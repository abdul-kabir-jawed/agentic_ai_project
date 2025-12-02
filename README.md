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

**(Placeholder: Detailed instructions for setting up the monorepo, installing dependencies for both backend and book, configuring environment variables, and initializing databases will go here.)**

## Running the Project

**(Placeholder: Instructions on how to run the Docusaurus frontend and FastAPI backend locally will go here.)**

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