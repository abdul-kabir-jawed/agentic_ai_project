"""
Script to index the Physical AI textbook content into Qdrant.
This script reads MDX chapter files, chunks them, generates embeddings, and uploads to Qdrant.
"""
import os
import re
import asyncio
import uuid
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from dotenv import load_dotenv
from qdrant_client import AsyncQdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
import httpx

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / '.env'
load_dotenv(dotenv_path=ENV_PATH)

# Configuration
QDRANT_URL = os.getenv("QDRANT_URL", "")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
COLLECTION_NAME = "physical_ai_textbook"
BOOK_ID = "physical_ai_humanoid_robotics"
EMBEDDING_MODEL = "models/text-embedding-004"  # Gemini embedding model
EMBEDDING_DIMENSION = 768  # Gemini embeddings are 768 dimensions
BASE_URL = "https://panaversity-robotics-hackathon.github.io/panaversity-robotics-hackathon"

# Chunking configuration - AGGRESSIVE OPTIMIZATION for speed
CHUNK_SIZE = 5000  # Large chunks = fewer API calls = MUCH faster
CHUNK_OVERLAP = 200  # Minimal overlap

# Paths
BOOK_DOCS_DIR = BASE_DIR.parent / "book" / "docs"


def parse_frontmatter(content: str) -> Tuple[Dict[str, Any], str]:
    """Extract frontmatter from MDX file and return (metadata, content)."""
    if not content.startswith("---"):
        return {}, content
    
    # Find the end of frontmatter
    end_idx = content.find("---", 3)
    if end_idx == -1:
        return {}, content
    
    frontmatter_text = content[3:end_idx].strip()
    body = content[end_idx + 3:].strip()
    
    # Parse frontmatter (simple key-value parser)
    metadata = {}
    for line in frontmatter_text.split("\n"):
        if ":" in line:
            key, value = line.split(":", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            metadata[key] = value
    
    return metadata, body


def extract_sections(content: str) -> List[Dict[str, Any]]:
    """Extract sections from markdown content based on headers."""
    sections = []
    lines = content.split("\n")
    current_section = {"title": "Introduction", "level": 1, "content": []}
    
    for line in lines:
        # Check for headers
        header_match = re.match(r"^(#{1,6})\s+(.+)$", line)
        if header_match:
            # Save previous section
            if current_section["content"]:
                sections.append(current_section.copy())
            
            # Start new section
            level = len(header_match.group(1))
            title = header_match.group(2).strip()
            current_section = {
                "title": title,
                "level": level,
                "content": []
            }
        else:
            current_section["content"].append(line)
    
    # Add last section
    if current_section["content"]:
        sections.append(current_section)
    
    return sections


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    """Split text into overlapping chunks."""
    if len(text) <= chunk_size:
        return [text]
    
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        
        # Try to break at sentence or paragraph boundary
        if end < len(text):
            # Look for paragraph break first
            para_break = text.rfind("\n\n", start, end)
            if para_break != -1:
                end = para_break + 2
            else:
                # Look for sentence break
                sentence_break = max(
                    text.rfind(". ", start, end),
                    text.rfind(".\n", start, end),
                    text.rfind("! ", start, end),
                    text.rfind("? ", start, end)
                )
                if sentence_break != -1:
                    end = sentence_break + 2
        
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        
        # Move start with overlap
        start = end - overlap if end < len(text) else end
    
    return chunks


def clean_markdown(text: str) -> str:
    """Remove markdown syntax for cleaner text (optional, can keep for context)."""
    # Remove code blocks but keep the content
    text = re.sub(r'```[\s\S]*?```', '', text)
    # Remove inline code markers
    text = re.sub(r'`([^`]+)`', r'\1', text)
    # Remove links but keep text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    # Remove images
    text = re.sub(r'!\[([^\]]*)\]\([^\)]+\)', '', text)
    return text.strip()


async def generate_embeddings_batch(texts: List[str]) -> List[List[float]]:
    """Generate embeddings using Gemini Embedding API via REST."""
    async with httpx.AsyncClient(timeout=120.0) as client:
        embeddings = []
        # Process in parallel batches (Gemini API supports concurrent requests)
        # Process 50 at a time to avoid rate limits
        batch_size = 50
        for i in range(0, len(texts), batch_size):
            batch_texts = texts[i:i + batch_size]
            
            # Create requests for this batch
            tasks = []
            for text in batch_texts:
                url = f"https://generativelanguage.googleapis.com/v1beta/{EMBEDDING_MODEL}:embedContent?key={GEMINI_API_KEY}"
                payload = {
                    "content": {
                        "parts": [{"text": text}]
                    },
                    "taskType": "RETRIEVAL_DOCUMENT"
                }
                tasks.append(client.post(url, json=payload))
            
            # Execute batch requests in parallel
            responses = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Extract embeddings
            for idx, response in enumerate(responses):
                if isinstance(response, Exception):
                    raise Exception(f"Request failed: {response}")
                if response.status_code == 200:
                    data = response.json()
                    if "embedding" in data and "values" in data["embedding"]:
                        embeddings.append(data["embedding"]["values"])
                    else:
                        raise Exception(f"Unexpected response format: {data}")
                else:
                    error_text = response.text
                    raise Exception(f"Gemini API error ({response.status_code}): {error_text}")
        
        return embeddings


def process_chapter_file(file_path: Path) -> List[Dict[str, Any]]:
    """Process a single chapter MDX file and return chunks with metadata."""
    print(f"Processing: {file_path.name}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Parse frontmatter
    metadata, body = parse_frontmatter(content)
    
    # Get chapter info
    chapter_id = metadata.get("id", file_path.stem)
    chapter_title = metadata.get("title", file_path.stem.replace("-", " ").title())
    chapter_url = f"{BASE_URL}/docs/{chapter_id}"
    
    # Extract sections
    sections = extract_sections(body)
    
    # Process sections into chunks
    chunks = []
    for section in sections:
        section_title = section["title"]
        section_content = "\n".join(section["content"])
        
        # Clean and chunk the section content
        cleaned_content = clean_markdown(section_content)
        if not cleaned_content or len(cleaned_content) < 50:  # Skip very short sections
            continue
        
        section_chunks = chunk_text(cleaned_content)
        
        for i, chunk_text_content in enumerate(section_chunks):
            chunks.append({
                "content": chunk_text_content,
                "chapter": chapter_title,
                "section": section_title,
                "chapter_url": chapter_url,
                "chapter_id": chapter_id,
            })
    
    print(f"  Extracted {len(chunks)} chunks from {len(sections)} sections")
    return chunks


async def index_chapters():
    """Main function to index all chapters."""
    # Validate environment
    if not QDRANT_URL or not QDRANT_API_KEY:
        print("❌ QDRANT_URL and QDRANT_API_KEY must be set in .env file")
        return False
    
    if not GEMINI_API_KEY:
        print("❌ GEMINI_API_KEY must be set in .env file")
        return False
    
    # Check if docs directory exists
    if not BOOK_DOCS_DIR.exists():
        print(f"❌ Textbook docs directory not found: {BOOK_DOCS_DIR}")
        return False
    
    # Initialize clients
    print("Initializing clients...")
    qdrant_client = AsyncQdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    
    # Verify collection exists
    try:
        await qdrant_client.get_collection(COLLECTION_NAME)
        print(f"✅ Collection '{COLLECTION_NAME}' exists")
    except Exception as e:
        if "doesn't exist" in str(e) or "404" in str(e):
            print(f"❌ Collection '{COLLECTION_NAME}' doesn't exist. Run init_qdrant_collection.py first")
            return False
        else:
            raise
    
    # Find all chapter MDX files
    chapter_files = sorted(BOOK_DOCS_DIR.glob("chapter-*.mdx"))
    
    if not chapter_files:
        print(f"❌ No chapter files found in {BOOK_DOCS_DIR}")
        return False
    
    print(f"\nFound {len(chapter_files)} chapter files")
    print("=" * 60)
    
    # Process and index chapters ONE AT A TIME for visible progress
    import time
    start_time = time.time()
    total_chunks = 0
    
    print(f"\n🚀 Starting indexing (processing chapters one at a time)...")
    print("=" * 60)
    
    # Maximum batch size for embeddings
    batch_size = 2048
    
    for idx, chapter_file in enumerate(chapter_files, 1):
        chapter_start = time.time()
        print(f"\n📖 [{idx}/{len(chapter_files)}] Processing: {chapter_file.name}")
        
        # Process chapter
        chunks = process_chapter_file(chapter_file)
        if not chunks:
            print(f"  ⚠️  No chunks extracted, skipping...")
            continue
        
        print(f"  📦 Extracted {len(chunks)} chunks")
        
        # Process in batches
        chapter_chunks_uploaded = 0
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i + batch_size]
            batch_num = (i // batch_size) + 1
            total_batches = (len(chunks) + batch_size - 1) // batch_size
            
            print(f"    Batch {batch_num}/{total_batches}: {len(batch)} chunks...", end="", flush=True)
            
            # Generate embeddings
            batch_texts = [chunk["content"] for chunk in batch]
            try:
                embeddings = await generate_embeddings_batch(batch_texts)
            except Exception as e:
                print(f" ❌ Error: {e}")
                continue
            
            # Prepare points
            points = []
            for chunk, embedding in zip(batch, embeddings):
                point_id = str(uuid.uuid4())
                points.append(
                    PointStruct(
                        id=point_id,
                        vector=embedding,
                        payload={
                            "content": chunk["content"],
                            "chapter": chunk["chapter"],
                            "section": chunk["section"],
                            "chapter_url": chunk["chapter_url"],
                            "chapter_id": chunk["chapter_id"],
                            "book": BOOK_ID,
                        }
                    )
                )
            
            # Upload to Qdrant
            try:
                await qdrant_client.upsert(
                    collection_name=COLLECTION_NAME,
                    points=points
                )
                chapter_chunks_uploaded += len(batch)
                total_chunks += len(batch)
                chapter_time = time.time() - chapter_start
                print(f" ✅ ({chapter_time:.1f}s)")
            except Exception as e:
                print(f" ❌ Upload error: {e}")
        
        chapter_total_time = time.time() - chapter_start
        print(f"  ✅ Chapter complete: {chapter_chunks_uploaded} chunks in {chapter_total_time:.1f}s")
    
    # Get final collection info
    total_time = time.time() - start_time
    collection_info = await qdrant_client.get_collection(COLLECTION_NAME)
    print("\n" + "=" * 60)
    print(f"✅ Indexing complete!")
    print(f"   Total time: {total_time:.1f}s ({total_time/60:.1f} minutes)")
    print(f"   Total points in collection: {collection_info.points_count}")
    print(f"   Chapters indexed: {len(chapter_files)}")
    print(f"   Total chunks uploaded: {total_chunks}")
    if total_time > 0:
        print(f"   Average speed: {total_chunks/total_time:.1f} chunks/second")
    
    return True


if __name__ == "__main__":
    print("Physical AI Textbook Indexing Script")
    print("=" * 60)
    success = asyncio.run(index_chapters())
    if not success:
        exit(1)

