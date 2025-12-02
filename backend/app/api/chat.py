"""
Chat API endpoint for the Physical AI Tutor.
"""
import asyncio
import os
import sys
from pathlib import Path
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

# Add backend directory to path to import agent
backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))
from agent import create_agent, set_user_profile_fetcher, physical_ai_tutor
from agents import Runner
from geminiconfig import get_gemini_config
import psycopg2
from psycopg2.extras import RealDictCursor

router = APIRouter(prefix="/api", tags=["chat"])

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Don't crash import in serverless; log a clear warning instead.
    print(
        "WARNING: DATABASE_URL not set in environment. "
        "Chat endpoint will fail on DB access until this is configured."
    )

def get_db_connection():
    """Get a database connection."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise


# Store current user_id for the user_context_tool to access
_current_user_id: Optional[str] = None

def fetch_user_profile_from_db(user_id: str) -> Optional[Dict[str, Any]]:
    """Fetch user profile from database."""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT 
                    experience_level,
                    background,
                    language
                FROM users 
                WHERE id = %s
                """,
                (user_id,)
            )
            user = cur.fetchone()
            
            if not user:
                return None
            
            user_dict = dict(user)
            return {
                "experience_level": user_dict.get("experience_level") or "intermediate",
                "background": user_dict.get("background") or "Profile not provided; using default settings.",
                "language": user_dict.get("language") or "english"
            }
    finally:
        conn.close()


# Set the user profile fetcher
set_user_profile_fetcher(fetch_user_profile_from_db)


class ChatRequest(BaseModel):
    query: str
    session_id: str
    user_id: Optional[str] = None
    selected_text: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    sources: list
    session_id: str


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: Optional[Dict[str, Any]] = None
):
    """
    Chat endpoint that uses the Physical AI Tutor agent.
    """
    try:
        # Get user ID from request or current_user
        user_id = request.user_id or (current_user.get("id") if current_user else None)
        
        # Get user language preference
        language = "english"
        if user_id:
            conn = get_db_connection()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    # Check if language column exists first
                    cur.execute("""
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name = 'users' AND column_name = 'language'
                    """)
                    if cur.fetchone():
                        # Column exists, query it
                        cur.execute(
                            "SELECT language FROM users WHERE id = %s",
                            (user_id,)
                        )
                        user = cur.fetchone()
                        if user and user.get("language"):
                            language = user.get("language")
                    # If column doesn't exist, use default "english"
            except Exception as e:
                print(f"Warning: Could not fetch user language: {e}")
                # Use default language
            finally:
                conn.close()
        
        # Create agent with language support
        agent = create_agent(language=language)
        
        # Get Gemini config
        config = get_gemini_config()
        
        # Prepare query text - include selected text if provided
        query_text = request.query
        if request.selected_text:
            query_text = f"Context: {request.selected_text}\n\nQuestion: {request.query}"
        
        # If user_id is available, include it in the query so the agent can use it
        # The agent will call user_context_tool with the user_id if needed
        if user_id:
            # We can't pass metadata directly, but the agent can call user_context_tool
            # with the user_id. For now, we'll just pass the query text.
            # The agent's instructions tell it to use user_context_tool when needed.
            pass
        
        # Run the agent with simple string input (no complex message format)
        # The agents SDK doesn't support metadata content type, so we use plain text
        result = await Runner.run(
            agent,
            input=query_text,  # Simple string input - no metadata format
            run_config=config
        )
        
        # Extract response
        # final_output is a property (string), not a method - access without parentheses
        try:
            response_text = result.final_output  # Property, not method
        except AttributeError:
            # Fallback: try final_output_as or other methods
            if hasattr(result, 'final_output_as'):
                response_text = result.final_output_as(str)
            else:
                response_text = str(result)
        
        # Extract sources from tool calls if available
        sources = []
        # Try to extract sources from the result
        # This is a simplified version - you may need to adjust based on your agent SDK
        try:
            if hasattr(result, 'messages'):
                for msg in result.messages:
                    # Check if message has tool calls or tool results
                    if hasattr(msg, 'tool_calls'):
                        for tool_call in msg.tool_calls:
                            if hasattr(tool_call, 'function') and tool_call.function.name == 'rag_search_tool':
                                # Try to get tool result
                                if hasattr(msg, 'tool_results'):
                                    for tool_result in msg.tool_results:
                                        if hasattr(tool_result, 'content'):
                                            # Parse content if it's a string
                                            import json
                                            try:
                                                content = json.loads(tool_result.content) if isinstance(tool_result.content, str) else tool_result.content
                                                if isinstance(content, dict) and 'chunks' in content:
                                                    for chunk in content['chunks']:
                                                        if chunk.get('chapter_url'):
                                                            sources.append({
                                                                'chapter': chunk.get('chapter', ''),
                                                                'section': chunk.get('section', ''),
                                                                'url': chunk.get('chapter_url', ''),
                                                            })
                                            except:
                                                pass
        except Exception as e:
            print(f"Error extracting sources: {e}")
        
        return ChatResponse(
            response=response_text,
            sources=sources,
            session_id=request.session_id
        )
        
    except Exception as e:
        print(f"Chat error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

