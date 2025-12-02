"""
Script to initialize the Qdrant collection for the Physical AI textbook.
This creates an empty collection that can be populated with textbook content later.
"""
import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from qdrant_client import AsyncQdrantClient
from qdrant_client.http.models import Distance, VectorParams

# Load environment variables from .env file
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / '.env'
load_dotenv(dotenv_path=ENV_PATH)

QDRANT_URL = os.getenv("QDRANT_URL", "")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "")
COLLECTION_NAME = "physical_ai_textbook"
EMBEDDING_DIMENSION = 768  # Gemini text-embedding-004 dimension

async def init_collection():
    """Create the Qdrant collection if it doesn't exist."""
    if not QDRANT_URL or not QDRANT_API_KEY:
        print("❌ QDRANT_URL and QDRANT_API_KEY must be set in .env file")
        print(f"   Looking for .env at: {ENV_PATH}")
        print(f"   .env file exists: {ENV_PATH.exists()}")
        return False
    
    print(f"Connecting to Qdrant at: {QDRANT_URL}")
    client = AsyncQdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    
    try:
        # Check if collection already exists
        try:
            collection_info = await client.get_collection(COLLECTION_NAME)
            print(f"✅ Collection '{COLLECTION_NAME}' already exists!")
            print(f"   Points count: {collection_info.points_count}")
            print(f"   Vectors count: {collection_info.vectors_count}")
            return True
        except Exception as e:
            error_msg = str(e)
            if "doesn't exist" in error_msg or "404" in error_msg or "Not found" in error_msg:
                # Collection doesn't exist, create it
                print(f"Collection '{COLLECTION_NAME}' doesn't exist. Creating it...")
                
                await client.create_collection(
                    collection_name=COLLECTION_NAME,
                    vectors_config=VectorParams(
                        size=EMBEDDING_DIMENSION,
                        distance=Distance.COSINE
                    )
                )
                
                print(f"✅ Collection '{COLLECTION_NAME}' created successfully!")
                print(f"   Vector dimension: {EMBEDDING_DIMENSION}")
                print(f"   Distance metric: COSINE")
                print("\n⚠️  Note: The collection is empty. You need to index your textbook content.")
                print("   Use an indexing script to add chunks and embeddings to the collection.")
                return True
            else:
                raise
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(init_collection())
    if not success:
        exit(1)

