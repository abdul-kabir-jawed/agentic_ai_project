import asyncio
import os
from typing import Any, Dict, List, Optional, Callable
import httpx

from agents import Agent, ModelSettings, Runner, function_tool
from agents import SQLiteSession  # Use concrete implementation instead of Protocol
from pydantic import BaseModel, Field
from qdrant_client import AsyncQdrantClient
from qdrant_client.http.models import FieldCondition, Filter, MatchValue

# --- Environment -----------------------------------------------------------------

QDRANT_URL = os.environ.get("QDRANT_URL", "")
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "")
QDRANT_API_KEY = os.environ.get("QDRANT_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# --- Shared clients --------------------------------------------------------------

qdrant_client = AsyncQdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY) if QDRANT_URL else None

# Gemini embedding configuration
EMBEDDING_MODEL = "models/text-embedding-004"  # Gemini embedding model
COLLECTION_NAME = "physical_ai_textbook"
BOOK_ID = "physical_ai_humanoid_robotics"

# User profile fetcher function (will be set from backend)
_user_profile_fetcher: Optional[Callable[[str], Dict[str, Any]]] = None

def set_user_profile_fetcher(fetcher: Callable[[str], Dict[str, Any]]):
    """Set the function to fetch user profiles from database."""
    global _user_profile_fetcher
    _user_profile_fetcher = fetcher


async def _generate_embedding(text: str) -> List[float]:
    """Helper to create embeddings via Gemini API."""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set")
    
    url = f"https://generativelanguage.googleapis.com/v1beta/{EMBEDDING_MODEL}:embedContent?key={GEMINI_API_KEY}"
    payload = {
        "content": {
            "parts": [{"text": text}]
        },
        "taskType": "RETRIEVAL_QUERY"  # Use RETRIEVAL_QUERY for search queries
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            return data["embedding"]["values"]
        else:
            error_text = response.text
            raise Exception(f"Gemini API error ({response.status_code}): {error_text}")


# --- Pydantic Schemas ------------------------------------------------------------

class RetrievedChunk(BaseModel):
    content: str
    chapter: Optional[str] = None
    section: Optional[str] = None
    chapter_url: Optional[str] = None
    score: Optional[float] = None


class RagSearchResponse(BaseModel):
    query: str
    total_results: int
    user_selected_text_included: bool = False
    chunks: List[RetrievedChunk] = Field(default_factory=list)


class UserProfile(BaseModel):
    experience_level: str
    background: str


# --- Tools -----------------------------------------------------------------------

@function_tool
async def rag_search_tool(
    query: str,
    user_selected_text: Optional[str] = None,
    top_k: int = 5,
) -> Dict[str, Any]:
    """
    Searches the Physical AI textbook collection for relevant chunks.

    Returns:
        dict containing retrieved chunks and metadata for citation.
    """
    if not query:
        return RagSearchResponse(
            query=query,
            total_results=0,
            user_selected_text_included=bool(user_selected_text),
            chunks=[],
        ).model_dump()

    if not qdrant_client:
        return RagSearchResponse(
            query=query,
            total_results=0,
            user_selected_text_included=bool(user_selected_text),
            chunks=[],
        ).model_dump()

    # Check if collection exists
    try:
        collection_info = await qdrant_client.get_collection(COLLECTION_NAME)
    except Exception as e:
        error_msg = str(e)
        if "doesn't exist" in error_msg or "404" in error_msg or "Not found" in error_msg:
            print(f"Warning: Qdrant collection '{COLLECTION_NAME}' does not exist. Please create and index the collection first.")
            return RagSearchResponse(
                query=query,
                total_results=0,
                user_selected_text_included=bool(user_selected_text),
                chunks=[],
            ).model_dump()
        else:
            print(f"Error checking Qdrant collection: {e}")
            return RagSearchResponse(
                query=query,
                total_results=0,
                user_selected_text_included=bool(user_selected_text),
                chunks=[],
            ).model_dump()

    # 1. Embed the query
    query_vector = await _generate_embedding(query)

    # 2. Search Qdrant using query_points (newer API - replaces search method)
    qdrant_filter = Filter(
        must=[
            FieldCondition(
                key="book",
                match=MatchValue(value=BOOK_ID),
            )
        ]
    )
    
    # Use query_points instead of search (for qdrant-client 1.16.0+)
    # query_points accepts the vector directly or a Query object
    try:
        query_result = await qdrant_client.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,  # Can pass vector directly
            query_filter=qdrant_filter,
            limit=top_k,
            with_payload=True,
            with_vectors=False,
        )
        hits = query_result.points
    except Exception as e:
        error_msg = str(e)
        print(f"Error querying Qdrant: {e}")
        if "doesn't exist" in error_msg or "404" in error_msg or "Not found" in error_msg:
            print(f"Warning: Qdrant collection '{COLLECTION_NAME}' does not exist. Please create and index the collection first.")
        return RagSearchResponse(
            query=query,
            total_results=0,
            user_selected_text_included=bool(user_selected_text),
            chunks=[],
        ).model_dump()

    # 3. Format chunks
    chunks: List[RetrievedChunk] = []
    for hit in hits:
        payload = hit.payload or {}
        # ScoredPoint has a 'score' attribute
        score = hit.score if hasattr(hit, 'score') else 0.0
        
        chunks.append(
            RetrievedChunk(
                content=payload.get("content", ""),
                chapter=payload.get("chapter"),
                section=payload.get("section"),
                chapter_url=payload.get("chapter_url"),
                score=score,
            )
        )

    # 4. Inject user-selected text (if any) at highest priority
    if user_selected_text:
        chunks.insert(
            0,
            RetrievedChunk(
                content=user_selected_text,
                chapter="User Selection",
                section="Provided Context",
                chapter_url=None,
                score=1.0,
            ),
        )

    return RagSearchResponse(
        query=query,
        chunks=chunks,
        total_results=len(chunks),
        user_selected_text_included=bool(user_selected_text),
    ).model_dump()


USER_PROFILES: Dict[str, UserProfile] = {
    "learner_beginner": UserProfile(
        experience_level="beginner",
        background="High school student exploring robotics.",
    ),
    "learner_advanced": UserProfile(
        experience_level="advanced",
        background="Graduate student in robotics.",
    ),
}
DEFAULT_PROFILE = UserProfile(
    experience_level="intermediate",
    background="Profile not provided; using default settings.",
)


@function_tool
async def user_context_tool(user_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Returns personalization data for the user.
    You should call this tool with the user_id when you want to personalize responses.
    If no user_id is provided, returns default profile.
    """
    if not user_id:
        return DEFAULT_PROFILE.model_dump()
    
    # Try to fetch from database if fetcher is set
    if _user_profile_fetcher:
        try:
            profile_data = _user_profile_fetcher(user_id)
            if profile_data:
                return profile_data
        except Exception as e:
            print(f"Error fetching user profile: {e}")
    
    # Fallback to hardcoded profiles
    return USER_PROFILES.get(user_id, DEFAULT_PROFILE).model_dump()


# --- Agent -----------------------------------------------------------------------

def create_agent(language: str = "english") -> Agent:
    """Create the Physical AI Tutor agent with language support."""
    # Language-specific instructions
    language_instruction = ""
    if language and language.lower() != "english":
        language_instruction = f"\n6. Respond in {language}. All your responses must be in {language}.\n"
    
    instructions = (
        "You tutor Physical AI & Humanoid Robotics using ONLY the official textbook. "
        "For every question:\n"
        "1. Always call rag_search_tool first with the user's question.\n"
        "2. If the user provides context (selected text), use it to better understand their question.\n"
        "3. Call user_context_tool if you need to personalize your response (pass user_id if mentioned in the conversation).\n"
        '4. If content is not in the textbook, reply only with "I don\'t have that information in the textbook."\n'
        "5. Present answers in Markdown with sections:\n"
        "   - **Reasoned Explanation** (step-by-step, pedagogical, citing chapters inline like (Chapter 2, Section 1)).\n"
        "   - **Examples and Code** when relevant.\n"
        "   - **Direct Answer** (succinct conclusion).\n"
        "   - **References** list (chapter & section plus chapter_url).\n"
        "6. Every factual statement must cite its source; combine multiple chunks when needed."
        + language_instruction
    )
    
    return Agent(
        name="Physical AI Tutor",
        instructions=instructions,
        tools=[rag_search_tool, user_context_tool],
        model_settings=ModelSettings(
            temperature=0.3,
            max_tokens=1200,
        ),
    )

# Default agent instance
physical_ai_tutor = create_agent()


# --- Runner / Session Example ----------------------------------------------------

async def main() -> None:
    """
    Demonstrates how to run the Physical AI Tutor with session-based history.
    """
    from geminiconfig import get_gemini_config
    
    config = get_gemini_config()
    session = SQLiteSession(session_id="user-123")  # persists conversation

    # User message (include metadata for user ID + highlighted text if available)
    user_message = {
        "role": "user",
        "content": [
            {
                "type": "input_text",
                "text": "How do proprioceptive sensors help a humanoid robot maintain balance?",
            },
            {
                "type": "metadata",
                "metadata": {
                    "user_id": "learner_beginner",
                    "user_selected_text": (
                        "Proprioception lets the robot sense joint angles and torques internally."
                    ),
                },
            },
        ],
    }

    result = await Runner.run(
        physical_ai_tutor,
        input=[user_message],
        session=session,
        run_config=config
    )

    print("\n--- Physical AI Tutor Response ---\n")
    print(result.final_output)  # final_output is a property, not a method


if __name__ == "__main__":
    asyncio.run(main())

