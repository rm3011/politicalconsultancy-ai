# app/services/gemini_service.py - SIMPLIFIED
import logging
from typing import List, Dict, Tuple, Optional, Any
from datetime import datetime

from app.core.config import Config
from app.services.intent_router import IntentRouter
from app.services.retrieval_engine import RetrievalEngine
from app.services.reasoning_engine import ReasoningEngine
from app.services.cache_manager import CacheManager

logger = logging.getLogger(__name__)

class GeminiService:
    """
    Production-ready AI service with:
    - Intent routing
    - Multi-source retrieval with reranking
    - Optimal context building
    - Dynamic caching
    - Confidence scoring
    """
    
    def __init__(self):
        self.intent_router = IntentRouter()
        self.retrieval_engine = RetrievalEngine()
        self.reasoning_engine = ReasoningEngine()
        self.cache_manager = CacheManager()
        logger.info("Gemini Service initialized with production architecture")
    
    async def answer_with_search(self, question: str, context: Dict) -> Tuple[str, List[Dict]]:
        """
        Main entry point for answering questions.
        Full pipeline: Intent → Cache → Retrieval → Reasoning
        """
        
        if not question:
            return "Please ask a question.", []
        
        # 1. Route intent
        intent = self.intent_router.route(question)
        logger.info(f"Intent: {intent.get('intent', 'unknown')}")
        
        # 2. Check cache (if not greeting)
        if intent.get('needs_search', True):
            cached = self.cache_manager.get(question, intent)
            if cached:
                return cached, []
        
        # 3. Handle greetings directly
        if intent.get('intent') == 'greeting' and intent.get('response'):
            return intent.get('response'), []
        
        # 4. Retrieve relevant results
        results = await self.retrieval_engine.retrieve(
            question,
            intent,
            max_results=Config.MAX_SEARCH_RESULTS
        )
        
        # 5. Reason with Gemini
        answer, sources = await self.reasoning_engine.reason(question, results, intent)
        
        # 6. Cache the answer
        if intent.get('needs_search', True) and answer and len(answer) > 10:
            self.cache_manager.set(question, answer, intent)
        
        return answer, sources
    
    async def _close_session(self):
        """Cleanup (maintained for compatibility)"""
        pass