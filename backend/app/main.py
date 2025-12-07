from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from typing import Optional
import logging
import asyncio
from datetime import datetime
import uuid

from .config import settings
from .db import db_manager
from .vector_store import vector_store
from .ingest import ingestion_pipeline
from .agent import agent
from .retrieval import retrieval_system
from .generation import generation_system
from .models import ChatRequest, ChatResponse, HealthCheck, ConversationHistoryResponse
from .utils import format_sources

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown"""
    # Startup
    logger.info("Starting up RAG Chatbot Backend...")

    # Initialize database connection
    try:
        await db_manager.connect()
        logger.info("Database connection established successfully")
    except Exception as e:
        logger.error(f"Database connection failed: {e}. Backend will start but conversation history will not be saved.")
        # Continue startup even if database fails

    # Initialize vector store
    try:
        await vector_store.initialize_collection()
        logger.info("Vector store initialized successfully")
    except Exception as e:
        logger.error(f"Vector store initialization failed: {e}")
        # Continue startup even if vector store fails

    # Check if we need to run ingestion
    try:
        doc_count = await vector_store.count_documents()
        if doc_count == 0:
            logger.info("No documents found in vector store. Starting ingestion...")
            try:
                await ingestion_pipeline.run_ingestion()
                doc_count_after = await vector_store.count_documents()
                if doc_count_after == 0:
                    logger.warning("Ingestion completed but no documents were added. Check if docs/ directory exists and contains MDX files.")
                else:
                    logger.info(f"Ingestion completed successfully. Added {doc_count_after} documents.")
            except Exception as e:
                logger.error(f"Ingestion failed: {e}", exc_info=True)
                logger.info("Continuing without ingestion. Make sure the docs/ directory exists and contains MDX files.")
    except Exception as e:
        logger.error(f"Document count check failed: {e}")

    yield

    # Shutdown
    logger.info("Shutting down RAG Chatbot Backend...")
    try:
        await db_manager.close()
    except Exception as e:
        logger.error(f"Error closing database connection: {e}")

# Create FastAPI app
app = FastAPI(
    title="Physical AI and Humanoid Robotics RAG Chatbot",
    description="RAG chatbot backend for the Physical AI and Humanoid Robotics textbook",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.github.io",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:3000/book",  # Docusaurus default
        "http://127.0.0.1:3000/book", # Docusaurus default
        "http://0.0.0.0:3000",        # Alternative
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "details": exc.errors()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "details": "An unexpected error occurred"
        }
    )

@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    try:
        # Check services
        # Check Groq by attempting a simple model call
        groq_status = "disconnected"
        try:
            from groq import AsyncGroq
            groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
            # Test with a simple models list call instead of chat completion
            models = await groq_client.models.list()
            if models:
                groq_status = "connected"
        except Exception:
            groq_status = "disconnected"

        qdrant_status = "disconnected"
        try:
            doc_count = await vector_store.count_documents()
            if doc_count >= 0:
                qdrant_status = "connected"
        except Exception:
            qdrant_status = "disconnected"

        neon_status = "disconnected"
        try:
            # Test database connection by attempting to get collections
            await db_manager.connect()
            neon_status = "connected"
        except Exception:
            neon_status = "disconnected"

        services = {
            "groq": groq_status,
            "qdrant": qdrant_status,
            "neon": neon_status
        }

        return HealthCheck(
            status="healthy",
            timestamp=datetime.utcnow().isoformat(),
            version="1.0.0",
            services=services
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint"""
    try:
        # Validate request
        if not request.question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty")

        logger.info(f"Received chat request: {request.question[:50]}...")

        # Create or use existing conversation ID
        conversation_id = request.conversation_id or str(uuid.uuid4())

        # Analyze query
        query_analysis = await agent.analyze_query(request.question)

        # Select retrieval strategy
        strategy = await agent.select_strategy(request.question, request.selected_text)

        # Retrieve relevant context
        retrieved_chunks = await retrieval_system.retrieve(
            question=request.question,
            selected_text=request.selected_text
        )

        # Build context string
        context = await agent.build_context(retrieved_chunks, request.selected_text)

        # Get conversation history for context
        history = await agent.get_conversation_history(conversation_id)

        # Generate response
        generation_result = await generation_system.generate_response(
            question=request.question,
            context=context,
            history=history
        )

        # Format sources
        sources = await generation_system.format_sources(retrieved_chunks)

        # Track conversation
        await agent.track_conversation(
            conversation_id=conversation_id,
            question=request.question,
            answer=generation_result['answer'],
            sources=sources
        )

        # Update conversation title if this is the first message
        if len(history) == 0:
            title = request.question[:50] + "..." if len(request.question) > 50 else request.question
            try:
                await db_manager.update_conversation_title(conversation_id, title)
            except Exception as e:
                logger.error(f"Failed to update conversation title: {e}")

        logger.info(f"Successfully processed chat request, returning response of length {len(generation_result['answer'])}")

        return ChatResponse(
            answer=generation_result['answer'],
            sources=sources,
            conversation_id=conversation_id,
            query_type=query_analysis.get('type')
        )
    except Exception as e:
        logger.error(f"Chat endpoint failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process chat request: {str(e)}")

@app.get("/conversations/{conversation_id}", response_model=ConversationHistoryResponse)
async def get_conversation(conversation_id: str):
    """Get conversation history"""
    try:
        # Get conversation details
        conversation = await db_manager.get_conversation(conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        # Get messages
        messages = await db_manager.get_conversation_history(conversation_id)

        return ConversationHistoryResponse(
            conversation_id=conversation_id,
            title=conversation['title'],
            created_at=conversation['created_at'].isoformat(),
            updated_at=conversation['updated_at'].isoformat(),
            messages=messages
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get conversation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve conversation")

@app.post("/conversations/clear/{conversation_id}")
async def clear_conversation(conversation_id: str):
    """Clear conversation history"""
    try:
        await db_manager.clear_conversation(conversation_id)
        return {
            "status": "success",
            "message": "Conversation cleared successfully",
            "conversation_id": conversation_id
        }
    except Exception as e:
        logger.error(f"Clear conversation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to clear conversation")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )