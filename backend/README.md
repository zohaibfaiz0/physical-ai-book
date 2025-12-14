# Physical AI and Humanoid Robotics RAG Chatbot Backend

This is the backend service for the Physical AI and Humanoid Robotics RAG (Retrieval-Augmented Generation) chatbot. The service integrates with the textbook content to provide intelligent answers to student questions using vector search and LLM-powered response generation.

## Overview

The RAG chatbot backend provides:
- Intelligent question answering based on the Physical AI and Humanoid Robotics textbook
- Support for both whole-book and selected-text-only modes
- Proper source citations in responses
- Conversation history management
- Fast response times using vector search and optimized LLM calls

## Prerequisites

- Python 3.9+
- Access to Groq API (for LLM calls)
- Qdrant Cloud account (for vector storage)
- Neon Postgres account (for conversation history)

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd [repository-name]/backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your API keys and connection strings.

5. **Run the application:**
   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000`

## Environment Variables

- `GROQ_API_KEY`: Your Groq API key for LLM calls
- `MODEL_NAME`: LLM model to use (default: `llama-3.1-8b-instant`)
- `EMBEDDING_MODEL`: Embedding model for vector generation (default: `models/embedding-001`)
- `NEON_DATABASE_URL`: Connection string for Neon Postgres
- `QDRANT_URL`: Qdrant Cloud cluster URL
- `QDRANT_API_KEY`: Qdrant API key
- `QDRANT_COLLECTION_NAME`: Name of the Qdrant collection (default: `physical-ai-book`)
- `HOST`: Host for the API server (default: `0.0.0.0`)
- `PORT`: Port for the API server (default: `8000`)

## API Endpoints

### POST /chat
Main endpoint for chat interactions.

**Request:**
```json
{
  "question": "What is embodied AI?",
  "selected_text": "Optional text to use as context instead of whole book",
  "conversation_id": "Optional conversation ID to continue existing conversation"
}
```

**Response:**
```json
{
  "answer": "The answer with inline citations like [Weeks 1-2: Foundations]",
  "sources": [
    {
      "chapter": "Chapter title",
      "section": "Section name",
      "content": "Brief content preview...",
      "file_path": "Path to source file",
      "relevance_score": 0.85
    }
  ],
  "conversation_id": "ID of the conversation",
  "query_type": "Type of query (conceptual, factual, etc.)"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-06T10:30:00.123Z",
  "version": "1.0.0",
  "services": {
    "groq": "connected",
    "qdrant": "connected",
    "neon": "connected"
  }
}
```

### GET /conversations/{conversation_id}
Get conversation history.

### POST /conversations/clear/{conversation_id}
Clear conversation history.

## Testing

Test the chat endpoint:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the key principles of embodied AI?",
    "selected_text": null,
    "conversation_id": null
  }'
```

## Deployment to Render

1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Set the build command to: `pip install -r requirements.txt`
4. Set the start command to: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard:
   - `GROQ_API_KEY`
   - `NEON_DATABASE_URL`
   - `QDRANT_URL`
   - `QDRANT_API_KEY`
6. The service will automatically run ingestion on first startup if the vector store is empty

## Architecture

The backend follows an agent-based architecture with these components:

- **Agent**: Handles query analysis, strategy selection, and conversation management
- **Retrieval System**: Performs hybrid search using vector similarity and metadata filtering
- **Generation System**: Uses Groq API to generate responses with proper citations
- **Database**: Neon Postgres for conversation history and document metadata
- **Vector Store**: Qdrant for efficient similarity search of textbook content

## Ingestion Pipeline

On first startup, the system automatically processes all MDX files in the `docs/chapters/` directory:
- Extracts content and metadata from frontmatter
- Chunks text into 1000-character segments with 200-character overlap
- Generates embeddings using Sentence Transformers
- Stores vectors in Qdrant and metadata in Neon Postgres

## Performance

The system is optimized for sub-600ms response times through:
- Efficient vector search in Qdrant
- Async operations throughout the stack
- Caching where appropriate
- Optimized LLM calls with proper temperature settings

## Troubleshooting

- **Ingestion fails**: Check that the `docs/` directory exists and contains MDX files
- **API errors**: Verify all environment variables are correctly set
- **Slow responses**: Check API usage limits for your LLM provider
- **Database connection issues**: Verify your Neon Postgres connection string
- **Vector search issues**: Ensure Qdrant collection exists and has data