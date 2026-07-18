# app/models/search_result.py
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
import hashlib

class SearchResult(BaseModel):
    """Unified search result from ANY source"""
    title: str
    url: str
    snippet: str
    content: Optional[str] = None
    source: str  # "ddg", "brave", "newsapi", "rss", "database"
    published_at: Optional[datetime] = None
    credibility_score: float = 0.5
    relevance_score: float = 0.0
    final_score: float = 0.0
    content_hash: str = ""
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }
    
    def __init__(self, **data):
        super().__init__(**data)
        if not self.content_hash and self.title:
            text = f"{self.title}{self.snippet or ''}"
            self.content_hash = hashlib.sha256(text.encode()).hexdigest()[:16]