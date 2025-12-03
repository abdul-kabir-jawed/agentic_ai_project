# API Documentation

This document provides comprehensive documentation for all FastAPI endpoints in the Physical AI & Humanoid Robotics Textbook backend.

**Base URL**: 
- Production: `https://agenticaiproject.vercel.app`
- Local: `http://localhost:8000`

## Authentication

Most endpoints require authentication via JWT token. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Health & Status

### GET `/`
Get welcome message and system status.

**Response:**
```json
{
  "message": "Welcome to the Physical AI & Humanoid Robotics Textbook Backend!",
  "env_loaded": true,
  "database_configured": true
}
```

### GET `/health`
Health check endpoint to verify system status.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "env_file": "/var/task/.env",
  "env_exists": true
}
```

---

## Authentication Endpoints

### POST `/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "is_technical": true,
  "experience_level": "intermediate"
}
```

**Response:**
```json
{
  "message": "User signed up successfully",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "user_metadata": {
      "is_technical": true,
      "experience_level": "intermediate"
    }
  },
  "session": {
    "access_token": "jwt-token-here",
    "refresh_token": "refresh-token-here",
    "expires_at": "2025-12-03T12:00:00"
  }
}
```

### POST `/auth/signin`
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User signed in successfully",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "user_metadata": {
      "is_technical": true,
      "experience_level": "intermediate"
    }
  },
  "session": {
    "access_token": "jwt-token-here",
    "refresh_token": "refresh-token-here",
    "expires_at": "2025-12-03T12:00:00"
  }
}
```

### GET `/protected-route`
Test endpoint that requires authentication.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Welcome, authenticated user!",
  "user_metadata": {
    "is_technical": true,
    "experience_level": "intermediate"
  }
}
```

---

## Chat API

### POST `/api/chat`
Send a message to the Physical AI Tutor chatbot.

**Headers:**
```
Authorization: Bearer <jwt_token> (optional)
```

**Request Body:**
```json
{
  "query": "What is physical AI?",
  "session_id": "session-uuid-here",
  "user_id": "user-uuid-here",
  "selected_text": "Optional: selected text from document"
}
```

**Response:**
```json
{
  "response": "Physical AI refers to artificial intelligence systems...",
  "sources": [
    {
      "chapter": "Chapter 1",
      "section": "Introduction",
      "content": "Relevant text excerpt..."
    }
  ],
  "session_id": "session-uuid-here"
}
```

**Features:**
- Uses RAG (Retrieval-Augmented Generation) to retrieve relevant textbook content
- Supports multi-language responses based on user preference
- Includes source citations for all answers
- Can use selected text from document as context

---

## Personalization API

### GET `/api/personalization`
Get user's personalization settings.

**Query Parameters:**
- `user_id` (optional): User ID (uses authenticated user if not provided)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "experience_level": "intermediate",
  "background": "robotics engineer",
  "language": "english",
  "is_technical": true
}
```

### PUT `/api/personalization`
Update user's personalization settings.

**Query Parameters:**
- `user_id` (optional): User ID (uses authenticated user if not provided)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "experience_level": "advanced",
  "background": "AI researcher",
  "language": "urdu",
  "is_technical": true
}
```

**Response:**
```json
{
  "experience_level": "advanced",
  "background": "AI researcher",
  "language": "urdu",
  "is_technical": true
}
```

**Valid Values:**
- `experience_level`: `"beginner"`, `"intermediate"`, `"advanced"`
- `language`: `"english"`, `"urdu"`, `"spanish"`, `"chinese"`, etc.
- `is_technical`: `true` or `false`

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "detail": "Authorization header missing"
}
```
or
```json
{
  "detail": "Invalid email or password"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error message"
}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. However, please use the API responsibly.

---

## CORS

The API supports CORS for the following origins:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `https://abdul-kabir-jawed.github.io`
- `https://abdul-kabir-jawed.github.io/agentic_ai_project`

Additional origins can be configured via the `ALLOWED_ORIGINS` environment variable.

---

## Example Usage

### Using cURL

**Sign Up:**
```bash
curl -X POST https://agenticaiproject.vercel.app/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "is_technical": true,
    "experience_level": "beginner"
  }'
```

**Chat:**
```bash
curl -X POST https://agenticaiproject.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "query": "Explain physical AI",
    "session_id": "session-123"
  }'
```

### Using JavaScript/Fetch

```javascript
// Sign in
const response = await fetch('https://agenticaiproject.vercel.app/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.session.access_token;

// Use token for authenticated requests
const chatResponse = await fetch('https://agenticaiproject.vercel.app/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: 'What is physical AI?',
    session_id: 'session-123'
  })
});
```

