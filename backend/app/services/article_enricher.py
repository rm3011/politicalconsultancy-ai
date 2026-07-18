from google import genai
from typing import Dict, List
import logging
import os
import json
from app.database import supabase

logger = logging.getLogger(__name__)

class ArticleEnricher:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not set")
        self.client = genai.Client(api_key=self.api_key)
        self.model = 'gemini-2.5-flash'
        logger.info("✅ Article Enricher initialized")
    
    async def enrich_article(self, article_id: str) -> Dict:
        """Enrich a single article with AI-extracted fields"""
        try:
            # Get the article
            response = supabase.table('articles').select('*').eq('id', article_id).execute()
            if not response.data:
                return {"error": "Article not found"}
            
            article = response.data[0]
            title = article.get('title', '')
            content = article.get('content', '') or article.get('summary', '') or ''
            
            if not content:
                return {"error": "No content to analyze"}
            
            # Build prompt for extraction
            prompt = f"""
            Analyze this political news article and extract the following:

            Title: {title}
            Content: {content[:3000]}

            Extract:
            1. Politicians mentioned (list of full names, use proper spelling)
            2. Political parties mentioned (list of party names, use proper spelling)
            3. Topics (3-5 broad topics like: Elections, Policy, Economy, Governance, Security, Health, Education, Infrastructure, Environment, Foreign Affairs)
            4. Keywords (5-10 important keywords)
            5. Sentiment (Positive, Negative, or Neutral)
            6. Importance Score (0-100, based on impact and relevance)

            Return as JSON only:
            {{
                "politicians": ["Name1", "Name2"],
                "parties": ["Party1", "Party2"],
                "topics": ["Topic1", "Topic2"],
                "keywords": ["keyword1", "keyword2"],
                "sentiment": "Positive",
                "importance_score": 75
            }}
            """
            
            # Call Gemini
            response_text = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            ).text
            
            # Parse response
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            enriched = json.loads(response_text.strip())
            
            # Update the article in database
            update_data = {
                'politicians': enriched.get('politicians', []),
                'parties': enriched.get('parties', []),
                'topics': enriched.get('topics', []),
                'keywords': enriched.get('keywords', []),
                'sentiment': enriched.get('sentiment', 'Neutral'),
                'importance_score': enriched.get('importance_score', 50)
            }
            
            # Use a simpler update approach
            supabase.table('articles').update(update_data).eq('id', article_id).execute()
            
            return {"success": True, "enriched": update_data}
            
        except Exception as e:
            logger.error(f"Enrichment error: {e}")
            return {"error": str(e)}
    
    async def enrich_batch(self, limit: int = 10):
        """Enrich multiple unprocessed articles"""
        try:
            # Get articles without politicians data - simpler query
            response = supabase.table('articles').select('*').limit(limit).execute()
            articles = response.data
            
            results = []
            for article in articles:
                # Only enrich if politicians field is empty
                if not article.get('politicians') or len(article.get('politicians', [])) == 0:
                    result = await self.enrich_article(article['id'])
                    results.append({
                        'id': article['id'],
                        'title': article['title'][:50],
                        'success': result.get('success', False)
                    })
            
            return {
                "total": len(articles),
                "processed": len([r for r in results if r['success']]),
                "results": results
            }
            
        except Exception as e:
            logger.error(f"Batch enrichment error: {e}")
            return {"error": str(e)}