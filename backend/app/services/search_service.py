import asyncio
from typing import List, Dict, Optional, Tuple
import logging
from ddgs import DDGS
from datetime import datetime
from rapidfuzz import fuzz
import re

logger = logging.getLogger(__name__)

class SearchService:
    """Dual-mode search service: News + General Web Search"""
    
    def __init__(self):
        self.max_results = 8
        self.ddg = DDGS()
        logger.info("DuckDuckGo Search Service initialized (News + Text)")
    
    async def search(self, query: str, max_results: int = 8, search_type: str = 'auto') -> List[Dict]:
        """
        Smart search that routes to appropriate search type
        
        Args:
            query: Search query
            max_results: Max results to return
            search_type: 'news', 'text', or 'auto' (auto-detect)
        """
        # Auto-detect search type if not specified
        if search_type == 'auto':
            search_type = self._detect_search_type(query)
        
        logger.info(f"Searching for: {query} (type: {search_type})")
        
        if search_type == 'news':
            return await self.search_news(query, max_results)
        else:
            return await self.search_text(query, max_results)
    
    async def search_news(self, query: str, max_results: int = 8) -> List[Dict]:
        """Search news articles"""
        try:
            loop = asyncio.get_event_loop()
            results = await asyncio.wait_for(
                loop.run_in_executor(
                    None,
                    self._search_news_sync,
                    query,
                    max_results
                ),
                timeout=10.0
            )
            return results
        except Exception as e:
            logger.error(f"News search error: {e}")
            return []
    
    async def search_text(self, query: str, max_results: int = 8) -> List[Dict]:
        """Search general web pages (Wikipedia, government sites, etc.)"""
        try:
            loop = asyncio.get_event_loop()
            results = await asyncio.wait_for(
                loop.run_in_executor(
                    None,
                    self._search_text_sync,
                    query,
                    max_results
                ),
                timeout=10.0
            )
            return results
        except Exception as e:
            logger.error(f"Text search error: {e}")
            return []
    
    def _detect_search_type(self, query: str) -> str:
        """
        Detect whether the query should use news or text search
        
        Returns: 'news' or 'text'
        """
        q = query.lower()
        
        # News indicators
        news_keywords = [
            'today', 'latest', 'recent', 'yesterday', 'this week',
            'breaking', 'news', 'update', 'just announced',
            'current', 'ongoing', 'happening now'
        ]
        
        # Evergreen/encyclopedic indicators
        text_keywords = [
            'who is', 'what is', 'definition', 'meaning', 'explain',
            'history', 'background', 'overview', 'summary',
            'constitution', 'act', 'law', 'policy', 'scheme',
            'biography', 'born', 'early life', 'education',
            'election commission', 'supreme court', 'parliament'
        ]
        
        # Check for news indicators
        if any(kw in q for kw in news_keywords):
            return 'news'
        
        # Check for text/encyclopedic indicators
        if any(kw in q for kw in text_keywords):
            return 'text'
        
        # Default to text for knowledge questions, news for time-sensitive
        if any(kw in q for kw in ['today', 'latest', 'recent']):
            return 'news'
        
        return 'text'  # Default to text for general questions
    
    def _search_news_sync(self, query: str, max_results: int) -> List[Dict]:
        """Synchronous DuckDuckGo news search"""
        try:
            results = list(self.ddg.news(
                query,
                region='in-en',
                safesearch='moderate',
                timelimit='w',  # Last week for current news
                max_results=max_results
            ))
            
            if not results:
                return []
            
            formatted = []
            for r in results:
                title = r.get('title', '')
                body = r.get('body', '')
                source = r.get('source', '')
                url = r.get('url', '')
                date = r.get('date', '')
                
                if not title or not body or not source or url == '#':
                    continue
                
                # Try to parse date for sorting
                pub_date = None
                try:
                    if date:
                        pub_date = datetime.fromisoformat(date.replace('Z', '+00:00'))
                except:
                    pass
                
                formatted.append({
                    'title': title,
                    'body': body,
                    'source': source,
                    'url': url,
                    'date': date,
                    'pub_date': pub_date,
                    'type': 'news',
                    'image': r.get('image', '')
                })
            
            # Sort by recency if dates available
            valid_dates = [r for r in formatted if r['pub_date']]
            if valid_dates:
                formatted = sorted(formatted, key=lambda x: x['pub_date'] if x['pub_date'] else datetime.min, reverse=True)
            
            return formatted
            
        except Exception as e:
            logger.error(f"DuckDuckGo news search error: {e}")
            return []
    
    def _search_text_sync(self, query: str, max_results: int) -> List[Dict]:
        """Synchronous DuckDuckGo text/web search"""
        try:
            results = list(self.ddg.text(
                query,
                region='in-en',
                safesearch='moderate',
                max_results=max_results
            ))
            
            if not results:
                return []
            
            formatted = []
            for r in results:
                title = r.get('title', '')
                body = r.get('body', '')
                url = r.get('href', '')
                
                if not title or not body or url == '#':
                    continue
                
                # Extract domain as source
                source = url.split('/')[2] if '//' in url else 'Unknown'
                
                formatted.append({
                    'title': title,
                    'body': body,
                    'source': source,
                    'url': url,
                    'date': '',
                    'pub_date': None,
                    'type': 'text',
                    'image': ''
                })
            
            return formatted
            
        except Exception as e:
            logger.error(f"DuckDuckGo text search error: {e}")
            return []