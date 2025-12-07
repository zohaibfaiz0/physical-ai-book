# Quickstart Guide: RAG Chatbot Backend

**Created**: 2025-12-06
**Status**: Complete
**Feature**: RAG Chatbot Backend with Agent Architecture

## Overview

This guide provides step-by-step instructions to set up, configure, and run the RAG chatbot backend service. The backend uses FastAPI, integrates with Groq for LLM, Neon Postgres for conversation history, and Qdrant for vector search.

## Prerequisites

- Python 3.9 or higher
- pip package manager
- Git (for cloning the repository)
- Access to the API keys for Groq, Qdrant, and Neon Postgres

## Setup Steps

### 1. Clone the Repository

```bash
git clone [repository-url]
cd [repository-name]
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory based on the `.env.example` template:

```bash
cp .env.example .env
```

Edit the `.env` file and add your API keys:

```env
# Groq API
GROQ_API_KEY=your_groq_api_key_here
MODEL_NAME=llama-3.1-70b-versatile

# Embeddings (Local - No API Key Needed)
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# Neon Postgres
NEON_DATABASE_URL=postgresql://username:password@ep-...aws.neon.tech/dbname?sslmode=require

# Qdrant Vector Database
QDRANT_URL=https://your-cluster-url.qdrant.io:6333
QDRANT_API_KEY=your_qdrant_api_key_here
QDRANT_COLLECTION_NAME=physical-ai-book

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

### 5. Run Database Migrations (if applicable)

If you have Alembic or similar migration tool:

```bash
alembic upgrade head
```

### 6. Run the Ingestion Pipeline

Process all MDX files from the docs directory:

```bash
python -m app.ingest
```

This will:
- Scan all `docs/chapters/**/*.mdx` files
- Extract content and metadata
- Generate embeddings
- Store in Qdrant and Neon Postgres

### 7. Start the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 8. Verify Installation

Open your browser or use curl to check the health endpoint:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-06T10:30:00.123Z",
  "version": "1.0.0",
  "dependencies": {
    "groq": "connected",
    "qdrant": "connected",
    "neon": "connected"
  }
}
```

## Testing the API

### Test the Chat Endpoint

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is embodied AI?",
    "selected_text": null,
    "conversation_id": null
  }'
```

### Expected Response Format

```json
{
  "answer": "Answer with inline citations like [Weeks 1-2: Foundations]",
  "sources": [
    {
      "chunk_id": "uuid",
      "chapter": "Chapter title",
      "section": "Section name",
      "file_path": "path/to/source",
      "relevance_score": 0.85
    }
  ],
  "conversation_id": "newly_created_or_existing_id",
  "query_type": "conceptual",
  "timestamp": "2025-12-06T10:30:00.123Z"
}
```

## Development Mode

For development with auto-reload:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Production Deployment

### Using Render.com

1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Set the build command to: `pip install -r requirements.txt`
4. Set the start command to: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard
6. The `render.yaml` file in the backend directory configures the deployment

### Environment Variables for Production

Ensure the following environment variables are set in your production environment:

- `GROQ_API_KEY`
- `QDRANT_URL`
- `QDRANT_API_KEY`
- `QDRANT_COLLECTION_NAME`
- `NEON_DATABASE_URL`

## Troubleshooting

### Common Issues

1. **API Keys Not Working**
   - Verify API keys are correctly set in `.env` file
   - Check for typos in the keys
   - Ensure the API keys have the necessary permissions

2. **Qdrant Connection Issues**
   - Verify the Qdrant URL and API key
   - Check if the collection name is correct
   - Ensure the Qdrant cloud instance is running

3. **Neon Postgres Connection Issues**
   - Verify the database URL format
   - Check if the database is accessible from your deployment environment
   - Ensure SSL mode is properly configured

4. **Ingestion Pipeline Fails**
   - Verify the docs directory structure matches `docs/chapters/**/*.mdx`
   - Check if the MDX files are properly formatted
   - Ensure sufficient memory for embedding generation

### Performance Issues

- If responses are slow, check the embedding model being used
- Monitor API usage limits for Groq
- Verify Qdrant cloud instance performance tier

## Next Steps

1. Integrate the chatbot with your Docusaurus frontend
2. Test the selected text functionality
3. Validate the citation accuracy
4. Monitor performance metrics
5. Set up logging and monitoring for production use