# Implementation Plan: Physical AI Textbook Project

**Branch**: `1-ai-textbook-spec` | **Date**: 2025-11-28 | **Spec**: `specs/1-ai-textbook-spec/spec.md`
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plus.plan` command. See `.speckit-plus/templates/commands/plan.md` for the execution workflow.

## Summary

This project aims to create an AI-native educational platform featuring an interactive Docusaurus textbook, a RAG chatbot, user authentication with personalization, and on-demand Urdu translation. The system is composed of Frontend, Intelligence, Backend, Data, and Auth & Security layers, designed for scalability and a rich user experience.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Python (3.11+ for FastAPI, OpenAI Agents, Claude Code subagents), TypeScript/JavaScript (for Docusaurus, React)
**Primary Dependencies**: FastAPI, Docusaurus, React, Qdrant, Neon Serverless Postgres, BetterAuth SDK, OpenAI Agents SDK
**Storage**: Neon Serverless Postgres, Qdrant, PanaversityFS
**Testing**: Unit, Integration, End-to-End Testing (e.g., Pytest for Python, Jest/React Testing Library for Frontend)
**Target Platform**: Web (Browser-based frontend, cloud-hosted backend)
**Project Type**: Web application (Frontend + Backend)
**Performance Goals**: Chatbot < 3s, Personalization < 5s, API < 200ms, DB < 50ms, Qdrant < 100ms
**Constraints**: WCAG 2.1 AA, HTTPS, Encrypted Data at Rest, RBAC, Secure JWT management
**Scale/Scope**: Support 100 concurrent active users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This plan adheres to the following core values from the project constitution:
- **AI-First Learning**: Emphasized through the RAG system, OpenAI Agents, and Claude Code subagents for personalization and translation.
- **Privacy & Trust**: Addressed by BetterAuth integration, explicit user consent for data processing, and encrypted storage.
- **Accessibility**: Ensured by the Docusaurus setup with custom dark-first theme, responsive design, and on-demand Urdu translation.
- **Source Integrity**: Maintained by the RAG chatbot's strict adherence to textbook content and user-selected text, with clear citation mechanisms.
- **Developer Experience**: Supported through spec-driven development, FastAPI microservices, and the use of reusable Claude Code subagents.
- **Production Quality**: Achieved via robust authentication, a scalable FastAPI backend, efficient data management with Neon Postgres and Qdrant, and comprehensive documentation.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plus.plan command output)
├── research.md          # Phase 0 output (/speckit-plus.plan command)
├── data-model.md        # Phase 1 output (/speckit-plus.plan command)
├── quickstart.md        # Phase 1 output (/speckit-plus.plan command)
├── contracts/           # Phase 1 output (/speckit-plus.plan command)
└── tasks.md             # Phase 2 output (/speckit-plus.tasks command - NOT created by /speckit-plus.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/        # RESTful API endpoints (chat, personalization, translation, user management)
│   ├── services/   # Business logic, vector search orchestration, chat history management
│   ├── models/     # Data models for API, database (Neon Postgres, Qdrant)
│   └── agents/     # OpenAI Agents SDK implementation, RAG orchestration, Claude Code subagent integration
└── tests/          # Backend unit and integration tests

book/ (Docusaurus Frontend application)
├── src/
│   ├── components/ # Custom React components for chatbot interface, user profile/settings, personalization controls, translation toggle
│   ├── pages/      # Docusaurus pages (e.g., homepage, markdown pages)
│   ├── css/        # Custom dark-first theme styles
│   └── assets/     # Frontend static assets
├── docs/           # Textbook chapters (MDX, Markdown)
└── docusaurus.config.ts # Docusaurus configuration
```

**Structure Decision**: The project will follow a monorepo-like structure with a `backend/` directory for FastAPI services and AI agents, and a `book/` directory for the Docusaurus frontend application. This aligns with the "Web application" model, separating concerns while co-locating project assets.


## Project Constraints & Goals
- **Timeline**: 72 hours
- **Team Size**: Solo
- **Scoring Goal**: Must achieve 250/100 scoring (all base + bonus features)

## Development Phases

### Phase 1: Foundation (Target: 20% of timeline, ~14.4 hours)
- **Concrete Tasks**:
    1.  **Repository Setup**: Initialize monorepo, configure CI/CD (e.g., GitHub Actions for linting/testing).
    2.  **Docusaurus Base Installation**: Set up Docusaurus, apply custom dark-first theme.
    3.  **Database Schema Design & Neon Setup**: Define initial Postgres schema (Users, Progress, Chat_history tables), connect to Neon Serverless Postgres.
    4.  **BetterAuth Integration**: Implement basic signup/signin API endpoints and frontend integration.
    5.  **PanaversityFS Setup**: Integrate file storage for book assets.
    6.  **Initial Project Structure**: Finalize `backend/` and `book/` directory structures.
- **Dependencies**: None
- **Time Estimates**: 2-3 hours per task.
- **Assigned Roles**: Solo Developer
- **Success Criteria**:
    - Repository is functional with CI/CD.
    - Docusaurus site is live with dark theme.
    - Database is accessible; basic user data can be stored.
    - Users can register and log in.
    - Basic file storage is functional.
    - Codebase adheres to defined structure.
- **Risk Mitigation**: Prioritize core components; use pre-built templates/libraries where possible.

### Phase 2: Content & Intelligence (Target: 30% of timeline, ~21.6 hours)
- **Concrete Tasks**:
    1.  **Write/Import Textbook Content**: Populate 5-10 Physical AI textbook chapters in MDX/Markdown.
    2.  **Content Chunking & Embedding Pipeline**: Develop script/service to chunk chapters and generate embeddings.
    3.  **Qdrant Collection Setup & Indexing**: Create Qdrant collection, index all textbook content embeddings.
    4.  **Basic RAG Retrieval**: Implement API endpoint to query Qdrant and retrieve relevant text snippets.
    5.  **OpenAI Agents SDK Chatbot Development**: Implement the core chatbot logic using OpenAI Agents SDK (separate implementation).
    6.  **Integration Layer**: Create FastAPI endpoints to connect chatbot agent with RAG pipeline, chat history, and user context.
    7.  **Text Selection Mechanism**: Implement frontend UI for users to select text passages as RAG context.
- **Dependencies**: Phase 1 completed.
- **Time Estimates**: 3-5 hours per task.
- **Assigned Roles**: Solo Developer
- **Success Criteria**:
    - Textbook content is available in Docusaurus.
    - Content is successfully chunked and indexed in Qdrant.
    - RAG system can retrieve relevant snippets.
    - OpenAI chatbot can respond (initially without full RAG/history).
    - Chatbot can access RAG context via FastAPI.
    - User can highlight text in the UI.
- **Risk Mitigation**: Start with simple chunking/embedding; incrementally build chatbot features; use mocks for complex integrations if needed.

### Phase 3: Core Features (Target: 25% of timeline, ~18 hours)
- **Concrete Tasks**:
    1.  **Embedded Chatbot UI**: Integrate chatbot interface into Docusaurus.
    2.  **Chat History Persistence**: Implement saving and loading chat history from Neon Postgres via FastAPI.
    3.  **User Profile/Background Questionnaire**: Develop UI for user profile and questionnaire, link to `users.profile_data`.
    4.  **Per-Chapter Personalization Toggle**: Implement UI toggle and backend logic to fetch personalized content based on profile data.
    5.  **Urdu Translation Toggle (Basic)**: Implement UI toggle and backend API call for basic Urdu translation.
- **Dependencies**: Phase 2 completed.
- **Time Estimates**: 3-4 hours per task.
- **Assigned Roles**: Solo Developer
- **Success Criteria**:
    - Chatbot is interactive within Docusaurus.
    - Chat conversations are saved and loaded.
    - User profiles can be updated.
    - Content personalization works for at least one chapter.
    - Basic Urdu translation is functional for text.
- **Risk Mitigation**: Focus on minimal viable implementation for each feature; iterate on UI/UX in polish phase.

### Phase 4: Bonus Features (Target: 15% of timeline, ~10.8 hours)
- **Concrete Tasks**:
    1.  **Claude Code Content Indexer Subagent**: Develop a subagent to automatically chunk and embed new/updated chapters into Qdrant.
    2.  **Claude Code Personalization Engine Subagent**: Develop a subagent to rewrite content based on user profiles.
    3.  **Claude Code Translation Subagent**: Develop a subagent to handle on-demand Urdu translation (can integrate with a translation API).
    4.  **Claude Code QA Automation Subagent**: Develop a subagent to test RAG quality (e.g., query RAG, check citation accuracy).
    5.  **Reusable Skill Definitions**: Define skills for common development tasks.
- **Dependencies**: Phase 3 completed, familiarity with Claude Code SDK.
- **Time Estimates**: 2-3 hours per subagent.
- **Assigned Roles**: Solo Developer
- **Success Criteria**:
    - All specified Claude Code subagents are functional.
    - Subagents can be invoked and perform their tasks.
    - RAG quality tests can be automated.
- **Risk Mitigation**: Leverage existing Claude Code examples; prioritize functionality over advanced features if time is short.

### Phase 5: Polish & Demo (Target: 10% of timeline, ~7.2 hours)
- **Concrete Tasks**:
    1.  **UI/UX Refinement**: Improve Docusaurus theme, chatbot interface, and overall user experience.
    2.  **Performance Optimization**: Review and optimize API calls, database queries, and frontend rendering.
    3.  **Demo Video Recording**: Prepare and record a compelling demo video showcasing all features.
    4.  **README and Documentation**: Update project README, add setup/run instructions, document key decisions.
    5.  **Deployment and Testing**: Final deployment, comprehensive end-to-end testing.
- **Dependencies**: All previous phases completed.
- **Time Estimates**: Allocate remaining time strategically across tasks.
- **Assigned Roles**: Solo Developer
- **Success Criteria**:
    - Polished UI/UX.
    - System meets performance requirements.
    - High-quality demo video and documentation.
    - Project is fully deployed and stable.
    - Achieves 250/100 scoring.
- **Risk Mitigation**: Allocate dedicated time for polish; practice demo; thorough final testing.

## Milestones
- **Milestone 1**: "Hello World" deployed (End of Phase 1)
- **Milestone 2**: RAG chatbot working locally (End of Phase 2)
- **Milestone 3**: All base features deployed (End of Phase 3)
- **Milestone 4**: Bonus features implemented (End of Phase 4)
- **Milestone 5**: Submission ready (End of Phase 5)

## Parallel Workstreams
- **Frontend Development (Docusaurus UI, Components)**: Can run somewhat in parallel with Backend API development once contracts are defined.
- **Content Creation**: Can run in parallel with early phases, generating chapters while infrastructure is built.
- **Claude Code Subagent Development**: Can begin once basic FastAPI/RAG interfaces are stable, but heavily depends on these.
- **OpenAI Agent Core Logic**: Can be developed relatively independently once API contracts with FastAPI are clear.

## Critical Path
1.  **Phase 1 (Foundation)**: All tasks are critical for subsequent phases.
2.  **Phase 2 (Content & Intelligence) - RAG Retrieval & Chatbot Integration**: Essential for core intelligence.
3.  **Phase 3 (Core Features) - Chat History & Personalization**: Directly dependent on Phase 2's output and required for user experience.
4.  **Phase 4 (Bonus Features) - Claude Code Subagents**: While "bonus," these are high-scoring and have dependencies on core functionalities.
5.  **Phase 5 (Polish & Demo)**: Requires all previous phases to be complete.

