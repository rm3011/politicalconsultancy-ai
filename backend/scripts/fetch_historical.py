# scripts/fetch_historical.py
import os
import httpx
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
news_api_key = os.getenv("NEWS_API_KEY")

supabase = create_client(url, key)

async def fetch_historical_news():
    """Fetch historical political news from NewsAPI"""
    
    # Get news from last 7 days
    date_from = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://newsapi.org/v2/everything",
            params={
                "q": "India politics",
                "from": date_from,
                "sortBy": "publishedAt",
                "apiKey": news_api_key,
                "pageSize": 100,
                "language": "en"
            }
        )
        
        data = response.json()
        
        if data.get('status') == 'ok':
            articles = data.get('articles', [])
            print(f"📰 Found {len(articles)} articles")
            
            # Process and save
            saved = 0
            for article in articles:
                try:
                    # Extract data
                    title = article.get('title', '')
                    content = article.get('content', '') or article.get('description', '')
                    url = article.get('url', '')
                    source = article.get('source', {}).get('name', 'Unknown')
                    published = article.get('publishedAt', datetime.now().isoformat())
                    
                    if not title or not content or not url:
                        continue
                    
                    # Insert
                    result = supabase.table('articles').insert({
                        'title': title[:500],
                        'content': content[:5000],
                        'summary': content[:300],
                        'url': url,
                        'source': source,
                        'published_at': published,
                        'state': 'India',  # Default
                        'sentiment': 'Neutral',
                        'importance_score': 50
                    }).execute()
                    
                    if result.data:
                        saved += 1
                        print(f"✅ Saved: {title[:50]}...")
                        
                except Exception as e:
                    print(f"❌ Error: {e}")
            
            print(f"✅ Total saved: {saved} articles")
        else:
            print(f"❌ API Error: {data}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(fetch_historical_news())