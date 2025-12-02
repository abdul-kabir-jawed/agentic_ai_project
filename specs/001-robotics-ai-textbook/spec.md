# Feature Specification: Physical AI Textbook Project

**Feature Branch**: `1-ai-textbook-spec`
**Created**: 2025-11-28
**Status**: Draft
**Input**: User description: "Create a detailed speckit-plus.md document for my Physical AI textbook hackathon project.\n\nREFERENCE THE CONSTITUTION with these core values:\n- AI-First Learning, Privacy & Trust, Accessibility, Source Integrity, Developer Experience, Production Quality\n\nSYSTEM COMPONENTS TO DEFINE:\n\n**Frontend Layer:**\n- Docusaurus setup with custom dark-first theme\n- Custom React components for chatbot interface\n- User profile/settings UI\n- Per-chapter personalization controls\n- Urdu translation toggle UI\n- Responsive, accessible design\n\n**Intelligence Layer:**\n- RAG system with Qdrant vector database\n- OpenAI Agents SDK - custom agent implementation (YOU will build this separately)\n- Agent integration points: RAG context injection, chat history, user-selected text\n- Claude Code subagents for auxiliary automation:\n  * Content indexing and embedding generation (NOT chatbot)\n  * Personalization engine (text rewriting)\n  * Translation pipeline (Urdu translation)\n  * QA and testing automation\n\nIMPORTANT DISTINCTION:\n- Main chatbot agent: Built by you with OpenAI Agents SDK \u2192 provide integration specs\n- Claude Code subagents: Auxiliary task automation (indexing, personalization, translation)\n- Focus specification on: API contracts for your agent to consume, RAG context format, chat history schema\n\n**Backend Layer:**\n- FastAPI microservice architecture\n- RESTful API endpoints (chat, personalization, translation, user management)\n- Vector search orchestration\n- Chat history management\n- User-selected text retrieval\n\n**Data Layer:**\n- Neon Serverless Postgres schema:\n  * Users table (id, email, profile_data, background_questionnaire)\n  * Progress table (user_id, chapter_id, completion_status)\n  * Chat_history table\n  * Personalization_preferences table\n- PanaversityFS for book assets and uploads\n- Qdrant collections for embeddings\n\n**Auth & Security:**\n- BetterAuth integration (multi-tenant SSO)\n- Signup flow with background questionnaire\n- JWT token management\n- Role-based access control\n\nFUNCTIONAL REQUIREMENTS:\nFor each component, specify:\n1. Inputs/outputs\n2. API contracts\n3. Data models\n4. Integration points\n5. Performance requirements\n6. Error handling\n\nNON-FUNCTIONAL REQUIREMENTS:\n- Response time targets (chatbot < 3s, personalization < 5s)\n- Scalability targets (support 100 concurrent users)\n- Security standards (HTTPS, encrypted storage)\n- Accessibility standards (WCAG 2.1 AA)\n\nCreate a comprehensive specification that could be handed to any developer to implement."

## 1. Feature Overview
This specification details the architecture and requirements for the "Physical AI & Humanoid Robotics Interactive Textbook" hackathon project. The project aims to create an AI-native educational platform featuring an interactive Docusaurus textbook, a RAG chatbot, user authentication with personalization, and on-demand Urdu translation. The system is composed of Frontend, Intelligence, Backend, Data, and Auth & Security layers, designed for scalability and a rich user experience.

## 2. Goals
- [ ] Deliver an AI-native interactive learning experience for Physical AI & Humanoid Robotics.
- [ ] Implement robust user authentication and per-chapter personalization based on user profiles.
- [ ] Provide a source-trustable RAG chatbot, answering only from book content and user-selected text.
- [ ] Offer on-demand Urdu translation for textbook content.
- [ ] Utilize reusable Claude Code subagents for auxiliary development automation tasks.
- [ ] Ensure the system adheres to high production quality standards, including performance, security, and accessibility.

## 3. Reference to Constitution
This specification adheres to the following core values from the project constitution:
- **AI-First Learning**: The project fundamentally uses AI for personalized learning, RAG chatbot, and content adaptation, making AI a central part of the educational experience.
- **Privacy & Trust**: User data protection is prioritized through BetterAuth integration, explicit consent flows for data processing, encrypted storage, and the source-trustable RAG system which limits external data use.
- **Accessibility**: A custom dark-first theme, responsive design, and on-demand Urdu i18n are core to the UI/UX, ensuring an inclusive platform for diverse users.
- **Source Integrity**: The RAG chatbot strictly adheres to providing answers derived exclusively from verified textbook content or user-selected text, with proper citation mechanisms.
- **Developer Experience**: The project emphasizes spec-driven development and the use of reusable Claude Code subagents to automate tasks, promote consistency, and streamline the development workflow.
- **Production Quality**: Achieved through robust authentication (BetterAuth), a scalable FastAPI backend, efficient data management with Neon Postgres and Qdrant, and comprehensive documentation across all layers.

## 4. User Scenarios & Acceptance Criteria

### User Story 1 - Authenticated User Accesses Personalized Chapter Content (Priority: P1)

An authenticated student wants to read a chapter, expecting the content to be adapted based on their previously provided background questionnaire data. The content should be presented in the selected language (e.g., Urdu, if toggled).

**Why this priority**: Core to the AI-First Learning and Personalization goals, providing immediate value to the authenticated user.

**Independent Test**: A test user can log in, navigate to a chapter, and observe content elements (e.g., explanations, examples) that are clearly adapted to their profile. Toggling Urdu translation should correctly render the chapter content.

**Acceptance Scenarios**:

1.  **Given** a user is logged in with a completed profile, **When** they navigate to a chapter, **Then** the chapter content is personalized according to their profile data.
2.  **Given** a user is viewing a personalized chapter, **When** they toggle the Urdu translation, **Then** the chapter content, including personalized elements, is accurately translated to Urdu and displayed with right-to-left rendering.
3.  **Given** a user with an incomplete profile, **When** they navigate to a chapter, **Then** default content is displayed, and a prompt for completing their profile is shown.

---

### User Story 2 - User Interacts with Source-Trustable RAG Chatbot (Priority: P1)

A student reading a chapter has a question about a specific concept and wants to ask the embedded chatbot. They expect the chatbot to provide an answer strictly based on the textbook content or specific text they have highlighted, with clear citations.

**Why this priority**: Addresses the core RAG chatbot functionality and Source Integrity principle, crucial for an AI-native textbook.

**Independent Test**: A user can ask questions related to a chapter, receive responses citing parts of the chapter, and also highlight text to get context-specific answers. The chatbot should refuse to answer questions outside its defined knowledge base.

**Acceptance Scenarios**:

1.  **Given** a user is on a chapter page, **When** they ask the chatbot a question related to the chapter content, **Then** the chatbot provides an accurate answer with citations from the current chapter.
2.  **Given** a user has selected a specific text passage in the chapter, **When** they ask the chatbot a question, **Then** the chatbot prioritizes answers using the selected text as context, providing citations.
3.  **Given** a user asks a question unrelated to the textbook content or selected text, **When** the chatbot processes the query, **Then** the chatbot politely declines to answer, stating it can only answer from the book or selected text.

---

### User Story 3 - New User Completes Onboarding and Accesses Content (Priority: P2)

A new user wants to sign up for the textbook platform, complete a background questionnaire to enable personalization, and then access the textbook content.

**Why this priority**: Establishes the user base and enables personalized learning, but is dependent on core content and personalization features.

**Independent Test**: A new user can successfully sign up via BetterAuth, complete the background questionnaire, and then seamlessly navigate to and view textbook chapters.

**Acceptance Scenarios**:

1.  **Given** a new user, **When** they complete the BetterAuth signup process and the background questionnaire, **Then** a user account is created, and their profile data is stored.
2.  **Given** a newly registered user, **When** they access the textbook, **Then** they are presented with the introductory content, and personalization features are enabled for subsequent chapter views.

---

### Edge Cases

- What happens when the RAG system retrieves contradictory information for a query? (Prioritize direct book content, flag contradictions for human review.)
- How does the system handle very long chat histories for the RAG chatbot? (Implement a summarization or truncation strategy for older messages.)
- What is the behavior if BetterAuth integration fails or experiences downtime? (Graceful degradation, inform user, allow access to non-authenticated content if possible.)
- How are new chapters added or existing ones updated in the RAG index? (Automated process triggered by content changes, managed by Claude Code subagent.)
- What happens if the Urdu translation service is unavailable or returns an error? (Fallback to original language, display an error message.)

## 5. Functional Requirements

### Component: Frontend Layer (Docusaurus)

#### Inputs/Outputs:
- **Inputs**: User interactions (clicks, text input), API responses from Backend, Docusaurus content (MDX, Markdown).
- **Outputs**: Rendered interactive textbook UI, API requests to Backend, user-selected text, chat messages.

#### API Contracts:
- `GET /api/user/profile`: Retrieve user profile data.
- `POST /api/user/profile`: Update user profile data.
- `GET /api/personalization/{chapter_id}`: Fetch personalized content for a chapter.
- `POST /api/chat`: Send chat message and receive RAG response.
- `POST /api/translate`: Request translation for a given text (chapter_id, target_language).

#### Data Models:
```json
// User Profile (partial)
{
  "id": "string",
  "email": "string",
  "profile_data": {"field": "value"}, // JSON object from questionnaire
  "preferences": {"lang": "en", "theme": "dark"}
}

// Chat Message
{
  "user_id": "string",
  "session_id": "string",
  "message": "string",
  "timestamp": "datetime",
  "is_user": "boolean",
  "response_to_message_id": "string"
}

// Personalized Content Request
{
  "chapter_id": "string",
  "user_id": "string",
  "language": "string"
}
```

#### Integration Points:
- Backend API for user, personalization, chat, and translation services.
- Docusaurus MDX components for embedding interactive elements.
- BetterAuth SDK/library for authentication state management.

#### Performance Requirements:
- UI rendering for chapter pages: < 2 seconds for initial load.
- Chatbot UI response (displaying query): Instantaneous.
- Personalization UI update: < 1 second after user profile changes.

#### Error Handling:
- Display user-friendly error messages for API failures (e.g., "Failed to load personalized content").
- Implement retry mechanisms for transient network issues.
- Visually indicate loading states for API-dependent components.

### Component: Intelligence Layer (RAG System, OpenAI Agents, Claude Code Subagents)

#### Inputs/Outputs:
- **Inputs**: User chat queries, book content (for indexing), user profile data (for personalization), text to translate, RAG context (from backend), chat history.
- **Outputs**: RAG chatbot responses, personalized content, translated text, content embeddings.

#### API Contracts:
- **Main Chatbot Agent (OpenAI Agents SDK):**
  - **`POST /agent/chat`**: (Consumed by Backend)
    - Input: `UserQuery (string), ChatHistory (array of ChatMessage), RAGContext (array of DocumentSnippet), UserPreferences (json)`
    - Output: `AgentResponse (string), Citations (array of SourceReference)`
- **Claude Code Subagents (e.g., via FastAPI endpoints exposing their functionality):**
  - **`POST /subagent/index-content`**: (Triggered by backend/dev workflow)
    - Input: `ChapterContent (string), ChapterMetadata (json)`
    - Output: `Status (success/failure), indexed_vectors_count (int)`
  - **`POST /subagent/personalize-text`**: (Consumed by backend)
    - Input: `OriginalText (string), UserProfile (json), Context (optional string)`
    - Output: `PersonalizedText (string)`
  - **`POST /subagent/translate-text`**: (Consumed by backend)
    - Input: `OriginalText (string), TargetLanguage (string)`
    - Output: `TranslatedText (string)`

#### Data Models:
```json
// RAG Context (array of document snippets)
[
  {
    "id": "string",
    "content": "string", // Text snippet
    "source": "string", // e.g., "chapter-1", "user-selected-text"
    "metadata": {"chapter_title": "string", "page_number": "int"}
  }
]

// Chat History (array of ChatMessage, as defined in Frontend layer)

// User Profile (as defined in Frontend layer)

// Source Reference (for RAG citations)
{
  "text": "string",
  "source": "string", // e.g., "Chapter 1: Introduction, page 15"
  "url": "string" // Optional: link to relevant section
}
```

#### Integration Points:
- FastAPI Backend (for exposing RAG, personalization, translation services).
- Qdrant (for vector storage and retrieval).
- PanaversityFS (for accessing book content for indexing and personalization).
- OpenAI Agents SDK (for the main chatbot agent logic).

#### Performance Requirements:
- RAG retrieval + generation: < 3 seconds for 90% of chatbot queries.
- Personalization engine (text rewriting): < 5 seconds for 90% of requests.
- Content indexing (Claude Code subagent): Within acceptable bounds for background task (e.g., < 1 minute per chapter).

#### Error Handling:
- RAG system: If no relevant content, fallback to a polite "I don't have enough information" response.
- Subagents: Log errors, report status to backend, implement retries for transient failures.
- OpenAI Agent: Handle API errors gracefully, provide informative messages.

### Component: Backend Layer (FastAPI)

#### Inputs/Outputs:
- **Inputs**: HTTP requests from Frontend, data from Data Layer, responses from Intelligence Layer.
- **Outputs**: HTTP responses to Frontend, requests to Intelligence Layer, data to Data Layer.

#### API Contracts:
- **`POST /auth/signup`**: (Input: `email, password, questionnaire_data`) -> `JWT_token, user_profile`
- **`POST /auth/signin`**: (Input: `email, password`) -> `JWT_token, user_profile`
- **`GET /user/profile`**: (Requires `Authorization: Bearer <JWT_token>`) -> `user_profile`
- **`PUT /user/profile`**: (Input: `profile_updates`, Requires `Authorization`) -> `user_profile`
- **`GET /personalization/{chapter_id}`**: (Input: `chapter_id`, Requires `Authorization`) -> `personalized_content`
- **`POST /chat`**: (Input: `user_query, chat_history_id, user_selected_text (optional)`) -> `chat_response, citations`
- **`POST /translate`**: (Input: `text_to_translate, target_language`) -> `translated_text`

#### Data Models:
```json
// User Signup/Signin Request (partial)
{
  "email": "string",
  "password": "string",
  "questionnaire_data": {"field": "value"} // For signup
}

// Personalized Content Response
{
  "chapter_id": "string",
  "content": "string" // Personalized MDX/HTML
}

// Chat Request
{
  "user_query": "string",
  "chat_history_id": "string",
  "user_selected_text": "string" // Optional
}

// Chat Response
{
  "response": "string",
  "citations": [
    {
      "text": "string",
      "source": "string",
      "url": "string"
    }
  ]
}

// Translation Request
{
  "text_to_translate": "string",
  "target_language": "string"
}
```

#### Integration Points:
- BetterAuth (for user authentication).
- Intelligence Layer (for RAG, personalization, translation logic).
- Data Layer (Neon Postgres, Qdrant, PanaversityFS).
- Docusaurus frontend (for serving API requests).

#### Performance Requirements:
- API endpoint latency: Average < 200ms.
- Database query latency: Average < 50ms.

#### Error Handling:
- Standard HTTP error responses (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error).
- Centralized error logging and monitoring.
- Implement input validation for all API endpoints.

### Component: Data Layer (Neon Postgres, Qdrant, PanaversityFS)

#### Inputs/Outputs:
- **Inputs**: User registration data, chat messages, personalization preferences, book content, embedding vectors.
- **Outputs**: User profiles, chat history, chapter progress, personalized settings, search results (from Qdrant), book assets.

#### API Contracts:
- **Neon Serverless Postgres:** Standard SQL queries via an ORM (e.g., SQLAlchemy, asyncpg).
- **Qdrant:** Qdrant Client SDK methods (e.g., `search`, `upsert`, `retrieve`).
- **PanaversityFS:** File system operations (read, write) for book assets.

#### Data Models:
```sql
-- Users Table (Neon Postgres)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    profile_data JSONB, -- Stores questionnaire results, preferences
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress Table (Neon Postgres)
CREATE TABLE progress (
    user_id UUID REFERENCES users(id),
    chapter_id VARCHAR(255) NOT NULL,
    completion_status VARCHAR(50) NOT NULL DEFAULT 'started',
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, chapter_id)
);

-- Chat_history Table (Neon Postgres)
CREATE TABLE chat_history (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255) NOT NULL,
    message_content TEXT NOT NULL,
    is_user BOOLEAN NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personalization_preferences Table (Neon Postgres) - May be merged with users.profile_data
-- CREATE TABLE personalization_preferences (
--     user_id UUID PRIMARY KEY REFERENCES users(id),
--     setting_key VARCHAR(255) NOT NULL,
--     setting_value JSONB
-- );

-- Qdrant Collections (conceptual)
-- Collection: 'textbook_chapters'
--   Payload: {chapter_id, section_id, text_content, metadata: {title, author, tags, page_range}}
--   Vectors: embeddings of text_content
```

#### Integration Points:
- FastAPI Backend (for all data access).
- Claude Code subagents (for content indexing into Qdrant).

#### Performance Requirements:
- Database queries: < 50ms for typical read/write operations.
- Qdrant vector search: < 100ms for relevant retrieval.
- File system operations (PanaversityFS): Fast access for book assets.

#### Error Handling:
- Database transaction management.
- Qdrant connection resilience and error logging.
- File system access error reporting.

### Component: Auth & Security

#### Inputs/Outputs:
- **Inputs**: User credentials (email, password), JWT tokens, role assignments.
- **Outputs**: Authenticated user sessions, authorized access to resources.

#### API Contracts:
- See FastAPI Backend API contracts for `/auth/signup` and `/auth/signin`.

#### Data Models:
- User model (from Neon Postgres) including hashed password.
- JWT token structure (header, payload, signature).

#### Integration Points:
- BetterAuth SDK/service for core authentication logic.
- FastAPI middleware for JWT validation and RBAC enforcement.
- Frontend (for managing tokens and user sessions).

#### Performance Requirements:
- Authentication (signup/signin): < 500ms.
- Authorization checks: Negligible overhead (tens of milliseconds).

#### Error Handling:
- Secure error responses (avoid leaking sensitive information).
- Robust password hashing and secure token management.
- Handle invalid/expired JWTs gracefully, prompting re-authentication.
- Implement rate limiting for authentication attempts.

## 6. Non-Functional Requirements

### Performance:
- **Response Time - Chatbot**: Chatbot responses MUST be delivered to the user within 3 seconds for 90% of requests.
- **Response Time - Personalization**: Personalized content generation and delivery MUST occur within 5 seconds for 90% of requests.
- **Scalability**: The system MUST support 100 concurrent active users without experiencing noticeable degradation in response times or service availability.

### Security:
- **Data in Transit**: All communication between frontend, backend, and external services MUST utilize HTTPS/SSL/TLS for encryption.
- **Data at Rest**: Sensitive user data (e.g., PII, profile data) stored in Neon Postgres and Qdrant MUST be encrypted at rest.
- **Authentication Tokens**: JWT tokens MUST be securely generated, stored, and validated.
- **Access Control**: Role-Based Access Control (RBAC) MUST be implemented to restrict access to sensitive backend functionalities and data based on user roles.

### Accessibility:
- **WCAG Compliance**: The frontend user interface MUST conform to WCAG 2.1 AA standards.
- **Dark-First Theme**: The custom dark-first theme MUST ensure sufficient contrast ratios and readability for all text and UI elements.

### Privacy:
- **Consent Management**: Explicit user consent MUST be obtained before sending any Personally Identifiable Information (PII) to third-party services (e.g., OpenAI, embedding providers).
- **Data Retention**: Clearly defined data retention policies MUST be established and adhered to, aligning with privacy principles.
- **GDPR/Compliance**: The system design and data handling processes MUST consider and align with relevant data protection regulations (e.g., GDPR, CCPA).
- **Anonymization**: Data used for analytics or general system improvements MUST be anonymized or aggregated to prevent re-identification of individual users.

## 7. Assumptions
- BetterAuth provides a reliable and secure multi-tenant SSO solution that can be integrated with FastAPI.
- OpenAI Agents SDK can be effectively integrated with the FastAPI backend for the main chatbot agent.
- Qdrant and Neon Serverless Postgres offer sufficient performance and scalability for the project's needs within the hackathon scope.
- PanaversityFS will provide a robust file storage solution for book assets.
- Sufficient computational resources will be available for running embedding models and AI agents.

## 8. Dependencies
- **Frontend**: Docusaurus, React, Tailwind CSS, BetterAuth SDK (or client library).
- **Backend**: FastAPI, Python, BetterAuth backend service, OpenAI Agents SDK, Qdrant client, Neon Postgres client/ORM.
- **Data**: Neon Serverless Postgres instance, Qdrant instance, PanaversityFS storage.
- **AI Models**: OpenAI (for chatbot agent), potentially other models for embeddings/personalization/translation.
- **Claude Code**: For subagent automation and development workflow.


