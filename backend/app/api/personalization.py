"""
Personalization API endpoints for user profile management.
"""
import os
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

router = APIRouter(prefix="/api", tags=["personalization"])

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set")

def get_db_connection():
    """Get a database connection."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise


class PersonalizationUpdate(BaseModel):
    experience_level: Optional[str] = None
    background: Optional[str] = None
    language: Optional[str] = None
    is_technical: Optional[bool] = None


class PersonalizationResponse(BaseModel):
    experience_level: Optional[str]
    background: Optional[str]
    language: str
    is_technical: Optional[bool] = None


@router.get("/personalization", response_model=PersonalizationResponse)
async def get_personalization(
    user_id: Optional[str] = None,
    current_user: Optional[dict] = None
):
    """
    Get user personalization settings.
    """
    # Use user_id from query or current_user
    actual_user_id = user_id or (current_user.get("id") if current_user else None)
    
    if not actual_user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT 
                    experience_level,
                    background,
                    language,
                    is_technical
                FROM users 
                WHERE id = %s
                """,
                (actual_user_id,)
            )
            user = cur.fetchone()
            
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            user_dict = dict(user)
            return PersonalizationResponse(
                experience_level=user_dict.get("experience_level"),
                background=user_dict.get("background"),
                language=user_dict.get("language") or "english",
                is_technical=user_dict.get("is_technical")
            )
    finally:
        conn.close()


@router.put("/personalization", response_model=PersonalizationResponse)
async def update_personalization(
    update: PersonalizationUpdate,
    user_id: Optional[str] = None,
    current_user: Optional[dict] = None
):
    """
    Update user personalization settings.
    """
    # Use user_id from query or current_user
    actual_user_id = user_id or (current_user.get("id") if current_user else None)
    
    if not actual_user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Build update query dynamically
            updates = []
            values = []
            
            if update.experience_level is not None:
                updates.append("experience_level = %s")
                values.append(update.experience_level)
            
            if update.background is not None:
                updates.append("background = %s")
                values.append(update.background)
            
            if update.language is not None:
                updates.append("language = %s")
                values.append(update.language)
            
            if update.is_technical is not None:
                updates.append("is_technical = %s")
                values.append(update.is_technical)
            
            if not updates:
                raise HTTPException(status_code=400, detail="No fields to update")
            
            updates.append("updated_at = %s")
            values.append(datetime.utcnow())
            values.append(actual_user_id)
            
            query = f"""
                UPDATE users 
                SET {', '.join(updates)}
                WHERE id = %s
                RETURNING 
                    experience_level,
                    background,
                    language,
                    is_technical
            """
            
            cur.execute(query, values)
            user = cur.fetchone()
            conn.commit()
            
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            user_dict = dict(user)
            return PersonalizationResponse(
                experience_level=user_dict.get("experience_level"),
                background=user_dict.get("background"),
                language=user_dict.get("language") or "english",
                is_technical=user_dict.get("is_technical")
            )
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating personalization: {str(e)}")
    finally:
        conn.close()

