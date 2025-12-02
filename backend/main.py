import os
import uuid
import jwt
import bcrypt
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Literal, Optional, Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.pool import SimpleConnectionPool

# Get the directory where this script is located
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / '.env'

# Load environment variables
load_result = load_dotenv(dotenv_path=ENV_PATH, verbose=True, override=True)

print(f"Loading .env from: {ENV_PATH}")
print(f".env file exists: {ENV_PATH.exists()}")

# Neon Postgres configuration
DATABASE_URL = os.getenv("DATABASE_URL")

# JWT configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
REFRESH_TOKEN_EXPIRE_DAYS = 30  # 30 days

# Better error messages
if not DATABASE_URL:
    # Don't crash the whole app in serverless environments; log clearly instead.
    print(
        "WARNING: DATABASE_URL not found!\n"
        f"Looking for .env at: {ENV_PATH}\n"
        f"File exists: {ENV_PATH.exists()}\n"
        "Ensure DATABASE_URL is set in environment variables (e.g. Vercel project settings)."
    )
else:
    print(f"✓ DATABASE_URL loaded: {DATABASE_URL[:30]}...")
    print(f"✓ DATABASE_URL loaded: {DATABASE_URL}")
    print(f"✓ JWT_SECRET_KEY loaded: {JWT_SECRET_KEY[:20]}...")

# Database connection pool
def get_db_connection():
    """Get a database connection from the pool"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise

app = FastAPI()

# CORS middleware
# In production, we read allowed origins from the ALLOWED_ORIGINS env var
# (comma-separated list). Fallback to sensible defaults for local + GitHub Pages.
default_allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://abdul-kabir-jawed.github.io",
    "https://abdul-kabir-jawed.github.io/agentic_ai_project",
]

raw_allowed = os.getenv("ALLOWED_ORIGINS", "")
if raw_allowed.strip():
    allowed_origins = [origin.strip() for origin in raw_allowed.split(",") if origin.strip()]
else:
    allowed_origins = default_allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    is_technical: bool
    experience_level: Literal["beginner", "intermediate", "advanced"]

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

# Helper functions
def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against a hash"""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    """Create a JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Helper to get current user from Authorization header
async def get_current_user(authorization: Optional[str] = Header(None)):
    """Get the current authenticated user from the JWT token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    # Extract token from "Bearer <token>" format
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    
    try:
        # Verify the token
        payload = verify_token(token)
        
        # Check token type
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token structure")
        
        # Get user from database
        conn = get_db_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "SELECT id, email, is_technical, experience_level FROM users WHERE id = %s",
                    (user_id,)
                )
                user = cur.fetchone()
                
                if not user:
                    raise HTTPException(status_code=401, detail="User not found")
                
                # Convert to dict and add user_metadata
                user_dict = dict(user)
                user_dict['user_metadata'] = {
                    'is_technical': user_dict.get('is_technical', False),
                    'experience_level': user_dict.get('experience_level')
                }
                
                return user_dict
        finally:
            conn.close()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication token: {str(e)}")

@app.get("/")
async def read_root():
    return {
        "message": "Welcome to the Physical AI & Humanoid Robotics Textbook Backend!",
        "env_loaded": load_result,
        "database_configured": bool(DATABASE_URL)
    }

@app.post("/auth/signup")
async def sign_up(request: SignUpRequest):
    """Register a new user"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Check if user already exists
            cur.execute("SELECT id FROM users WHERE email = %s", (request.email,))
            existing_user = cur.fetchone()
            
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already registered")
            
            # Hash password
            password_hash = hash_password(request.password)
            
            # Create user
            user_id = str(uuid.uuid4())
            cur.execute(
                """INSERT INTO users (id, email, password_hash, is_technical, experience_level)
                   VALUES (%s, %s, %s, %s, %s) RETURNING id, email, is_technical, experience_level""",
                (user_id, request.email, password_hash, request.is_technical, request.experience_level)
            )
            user = cur.fetchone()
            conn.commit()
            
            # Create tokens
            token_data = {"sub": user_id, "email": request.email}
            access_token = create_access_token(token_data)
            refresh_token = create_refresh_token(token_data)
            
            # Store refresh token in database
            expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
            cur.execute(
                "INSERT INTO sessions (user_id, refresh_token, expires_at) VALUES (%s, %s, %s)",
                (user_id, refresh_token, expires_at)
            )
            conn.commit()
            
            user_dict = dict(user)
            return {
                "message": "User signed up successfully",
                "user": {
                    "id": user_dict["id"],
                    "email": user_dict["email"],
                    "user_metadata": {
                        "is_technical": user_dict.get("is_technical", False),
                        "experience_level": user_dict.get("experience_level")
                    }
                },
                "session": {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "expires_at": (datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)).isoformat()
                }
            }
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@app.post("/auth/signin")
async def sign_in(request: SignInRequest):
    """Authenticate a user and return tokens"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Get user by email
            cur.execute(
                "SELECT id, email, password_hash, is_technical, experience_level FROM users WHERE email = %s",
                (request.email,)
            )
            user = cur.fetchone()
            
            if not user:
                raise HTTPException(status_code=401, detail="Invalid email or password")
            
            # Verify password
            if not verify_password(request.password, user["password_hash"]):
                raise HTTPException(status_code=401, detail="Invalid email or password")
            
            # Create tokens
            user_id = str(user["id"])
            token_data = {"sub": user_id, "email": user["email"]}
            access_token = create_access_token(token_data)
            refresh_token = create_refresh_token(token_data)
            
            # Store refresh token in database
            expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
            cur.execute(
                "INSERT INTO sessions (user_id, refresh_token, expires_at) VALUES (%s, %s, %s)",
                (user_id, refresh_token, expires_at)
            )
            conn.commit()
            
            user_dict = dict(user)
            return {
                "message": "User signed in successfully",
                "user": {
                    "id": user_dict["id"],
                    "email": user_dict["email"],
                    "user_metadata": {
                        "is_technical": user_dict.get("is_technical", False),
                        "experience_level": user_dict.get("experience_level")
                    }
                },
                "session": {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "expires_at": (datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)).isoformat()
                }
            }
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=401, detail=str(e))
    finally:
        conn.close()

@app.get("/protected-route")
async def protected_route(user = Depends(get_current_user)):
    """Protected route that requires authentication"""
    return {
        "message": "Welcome, authenticated user!",
        "user_metadata": user.get('user_metadata', {})
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        conn = get_db_connection()
        conn.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "env_file": str(ENV_PATH),
        "env_exists": ENV_PATH.exists()
    }

# Include API routers
from app.api import chat, personalization

# Helper function for optional authentication
async def get_current_user_optional(authorization: Optional[str] = Header(None)) -> Optional[Dict[str, Any]]:
    """Get current user if authenticated, otherwise return None."""
    if not authorization:
        return None
    try:
        return await get_current_user(authorization)
    except:
        return None

# Include routers - but we'll override the chat endpoint to add auth
# Note: The router endpoints won't be used since we override them below
# app.include_router(chat.router)
# app.include_router(personalization.router)

# Override chat endpoint with authenticated version
from app.api.chat import ChatRequest, ChatResponse
@app.post("/api/chat", response_model=ChatResponse, tags=["chat"])
async def chat_endpoint_authenticated(
    request: ChatRequest,
    authorization: Optional[str] = Header(None)
):
    """Chat endpoint with optional authentication."""
    current_user = await get_current_user_optional(authorization)
    return await chat.chat_endpoint(request, current_user)

# Override personalization endpoints with authenticated versions
from app.api.personalization import PersonalizationUpdate, PersonalizationResponse
@app.get("/api/personalization", response_model=PersonalizationResponse)
async def get_personalization_authenticated(
    user_id: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """Get personalization with authentication."""
    current_user = await get_current_user_optional(authorization)
    actual_user_id = user_id or (current_user.get("id") if current_user else None)
    if not actual_user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    return await personalization.get_personalization(actual_user_id, current_user)

@app.put("/api/personalization", response_model=PersonalizationResponse)
async def update_personalization_authenticated(
    update: PersonalizationUpdate,
    user_id: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """Update personalization with authentication."""
    current_user = await get_current_user_optional(authorization)
    actual_user_id = user_id or (current_user.get("id") if current_user else None)
    if not actual_user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    return await personalization.update_personalization(update, actual_user_id, current_user)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
