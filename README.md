# Physical AI & Humanoid Robotics Interactive Textbook

## Project Overview

This project aims to create an AI-native educational platform featuring an interactive Docusaurus textbook, a RAG chatbot, user authentication with personalization, and on-demand Urdu translation. It focuses on the exciting fields of Physical AI and Humanoid Robotics.

## High-Level Architecture

The system is designed with a clear separation of concerns:

*   **Frontend**: Interactive Docusaurus book (static site generation).
*   **Backend**: FastAPI for serverless API, handling core logic, RAG, personalization, and translation.
*   **Database**: Qdrant (vector database for RAG) and Neon Postgres (relational database for user data, chat history).
*   **Authentication**: BetterAuth.
*   **Core AI**: OpenAI Agents/ChatKit (custom implementation for main conversational AI).
*   **Automation/Assistance**: Claude Code subagents.
*   **Deployment**: GitHub Pages (frontend), serverless API (backend).

## Setup and Installation

### Prerequisites

- **Node.js** 20.x or higher
- **Python** 3.12 or higher
- **PostgreSQL** (Neon Serverless Postgres recommended)
- **Qdrant Cloud** account (or self-hosted Qdrant)
- **Google Gemini API** key
- **Git** for version control

### Step 1: Clone the Repository

```bash
git clone https://github.com/abdul-kabir-jawed/agentic_ai_project.git
cd agentic_ai_project
```

### Step 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
   JWT_SECRET_KEY=your-secret-key-here
   GEMINI_API_KEY=your-gemini-api-key
   QDRANT_URL=https://your-cluster.qdrant.io
   QDRANT_API_KEY=your-qdrant-api-key
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   ```

5. **Initialize database:**
   ```bash
   python init_db.py
   ```

6. **Initialize Qdrant collection:**
   ```bash
   python init_qdrant_collection.py
   ```

7. **Index textbook content:**
   ```bash
   python index_textbook.py
   ```

### Step 3: Frontend Setup

1. **Navigate to book directory:**
   ```bash
   cd ../book
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

   The Docusaurus site will be available at `http://localhost:3000`

## Running the Project

### Backend (FastAPI)

From the `backend/` directory:

```bash
# Activate virtual environment first
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run the server
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend (Docusaurus)

From the `book/` directory:

```bash
# Development server
npm start

# Production build
npm run build

# Serve production build
npm run serve
```

### Access the Application

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **API Docs**: `http://localhost:8000/docs` (FastAPI auto-generated docs)

## Claude Code Subagents

Claude Code subagents are specialized agents designed to automate specific, repetitive, or complex tasks within this project, complementing the main OpenAI-powered RAG chatbot. They are integrated into the `agents/` directory.

### Available Subagents:

1.  **Content Indexer Subagent (`agents/content_indexer.py`)**
    *   **Role**: Monitors new or updated textbook content (Markdown files), extracts relevant information, generates embeddings using OpenAI, and indexes them into the Qdrant vector database for the RAG system.
    *   **Usage**: Designed to be triggered when new chapters are added to `panaversity-fs` or existing ones are updated.

2.  **Personalization Engine Subagent (`agents/personalization_engine.py`)**
    *   **Role**: Leverages LLMs to rewrite or adapt textbook content based on a given user's profile and predefined prompt templates (e.g., adjusting complexity for different skill levels).
    *   **Usage**: Can be invoked to provide a tailored learning experience, dynamically adjusting content to individual learner needs.

3.  **Translation Service Subagent (`agents/translation_service.py`)**
    *   **Role**: Handles on-demand translation of textbook content into Urdu using a translation API (e.g., OpenAI GPT-4).
    *   **Usage**: Facilitates internationalization by enabling users to access content in their preferred language.

4.  **QA Automation Subagent (`agents/qa_agent.py`)**
    *   **Role**: Queries the RAG system with a set of test questions and evaluates the relevance, completeness, and citation accuracy of the responses.
    *   **Usage**: Crucial for maintaining the quality and reliability of the RAG chatbot, providing reports on its performance.

### Extending Subagents

All subagents are registered in `agents/subagent_registry.py`. To add a new subagent or modify an existing one:

1.  **Create your subagent script**: Place your Python script (e.g., `my_new_agent.py`) in the `agents/` directory.
2.  **Define a main function**: Ensure your script has a clear entry point function that encapsulates its logic.
3.  **Register your subagent**: Open `agents/subagent_registry.py` and import your new subagent's main function. Then, add an entry to the `SUBAGENT_REGISTRY` dictionary, mapping a unique name to your function.

This structured approach allows for easy expansion and management of automated tasks within the project.

## Contributing

**(Placeholder: Guidelines for contributing to the project, coding standards, and pull request process will go here.)**

## License

**(Placeholder: Project license information will go here.)**