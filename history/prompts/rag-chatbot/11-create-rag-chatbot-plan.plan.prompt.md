---
id: 11
title: Create RAG Chatbot Plan
stage: plan
date: 2025-12-06
surface: agent
model: claude-haiku-4-5-20251001
feature: rag-chatbot
branch: master
user: AA
command: /sp.plan
labels: [architecture,design,backend,rag]
links:
  spec: specs/8-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/8-rag-chatbot/plan.md
 - specs/8-rag-chatbot/research.md
 - specs/8-rag-chatbot/data-model.md
 - specs/8-rag-chatbot/contracts/api-contracts.md
 - specs/8-rag-chatbot/quickstart.md
tests:
 - none
---

## Prompt

```
Build complete RAG chatbot backend using Agent architecture pattern

Requirements:

AGENT ARCHITECTURE:
- Implement agentic RAG pattern with intelligent query routing
- Agent capabilities:
  1. Query Analysis: Classify query type (conceptual, factual, code-related, comparison)
  2. Strategy Selection: Decide retrieval strategy (whole-book vs selected-text-only)
  3. Context Building: Retrieve and rank relevant chunks with hybrid search
  4. Response Generation: Synthesize answer with proper citations
  5. Source Attribution: Always cite chapter/section sources inline [Chapter X, Section Y]

BACKEND STACK:
- FastAPI with async support
- Groq API for LLM (llama-3.1-70b-versatile)
- Sentence Transformers for embeddings (all-MiniLM-L6-v2, 384 dimensions)
- Neon Postgres for conversation history, document metadata, and user sessions
- Qdrant Cloud for vector similarity search
- Agent state management for multi-turn conversations

CHATKIT PATTERN (Frontend Integration):
- React chat component with message history
- Selected text capture using window.getSelection()
- Chat bubble UI with expandable modal
- Message persistence across page navigation
- Conversation history management
- Clear conversation button

INGESTION PIPELINE:
- Process all docs/chapters/**/*.mdx files recursively
- Extract metadata: chapter title, week, difficulty, file path
- Chunking strategy: 1000 characters with 200 character overlap
- Store vectors in Qdrant and metadata + full text in Neon
- Generate embeddings locally with Sentence Transformers
- Run automatically on first startup if collection is empty

API ENDPOINTS:
- POST /chat: Main conversational endpoint
  Input: {question: str, selected_text: str | null, conversation_id: str | null}
  Output: {answer: str, sources: list[dict], conversation_id: str}
- GET /health: Service health check
- POST /conversations/clear/{id}: Clear conversation history
- GET /conversations/{id}: Retrieve conversation history

AGENT LOGIC:
- Use Groq to analyze query intent and classify question type
- If selected_text provided: use ONLY that context for retrieval
- If no selection: perform hybrid search (vector similarity + metadata filtering)
- Retrieve top 5 most relevant chunks
- Build context with proper source tracking
- Generate response with inline citations format: [Chapter X: Section Name]
- Maintain conversation history for context-aware follow-up questions

DEPLOYMENT:
- Render.com free tier compatible
- Environment variables from .env file
- Auto-ingestion on first startup
- Graceful error handling with fallbacks
- CORS enabled for localhost:3000 and GitHub Pages domain
- Target latency: under 600ms per query

OUTPUT FOLDER STRUCTURE:
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI server with all endpoints
│   ├── agent.py         # Core agent logic (query analysis, strategy selection)
│   ├── retrieval.py     # Hybrid retrieval (vector + metadata search)
│   ├── generation.py    # Groq-powered response generation with citations
│   ├── db.py            # Neon Postgres connection and operations
│   ├── vector_store.py  # Qdrant client and operations
│   ├── ingest.py        # MDX file ingestion pipeline
│   ├── models.py        # Pydantic request/response models
│   ├── config.py        # Environment configuration
│   └── utils.py         # Helper functions (text processing, etc.)
├── requirements.txt     # Python dependencies
├── render.yaml          # Render.com deployment config
├── .env.example         # Environment template
└── README.md            # Setup and deployment instructions

SUCCESS CRITERIA:
- Agent correctly routes queries (whole-book vs selected-text modes)
- All responses include proper source citations
- Multi-turn conversations maintain context
- Achieves ≥92% factual accuracy on test questions
- Average response time <600ms
- Zero errors on health check
- Successfully deploys to Render.com free tier
```

## Response snapshot

Created comprehensive planning artifacts for the RAG chatbot backend:

- Implementation plan (plan.md) with technical context, constitution check, and implementation phases
- Research document (research.md) addressing all technical decisions including query analysis, hybrid search, agent state management, text chunking, citation generation, frontend integration, error handling, and performance optimization
- Data model (data-model.md) defining entities for Document Chunk, Conversation, and Message with relationships and validation rules
- API contracts (contracts/api-contracts.md) specifying endpoints for chat, health check, conversation retrieval, and conversation clearing with request/response schemas
- Quickstart guide (quickstart.md) with setup instructions, configuration steps, and testing procedures

All constitution principles validated and gates passed. The plan addresses intelligent query routing, source attribution, multi-turn conversations, deployment compatibility, and performance requirements.

## Outcome

- ✅ Impact: Complete architectural plan for RAG chatbot backend created with all required components
- 🧪 Tests: none
- 📁 Files: 5 created/modified
- 🔁 Next prompts: Generate implementation tasks with /sp.tasks
- 🧠 Reflection: Plan comprehensively addresses agent architecture, data models, API contracts, and deployment requirements

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Generate implementation tasks