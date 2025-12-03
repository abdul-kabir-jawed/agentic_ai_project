# Hackathon Project Tasks: Physical AI Textbook

This document outlines the granular, checkbox-style tasks for the Physical AI textbook hackathon project, organized by development phase and categories.

**Project Constraints:**
- **Timeline**: 72 hours
- **Team Size**: Solo
- **Scoring Goal**: Must achieve 250/100 scoring (all base + bonus features)

---

## Phase 1: Foundation

### Setup & Infrastructure
- [X] **Initialize monorepo with pnpm workspaces** 🔴
  - Description: Set up the project as a monorepo using pnpm workspaces for `backend` and `book` (Docusaurus).
  - Acceptance criteria: `pnpm-workspace.yaml` exists, `backend/` and `book/` directories are recognized as workspaces.
  - Dependencies: None
  - Commands/code snippets:
    ```bash
    mkdir physical-ai-textbook
    cd physical-ai-textbook
    pnpm init
    # Add workspace configurations to pnpm-workspace.yaml
    mkdir backend book
    # Initialize git and CI/CD (e.g., GitHub Actions boilerplate)
    ```
- [X] **Set up Docusaurus project with TypeScript** 🔴
  - Description: Install Docusaurus in the `book/` directory with TypeScript template.
  - Acceptance criteria: Docusaurus project is created, `book/` contains Docusaurus files, `npm start` runs successfully.
  - Dependencies: Initialize monorepo.
  - Commands/code snippets:
    ```bash
    cd book
    npx create-docusaurus@latest . classic --typescript
    # Follow Docusaurus setup instructions
    ```
- [X] **Configure dark-first custom theme** 🟡
  - Description: Adjust Docusaurus configuration and CSS to ensure a dark-first theme is applied.
  - Acceptance criteria: Docusaurus site loads with a dark theme by default.
  - Dependencies: Docusaurus project setup.
  - Commands/code snippets: Edit `book/docusaurus.config.ts`, `book/src/css/custom.css`.
- [X] **Set up Neon Serverless Postgres database** 🔴
  - Description: Create a new Neon Serverless Postgres instance and obtain connection string.
  - Acceptance criteria: Database instance is provisioned and connection string is available.
  - Dependencies: None
- [X] **Create database schema (users, progress, chat_history, etc.)** 🔴
  - Description: Define and apply SQL schema for `users`, `progress`, `chat_history` tables.
  - Acceptance criteria: Tables are created in Neon Postgres as per `spec.md` data models.
  - Dependencies: Neon Serverless Postgres setup.
  - Commands/code snippets: SQL DDL statements (e.g., via `psql` or a migration tool) in `backend/src/db/schema.sql`.
- [X] **Configure BetterAuth with email/password provider** 🔴
  - Description: Set up BetterAuth as an identity provider with email/password authentication.
  - Acceptance criteria: BetterAuth instance configured, client ID/secret obtained.
  - Dependencies: None
- [X] **Set up PanaversityFS folder structure** 🟡
  - Description: Create local directory for PanaversityFS (book assets, uploads).
  - Acceptance criteria: `physical-ai-textbook/panaversity-fs/` directory exists.
  - Dependencies: Initialize monorepo.
- [X] **Configure Qdrant Cloud collection** 🔴
  - Description: Provision a Qdrant Cloud instance and create initial collection for textbook embeddings.
  - Acceptance criteria: Qdrant instance accessible, collection created.
  - Dependencies: None
- [X] **Set up environment variables template** 🔴
  - Description: Create a `.env.template` file with all necessary environment variables for backend and frontend.
  - Acceptance criteria: `.env.template` lists all required environment variables (DB_URL, QDRANT_API_KEY, BETTERAUTH_CLIENT_ID, etc.).
  - Dependencies: All infrastructure setups.

### Milestone 1: "Hello World" deployed (End of Phase 1)

---

## Phase 2: Content & Intelligence

### Content Creation
- [X] **Write Chapter 1: Introduction to Physical AI** 🟡
  - Description: Create content for the first textbook chapter.
  - Acceptance criteria: `book/docs/chapter1.md` exists with substantial content.
  - Dependencies: Docusaurus project setup.
- [X] **Write Chapter 2: Humanoid Robotics Fundamentals** 🟡
  - Description: Create content for the second textbook chapter.
  - Acceptance criteria: `book/docs/chapter2.md` exists with substantial content.
  - Dependencies: Docusaurus project setup.
- [X] **Write Chapter 3: Humanoid Robotics Overview** 🟡
  - Description: Create content for the third textbook chapter.
  - Acceptance criteria: `book/docs/chapter3.md` exists with substantial content.
  - Dependencies: Docusaurus project setup.
- [X] **Write Chapter 4: Perception** 🟡
  - Description: Embed relevant Python/robotics code snippets into Chapter 1-3.
  - Acceptance criteria: Code blocks are present and correctly rendered in chapters.
  - Dependencies: Chapters 1-3 content created.
- [X] **Write Chapter 4: Perception** 🟡
  - Description: Generate 1-2 diagrams (e.g., Mermaid diagrams, simple PNGs) for key concepts in chapters.
  - Acceptance criteria: Images/diagrams are embedded and displayed correctly.
  - Dependencies: Chapters 1-3 content created.
- [X] **Implement content chunking script** 🔴
  - Description: Develop a Python script to read MDX/Markdown chapters, split into logical chunks, and extract metadata.
  - Acceptance criteria: Script successfully processes a chapter and outputs chunks.
  - Dependencies: Backend FastAPI project structure (for Python environment).
  - Commands/code snippets: Python script in `backend/src/services/content_processor.py`.

### RAG System
- [X] **Implement embedding generation (OpenAI text-embedding-3-small)** 🔴
  - Description: Write Python function to generate embeddings for text chunks using OpenAI API.
  - Acceptance criteria: Function takes text, returns embedding vector.
  - Dependencies: Content chunking script, OpenAI API key.
  - Commands/code snippets: Python function in `backend/src/services/embedding_generator.py`.
- [X] **Create Qdrant indexing pipeline** 🔴
  - Description: Integrate embedding generation with Qdrant client to upload chunks and their embeddings.
  - Acceptance criteria: Script processes chapters, generates embeddings, and uploads to Qdrant collection.
  - Dependencies: Content chunking script, embedding generation, Qdrant Cloud collection setup.
  - Commands/code snippets: Python script in `backend/src/services/qdrant_indexer.py`.
- [X] **Build RAG retrieval logic in FastAPI** 🔴
  - Description: Implement FastAPI endpoint (`/api/rag/retrieve`) to query Qdrant with a user prompt and return relevant text chunks.
  - Acceptance criteria: API endpoint receives query, interacts with Qdrant, returns structured results.
  - Dependencies: Qdrant indexing pipeline, FastAPI project structure.
  - Commands/code snippets: Python code in `backend/src/api/rag.py`.
- [X] **Implement context window management** 🟡
  - Description: Develop logic to manage the size of RAG context passed to the OpenAI agent, including summarization or truncation if necessary.
  - Acceptance criteria: RAG context size is controlled, no errors for long contexts.
  - Dependencies: RAG retrieval logic.
- [X] **Add source citation to responses** 🟡
  - Description: Ensure RAG responses include clear citations back to the source chapter/section.
  - Acceptance criteria: Chatbot responses show `[Source: Chapter X, Page Y]` or similar.
  - Dependencies: RAG retrieval logic.
- [X] **Implement user text selection API** 🟡
  - Description: Create a FastAPI endpoint (`/api/user/selected-text`) to receive user-selected text from the frontend and store it temporarily or pass it directly to the RAG context.
  - Acceptance criteria: API endpoint receives and processes selected text.
  - Dependencies: Backend FastAPI project structure.
- [X] **Create integration endpoints for your OpenAI agent to call** 🔴
  - Description: Define and implement FastAPI endpoints that the OpenAI Agent can call for RAG retrieval, chat history, user context, personalization, and translation.
  - Acceptance criteria: Dedicated endpoints exist (e.g., `/agent/rag`, `/agent/history`) callable by the OpenAI agent.
  - Dependencies: FastAPI project structure, RAG retrieval logic, chat history storage, user profile endpoints.

### Backend API
- [X] **Set up FastAPI project structure** 🔴
  - Description: Initialize a FastAPI application in the `backend/` directory.
  - Acceptance criteria: Basic FastAPI app runs, `main.py` exists, virtual environment set up.
  - Dependencies: Initialize monorepo.
  - Commands/code snippets:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate # or venv\Scripts\activate for Windows
    pip install fastapi uvicorn
    # Create main.py with a basic endpoint
    ```
- [X] **Create /api/chat endpoint (for your OpenAI agent to use)** 🔴
  - Description: Implement the primary chat endpoint that orchestrates the OpenAI agent, RAG, and chat history.
  - Acceptance criteria: `/api/chat` receives user query, sends to OpenAI agent, returns response.
  - Dependencies: FastAPI project setup, OpenAI Agent SDK integration (later).
  - Commands/code snippets: `backend/src/api/chat.py`.
- [X] **Create /api/personalize endpoint** 🟡
  - Description: Implement API endpoint to trigger content personalization based on user profile.
  - Acceptance criteria: `/api/personalize` receives text and user ID, returns personalized text.
  - Dependencies: FastAPI project setup.
- [X] **Create /api/translate endpoint** 🟡
  - Description: Implement API endpoint for on-demand text translation.
  - Acceptance criteria: `/api/translate` receives text and target language, returns translated text.
  - Dependencies: FastAPI project setup.
- [X] **Create /api/user/profile endpoints** 🔴
  - Description: Implement GET and PUT endpoints for user profile management.
  - Acceptance criteria: Users can retrieve and update their profile data.
  - Dependencies: FastAPI project setup, database schema.
- [X] **Implement chat history storage** 🔴
  - Description: Develop functions to store and retrieve chat messages from the `chat_history` table.
  - Acceptance criteria: Chat messages can be saved and loaded by `user_id` and `session_id`.
  - Dependencies: Database schema, FastAPI project setup.
- [X] **Add request validation and error handling** 🟡
  - Description: Implement Pydantic models for API request/response validation and comprehensive error handling.
  - Acceptance criteria: API endpoints return structured errors for invalid input; robust error logging.
  - Dependencies: All API endpoints.
- [X] **Integrate your OpenAI Agents SDK code with FastAPI** 🔴
  - Description: Connect your separately developed OpenAI Agent SDK code into the FastAPI backend.
  - Acceptance criteria: FastAPI can instantiate and interact with your OpenAI agent.
  - Dependencies: All required FastAPI integration endpoints.

### Milestone 2: RAG chatbot working locally (End of Phase 2)

---

## Phase 3: Core Features

### Frontend Components
- [X] **Create ChatbotPanel React component** 🔴
  - Description: Develop the main UI component for the chatbot interface within Docusaurus.
  - Acceptance criteria: Chatbot UI renders, input field and message display area functional.
  - Dependencies: Docusaurus project setup.
- [X] **Create PersonalizationToggle component** 🟡
  - Description: Develop a React component for toggling per-chapter personalization.
  - Acceptance criteria: Toggle renders and changes state.
  - Dependencies: Docusaurus project setup.
- [X] **Create UrduTranslationToggle component** 🟡
  - Description: Develop a React component for toggling Urdu translation.
  - Acceptance criteria: Toggle renders and changes state.
  - Dependencies: Docusaurus project setup.
- [X] **Create UserProfileForm component** 🔴
  - Description: Develop React component for users to view/edit their profile data and complete the background questionnaire.
  - Acceptance criteria: Form renders, allows input, and can submit data.
  - Dependencies: Docusaurus project setup.
- [X] **Create BackgroundQuestionnaire component** 🔴
  - Description: Develop a React component specifically for the background questionnaire during signup/profile update.
  - Acceptance criteria: Questionnaire renders with questions and submission logic.
  - Dependencies: UserProfileForm component.
- [X] **Integrate components into Docusaurus pages** 🔴
  - Description: Embed the ChatbotPanel, personalization/translation toggles, and profile forms into relevant Docusaurus pages (e.g., chapter pages, settings page).
  - Acceptance criteria: All components appear and function within the Docusaurus context.
  - Dependencies: All component creation tasks.
- [X] **Add text selection overlay** 🟡
  - Description: Implement frontend logic to detect user text selection and provide an option to "send to chatbot" or "use as context."
  - Acceptance criteria: User can select text, an overlay/button appears, and selected text can be captured.
  - Dependencies: Docusaurus project setup.

### Authentication
- [X] **Implement signup page with questionnaire** 🔴
  - Description: Create a Docusaurus page for user registration, including the background questionnaire.
  - Acceptance criteria: User can navigate to signup, complete form, and successfully register.
  - Dependencies: UserProfileForm, BackgroundQuestionnaire components, Backend `/auth/signup` endpoint.
- [X] **Implement signin page** 🔴
  - Description: Create a Docusaurus page for user login.
  - Acceptance criteria: User can navigate to signin, enter credentials, and successfully log in.
  - Dependencies: Backend `/auth/signin` endpoint.
- [X] **Add JWT token management** 🔴
  - Description: Implement client-side storage and management of JWT tokens received from BetterAuth.
  - Acceptance criteria: Tokens are stored securely (e.g., local storage/cookies), sent with authenticated requests.
  - Dependencies: Signup/signin pages.
- [X] **Protect authenticated routes** 🔴
  - Description: Implement frontend route guards and backend middleware to protect authenticated content/APIs.
  - Acceptance criteria: Unauthenticated users cannot access protected content/features.
  - Dependencies: JWT token management.
- [X] **Add user profile settings page** 🟡
  - Description: Create a Docusaurus page for users to manage their profile and personalization preferences.
  - Acceptance criteria: Authenticated users can access, view, and update their profile.
  - Dependencies: UserProfileForm component, Backend `/api/user/profile` endpoints.

### Personalization
- [X] **Define user background taxonomy** 🟡
  - Description: Formalize the categories and values for user background factors (e.g., beginner/intermediate/advanced for experience, hardware/software for focus).
  - Acceptance criteria: A clear, documented taxonomy exists.
  - Dependencies: None
- [X] **Implement personalization prompt templates** 🟡
  - Description: Create dynamic prompt templates that incorporate user background factors to guide personalization.
  - Acceptance criteria: Templates generate varied prompts based on profile data.
  - Dependencies: Define user background taxonomy, Backend `/api/personalize` endpoint.
- [X] **Create personalization cache layer** 🟢
  - Description: Implement a caching mechanism (e.g., Redis, in-memory) for personalized content to improve performance.
  - Acceptance criteria: Personalized content is served faster after initial generation.
  - Dependencies: Backend `/api/personalize` endpoint.
- [X] **Add per-chapter personalization UI** 🟡
  - Description: Ensure the PersonalizationToggle is integrated correctly and influences content display dynamically.
  - Acceptance criteria: Toggling personalization re-renders chapter content appropriately.
  - Dependencies: PersonalizationToggle component, Backend `/api/personalize` endpoint.

### Translation
- [X] **Set up translation API (OpenAI GPT-4 or dedicated translation model)** 🟡
  - Description: Integrate a translation service (e.g., OpenAI GPT-4 API) into the backend.
  - Acceptance criteria: Backend can send text to translation service and receive translated output.
  - Dependencies: Backend FastAPI project.
- [X] **Implement chapter translation caching** 🟢
  - Description: Cache translated chapter content to avoid repeated API calls.
  - Acceptance criteria: Subsequent requests for the same translated chapter are served from cache.
  - Dependencies: Translation API setup.
- [X] **Handle RTL text rendering for Urdu** 🟡
  - Description: Implement CSS and potentially Docusaurus plugins to ensure correct right-to-left rendering for Urdu text.
  - Acceptance criteria: Urdu text displays correctly with RTL layout.
  - Dependencies: UrduTranslationToggle component.
- [X] **Add language toggle to chapter headers** 🟡
  - Description: Integrate the UrduTranslationToggle component into Docusaurus chapter pages.
  - Acceptance criteria: Users can toggle language from chapter pages.
  - Dependencies: UrduTranslationToggle component.

### Milestone 3: All base features deployed (End of Phase 3)

---

## Phase 4: Bonus Features

### Claude Code Subagents
- [X] **Define content indexer subagent (automates embedding new chapters)** 🟡
  - Description: Create a Claude Code subagent that monitors `panaversity-fs` for new/updated chapters, chunks them, generates embeddings, and indexes into Qdrant.
  - Acceptance criteria: New chapters are automatically indexed when added to the filesystem.
  - Dependencies: Content chunking script, embedding generation, Qdrant indexing pipeline.
- [X] **Define personalization subagent (rewrites content for user profile)** 🟡
  - Description: Create a Claude Code subagent that leverages LLMs to rewrite textbook content based on a given user profile and prompt templates.
  - Acceptance criteria: Subagent takes original text and user profile, returns rewritten text.
  - Dependencies: Personalization prompt templates.
- [X] **Define translation subagent (translates chapters to Urdu)** 🟡
  - Description: Create a Claude Code subagent that takes original chapter text and translates it to Urdu.
  - Acceptance criteria: Subagent takes text, returns Urdu translation.
  - Dependencies: Translation API setup.
- [X] **Define QA automation subagent (tests RAG accuracy)** 🟡
  - Description: Create a Claude Code subagent that queries the RAG system with test questions and evaluates the relevance and citation accuracy of responses.
  - Acceptance criteria: Subagent runs tests and provides a report on RAG quality.
  - Dependencies: RAG retrieval logic.
- [X] **Create subagent registry** 🟢
  - Description: Implement a simple mechanism (e.g., Python dictionary or configuration file) to register and manage Claude Code subagents.
  - Acceptance criteria: Subagents can be easily added/removed from the registry.
  - Dependencies: All subagent definitions.
- [X] **Document subagent usage in README** 🟢
  - Description: Add a section to the main README detailing how to use and extend the Claude Code subagents.
  - Acceptance criteria: README includes subagent documentation.
  - Dependencies: All subagent definitions.

### Milestone 4: Bonus features implemented (End of Phase 4)

---

## Phase 5: Polish & Demo

### Deployment
- [X] **Configure GitHub Actions for Docusaurus build** 🟡
  - Description: Set up CI/CD pipeline in GitHub Actions to build and deploy the Docusaurus frontend.
  - Acceptance criteria: GitHub Actions workflow successfully builds Docusaurus.
  - Dependencies: Docusaurus project.
- [X] **Deploy Docusaurus to GitHub Pages** 🟡
  - Description: Configure GitHub Actions to deploy the Docusaurus site to GitHub Pages.
  - Acceptance criteria: Docusaurus site is accessible via GitHub Pages URL.
  - Dependencies: GitHub Actions for Docusaurus build.
- [X] **Deploy FastAPI to serverless platform** 🟡
  - Description: Deploy the FastAPI backend to a serverless platform (e.g., Vercel, Render, AWS Lambda).
  - Acceptance criteria: Backend API endpoints are publicly accessible.
  - Dependencies: FastAPI project.
- [X] **Configure CORS for cross-origin requests** 🔴
  - Description: Set up CORS middleware in FastAPI to allow frontend access.
  - Acceptance criteria: Frontend can make API requests to the backend without CORS errors.
  - Dependencies: FastAPI deployment.
- [X] **Set up production environment variables** 🔴
  - Description: Configure environment variables for the deployed production environment (e.g., secure API keys).
  - Acceptance criteria: Production deployment uses correct, secure environment variables.
  - Dependencies: Frontend and Backend deployments.
- [X] **Test production deployment** 🟢
  - Description: Perform end-to-end testing on the live production environment.
  - Acceptance criteria: All features (auth, chat, personalization, translation) function correctly in production.
  - Dependencies: All deployment tasks.

### Documentation & Demo
- [X] **Write README with setup instructions** 🟢
  - Description: Create a comprehensive README, including project overview, setup, and run instructions.
  - Acceptance criteria: README is clear, complete, and enables easy project setup.
  - Dependencies: All project features implemented.
- [X] **Document API endpoints** 🟢
  - Description: Generate or manually document all FastAPI API endpoints with examples.
  - Acceptance criteria: API documentation is accurate and easy to understand.
  - Dependencies: All Backend API endpoints.
- [X] **Create architecture diagram** 🟢
  - Description: Design a high-level architecture diagram (e.g., using Mermaid) for the project.
  - Acceptance criteria: Diagram clearly illustrates system components and interactions.
  - Dependencies: Project structure.
- [ ] **Record demo video (3-5 minutes)** 🟡
  - Description: Create a compelling demo video showcasing all core and bonus features.
  - Acceptance criteria: Video highlights key functionalities, is engaging, and meets time limits.
  - Dependencies: All features working, script prepared.
- [ ] **Take screenshots of key features** 🟢
  - Description: Capture screenshots of critical UI elements and features for the README and submission.
  - Acceptance criteria: High-quality screenshots are available.
  - Dependencies: All frontend features.
- [X] **Write hackathon submission description** 🟢
  - Description: Draft the final submission description, emphasizing achievements and adherence to scoring criteria.
  - Acceptance criteria: Description is persuasive, highlights all features, and addresses scoring.
  - Dependencies: All features implemented.

### Milestone 5: Submission ready (End of Phase 5)

---

## Overall Dependencies & Critical Path:

**Critical Path (Key dependencies that block significant progress):**
1.  **Phase 1 Completion**: Foundation must be solid before any other work begins.
2.  **FastAPI Project Setup & Core API Endpoints**: Backend structure and basic endpoints (`/api/chat`, `/api/user/profile`) are essential.
3.  **Content Chunking, Embedding & Qdrant Indexing**: The RAG intelligence layer is built upon this.
4.  **RAG Retrieval Logic & OpenAI Agent Integration**: Core AI functionality.
5.  **Chat History Persistence & Frontend Chatbot UI**: Enables interactive chat.
6.  **Authentication & Protected Routes**: Necessary for secure, personalized experience.
7.  **Personalization & Translation Core Logic**: Enables key features.

**Parallel Workstreams:**
- Frontend component development can proceed once backend API contracts are clear.
- Initial textbook content creation can be done early and refined as RAG integration progresses.
- Claude Code subagent development can start once the core backend and RAG functionalities are stable.
- Dedicated OpenAI agent logic can be developed somewhat independently once its interaction points with FastAPI are defined.
