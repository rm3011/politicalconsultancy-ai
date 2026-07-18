from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
import logging
import asyncio

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()
news_collector = None
article_processor = None

# More frequent updates - every 15 minutes
SOURCE_SCHEDULE = {
    'newsapi': {'minutes': 15},
    'gnews': {'minutes': 30},
    'newsdata': {'minutes': 45},
}

async def collect_from_source(source: str):
    """Collect and process articles from a source"""
    global news_collector, article_processor
    
    if news_collector is None:
        from app.services.news_collector import NewsCollector
        from app.services.article_processor import ArticleProcessor
        news_collector = NewsCollector()
        article_processor = ArticleProcessor()
    
    logger.info(f"🔄 Collecting from {source} at {datetime.now()}...")
    
    try:
        # Fetch articles
        articles = await news_collector.fetch_articles(source)
        
        if not articles:
            logger.info(f"📭 No articles from {source}")
            return
        
        processed_count = 0
        for raw_article in articles:
            # Normalize
            article = news_collector.normalize_article(raw_article)
            
            # Check if exists
            exists = await news_collector.check_exists(article['url'])
            if exists:
                continue
            
            # Process with AI
            processed = await article_processor.process_article(article)
            
            # Save to database
            saved = await article_processor.save_article(processed)
            if saved:
                processed_count += 1
                logger.info(f"✅ Saved: {processed['title'][:50]}...")
        
        logger.info(f"✅ {source}: saved {processed_count} new articles")
        
    except Exception as e:
        logger.error(f"❌ {source} collection error: {e}")

def start_scheduler():
    """Start the news collection scheduler"""
    try:
        for source, config in SOURCE_SCHEDULE.items():
            scheduler.add_job(
                lambda s=source: asyncio.create_task(collect_from_source(s)),
                trigger=IntervalTrigger(minutes=config['minutes']),
                id=f"collect_{source}",
                replace_existing=True,
                coalesce=True
            )
            logger.info(f"📅 Scheduled {source}: every {config['minutes']} minutes")
        
        scheduler.start()
        logger.info("✅ Scheduler started")
        
    except Exception as e:
        logger.error(f"❌ Scheduler error: {e}")