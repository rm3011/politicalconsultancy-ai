import os
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)

# Historical political data
articles = [
    {
        "title": "2026 Tamil Nadu Election Results: TVK Wins Majority",
        "content": "TVK party led by actor Vijay won a decisive victory in the 2026 Tamil Nadu assembly elections. The party secured 120 seats out of 234, forming the government.",
        "summary": "TVK wins 2026 Tamil Nadu elections.",
        "url": "https://example.com/tn-election-2026-results",
        "source": "Election Commission",
        "published_at": "2026-05-04 20:00:00",
        "state": "Tamil Nadu",
        "politicians": ["Joseph Vijay", "MK Stalin"],
        "parties": ["TVK", "DMK"],
        "sentiment": "Positive",
        "importance_score": 98
    },
    {
        "title": "Joseph Vijay Sworn In as Tamil Nadu CM",
        "content": "Actor-turned-politician Joseph Vijay was sworn in as the 13th Chief Minister of Tamil Nadu on May 10, 2026. His party TVK swept the elections.",
        "summary": "Joseph Vijay becomes Tamil Nadu CM.",
        "url": "https://example.com/vijay-cm-2026",
        "source": "NDTV",
        "published_at": "2026-05-10 10:00:00",
        "state": "Tamil Nadu",
        "politicians": ["Joseph Vijay"],
        "parties": ["TVK"],
        "sentiment": "Positive",
        "importance_score": 95
    },
    {
        "title": "MK Stalin: Former Tamil Nadu CM",
        "content": "MK Stalin served as Tamil Nadu Chief Minister from 2021 to 2026. His party DMK lost the 2026 elections to TVK.",
        "summary": "MK Stalin was CM from 2021-2026.",
        "url": "https://example.com/stalin-former-cm",
        "source": "The Hindu",
        "published_at": "2026-05-11 10:00:00",
        "state": "Tamil Nadu",
        "politicians": ["MK Stalin"],
        "parties": ["DMK"],
        "sentiment": "Neutral",
        "importance_score": 85
    },
    {
        "title": "2024 Lok Sabha Elections: BJP Wins Majority",
        "content": "BJP won a majority in the 2024 Lok Sabha elections. Narendra Modi became Prime Minister for the third consecutive term.",
        "summary": "BJP wins 2024 national elections.",
        "url": "https://example.com/lok-sabha-2024",
        "source": "Times of India",
        "published_at": "2024-06-04 20:00:00",
        "state": "India",
        "politicians": ["Narendra Modi"],
        "parties": ["BJP"],
        "sentiment": "Positive",
        "importance_score": 90
    }
]

def seed():
    print("🌱 Seeding database with historical data...")
    
    for article in articles:
        try:
            result = supabase.table('articles').insert(article).execute()
            if result.data:
                print(f"✅ Inserted: {article['title'][:50]}...")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    # Verify
    response = supabase.table('articles').select('*', count='exact').execute()
    print(f"📊 Total articles in database: {response.count}")

if __name__ == "__main__":
    seed()