# app/services/intent_router.py
import re
from typing import Dict, Any, Optional
from enum import Enum

class IntentType(Enum):
    GREETING = "greeting"
    FACTUAL = "factual"
    NEWS = "news"
    CURRENT_AFFAIRS = "current_affairs"
    OPINION = "opinion"
    PREDICTION = "prediction"
    STRATEGY = "strategy"
    CONSTITUTIONAL = "constitutional"
    HISTORICAL = "historical"
    CONVERSATIONAL = "conversational"

class IntentRouter:
    """Routes questions to appropriate pipeline based on intent"""
    
    # Keyword sets for intent detection
    GREETING_KEYWORDS = {
        'hello', 'hi', 'hey', 'good morning', 'good afternoon', 
        'good evening', 'namaste', 'vanakkam', 'howdy'
    }
    
    NEWS_KEYWORDS = {
        'today', 'latest', 'recent', 'yesterday', 'breaking',
        'just announced', 'current', 'ongoing', 'happening now',
        'update', 'new', 'report', 'just in'
    }
    
    CURRENT_AFFAIRS_KEYWORDS = {
        'now', 'currently', 'present', 'this week', 'this month',
        'ongoing', 'acting', 'interim'
    }
    
    PREDICTION_KEYWORDS = {
        'will win', 'predict', 'forecast', 'estimated', 'expected',
        'likely', 'projection', 'will happen', 'next'
    }
    
    OPINION_KEYWORDS = {
        'think', 'believe', 'opinion', 'view', 'perspective',
        'should', 'must', 'need to', 'better to'
    }
    
    STRATEGY_KEYWORDS = {
        'how to win', 'strategy', 'campaign', 'tactics', 'approach',
        'method', 'plan', 'best way'
    }
    
    CONSTITUTIONAL_KEYWORDS = {
        'article', 'amendment', 'constitution', 'supreme court',
        'judgment', 'verdict', 'act', 'law', 'policy'
    }
    
    HISTORICAL_KEYWORDS = {
        'history', 'founder', 'formed', 'established', 'since',
        'past', 'former', 'during', 'before'
    }
    
    FACTUAL_INDICATORS = {
        'who is', 'who are', 'who was', 'who were',
        'what is', 'what are', 'what was', 'what were',
        'when is', 'when was', 'when are',
        'where is', 'where was', 'where are',
        'why is', 'why was', 'why are',
        'how is', 'how was', 'how are',
        'tell me about', 'explain', 'describe', 'define',
        'what does', 'what do', 'who does', 'who do'
    }
    
    def route(self, question: str) -> Dict[str, Any]:
        """Route question to appropriate pipeline"""
        
        if not question:
            return {'intent': IntentType.CONVERSATIONAL, 'needs_search': True}
        
        q_lower = question.lower().strip()
        
        # 1. Check Greeting
        if self._is_greeting(q_lower):
            return {
                'intent': IntentType.GREETING,
                'needs_search': False,
                'ttl': 86400 * 30,
                'recency_days': None,
                'response': "Hello! I'm your Political Intelligence Assistant. I can help with political news, elections, government policies, and political trends. What would you like to know?"
            }
        
        # 2. Check Constitutional
        if self._is_constitutional(q_lower):
            return {
                'intent': IntentType.CONSTITUTIONAL,
                'needs_search': True,
                'ttl': 86400 * 7,
                'recency_days': 30,
                'requires_freshness': False
            }
        
        # 3. Check Historical
        if self._is_historical(q_lower):
            return {
                'intent': IntentType.HISTORICAL,
                'needs_search': True,
                'ttl': 86400 * 30,
                'recency_days': 365,
                'requires_freshness': False
            }
        
        # 4. Check News/Breaking
        if self._is_news(q_lower):
            return {
                'intent': IntentType.NEWS,
                'needs_search': True,
                'ttl': 300,  # 5 minutes
                'recency_days': 1,
                'requires_freshness': True
            }
        
        # 5. Check Current Affairs
        if self._is_current_affairs(q_lower):
            return {
                'intent': IntentType.CURRENT_AFFAIRS,
                'needs_search': True,
                'ttl': 3600,  # 1 hour
                'recency_days': 3,
                'requires_freshness': True
            }
        
        # 6. Check Prediction
        if self._is_prediction(q_lower):
            return {
                'intent': IntentType.PREDICTION,
                'needs_search': True,
                'ttl': 300,  # 5 minutes
                'recency_days': 1,
                'requires_freshness': True
            }
        
        # 7. Check Opinion
        if self._is_opinion(q_lower):
            return {
                'intent': IntentType.OPINION,
                'needs_search': True,
                'ttl': 3600,
                'recency_days': 7,
                'requires_freshness': True
            }
        
        # 8. Check Strategy
        if self._is_strategy(q_lower):
            return {
                'intent': IntentType.STRATEGY,
                'needs_search': True,
                'ttl': 86400,
                'recency_days': 30,
                'requires_freshness': False
            }
        
        # 9. Check Factual
        if self._is_factual(q_lower):
            return {
                'intent': IntentType.FACTUAL,
                'needs_search': True,
                'ttl': 86400,
                'recency_days': 30,
                'requires_freshness': False
            }
        
        # 10. Default - Conversational
        return {
            'intent': IntentType.CONVERSATIONAL,
            'needs_search': True,
            'ttl': 3600,
            'recency_days': 7,
            'requires_freshness': False
        }
    
    def _is_greeting(self, text: str) -> bool:
        return any(g in text for g in self.GREETING_KEYWORDS)
    
    def _is_news(self, text: str) -> bool:
        return any(kw in text for kw in self.NEWS_KEYWORDS)
    
    def _is_current_affairs(self, text: str) -> bool:
        return any(kw in text for kw in self.CURRENT_AFFAIRS_KEYWORDS)
    
    def _is_prediction(self, text: str) -> bool:
        return any(kw in text for kw in self.PREDICTION_KEYWORDS)
    
    def _is_opinion(self, text: str) -> bool:
        return any(kw in text for kw in self.OPINION_KEYWORDS)
    
    def _is_strategy(self, text: str) -> bool:
        return any(kw in text for kw in self.STRATEGY_KEYWORDS)
    
    def _is_constitutional(self, text: str) -> bool:
        return any(kw in text for kw in self.CONSTITUTIONAL_KEYWORDS)
    
    def _is_historical(self, text: str) -> bool:
        return any(kw in text for kw in self.HISTORICAL_KEYWORDS)
    
    def _is_factual(self, text: str) -> bool:
        return any(text.startswith(ind) for ind in self.FACTUAL_INDICATORS)
    
    def should_search(self, intent: IntentType) -> bool:
        """Check if intent requires search"""
        return intent not in [IntentType.GREETING]