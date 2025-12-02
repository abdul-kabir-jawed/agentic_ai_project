# Physical AI & Humanoid Robotics Interactive Textbook Constitution

## 1. Project Mission and North Star

**Mission:** To create an AI-native, interactive textbook for Physical AI & Humanoid Robotics that leverages advanced AI capabilities for personalized learning, offers a source-trustable RAG chatbot, ensures robust user authentication and personalization, and supports multilingual access.

**North Star:** To be the definitive interactive learning platform for Physical AI & Humanoid Robotics, fostering deep understanding and practical application through intelligent, adaptive, and trustworthy educational experiences.

## 2. Core Principles

### I. AI-First Learning
**Description:** We leverage Artificial Intelligence to deliver personalized, adaptive, and engaging educational experiences. AI is integrated to enhance content delivery, provide intelligent assistance, and tailor the learning path to individual student needs.
**Rationale:** To maximize learning effectiveness and provide a cutting-edge educational tool.

### II. Privacy & Trust
**Description:** User data protection is paramount. All interactions, especially with AI components, must be transparent. Personally Identifiable Information (PII) will never be shared with third parties without explicit user consent. Data handling practices must adhere to the highest privacy standards.
**Rationale:** To build and maintain user confidence and comply with data protection regulations.

### III. Accessibility
**Description:** The textbook is designed with a dark-first theme to minimize eye strain. It includes internationalization support, specifically for Urdu, and ensures an inclusive user experience (UX) through thoughtful design and implementation.
**Rationale:** To make the learning platform usable and comfortable for a diverse global audience.

### IV. Source Integrity
**Description:** The RAG (Retrieval-Augmented Generation) chatbot will *only* provide answers derived from the verified content of the textbook itself or from user-selected text. No external, unverified sources will be used by the RAG system without explicit user input.
**Rationale:** To ensure the accuracy, reliability, and academic integrity of information provided by the AI.

### V. Developer Experience
**Description:** Development follows a spec-driven methodology, ensuring clarity, consistency, and reduced ambiguity. Reusable Claude Code subagents are employed to automate repetitive tasks, promote code consistency, and accelerate development cycles.
**Rationale:** To enable efficient, high-quality development and maintain a manageable codebase in a hackathon context and beyond.

### VI. Production Quality
**Description:** The project will feature robust user authentication, a scalable backend architecture, and comprehensive documentation for both codebase and deployment. Solutions must be stable, performant, and maintainable.
**Rationale:** To deliver a high-quality product that meets hackathon scoring criteria and demonstrates potential for real-world application.

### VII. Modularity
**Description:** The system architecture must promote clear separation of concerns, with distinct and independently deployable layers for the frontend, backend, and intelligence services. Components should be loosely coupled.
**Rationale:** To facilitate independent development, testing, and scaling of different parts of the system.

### VIII. Observability
**Description:** Critical components must be designed with built-in logging, monitoring, and debugging capabilities. This includes structured logging, clear error reporting, and metrics collection to understand system behavior and troubleshoot issues effectively.
**Rationale:** To ensure reliable operation and efficient identification and resolution of problems.

### IX. Reproducibility
**Description:** The project must have well-documented setup procedures, and builds (especially the Docusaurus frontend) must be deterministic. All dependencies and configurations should be clearly specified to ensure consistent environments.
**Rationale:** To enable easy onboarding for new developers and reliable deployment across different environments.

### X. Extensibility
**Description:** The architecture should allow for the addition of new features and functionalities without requiring significant refactoring of existing core systems. Where applicable, a plugin-oriented design should be considered.
**Rationale:** To ensure the project can evolve and adapt to future requirements and expansions beyond the hackathon.

## 3. Quality Standards and Constraints

*   **Dark-First Theme:** All UI/UX elements, styling, and asset choices must align with a dark-first aesthetic.
*   **Privacy-First Design:** Strict adherence to data privacy guidelines, especially concerning PII. User consent is mandatory for any third-party data sharing.
*   **Offline-Buildable Pages:** The Docusaurus frontend must be capable of being built entirely offline, without reliance on external network resources during the build process.
*   **Source-Trustable RAG:** The RAG chatbot’s knowledge base is strictly limited to the textbook content and explicit user inputs. Any deviation requires a clear design justification and explicit user interaction.
*   **Robust Authentication:** The BetterAuth integration must be secure, handle common attack vectors, and provide a reliable user experience.
*   **Scalable Architecture:** Backend services (FastAPI, Qdrant, Neon Postgres) must be designed to handle anticipated load and be deployable in a serverless environment.
*   **Comprehensive Documentation:** All significant features, architectural decisions, API endpoints, and deployment procedures must be documented clearly and maintained.

## 4. Decision-Making & Non-Negotiable Requirements

*   **Principle Adherence:** All design and implementation decisions **MUST** align with the Core Principles (Section 2). Any proposed deviation requires explicit justification and review by stakeholders.
*   **Security First:** Security considerations are non-negotiable at every stage of development. All code must undergo security review, and best practices (e.g., input validation, secure coding patterns) **MUST** be applied.
*   **Performance Targets:** Key user flows (e.g., page load times, chatbot response times) **MUST** meet defined performance metrics to ensure a responsive user experience.
*   **User Consent:** Explicit user consent is a non-negotiable requirement for processing or sharing any sensitive data or enabling personalized features.
*   **Code Review:** All code changes **MUST** undergo a peer code review process to ensure quality, adherence to principles, and identification of potential issues.

## Governance

This Constitution supersedes all other project practices and guidelines. Amendments to this Constitution require:
1.  A formal proposal outlining the changes and their rationale.
2.  Review and approval by at least two core project developers or key stakeholders.
3.  Documentation of the changes in the Sync Impact Report within the `constitution.md` file.
4.  Propagation of relevant changes to dependent templates (specifications, plans, tasks).

Compliance with these principles will be periodically reviewed. All pull requests and code reviews **MUST** verify adherence to the stated principles. `CLAUDE.md` serves as the primary runtime development guidance for Claude Code.

**Version**: 1.0.0 | **Ratified**: 2025-11-28 | **Last Amended**: 2025-11-28
