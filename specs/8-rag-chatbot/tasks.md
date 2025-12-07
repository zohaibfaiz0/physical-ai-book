# Implementation Tasks: RAG Chatbot Backend

**Feature**: Build complete RAG chatbot backend using Agent architecture pattern
**Created**: 2025-12-06
**Status**: Ready for implementation

## Phase 0: Project Setup

### Task 0.1: Create Backend Project Structure
**ID**: T0.1
**Description**: Create the complete backend directory structure as specified in the plan
**File**: backend/app/__init__.py, backend/requirements.txt, backend/render.yaml, backend/.env.example, backend/README.md
**Dependencies**: None
**Priority**: Critical

**Steps**:
- Create backend/ directory
- Create backend/app/ directory
- Create all specified files: __init__.py, main.py, agent.py, retrieval.py, generation.py, db.py, vector_store.py, ingest.py, models.py, config.py, utils.py
- Create requirements.txt with initial dependencies
- Create render.yaml for deployment
- Create .env.example template
- Create README.md with setup instructions

**Test**: Verify all files exist with correct paths

---

### Task 0.2: Set Up Python Virtual Environment and Dependencies
**ID**: T0.2
**Description**: Configure Python virtual environment and install all required dependencies
**File**: backend/requirements.txt
**Dependencies**: T0.1
**Priority**: Critical

**Steps**:
- Define all required dependencies in requirements.txt:
  - fastapi==0.104.1
  - uvicorn[standard]==0.24.0
  - groq==0.4.1
  - sentence-transformers==2.2.2
  - qdrant-client==1.8.0
  - asyncpg==0.29.0
  - pydantic==2.5.0
  - python-dotenv==1.0.0
  - psycopg[binary]==3.1.12
  - aiofiles==23.2.1
  - python-multipart==0.0.6
  - python-jose[cryptography]==3.3.0
  - passlib[bcrypt]==1.7.4
  - python-slugify==8.0.1
- Include development dependencies if needed

**Test**: Create virtual environment and install dependencies without errors

---

## Phase 1: Configuration and Environment

### Task 1.1: Implement Configuration Module
**ID**: T1.1
**Description**: Create config.py to handle environment variables and configuration validation
**File**: backend/app/config.py
**Dependencies**: T0.1
**Priority**: Critical

**Steps**:
- Import python-dotenv for environment variable loading
- Define Pydantic BaseSettings class for configuration
- Include fields for:
  - GROQ_API_KEY
  - MODEL_NAME
  - EMBEDDING_MODEL
  - NEON_DATABASE_URL
  - QDRANT_URL
  - QDRANT_API_KEY
  - QDRANT_COLLECTION_NAME
  - HOST
  - PORT
- Add validation to ensure required fields are present
- Create singleton pattern for configuration access

**Test**: Load configuration from .env file without errors, validate required fields

---

### Task 1.2: Create Environment Template
**ID**: T1.2
**Description**: Create .env.example template with all required environment variables
**File**: backend/.env.example
**Dependencies**: T1.1
**Priority**: High

**Steps**:
- Create template with all required environment variables
- Include placeholder values and descriptions
- Add comments explaining each variable's purpose
- Ensure template matches config.py requirements

**Test**: Verify template includes all required variables with proper format

---

## Phase 2: Database Setup

### Task 2.1: Implement Neon Postgres Connection
**ID**: T2.1
**Description**: Create database module with Neon Postgres connection and basic operations
**File**: backend/app/db.py
**Dependencies**: T1.1
**Priority**: Critical

**Steps**:
- Import asyncpg and other database libraries
- Create async connection function to Neon Postgres
- Implement connection pooling
- Add connection validation function
- Create basic CRUD operations for conversation and message entities
- Add error handling for connection failures

**Test**: Successfully connect to Neon Postgres, execute simple query

---

### Task 2.2: Create Conversation Schema
**ID**: T2.2
**Description**: Define and create schema for conversation history in Neon Postgres
**File**: backend/app/db.py
**Dependencies**: T2.1
**Priority**: Critical

**Steps**:
- Define SQL schema for Conversation table with fields:
  - id (UUID, primary key)
  - user_id (UUID, optional)
  - created_at (timestamp)
  - updated_at (timestamp)
  - title (text, optional)
- Define SQL schema for Message table with fields:
  - id (UUID, primary key)
  - conversation_id (UUID, foreign key)
  - role (enum: user, assistant)
  - content (text)
  - sources (JSONB)
  - timestamp (timestamp)
  - query_type (text, optional)
- Create functions to create tables if they don't exist
- Add indexes for efficient querying

**Test**: Create tables successfully, verify indexes are in place

---

### Task 2.3: Test Database Operations
**ID**: T2.3
**Description**: Create and test basic database operations for conversations and messages
**File**: backend/app/db.py
**Dependencies**: T2.2
**Priority**: Critical

**Steps**:
- Create function to create new conversation
- Create function to add message to conversation
- Create function to retrieve conversation history
- Create function to clear conversation history
- Create function to update conversation metadata
- Add comprehensive error handling

**Test**: Execute all database operations successfully, verify data integrity

---

## Phase 3: Vector Store Setup

### Task 3.1: Implement Qdrant Client
**ID**: T3.1
**Description**: Create vector store module with Qdrant client and basic operations
**File**: backend/app/vector_store.py
**Dependencies**: T1.1
**Priority**: Critical

**Steps**:
- Import qdrant-client library
- Create Qdrant client instance using configuration
- Implement collection creation with:
  - 384-dimensional vector space (for all-MiniLM-L6-v2)
  - Payload schema for metadata
- Add connection validation function
- Create basic CRUD operations for vector operations

**Test**: Successfully connect to Qdrant, create collection with correct dimensions

---

### Task 3.2: Implement Vector Operations
**ID**: T3.2
**Description**: Create functions for vector upsert and search operations
**File**: backend/app/vector_store.py
**Dependencies**: T3.1
**Priority**: Critical

**Steps**:
- Create function to upsert vectors with metadata
- Create function to search vectors by similarity
- Create function to retrieve specific vectors by ID
- Add metadata filtering capabilities
- Implement proper error handling for vector operations

**Test**: Successfully upsert and search vectors, verify metadata filtering works

---

## Phase 4: Document Ingestion

### Task 4.1: Build MDX File Parser
**ID**: T4.1
**Description**: Create ingestion module to parse MDX files and extract content
**File**: backend/app/ingest.py
**Dependencies**: T3.2, T2.2
**Priority**: Critical

**Steps**:
- Import libraries for file system operations and MDX parsing
- Create function to recursively scan docs/chapters/**/*.mdx
- Extract content from MDX files (excluding frontmatter)
- Extract metadata from frontmatter (title, week, etc.)
- Create data structures to hold parsed content

**Test**: Successfully parse sample MDX files, extract content and metadata correctly

---

### Task 4.2: Implement Text Chunking
**ID**: T4.2
**Description**: Create text chunking functionality with overlap and metadata preservation
**File**: backend/app/ingest.py, backend/app/utils.py
**Dependencies**: T4.1
**Priority**: Critical

**Steps**:
- Create function to chunk text into 1000-character segments
- Implement 200-character overlap between chunks
- Preserve document metadata in each chunk
- Respect document structure (sections, paragraphs) when possible
- Add chunk ID generation

**Test**: Verify chunking preserves content, maintains overlap, and preserves metadata

---

### Task 4.3: Generate Embeddings and Store
**ID**: T4.3
**Description**: Generate embeddings using Sentence Transformers and store in both Qdrant and Neon
**File**: backend/app/ingest.py
**Dependencies**: T4.2, T3.2, T2.2
**Priority**: Critical

**Steps**:
- Import sentence-transformers library
- Create function to generate embeddings using all-MiniLM-L6-v2
- Create function to store chunks in Qdrant with embeddings
- Create function to store chunk metadata in Neon Postgres
- Add progress tracking and logging
- Implement batch processing for efficiency

**Test**: Successfully generate embeddings, store in both systems, verify retrieval

---

### Task 4.4: Complete Ingestion Pipeline
**ID**: T4.4
**Description**: Create complete ingestion pipeline with status reporting
**File**: backend/app/ingest.py
**Dependencies**: T4.3
**Priority**: High

**Steps**:
- Create main ingestion function that orchestrates the entire process
- Add check for existing collection to avoid duplicate ingestion
- Create status reporting with progress updates
- Add error handling for individual files
- Implement ingestion completion notification

**Test**: Run complete ingestion on sample data, verify all content is processed

---

## Phase 5: Agent Core Logic

### Task 5.1: Implement Query Analyzer
**ID**: T5.1
**Description**: Create query analysis function to classify question types
**File**: backend/app/agent.py
**Dependencies**: T1.1
**Priority**: Critical

**Steps**:
- Import groq library
- Create function to send query to Groq for classification
- Implement prompt engineering for query type identification
- Classify queries as: conceptual, factual, code-related, comparison
- Return classification with confidence score
- Add fallback logic for classification failures

**Test**: Successfully classify sample queries into correct categories

---

### Task 5.2: Build Strategy Selector
**ID**: T5.2
**Description**: Create logic to select retrieval strategy based on query and context
**File**: backend/app/agent.py
**Dependencies**: T5.1
**Priority**: Critical

**Steps**:
- Create function to determine retrieval strategy:
  - If selected_text provided: use only that context
  - If no selection: use whole-book retrieval
- Implement logic to decide between different search approaches
- Add conversation context awareness
- Return strategy and parameters

**Test**: Correctly select strategy based on input parameters

---

### Task 5.3: Create Context Builder
**ID**: T5.3
**Description**: Build context from retrieved chunks with source tracking
**File**: backend/app/agent.py
**Dependencies**: T5.2
**Priority**: Critical

**Steps**:
- Create function to format retrieved chunks into context
- Preserve source information for citation generation
- Rank and filter chunks by relevance
- Build coherent context from multiple sources
- Add source attribution tracking

**Test**: Build context with proper source tracking, verify relevance ranking

---

### Task 5.4: Add Conversation State Management
**ID**: T5.4
**Description**: Implement conversation state management for multi-turn interactions
**File**: backend/app/agent.py
**Dependencies**: T5.3, T2.3
**Priority**: High

**Steps**:
- Create function to load conversation context
- Implement context window management (last 5-10 messages)
- Add conversation state tracking
- Implement conversation ID generation
- Add conversation metadata management

**Test**: Maintain context across multiple conversation turns

---

## Phase 6: Retrieval System

### Task 6.1: Implement Hybrid Search
**ID**: T6.1
**Description**: Create hybrid search combining vector similarity and metadata filtering
**File**: backend/app/retrieval.py
**Dependencies**: T3.2, T2.3
**Priority**: Critical

**Steps**:
- Create function to perform vector similarity search in Qdrant
- Add metadata filtering capabilities
- Implement weighted scoring combining similarity and metadata relevance
- Add result ranking and deduplication
- Implement top-k retrieval (retrieve top 5 most relevant chunks)

**Test**: Successfully retrieve relevant chunks using hybrid approach

---

### Task 6.2: Add Advanced Retrieval Features
**ID**: T6.2
**Description**: Enhance retrieval with advanced features like reranking
**File**: backend/app/retrieval.py
**Dependencies**: T6.1
**Priority**: Medium

**Steps**:
- Implement reranking of results based on query relevance
- Add semantic expansion for better recall
- Implement result diversity to avoid repetitive content
- Add caching for frequently accessed content

**Test**: Verify enhanced retrieval improves answer quality

---

## Phase 7: Response Generation

### Task 7.1: Implement Groq Integration
**ID**: T7.1
**Description**: Create response generation using Groq API with proper context
**File**: backend/app/generation.py
**Dependencies**: T5.3, T1.1
**Priority**: Critical

**Steps**:
- Import groq library and create client
- Create function to generate response using llama-3.1-70b-versatile
- Format context and query for LLM consumption
- Implement proper prompt engineering for citation generation
- Add response validation and cleaning

**Test**: Generate coherent responses with proper context usage

---

### Task 7.2: Build Citation Formatter
**ID**: T7.2
**Description**: Implement citation formatting in responses
**File**: backend/app/generation.py
**Dependencies**: T7.1
**Priority**: Critical

**Steps**:
- Create function to format citations as [Chapter X: Section Name]
- Integrate citation generation with response creation
- Ensure citations are accurate and properly placed
- Add citation validation to ensure they reference actual sources

**Test**: Generate responses with proper inline citations

---

## Phase 8: API Endpoints

### Task 8.1: Implement Chat Endpoint
**ID**: T8.1
**Description**: Create main POST /chat endpoint with full functionality
**File**: backend/app/main.py
**Dependencies**: T5.4, T6.1, T7.2
**Priority**: Critical

**Steps**:
- Create Pydantic models for request/response validation
- Implement POST /chat endpoint
- Integrate agent, retrieval, and generation components
- Handle conversation state management
- Return properly formatted responses with sources
- Add request validation and error handling

**Test**: Successfully process chat requests, return properly formatted responses

---

### Task 8.2: Implement Health Check Endpoint
**ID**: T8.2
**Description**: Create GET /health endpoint for service monitoring
**File**: backend/app/main.py
**Dependencies**: T2.1, T3.1
**Priority**: High

**Steps**:
- Create GET /health endpoint
- Check connectivity to all dependencies (Groq, Qdrant, Neon)
- Return service status and version information
- Add timestamp and dependency status information

**Test**: Verify health endpoint returns correct status for all dependencies

---

### Task 8.3: Implement Conversation Management Endpoints
**ID**: T8.3
**Description**: Create endpoints for conversation history and management
**File**: backend/app/main.py
**Dependencies**: T2.3
**Priority**: High

**Steps**:
- Create GET /conversations/{id} endpoint
- Create POST /conversations/clear/{id} endpoint
- Implement proper request validation
- Add error handling for non-existent conversations
- Return properly formatted conversation history

**Test**: Successfully retrieve and clear conversation history

---

### Task 8.4: Add Middleware and Validation
**ID**: T8.4
**Description**: Add CORS middleware and request validation
**File**: backend/app/main.py, backend/app/models.py
**Dependencies**: T8.1
**Priority**: High

**Steps**:
- Add CORS middleware for localhost:3000 and GitHub Pages domains
- Create Pydantic models for all request/response bodies
- Add request validation using Pydantic
- Add comprehensive error handling
- Add logging for debugging and monitoring

**Test**: Verify CORS works correctly, requests are properly validated

---

## Phase 9: Testing and Validation

### Task 9.1: Create Test Queries
**ID**: T9.1
**Description**: Develop comprehensive test queries for validation
**File**: backend/test_queries.json (example file)
**Dependencies**: T8.1
**Priority**: High

**Steps**:
- Create set of test queries covering different types
- Include conceptual, factual, code-related, and comparison questions
- Create queries for both whole-book and selected-text modes
- Define expected response quality criteria
- Document test evaluation methodology

**Test**: Verify test queries cover all functionality areas

---

### Task 9.2: Test Selected-Text Mode
**ID**: T9.2
**Description**: Validate selected-text mode functionality
**File**: Various backend files
**Dependencies**: T8.1
**Priority**: Critical

**Steps**:
- Test with various selected text lengths
- Verify responses only use provided context
- Test with empty and null selected text
- Validate response quality and accuracy
- Check citation accuracy in selected-text mode

**Test**: Selected-text mode works correctly, uses only provided context

---

### Task 9.3: Test Whole-Book Mode
**ID**: T9.3
**Description**: Validate whole-book retrieval and response generation
**File**: Various backend files
**Dependencies**: T8.1
**Priority**: Critical

**Steps**:
- Test with various question types across all chapters
- Verify proper source attribution
- Test multi-turn conversations
- Validate response quality and accuracy
- Check citation accuracy in whole-book mode

**Test**: Whole-book mode works correctly, provides accurate responses with proper citations

---

## Phase 10: Deployment

### Task 10.1: Create Render Deployment Configuration
**ID**: T10.1
**Description**: Create render.yaml for Render.com deployment
**File**: backend/render.yaml
**Dependencies**: T0.1
**Priority**: High

**Steps**:
- Define Render web service configuration
- Set build command to install dependencies
- Set start command for uvicorn
- Configure environment variables
- Set up health check endpoint
- Optimize for free tier constraints

**Test**: Successfully deploy to Render.com using configuration

---

### Task 10.2: Write Deployment Documentation
**ID**: T10.2
**Description**: Create comprehensive README.md with deployment instructions
**File**: backend/README.md
**Dependencies**: All previous tasks
**Priority**: High

**Steps**:
- Include setup instructions
- Document environment variables
- Provide deployment steps for Render.com
- Include troubleshooting section
- Add API documentation summary
- Include performance optimization tips

**Test**: Verify documentation is clear and complete

---

## Task Status Legend
- **Pending**: [ ]
- **In Progress**: [/]
- **Complete**: [x]
- **Blocked**: [b]

## Priority Legend
- **Critical**: Required for basic functionality
- **High**: Important for core features
- **Medium**: Enhances functionality
- **Low**: Nice to have