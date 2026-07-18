# app/core/config.py
from typing import Dict
from datetime import timedelta
import os

class Config:
    """Centralized configuration with dynamic TTLs"""
    
    # API Keys
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    NEWS_API_KEY = os.getenv("NEWS_API_KEY")
    GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")
    
    # Search Settings
    MAX_SEARCH_RESULTS = 5
    MAX_CONTEXT_CHUNKS = 3
    MAX_CHUNK_LENGTH = 500  # Characters per chunk
    MAX_TOTAL_TOKENS = 1500
    
    # Dynamic TTLs (in seconds)
    TTL_CONFIG: Dict[str, int] = {
        'greeting': 86400 * 30,      # 30 days
        'factual': 86400,            # 1 day
        'constitutional': 86400 * 7, # 7 days
        'historical': 86400 * 30,    # 30 days
        'news': 300,                 # 5 minutes
        'current_affairs': 3600,     # 1 hour
        'opinion': 3600,             # 1 hour
        'prediction': 300,           # 5 minutes
        'default': 3600,             # 1 hour
    }
    
    # Recency Requirements (in days)
    RECENCY_CONFIG: Dict[str, int] = {
        'news': 1,           # 1 day
        'current_affairs': 3, # 3 days
        'factual': 30,       # 30 days
        'default': 7,        # 7 days
    }
    
    # Credibility Scores
    CREDIBILITY_SCORES = {
        'thehindu': 0.95,
        'indianexpress': 0.95,
        'timesofindia': 0.90,
        'bbc': 0.95,
        'reuters': 0.95,
        'ap': 0.95,
        'ndtv': 0.85,
        'news18': 0.80,
        'cnn': 0.75,
        'aljazeera': 0.80,
        'scroll': 0.70,
        'theprint': 0.70,
        'wikipedia': 0.85,
        'gov': 0.95,
        'default': 0.50,
    }