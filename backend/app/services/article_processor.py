import os
import json
from typing import Dict, List, Optional
import logging
from google import genai
from app.database import supabase
from app.config import Config

logger = logging.getLogger(__name__)

class ArticleProcessor:
    def __init__(self):
        self.client = genai.Client(api_key=Config.GEMINI_API_KEY)
        self.model = 'gemini-2.5-flash'
        logger.info("✅ Article Processor initialized with Gemini")
    
    async def process_article(self, article: Dict) -> Dict:
        """Process a single article with Gemini - ONCE"""
        try:
            # Generate AI enrichment
            prompt = f"""
            Analyze this political news article and extract the following:
            
            Title: {article.get('title', '')}
            Content: {article.get('content', '')[:3000]}
            
            Extract:
            1. Summary (150-200 words)
            2. Country (e.g., India, USA)
            3. State (e.g., Tamil Nadu, Kerala) - only if applicable
            4. Politicians mentioned (list)
            5. Political parties mentioned (list)
            6. Keywords (5-10)
            7. Topics (3-5, e.g., Elections, Policy, Governance, Economy, Security)
            8. Sentiment (Positive, Negative, Neutral)
            9. Importance Score (0-100) - based on impact, scale, and relevance
            
            Return as JSON only:
            {{
                "summary": "...",
                "country": "...",
                "state": "...",
                "politicians": [],
                "parties": [],
                "keywords": [],
                "topics": [],
                "sentiment": "...",
                "importance_score": 0
            }}
            """
            
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )
            
            # Parse JSON response
            processed = self._parse_response(response.text)
            
            # Merge with original article
            return {
                **article,
                'summary': processed.get('summary', ''),
                'country': processed.get('country', 'India'),
                'state': processed.get('state', ''),
                'politicians': processed.get('politicians', []),
                'parties': processed.get('parties', []),
                'keywords': processed.get('keywords', []),
                'topics': processed.get('topics', []),
                'sentiment': processed.get('sentiment', 'Neutral'),
                'importance_score': processed.get('importance_score', 50)
            }
            
        except Exception as e:
            logger.error(f"❌ Article processing error: {e}")
            # Return article with basic info
            return {
                **article,
                'summary': article.get('content', '')[:300],
                'country': 'India',
                'state': '',
                'politicians': [],
                'parties': [],
                'keywords': [],
                'topics': ['Politics'],
                'sentiment': 'Neutral',
                'importance_score': 50
            }

    def _parse_response(self, text: str) -> Dict:
        """Parse Gemini response to extract JSON"""
        try:
            # Clean the response
            text = text.strip()
            if text.startswith('```json'):
                text = text[7:]
            if text.startswith('```'):
                text = text[3:]
            if text.endswith('```'):
                text = text[:-3]
            return json.loads(text.strip())
        except Exception as e:
            logger.error(f"Parsing error: {e}")
            return {}

    async def save_article(self, article: Dict) -> bool:
        """Save processed article to Supabase"""
        try:
            data = {
                'title': article.get('title', ''),
                'content': article.get('content', ''),
                'summary': article.get('summary', ''),
                'url': article.get('url', ''),
                'source': article.get('source', 'Unknown'),
                'published_at': article.get('published_at'),
                'country': article.get('country', 'India'),
                'state': article.get('state', ''),
                'politicians': article.get('politicians', []),
                'parties': article.get('parties', []),
                'keywords': article.get('keywords', []),
                'topics': article.get('topics', []),
                'sentiment': article.get('sentiment', 'Neutral'),
                'importance_score': article.get('importance_score', 50),
                'content_hash': article.get('content_hash', '')
            }
            
            response = supabase.table('articles').insert(data).execute()
            return len(response.data) > 0
        except Exception as e:
            logger.error(f"❌ Save error: {e}")
            return False