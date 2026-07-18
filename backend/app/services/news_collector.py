import os
import httpx
import hashlib
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging
from app.config import Config
from app.database import supabase

logger = logging.getLogger(__name__)

class NewsCollector:
    def __init__(self):
        self.sources = {
            'newsapi': {
                'url': 'https://newsapi.org/v2/everything',
                'key': Config.NEWS_API_KEY,
                'params': {'pageSize': 30}
            },
            'gnews': {
                'url': 'https://gnews.io/api/v4/search',
                'key': Config.GNEWS_API_KEY,
                'params': {'max': 30}
            },
            'newsdata': {
                'url': 'https://newsdata.io/api/1/news',
                'key': Config.NEWSDATA_API_KEY,
                'params': {'size': 30}
            }
        }
        self.fetched_count = 0
        self.max_per_day = Config.MAX_ARTICLES_PER_DAY

    async def fetch_articles(self, source: str, query: str = "politics India") -> List[Dict]:
        """Fetch articles from a specific source"""
        if source not in self.sources:
            logger.warning(f"Source {source} not configured")
            return []
        
        if self.fetched_count >= self.max_per_day:
            logger.warning(f"Daily fetch limit reached ({self.max_per_day})")
            return []
        
        config = self.sources[source]
        if not config['key'] or config['key'] == 'your_key_here':
            logger.warning(f"API key missing for {source}")
            return []
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    config['url'],
                    params={**config['params'], 'q': query, 'apiKey': config['key']}
                )
                if response.status_code == 200:
                    data = response.json()
                    articles = self._extract_articles(data, source)
                    self.fetched_count += len(articles)
                    logger.info(f"✅ Fetched {len(articles)} articles from {source}")
                    return articles
                else:
                    logger.error(f"❌ {source} error: {response.status_code}")
                    return []
        except Exception as e:
            logger.error(f"❌ {source} fetch error: {e}")
            return []

    def _extract_articles(self, data: Dict, source: str) -> List[Dict]:
        """Extract and normalize articles from provider response"""
        articles = []
        
        if source == 'newsapi' and 'articles' in data:
            for article in data['articles']:
                if article.get('title') and article.get('url'):
                    articles.append({
                        'title': article.get('title', ''),
                        'content': article.get('content', '') or article.get('description', ''),
                        'description': article.get('description', ''),
                        'url': article.get('url', ''),
                        'source': article.get('source', {}).get('name', 'NewsAPI'),
                        'published_at': article.get('publishedAt', datetime.now().isoformat()),
                        'image': article.get('urlToImage', ''),
                        'provider': 'newsapi'
                    })
        
        elif source == 'gnews' and 'articles' in data:
            for article in data['articles']:
                articles.append({
                    'title': article.get('title', ''),
                    'content': article.get('content', '') or article.get('description', ''),
                    'description': article.get('description', ''),
                    'url': article.get('url', ''),
                    'source': article.get('source', {}).get('name', 'GNews'),
                    'published_at': article.get('publishedAt', datetime.now().isoformat()),
                    'image': article.get('image', ''),
                    'provider': 'gnews'
                })
        
        return articles

    def normalize_article(self, raw_article: Dict) -> Dict:
        """Normalize article to unified schema"""
        content = raw_article.get('content', '') or raw_article.get('description', '')
        return {
            'title': raw_article.get('title', '')[:500],
            'content': content[:5000],
            'description': raw_article.get('description', '')[:500],
            'url': raw_article.get('url', ''),
            'source': raw_article.get('source', 'Unknown'),
            'published_at': raw_article.get('published_at', datetime.now().isoformat()),
            'image': raw_article.get('image', ''),
            'provider': raw_article.get('provider', 'unknown'),
            'content_hash': hashlib.sha256(raw_article.get('url', '').encode()).hexdigest()[:16]
        }

    async def check_exists(self, url: str) -> bool:
        """Check if article already exists in database"""
        try:
            response = supabase.table('articles').select('id').eq('url', url).execute()
            return len(response.data) > 0
        except Exception:
            return False

    def reset_count(self):
        """Reset daily fetch count"""
        self.fetched_count = 0
        logger.info("🔄 Daily fetch count reset")