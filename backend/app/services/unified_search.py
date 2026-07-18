# app/services/unified_search.py
import asyncio
import os
import hashlib
from typing import List, Optional
from datetime import datetime, timedelta
from app.models.search_result import SearchResult
from app.services.search_service import SearchService
import logging

logger = logging.getLogger(__name__)

class UnifiedSearchProvider:
    """Search across multiple sources with unified output"""
    
    def __init__(self):
        self.ddg = SearchService()
        self.news_api_key = os.getenv("NEWS_API_KEY")
        
    async def search(self, query: str, max_results: int = 5) -> List[SearchResult]:
        """Search all sources and return unified results"""
        
        results = []
        
        # 1. DuckDuckGo (with recency)
        ddg_results = await self._search_ddg(query, max_results)
        results.extend(ddg_results)
        
        # 2. NewsAPI (if available)
        if self.news_api_key:
            newsapi_results = await self._search_newsapi(query, max_results)
            results.extend(newsapi_results)
        
        # 3. Database (if available)
        db_results = await self._search_database(query, max_results)
        results.extend(db_results)
        
        # Deduplicate
        unique = self._deduplicate(results)
        
        # Filter by recency (LAST 7 DAYS ONLY)
        recent = self._filter_by_recency(unique, days=7)
        
        # If no recent results, retry with forced date
        if not recent:
            logger.warning("No recent results, retrying with '2026'...")
            ddg_results = await self._search_ddg(f"{query} 2026", max_results)
            recent = self._filter_by_recency(ddg_results, days=7)
        
        # Rank
        ranked = self._rank_results(recent, query)
        
        return ranked[:max_results]
    
    async def _search_ddg(self, query: str, max_results: int) -> List[SearchResult]:
        """Search DuckDuckGo with recency"""
        try:
            # Force recency by adding date to query
            query_with_date = f"{query} 2026"
            
            # Use the search_service's method directly
            raw_results = await asyncio.to_thread(
                self.ddg._search_news_sync,
                query_with_date,
                max_results
            )
            
            if not raw_results:
                return []
            
            results = []
            for r in raw_results[:max_results]:
                published_at = None
                date_str = r.get('date', '')
                if date_str:
                    try:
                        published_at = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                    except:
                        pass
                
                results.append(SearchResult(
                    title=r.get('title', ''),
                    url=r.get('url', ''),
                    snippet=r.get('body', ''),
                    content=r.get('body', ''),
                    source='ddg',
                    published_at=published_at,
                    credibility_score=self._get_credibility(r.get('source', ''))
                ))
            return results
        except Exception as e:
            logger.error(f"DDG search error: {e}")
            return []
    
    async def _search_database(self, query: str, max_results: int) -> List[SearchResult]:
        """Search your own article database"""
        try:
            from app.database import supabase
            from rapidfuzz import fuzz
            
            # Get articles
            response = supabase.table('articles').select('*').execute()
            
            if not response.data:
                return []
            
            results = []
            for article in response.data:
                text = f"{article.get('title', '')} {article.get('content', '')}"
                score = fuzz.partial_ratio(query.lower(), text.lower())
                
                if score > 30:
                    pub_str = article.get('published_at', '')
                    pub_date = None
                    if pub_str:
                        try:
                            pub_date = datetime.fromisoformat(pub_str.replace('Z', '+00:00'))
                        except:
                            pass
                    
                    results.append(SearchResult(
                        title=article.get('title', ''),
                        url=article.get('url', ''),
                        snippet=article.get('summary', '')[:200],
                        content=article.get('content', ''),
                        source='database',
                        published_at=pub_date,
                        credibility_score=0.9,
                        relevance_score=score / 100,
                        content_hash=article.get('content_hash', '')
                    ))
            
            return results
        except Exception as e:
            logger.error(f"Database search error: {e}")
            return []
    
    def _deduplicate(self, results: List[SearchResult]) -> List[SearchResult]:
        """Remove duplicates by content hash"""
        seen = set()
        unique = []
        for r in results:
            if r.content_hash and r.content_hash not in seen:
                seen.add(r.content_hash)
                unique.append(r)
            elif r.url and r.url not in seen:
                seen.add(r.url)
                unique.append(r)
        return unique
    
    def _rank_results(self, results: List[SearchResult], query: str) -> List[SearchResult]:
        """Score and rank by credibility × recency × relevance"""
        
        now = datetime.now()
        
        for r in results:
            # Recency score (0-1) - last 7 days = 1, older = less
            if r.published_at:
                hours_ago = (now - r.published_at).total_seconds() / 3600
                recency_score = max(0, 1 - (hours_ago / 168))  # 1 week = 0
            else:
                recency_score = 0.5
            
            # Credibility score
            credibility = r.credibility_score or 0.5
            
            # Relevance
            relevance = r.relevance_score or 0.5
            
            # Final score
            r.final_score = (credibility * 0.4) + (recency_score * 0.3) + (relevance * 0.3)
        
        results.sort(key=lambda x: x.final_score, reverse=True)
        return results
    
    def _get_credibility(self, source: str) -> float:
        """Score source credibility"""
        source_lower = source.lower()
        
        high_trust = ['thehindu', 'indianexpress', 'timesofindia', 'bbc', 'reuters', 'ap', 'ndtv', 'news18']
        medium_trust = ['cnn', 'aljazeera', 'scroll', 'theprint']
        low_trust = ['blog', 'instagram', 'facebook', 'twitter', 'linkedin']
        
        if any(t in source_lower for t in high_trust):
            return 0.9
        elif any(t in source_lower for t in medium_trust):
            return 0.7
        elif any(t in source_lower for t in low_trust):
            return 0.2
        else:
            return 0.5
    
    def _filter_by_recency(self, results: List[SearchResult], days: int = 7) -> List[SearchResult]:
        """Filter results by recency (last X days)"""
        now = datetime.now()
        cutoff = now - timedelta(days=days)
        
        filtered = []
        for r in results:
            if r.published_at and r.published_at >= cutoff:
                filtered.append(r)
        
        return filtered
    
    def _verify_answer(self, results: List[SearchResult], question: str) -> bool:
        """Check if the answer is from a recent source"""
        # Count sources from 2026
        recent_count = sum(1 for r in results if r.published_at and r.published_at.year >= 2026)
        return recent_count >= 2
    
    async def _search_newsapi(self, query: str, max_results: int) -> List[SearchResult]:
        """Search NewsAPI (placeholder)"""
        return []