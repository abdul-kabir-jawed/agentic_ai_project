# Claude Code Integration Guide: Physical AI & Humanoid Robotics Interactive Textbook

## 1. Project Context and Architecture Overview

**Project Name:** Physical AI & Humanoid Robotics Interactive Textbook
**Mission:** To create an AI-native textbook featuring an embedded RAG chatbot, user authentication, personalization, and internationalization, specifically focusing on Physical AI and Humanoid Robotics.

**High-Level Architecture:**
- **Frontend:** Interactive Docusaurus book (static site generation)
- **Backend:** FastAPI for serverless API
- **Database:** Qdrant (vector database for RAG) and Neon Postgres (relational database for user data, etc.)
- **Authentication:** BetterAuth
- **Core AI:** OpenAI Agents/ChatKit (custom implementation for main conversational AI)
- **Automation/Assistance:** Claude Code subagents
- **Deployment:** GitHub Pages (frontend), serverless API (backend)

**Claude Code's Role:** Claude Code subagents are designed to handle auxiliary tasks such as content indexing, personalization logic, translation services, and quality assurance. They are NOT responsible for the main RAG chatbot functionality, which will be powered by a separate OpenAI agent.

## 2. Development Workflow with Claude Code

Claude Code will be an integral part of the development process, assisting with various aspects of the project.

### Key Interaction Points:
- **Content Management:** Subagents can help index new content into Qdrant or update existing content.
- **Personalization Logic:** Assist in developing and refining the personalization algorithms that adapt chapter content based on user profiles.
- **Translation Services:** Facilitate the on-demand Urdu translation of book content.
- **Code Generation & Review:** Aid in writing and reviewing code for FastAPI endpoints, Docusaurus components, and integration logic.
- **Troubleshooting:** Help diagnose and resolve issues within the project.

## 3. Key Patterns and Conventions

### File Naming:
- Markdown files for book content: `chapter-name.mdx` or `chapter-name.md`
- FastAPI routes: `api_[feature].py`
- Docusaurus components: `[ComponentName].tsx`

### Code Style:
- Adhere to Black for Python and Prettier for TypeScript/JavaScript.
- Follow Docusaurus conventions for content and component structure.

### API Design:
- RESTful principles for FastAPI endpoints.
- Clear separation of concerns between API logic and data access.

## 4. File Structure and Organization

```
physical-ai-textbook/
├── book/                  # Docusaurus frontend
│   ├── docs/              # Textbook chapters
│   ├── src/               # Docusaurus components, pages, CSS
│   └── docusaurus.config.ts
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core logic, services
│   │   └── data/          # Database interactions, models
│   ├── main.py
│   └── requirements.txt
├── agents/                # Claude Code subagents definitions and scripts
│   ├── content_indexer.py
│   ├── personalization_engine.py
│   ├── translation_service.py
│   └── qa_agent.py
├── specs/                 # Project specifications, plans, tasks
│   └── 1-ai-textbook-spec/
│       ├── claude.md      # This guide
│       ├── plan.md        # Implementation plan
│       ├── tasks.md       # Detailed task list
│       └── spec.md        # Feature specification
├── .github/               # GitHub workflows, issue templates, PR templates
├── .gitignore
├── README.md
└── pyproject.toml         # For poetry dependency management (backend)
```

## 5. How to Interact with Claude for this Project

To effectively collaborate with Claude Code:

- **Provide Clear Instructions:** Be specific about the task you want Claude to perform.
- **Reference Files:** When discussing code, provide file paths (e.g., `backend/app/api/chapters.py`).
- **Use Task Tool for Complex Operations:** For multi-step tasks like "index new chapter content," use the `Task` tool with the appropriate subagent.
- **Use TodoWrite:** Proactively use the `TodoWrite` tool to break down complex tasks into smaller, manageable steps and track progress.
- **Ask for Clarification:** If you're unsure about an approach, use `AskUserQuestion` to get clarification before proceeding.

## 6. Subagent Definitions and Their Roles

Claude Code subagents are specialized agents designed to automate specific, repetitive, or complex tasks within the project.

-   **Content Indexer Subagent:**
    -   **Role:** Responsible for processing new or updated textbook content (Markdown files), extracting relevant information, and indexing it into the Qdrant vector database for RAG.
    -   **Triggers:** New chapter added, existing chapter updated.
    -   **Input:** File path to the Markdown content.
    -   **Output:** Confirmation of successful indexing, or error details.

-   **Personalization Engine Subagent:**
    -   **Role:** Develops and refines the logic for adapting textbook content based on individual user profiles (e.g., skill level, learning preferences).
    -   **Triggers:** User profile update, request for personalized content.
    -   **Input:** User profile data, chapter ID.
    -   **Output:** Modified chapter content or personalization rules.

-   **Translation Service Subagent:**
    -   **Role:** Handles on-demand translation of textbook content into Urdu.
    -   **Triggers:** User requests Urdu translation for a chapter.
    -   **Input:** English chapter content, target language (Urdu).
    -   **Output:** Translated chapter content.

-   **QA Agent Subagent:**
    -   **Role:** Assists in quality assurance by checking for content consistency, broken links, formatting issues, or other predefined quality metrics.
    -   **Triggers:** Content review, pre-deployment checks.
    -   **Input:** File path to chapter content, specific QA checks to perform.
    -   **Output:** QA report with findings and suggestions.

## 7. Testing and Deployment Procedures

### Testing:
-   **Unit Tests:** For individual functions and components (backend and frontend).
-   **Integration Tests:** Verify interactions between FastAPI, Qdrant, and BetterAuth.
-   **End-to-End Tests:** Simulate user journeys through the Docusaurus book and RAG chatbot.
-   **Localization Tests:** Ensure Urdu translation functions correctly.

### Deployment:
-   **Frontend (Docusaurus):** Deployed to GitHub Pages.
-   **Backend (FastAPI):** Deployed as serverless functions.
-   **CI/CD:** Automated pipelines for testing, building, and deployment upon code changes.

## 8. Troubleshooting Common Issues

-   **RAG Chatbot Inaccuracy:**
    -   **Cause:** Insufficient or poorly indexed content in Qdrant.
    -   **Solution:** Use the Content Indexer subagent to re-index content, review content quality.
-   **Authentication Failures:**
    -   **Cause:** Misconfiguration of BetterAuth or incorrect integration with FastAPI.
    -   **Solution:** Check BetterAuth logs, verify API endpoint security, review user registration/login flows.
-   **Translation Issues:**
    -   **Cause:** API limits for translation service, incorrect locale handling.
    -   **Solution:** Check translation service logs, verify i18n implementation in Docusaurus.
-   **Performance Bottlenecks:**
    -   **Cause:** Inefficient queries to Qdrant/Postgres, unoptimized Docusaurus builds.
    -   **Solution:** Profile API endpoints, optimize database queries, analyze Docusaurus build times.

## IMPORTANT NOTES:
- The OpenAI agent will be built by you using OpenAI Agents SDK (custom implementation) for the main conversational AI.
- Claude Code subagents handle auxiliary tasks (indexing, personalization, translation, QA), NOT the main chatbot.
- The main conversational AI agent code will be provided separately and integrated.
- This `claude.md` focuses on integrating your pre-built agent code with the RAG pipeline.
- For everytime you want to see the specs you will always find those in this path D:\Abdul Kabir\agentic_ai\hackathon\panaversity-robotics-hackathon\specs\001-robotics-ai-textbook

## CRITICAL: History Update Requirement

**⚠️ MANDATORY WORKFLOW**: Whenever `CLAUDE.md` is edited or updated, you MUST automatically update `.speckit-plus/history/history.md` to reflect the changes.

### Update History Workflow:
1. **After ANY edit to CLAUDE.md**, read the current `history.md` file
2. **Add a new entry** to `history.md` with:
   - Current date
   - Tool: "Claude Code with speckit-plus"
   - Command: `/speckit-plus.update` or appropriate command
   - Action: Brief description of what was changed in CLAUDE.md
   - Details: List of specific changes made (sections updated, new information added, etc.)

### Example History Entry Format:
```markdown
### YYYY-MM-DD - CLAUDE.md Update
**Tool**: Claude Code with speckit-plus  
**Command**: `/speckit-plus.update`  
**Action**: Updated CLAUDE.md with [brief description]

**Changes Made**:
- Updated [section name] with [what changed]
- Added [new information]
- Modified [specific details]

**Files Modified**:
- `CLAUDE.md` - [specific changes]
```

### Automation:
- If editing CLAUDE.md, ALWAYS check if history.md needs updating
- If history.md is not updated by default, you MUST manually add an entry
- This ensures complete development history tracking
- History entries should be chronological and detailed enough to understand what changed

**This is a non-negotiable requirement for maintaining project history.**