# app/services/retrieval_engine.py
import asyncio
import hashlib
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
import logging
from rapidfuzz import fuzz

from app.core.config import Config
from app.models.search_result import SearchResult
from app.services.search_service import SearchService
from app.services.unified_search import UnifiedSearchProvider

logger = logging.getLogger(__name__)

class RetrievalEngine:
    """
    Multi-source retrieval with normalization, deduplication,
    recency filtering, credibility scoring, and reranking.
    """
    
    def __init__(self):
        self.unified_search = UnifiedSearchProvider()
        self.search_service = SearchService()
        self.credibility_scores = Config.CREDIBILITY_SCORES
    
    async def retrieve(
        self,
        query: str,
        intent: Dict[str, Any],
        max_results: int = 5
    ) -> List[SearchResult]:
        """Retrieve and rank results based on intent"""
        
        recency_days = intent.get('recency_days', 7)
        requires_freshness = intent.get('requires_freshness', False)
        
        # 1. Multi-source search
        results = await self._search_sources(query, max_results * 3)
        
        if not results:
            return []
        
        # 2. Normalize and deduplicate
        results = self._deduplicate(results)
        
        # 3. Filter by recency
        results = self._filter_by_recency(results, recency_days)
        
        # 4. Apply credibility scoring
        results = self._apply_credibility(results)
        
        # 5. Rerank
        results = self._rerank(results, query, requires_freshness)
        
        # 6. Return top results
        return results[:max_results]
    
    async def _search_sources(self, query: str, max_results: int) -> List[SearchResult]:
        """Search across all sources"""
        
        all_results = []
        
        # Try unified search
        try:
            unified_results = await self.unified_search.search(query, max_results)
            all_results.extend(unified_results)
            logger.info(f"Unified search returned {len(unified_results)} results")
        except Exception as e:
            logger.error(f"Unified search error: {e}")
        
        # If no results, fallback to DDG
        if not all_results:
            try:
                ddg_results = await self._search_ddg(query, max_results)
                all_results.extend(ddg_results)
                logger.info(f"DDG fallback returned {len(ddg_results)} results")
            except Exception as e:
                logger.error(f"DDG search error: {e}")
        
        return all_results
    
    async def _search_ddg(self, query: str, max_results: int) -> List[SearchResult]:
        """Search DuckDuckGo with recency"""
        
        try:
            # Force 2026 for current political questions
            query_with_date = f"{query} 2026"
            
            raw_results = await asyncio.to_thread(
                self.search_service._search_news_sync,
                query_with_date,
                max_results
            )
            
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
                    credibility_score=0.5,
                    content_hash=self._hash_content(r.get('title', ''), r.get('body', ''))
                ))
            return results
        except Exception as e:
            logger.error(f"DDG search error: {e}")
            return []
    
    def _hash_content(self, title: str, content: str) -> str:
        """Generate content hash for deduplication"""
        text = f"{title}{content[:300]}"
        return hashlib.sha256(text.encode()).hexdigest()[:16]
    
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
    
    def _filter_by_recency(self, results: List[SearchResult], days: int) -> List[SearchResult]:
        """Filter results by recency"""
        if days <= 0:
            return results
        
        cutoff = datetime.now() - timedelta(days=days)
        filtered = []
        for r in results:
            if r.published_at:
                # Convert to naive for comparison
                pub = r.published_at.replace(tzinfo=None) if r.published_at.tzinfo else r.published_at
                if pub >= cutoff:
                    filtered.append(r)
            else:
                # Keep articles with unknown date (could be recent)
                filtered.append(r)
        
        return filtered
    
    def _apply_credibility(self, results: List[SearchResult]) -> List[SearchResult]:
        """Apply credibility scores to results"""
        for r in results:
            source = r.source.lower()
            score = self.credibility_scores.get(source, self.credibility_scores['default'])
            r.credibility_score = score
        return results
    
    def _rerank(self, results: List[SearchResult], query: str, requires_freshness: bool) -> List[SearchResult]:
        """Rerank by credibility × recency × relevance"""
        
        now = datetime.now()
        
        for r in results:
            # Recency score (0-1)
            if r.published_at:
                pub = r.published_at.replace(tzinfo=None) if r.published_at.tzinfo else r.published_at
                hours_ago = (now - pub).total_seconds() / 3600
                recency_score = max(0, 1 - (hours_ago / 168))  # 1 week = 0
            else:
                recency_score = 0.5
            
            # Credibility (already set)
            credibility = r.credibility_score or 0.5
            
            # Relevance (fuzzy match)
            text = f"{r.title} {r.snippet}"
            relevance = fuzz.partial_ratio(query.lower(), text.lower()) / 100
            
            # Weighted score
            if requires_freshness:
                r.final_score = (credibility * 0.3) + (recency_score * 0.5) + (relevance * 0.2)
            else:
                r.final_score = (credibility * 0.4) + (recency_score * 0.2) + (relevance * 0.4)
        
        results.sort(key=lambda x: x.final_score, reverse=True)
        return results
    
    def _get_credibility(self, source: str) -> float:
        """Get credibility score for a source"""
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