# Hackathon Submission: Physical AI & Humanoid Robotics Interactive Textbook

## Project Overview

The **Physical AI & Humanoid Robotics Interactive Textbook** is an AI-native educational platform that combines an interactive Docusaurus textbook with a RAG-powered chatbot, personalized learning experiences, and multi-language support. This project demonstrates cutting-edge AI integration in educational technology.

## Live Demo

- **Frontend**: [https://abdul-kabir-jawed.github.io/agentic_ai_project/](https://abdul-kabir-jawed.github.io/agentic_ai_project/)
- **Backend API**: [https://agenticaiproject.vercel.app/](https://agenticaiproject.vercel.app/)
- **GitHub Repository**: [https://github.com/abdul-kabir-jawed/agentic_ai_project](https://github.com/abdul-kabir-jawed/agentic_ai_project)

## Key Features

### 🎓 Interactive Textbook
- **8 Comprehensive Chapters** covering Physical AI and Humanoid Robotics
- Beautiful, dark-first UI with responsive design
- Chapter navigation and search functionality
- Code examples and diagrams integrated throughout

### 🤖 RAG-Powered AI Tutor
- **Retrieval-Augmented Generation** for accurate, context-aware responses
- **Source Citations**: Every answer includes references to source chapters
- **Multi-language Support**: Responds in user's preferred language (English, Urdu, Spanish, Chinese)
- **Context-Aware**: Can use selected text from documents as context

### 👤 User Personalization
- **Adaptive Learning**: Adjusts explanations based on technical level (Beginner/Intermediate/Advanced)
- **Background-Aware**: Considers user's background (Technical/Non-Technical)
- **Persistent Preferences**: Settings saved and applied across sessions
- **Smart Chat Integration**: Automatically opens chat with context when preferences change

### 🌍 Multi-Language Support
- **On-Demand Translation**: Urdu translation support
- **Language Persistence**: User's language preference saved and applied to all AI responses
- **RTL Support**: Proper right-to-left rendering for Urdu text

### 🔐 Authentication & Security
- **JWT-Based Authentication**: Secure token-based auth system
- **Password Hashing**: bcrypt with salt for secure password storage
- **Protected Routes**: Frontend and backend route protection
- **Session Management**: Refresh token support

### 📱 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme**: Beautiful dark-first design
- **Interactive Components**: Smooth animations and transitions
- **Accessibility**: Keyboard navigation and screen reader support

## Technical Architecture

### Frontend
- **Framework**: Docusaurus 3.9.2 (React 19, TypeScript)
- **Styling**: Tailwind CSS with custom dark theme
- **Deployment**: GitHub Pages via GitHub Actions
- **State Management**: React Context API

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Deployment**: Vercel Serverless Functions
- **Database**: Neon PostgreSQL (user data, chat history)
- **Vector DB**: Qdrant Cloud (textbook embeddings)
- **AI**: Google Gemini API (LLM and embeddings)

### AI & Intelligence
- **RAG System**: Custom implementation with Qdrant vector search
- **Agent Framework**: OpenAI Agents SDK
- **Embeddings**: Gemini text-embedding-004 model
- **LLM**: Gemini 2.5 Flash for chat responses

## Scoring Criteria Alignment

### ✅ Base Features (Required)
- [x] Interactive textbook with multiple chapters
- [x] RAG-powered chatbot with source citations
- [x] User authentication (signup/signin)
- [x] Personalization system
- [x] Multi-language support (Urdu)
- [x] Chat history persistence
- [x] Responsive UI/UX

### ✅ Bonus Features
- [x] **Advanced RAG**: Semantic search with relevance scoring
- [x] **Multi-language AI**: Agent responds in user's preferred language
- [x] **Context-Aware Chat**: Uses selected text from documents
- [x] **Persistent Personalization**: Settings saved across sessions
- [x] **Production Deployment**: Fully deployed and accessible
- [x] **Comprehensive Documentation**: README, API docs, architecture diagrams
- [x] **Claude Code Subagents**: Automated content indexing and QA

## Technical Highlights

### 1. Advanced RAG Implementation
- **Semantic Search**: Uses vector embeddings for context retrieval
- **Relevance Filtering**: Filters results by book and chapter
- **Context Window Management**: Handles long contexts efficiently
- **Source Attribution**: Every response includes chapter and section citations

### 2. Intelligent Personalization
- **Dynamic Adaptation**: Adjusts explanation complexity based on user level
- **Background Integration**: Considers user's technical background
- **Language Preference**: Applies user's language choice to all responses
- **Seamless UX**: Auto-opens chat with context when preferences change

### 3. Production-Ready Deployment
- **CI/CD Pipeline**: Automated deployment via GitHub Actions
- **Serverless Backend**: Scalable Vercel deployment
- **Environment Management**: Secure environment variable handling
- **CORS Configuration**: Proper cross-origin setup
- **Health Monitoring**: Health check endpoints

### 4. Developer Experience
- **Type Safety**: Full TypeScript coverage
- **API Documentation**: Comprehensive endpoint documentation
- **Architecture Diagrams**: Visual system documentation
- **Code Organization**: Clean, modular structure

## Project Statistics

- **Chapters**: 8 comprehensive chapters
- **Code Examples**: Multiple Python examples integrated
- **Vector Embeddings**: 249+ chunks indexed in Qdrant
- **API Endpoints**: 10+ RESTful endpoints
- **React Components**: 20+ reusable components
- **Lines of Code**: 10,000+ lines across frontend and backend

## Challenges Overcome

1. **RAG Integration**: Successfully integrated vector search with LLM for accurate, cited responses
2. **Multi-language Support**: Implemented language-aware agent that maintains context across languages
3. **Serverless Deployment**: Configured complex Python dependencies for Vercel serverless
4. **CORS & Authentication**: Resolved cross-origin issues between GitHub Pages and Vercel
5. **State Management**: Implemented persistent user preferences across sessions

## Future Roadmap

- [ ] Real-time collaborative features
- [ ] Advanced analytics and progress tracking
- [ ] Additional language support
- [ ] Mobile app version
- [ ] Offline mode support
- [ ] Advanced personalization algorithms

## Team

**Solo Developer**: Abdul Kabir Jawed

## Technologies Used

- **Frontend**: React, TypeScript, Docusaurus, Tailwind CSS
- **Backend**: Python, FastAPI, Uvicorn
- **Databases**: PostgreSQL (Neon), Qdrant Vector DB
- **AI/ML**: Google Gemini API, OpenAI Agents SDK
- **Deployment**: GitHub Pages, Vercel
- **DevOps**: GitHub Actions, Docker (optional)

## Conclusion

This project demonstrates a complete, production-ready AI-native educational platform that combines modern web technologies with cutting-edge AI capabilities. The system is fully deployed, documented, and ready for use. It showcases advanced RAG implementation, intelligent personalization, and seamless user experience across multiple languages and technical levels.

**The platform is live and ready for evaluation!**

