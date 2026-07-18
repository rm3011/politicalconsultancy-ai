import asyncio
import aiohttp
import feedparser
from datetime import datetime, timedelta
from typing import List, Dict, Any
import json
import os
import re
import hashlib
import logging
from collections import Counter
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

class PoliticalCollector:
    """Collects and categorizes political news - Hybrid approach (AI only for summaries)"""
    
    RSS_FEEDS = [
        "https://tamil.news18.com/rss/",
        "https://tamil.oneindia.com/rss/feed-news-fb.xml",
        "https://www.thehindu.com/news/national/tamil-nadu/feeder/default.rss",
        "https://www.thehindu.com/news/national/feeder/default.rss",
        "https://www.newindianexpress.com/rss/states/tamil-nadu.xml",
        "https://www.dinamalar.com/RSS/RSS_Latest.asp?cat=news",
        "https://www.puthiyathalaimurai.com/rss/",
    ]
    
    GDELT_URL = "https://api.gdeltproject.org/api/v2/doc/doc"
    GDELT_QUERY = "?query=(Tamil+Nadu)+(Politics+OR+Election+OR+DMK+OR+AIADMK+OR+Congress+OR+BJP+OR+TVK)&mode=artlist&timespan=30m&maxrecords=50&format=json&sort=DateDesc"
    
    # Politics keywords for filtering
    POLITICS_KEYWORDS = [
        'politics', 'election', 'vote', 'campaign', 'candidate',
        'dmk', 'aiadmk', 'bjp', 'congress', 'tvk', 'ncp', 'cpi',
        'modi', 'stalin', 'vijay', 'udhayanidhi', 'rajinikanth',
        'parliament', 'assembly', 'government', 'opposition',
        'minister', 'chief minister', 'cm', 'pm', 'mp', 'mla',
        'policy', 'budget', 'scheme', 'fund', 'grant',
        'protest', 'rally', 'demonstration', 'agitation',
        'coalition', 'alliance', 'seat sharing',
        'tamil nadu', 'chennai', 'madras high court',
        'supreme court', 'judgment', 'verdict'
    ]
    
    # Location keywords for categorization
    LOCATION_KEYWORDS = {
        'tamilnadu': [
            'tamil nadu', 'tamilnadu', 'chennai', 'coimbatore', 'madurai', 
            'trichy', 'salem', 'tirunelveli', 'kanyakumari', 'vellore',
            'dmk', 'aiadmk', 'tvk', 'stalin', 'vijay', 'udhayanidhi'
        ],
        'india': [
            'india', 'delhi', 'mumbai', 'kolkata', 'bengaluru', 'hyderabad',
            'modi', 'parliament', 'lok sabha', 'rajya sabha', 'supreme court'
        ],
        'international': [
            'usa', 'us', 'america', 'uk', 'britain', 'china', 'russia', 
            'ukraine', 'europe', 'africa', 'middle east', 'israel', 
            'palestine', 'iran', 'pakistan', 'bangladesh', 'sri lanka'
        ]
    }
    
    def __init__(self):
        try:
            self.gemini = GeminiService()
        except Exception as e:
            print(f"⚠️ GeminiService not initialized: {e}")
            self.gemini = None
        self.gnews_api_key = os.getenv("GNEWS_API_KEY")
        self.news_api_key = os.getenv("NEWS_API_KEY")
        self.newsdata_api_key = os.getenv("NEWSDATA_API_KEY")
        self.last_articles = []
        
    def _parse_date(self, date_str: str) -> datetime:
        """Safely parse date string to timezone-naive datetime"""
        if not date_str:
            return datetime.now()
        
        try:
            # Try ISO format
            dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            return dt.replace(tzinfo=None)
        except:
            pass
        
        try:
            # Try RSS format
            from email.utils import parsedate_to_datetime
            dt = parsedate_to_datetime(date_str)
            return dt.replace(tzinfo=None)
        except:
            pass
        
        try:
            # Try dateutil
            from dateutil import parser
            dt = parser.parse(date_str)
            return dt.replace(tzinfo=None)
        except:
            pass
        
        # Fallback to current time
        return datetime.now()
    
    async def collect_all(self) -> Dict[str, Any]:
        """Collect all articles and categorize"""
        
        articles = []
        
        # Collect from RSS
        rss_articles = await self.collect_rss()
        if rss_articles:
            articles.extend(rss_articles)
            print(f"📰 RSS: {len(rss_articles)} articles")
        
        # Collect from GDELT
        gdelt_articles = await self.collect_gdelt()
        if gdelt_articles:
            articles.extend(gdelt_articles)
            print(f"🌐 GDELT: {len(gdelt_articles)} articles")
        
        # Collect from GNews
        if self.gnews_api_key:
            gnews_articles = await self.collect_gnews()
            if gnews_articles:
                articles.extend(gnews_articles)
                print(f"📰 GNews: {len(gnews_articles)} articles")
        
        # Collect from NewsAPI
        if self.news_api_key:
            newsapi_articles = await self.collect_newsapi()
            if newsapi_articles:
                articles.extend(newsapi_articles)
                print(f"📰 NewsAPI: {len(newsapi_articles)} articles")
        
        print(f"📊 Total raw articles: {len(articles)}")
        
        # Step 1: Normalize with deduplication + recency
        normalized = self.normalize_articles(articles)
        print(f"📋 Normalized (unique + recent): {len(normalized)} articles")
        
        # Step 2: Filter politics
        political = self.filter_politics(normalized)
        print(f"🗳️ Political: {len(political)} articles")
        
        # Step 3: Categorize by geography
        categorized = self.categorize_by_geography(political)
        
        # Step 4: Generate trends for each category
        trends = {
            'international': self.generate_trends(categorized['international'], 'international'),
            'india': self.generate_trends(categorized['india'], 'india'),
            'tamilnadu': self.generate_trends(categorized['tamilnadu'], 'tamilnadu')
        }
        
        return {
            "status": "success",
            "timestamp": datetime.now(),
            "total_articles": len(articles),
            "political_articles": len(political),
            "sources": {
                "rss": len(rss_articles),
                "gdelt": len(gdelt_articles),
                "gnews": len(gnews_articles) if self.gnews_api_key else 0,
                "newsapi": len(newsapi_articles) if self.news_api_key else 0
            },
            "categories": {
                "international": len(categorized['international']),
                "india": len(categorized['india']),
                "tamilnadu": len(categorized['tamilnadu'])
            },
            "trends": trends,
            "articles": {
                "international": categorized['international'][:10],
                "india": categorized['india'][:10],
                "tamilnadu": categorized['tamilnadu'][:10]
            }
        }
    
    def normalize_articles(self, articles: List[Dict]) -> List[Dict]:
        """
        Normalize with strict deduplication and recency filter.
        Only keeps articles from the last 48 hours.
        """
        normalized = []
        seen_hashes = set()
        
        # Only show news from the last 48 hours
        cutoff = datetime.now() - timedelta(hours=1)
        cutoff = cutoff.replace(tzinfo=None)  # Make timezone-naive
        
        for article in articles:
            # 1. Generate a unique hash based on title + content snippet
            title = article.get('title', '')
            summary = article.get('summary', '')
            text = f"{title}{summary[:300]}"
            content_hash = hashlib.sha256(text.encode()).hexdigest()[:16]
            
            # 2. Skip if we've already seen this hash
            if content_hash in seen_hashes:
                continue
            seen_hashes.add(content_hash)
            
            # 3. Parse the publication date
            pub_str = article.get('published', article.get('published_at', ''))
            pub_date = self._parse_date(pub_str)
            
            # 4. Skip if older than 48 hours
            if pub_date < cutoff:
                continue
            
            # 5. Get URL (handle different field names)
            url = article.get('link', article.get('url', ''))
            if not url:
                # Try to find URL in entry
                if 'links' in article and article['links']:
                    url = article['links'][0].get('href', '')
            
            # 6. Build normalized article
            normalized.append({
                'title': title.strip(),
                'summary': summary.strip(),
                'content': article.get('content', summary).strip(),
                'url': url,
                'source': article.get('source', 'Unknown'),
                'source_type': article.get('source_type', 'unknown'),
                'published_at': pub_date.isoformat(),
                'content_hash': content_hash,
                'collected_at': datetime.now().isoformat()
            })
        
        # Sort by newest first
        normalized.sort(key=lambda x: x['published_at'], reverse=True)
        
        # Limit to top 50 to keep response fast
        return normalized[:50]
    
    def filter_politics(self, articles: List[Dict]) -> List[Dict]:
        """Filter articles that are about politics"""
        political = []
        for article in articles:
            text = (article['title'] + ' ' + article['summary']).lower()
            if any(keyword in text for keyword in self.POLITICS_KEYWORDS):
                political.append(article)
        return political
    
    def categorize_by_geography(self, articles: List[Dict]) -> Dict[str, List[Dict]]:
        """Categorize articles by geography"""
        categorized = {
            'international': [],
            'india': [],
            'tamilnadu': []
        }
        
        for article in articles:
            text = (article['title'] + ' ' + article['summary']).lower()
            
            # Check Tamil Nadu first (more specific)
            if any(keyword in text for keyword in self.LOCATION_KEYWORDS['tamilnadu']):
                categorized['tamilnadu'].append(article)
            # Then India
            elif any(keyword in text for keyword in self.LOCATION_KEYWORDS['india']):
                categorized['india'].append(article)
            # Then International
            elif any(keyword in text for keyword in self.LOCATION_KEYWORDS['international']):
                categorized['international'].append(article)
            # Default to India if no location detected
            else:
                categorized['india'].append(article)
        
        return categorized
    
    def generate_trends(self, articles: List[Dict], category: str) -> List[Dict]:
        """Generate trends from articles using keyword frequency"""
        if not articles:
            return []
        
        # Extract all titles
        titles = [a['title'] for a in articles]
        all_text = ' '.join(titles).lower()
        keyword_counts = Counter()
        
        # Count political keywords
        for keyword in self.POLITICS_KEYWORDS:
            if len(keyword) > 3:
                count = all_text.count(keyword)
                if count > 0:
                    keyword_counts[keyword] = count
        
        # Get top keywords
        top_keywords = keyword_counts.most_common(5)
        
        trends = []
        for keyword, count in top_keywords:
            # Find articles with this keyword
            matching_articles = [a for a in articles if keyword.lower() in a['title'].lower()]
            
            trends.append({
                "keyword": keyword.capitalize(),
                "count": count,
                "article_count": len(matching_articles),
                "sample_titles": [a['title'][:100] for a in matching_articles[:3]],
                "sources": list(set([a['source'] for a in matching_articles[:5]])),
                "category": category
            })
        
        return trends
    
    # ===================== COLLECTION METHODS =====================
    
    async def collect_rss(self) -> List[Dict]:
        articles = []
        async with aiohttp.ClientSession() as session:
            tasks = [self.fetch_rss(session, url) for url in self.RSS_FEEDS]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            for result in results:
                if isinstance(result, list):
                    articles.extend(result)
        return articles
    
    async def fetch_rss(self, session, url: str) -> List[Dict]:
        try:
            async with session.get(url, timeout=10, ssl=False) as response:
                text = await response.text()
                feed = feedparser.parse(text)
                articles = []
                
                # Check if feed has entries
                if not feed.entries:
                    print(f"⚠️ No entries in feed: {url}")
                    return []
                
                for entry in feed.entries[:15]:
                    # Skip if no title or link
                    if not entry.get('title') or not entry.get('link'):
                        continue
                    
                    # Handle missing summary
                    summary = entry.get('summary', '')
                    if not summary or summary == '' or summary == ' ':
                        summary = entry.get('description', entry.get('title', ''))
                    
                    # Handle published date
                    published = entry.get('published', '')
                    if not published:
                        published = entry.get('pubDate', '')
                    if not published:
                        published = entry.get('updated', '')
                    if not published:
                        published = datetime.now().isoformat()
                    
                    articles.append({
                        'title': entry.get('title', '').strip(),
                        'summary': summary.strip(),
                        'link': entry.get('link', ''),
                        'published': published,
                        'source': url.split('/')[2] if '//' in url else 'rss',
                        'source_type': 'rss'
                    })
                return articles
        except Exception as e:
            print(f"RSS error {url}: {e}")
            return []
    
    async def collect_gdelt(self) -> List[Dict]:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.GDELT_URL}{self.GDELT_QUERY}", timeout=10, ssl=False) as response:
                    if response.status != 200:
                        print(f"GDELT error: {response.status}")
                        return []
                    
                    data = await response.json()
                    articles = []
                    for article in data.get('articles', []):
                        title = article.get('title', '')
                        if not title:
                            continue
                        articles.append({
                            'title': title,
                            'summary': article.get('snippet', ''),
                            'link': article.get('url', ''),
                            'published': article.get('seendate', datetime.now().isoformat()),
                            'source': article.get('source', 'gdelt'),
                            'source_type': 'gdelt'
                        })
                    return articles
        except Exception as e:
            print(f"GDELT error: {e}")
            return []
    
    async def collect_gnews(self) -> List[Dict]:
        if not self.gnews_api_key:
            return []
        try:
            url = f"https://gnews.io/api/v4/search?q=tamil+nadu+politics&lang=en&country=in&max=10&token={self.gnews_api_key}"
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=10, ssl=False) as response:
                    if response.status != 200:
                        print(f"GNews error: {response.status}")
                        return []
                    
                    data = await response.json()
                    if 'errors' in data:
                        print(f"GNews error: {data.get('errors')}")
                        return []
                    
                    articles = []
                    for article in data.get('articles', []):
                        title = article.get('title', '')
                        if not title:
                            continue
                        articles.append({
                            'title': title,
                            'summary': article.get('description', ''),
                            'link': article.get('url', ''),
                            'published': article.get('publishedAt', datetime.now().isoformat()),
                            'source': article.get('source', {}).get('name', 'gnews'),
                            'source_type': 'gnews'
                        })
                    return articles
        except Exception as e:
            print(f"GNews error: {e}")
            return []
    
    async def collect_newsapi(self) -> List[Dict]:
        if not self.news_api_key:
            return []
        try:
            url = f"https://newsapi.org/v2/everything?q=Tamil%20Nadu%20politics&language=en&sortBy=publishedAt&pageSize=20&apiKey={self.news_api_key}"
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=10, ssl=False) as response:
                    if response.status != 200:
                        print(f"NewsAPI error: {response.status}")
                        return []
                    
                    data = await response.json()
                    if data.get('status') == 'error':
                        print(f"NewsAPI error: {data.get('message')}")
                        return []
                    
                    articles = []
                    for article in data.get('articles', []):
                        title = article.get('title', '')
                        if not title or title == '[Removed]':
                            continue
                        articles.append({
                            'title': title,
                            'summary': article.get('description', ''),
                            'link': article.get('url', ''),
                            'published': article.get('publishedAt', datetime.now().isoformat()),
                            'source': article.get('source', {}).get('name', 'newsapi'),
                            'source_type': 'newsapi'
                        })
                    return articles
        except Exception as e:
            print(f"NewsAPI error: {e}")
            return []