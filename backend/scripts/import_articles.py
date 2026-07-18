import csv
import os
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)

# CSV file with historical data
csv_file = "historical_articles.csv"

def import_from_csv(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        articles = []
        for row in reader:
            articles.append({
                'title': row['title'],
                'content': row['content'],
                'summary': row['summary'],
                'url': row['url'],
                'source': row['source'],
                'published_at': datetime.fromisoformat(row['published_at']).isoformat(),
                'state': row['state'],
                'politicians': row['politicians'].split(','),
                'parties': row['parties'].split(','),
                'sentiment': row['sentiment'],
                'importance_score': int(row['importance_score'])
            })
        
        # Batch insert
        response = supabase.table('articles').insert(articles).execute()
        print(f"✅ Imported {len(response.data)} articles")

if __name__ == "__main__":
    import_from_csv(csv_file)