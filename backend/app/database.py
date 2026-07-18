import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env")

# Initialize Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

def test_connection():
    """Test Supabase connection"""
    try:
        # Test with a simple query
        response = supabase.table('articles').select('*', count='exact').limit(1).execute()
        print(f"✅ Supabase connected! Found {response.count if hasattr(response, 'count') else len(response.data)} articles")
        return True
    except Exception as e:
        print(f"❌ Supabase connection error: {e}")
        return False

# Test on import
if __name__ == "__main__":
    test_connection()