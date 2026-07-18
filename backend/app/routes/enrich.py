from fastapi import APIRouter, Query
from app.services.article_enricher import ArticleEnricher
import logging

router = APIRouter()
enricher = ArticleEnricher()
logger = logging.getLogger(__name__)

@router.post("/enrich/batch")
async def enrich_batch(limit: int = Query(10, description="Number of articles to enrich")):
    """Enrich multiple articles"""
    result = await enricher.enrich_batch(limit)
    return result

@router.get("/enrich/status")
async def get_enrichment_status():
    """Check how many articles are enriched"""
    try:
        from app.database import supabase
        
        total = supabase.table('articles').select('*', count='exact').execute().count
        enriched = supabase.table('articles').select('*', count='exact').not_.is_('politicians', '{}').execute().count
        
        return {
            "total_articles": total,
            "enriched_articles": enriched,
            "unprocessed": total - enriched
        }
    except Exception as e:
        return {"error": str(e)}