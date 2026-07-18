# app/services/cache_manager.py
import hashlib
import json
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class CacheManager:
    """
    Semantic cache with dynamic TTL.
    Uses simple in-memory cache (replace with Redis in production).
    """
    
    def __init__(self):
        self.cache = {}
        self.default_ttl = 3600  # 1 hour
    
    def get(self, question: str, intent: Dict[str, Any]) -> Optional[str]:
        """Get cached answer with TTL check"""
        key = self._generate_key(question)
        
        if key not in self.cache:
            return None
        
        entry = self.cache[key]
        ttl = self._get_ttl(intent)
        
        if datetime.now() - entry['timestamp'] > timedelta(seconds=ttl):
            del self.cache[key]
            return None
        
        logger.info(f"Cache hit for: {question[:50]}...")
        return entry['answer']
    
    def set(self, question: str, answer: str, intent: Dict[str, Any]):
        """Cache answer with dynamic TTL"""
        key = self._generate_key(question)
        ttl = self._get_ttl(intent)
        
        self.cache[key] = {
            'answer': answer,
            'timestamp': datetime.now(),
            'ttl': ttl,
            'intent': intent.get('intent', 'unknown')
        }
        
        logger.info(f"Cached answer for: {question[:50]}... (TTL: {ttl}s)")
    
    def _generate_key(self, question: str) -> str:
        """Generate cache key with semantic normalization"""
        # Simple key for now - replace with semantic embedding in production
        normalized = question.lower().strip()
        # Remove common variations
        replacements = {
            'current': '',
            'now': '',
            'today': '',
            'latest': '',
        }
        for old, new in replacements.items():
            normalized = normalized.replace(old, new).strip()
        
        return hashlib.md5(normalized.encode()).hexdigest()
    
    def _get_ttl(self, intent: Dict[str, Any]) -> int:
        """Get dynamic TTL based on intent"""
        # Use intent TTL if provided
        if 'ttl' in intent:
            return intent['ttl']
        
        # Fallback to intent-based TTLs
        intent_type = intent.get('intent', 'default')
        ttl_map = {
            'greeting': 86400 * 30,      # 30 days
            'factual': 86400,            # 1 day
            'constitutional': 86400 * 7, # 7 days
            'historical': 86400 * 30,    # 30 days
            'news': 300,                 # 5 minutes
            'current_affairs': 3600,     # 1 hour
            'opinion': 3600,             # 1 hour
            'prediction': 300,           # 5 minutes
            'strategy': 86400,           # 1 day
            'conversational': 3600,      # 1 hour
            'default': 3600,             # 1 hour
        }
        return ttl_map.get(intent_type, self.default_ttl)
    
    def clear(self):
        """Clear all cache"""
        self.cache = {}
        logger.info("Cache cleared")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total = len(self.cache)
        if total == 0:
            return {'total': 0, 'ttl_by_intent': {}}
        
        ttl_by_intent = {}
        for key, entry in self.cache.items():
            intent = entry.get('intent', 'unknown')
            ttl_by_intent[intent] = ttl_by_intent.get(intent, 0) + 1
        
        return {
            'total': total,
            'ttl_by_intent': ttl_by_intent
        }