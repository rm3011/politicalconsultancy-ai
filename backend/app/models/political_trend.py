from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
import uuid

class PoliticalTrend(BaseModel):
    id: str = str(uuid.uuid4())
    title: str
    summary: str
    source_count: int
    sources: List[str]
    headlines: List[str]
    confidence: float
    generated_at: datetime = datetime.now()
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class PoliticalTrendResponse(BaseModel):
    status: str
    timestamp: datetime
    total_articles: int
    sources_used: List[str]
    trends: List[PoliticalTrend]
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }