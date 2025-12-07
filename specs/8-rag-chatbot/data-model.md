# Data Model: RAG Chatbot Backend

**Created**: 2025-12-06
**Status**: Complete
**Feature**: RAG Chatbot Backend with Agent Architecture

## Document Chunk Entity

**Description**: Represents a processed chunk of content from the book's MDX files for vector search and retrieval.

**Fields**:
- `id` (UUID, Primary Key): Unique identifier for the chunk
- `content` (Text): The actual text content of the chunk
- `embedding` (Vector[384]): Dense embedding vector for semantic search (384 dimensions from all-MiniLM-L6-v2)
- `metadata` (JSONB): Document metadata including:
  - `chapter_title` (String): Title of the chapter
  - `week` (String): Week identifier (e.g., "Weeks 1-2")
  - `file_path` (String): Relative path to the source MDX file
  - `section_name` (String): Name of the section within the chapter
  - `difficulty` (String): Estimated difficulty level
- `created_at` (Timestamp): When the chunk was created during ingestion
- `updated_at` (Timestamp): When the chunk was last updated

**Indexes**:
- GIN index on `metadata` for efficient metadata filtering
- Vector index on `embedding` for fast similarity search

**Relationships**: None (standalone entity)

## Conversation Entity

**Description**: Represents a single conversation session between a user and the chatbot.

**Fields**:
- `id` (UUID, Primary Key): Unique identifier for the conversation
- `user_id` (UUID, Optional): Identifier for the user (null for anonymous sessions)
- `created_at` (Timestamp): When the conversation was initiated
- `updated_at` (Timestamp): When the conversation was last updated
- `title` (String, Optional): Auto-generated title based on first query

**Indexes**:
- B-tree index on `user_id` for user-specific queries
- B-tree index on `updated_at` for conversation history ordering

**Relationships**:
- One-to-Many with `Message` entity (conversation contains multiple messages)

## Message Entity

**Description**: Represents a single message in a conversation (either user query or assistant response).

**Fields**:
- `id` (UUID, Primary Key): Unique identifier for the message
- `conversation_id` (UUID, Foreign Key): Reference to the parent conversation
- `role` (Enum): Message role - either "user" or "assistant"
- `content` (Text): The actual message content
- `sources` (JSONB): List of source references for assistant responses:
  - `chunk_id` (UUID): Reference to the document chunk used
  - `chapter` (String): Chapter title
  - `section` (String): Section name
  - `file_path` (String): Path to source file
- `timestamp` (Timestamp): When the message was created
- `query_type` (String, Optional): Classification of the original query (for analytics)

**Indexes**:
- B-tree index on `conversation_id` for conversation-based queries
- B-tree index on `timestamp` for chronological ordering

**Relationships**:
- Many-to-One with `Conversation` entity (message belongs to one conversation)

## Schema Relationships

```
Conversation (1) <---> (Many) Message
```

The Document Chunk entity exists independently in Qdrant vector database and is linked to Message sources via chunk_id references.

## Validation Rules

### Document Chunk
- `content` must be between 100 and 1500 characters
- `embedding` must be exactly 384 dimensions
- `metadata` must contain required fields: `chapter_title`, `file_path`, `section_name`
- `created_at` is automatically set on creation

### Conversation
- `user_id` can be null for anonymous sessions
- `created_at` and `updated_at` are automatically managed
- `title` is auto-generated from first user message if not provided

### Message
- `role` must be either "user" or "assistant"
- `sources` is only populated for "assistant" messages
- `conversation_id` must reference an existing conversation
- `timestamp` is automatically set on creation

## State Transitions

### Conversation States
- **Active**: New conversation created, ready for messages
- **Active**: Messages are added to the conversation
- **Archived**: Conversation not accessed for 30+ days (still retrievable)

### Message States
- **Created**: Message received and stored
- **Processed**: For assistant messages, indicates sources have been identified
- **Complete**: Message fully formed and returned to user

## Indexing Strategy

### Neon Postgres
- Primary keys are automatically indexed
- Foreign key relationships have supporting indexes
- JSONB fields have GIN indexes for efficient querying
- Timestamp fields have B-tree indexes for chronological operations

### Qdrant Vector Database
- Vector index on embedding field for similarity search
- Payload index on metadata fields for filtering
- Collection configured for efficient search with metadata conditions