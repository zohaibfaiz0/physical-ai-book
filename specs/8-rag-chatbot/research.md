# Research: RAG Chatbot Backend Implementation

**Created**: 2025-12-06
**Status**: Complete
**Feature**: RAG Chatbot Backend with Agent Architecture

## Decision: Query Analysis Techniques for Classification

**Rationale**: To implement intelligent query routing, we need to classify incoming questions into types (conceptual, factual, code-related, comparison) to determine the appropriate retrieval strategy.

**Approach**: Use Groq's LLM to perform query classification by sending the question with a classification prompt that asks the model to identify the query type and suggest the best retrieval strategy.

**Implementation**: Create a dedicated function in the agent module that sends the query to Groq with a structured prompt asking for query type classification and retrieval strategy recommendation.

**Alternatives considered**:
- Rule-based classification using keyword matching (less accurate for complex queries)
- Pre-trained classification models (requires additional model loading and maintenance)
- Fixed routing rules (not adaptive to query complexity)

## Decision: Hybrid Search Implementation in Qdrant

**Rationale**: Pure vector search may miss relevant content due to semantic gaps, while metadata filtering alone doesn't capture semantic similarity. Hybrid search combines both approaches.

**Approach**: Use Qdrant's sparse vector and dense vector capabilities together. First, perform semantic search using dense vectors (embeddings), then apply metadata filters to refine results. Use Qdrant's query API to combine both approaches.

**Implementation**:
- Store both dense embeddings (from Sentence Transformers) and sparse keyword vectors in Qdrant
- Use Qdrant's `query` method with both vector and filter conditions
- Implement a weighted scoring system that combines semantic similarity and metadata relevance

**Alternatives considered**:
- Separate semantic and keyword searches with manual result merging (less efficient)
- Post-filtering vector search results (misses semantically relevant content that doesn't match metadata)
- Single approach (either semantic or keyword) (reduces recall)

## Decision: Agent State Management for Multi-turn Conversations

**Rationale**: To maintain context across multiple conversation turns, we need a state management system that can track conversation history and relevant context.

**Approach**: Store conversation history in Neon Postgres with a separate table for messages. Use conversation ID to track context across turns. For immediate context, maintain a sliding window of recent messages in the agent's working memory.

**Implementation**:
- Create Conversation and Message tables in Neon Postgres
- Implement functions to load/save conversation history
- Use a context window of last 5-10 messages for immediate context
- Include conversation context in the generation prompt to maintain coherence

**Alternatives considered**:
- In-memory storage (not persistent across server restarts)
- Client-side storage only (not available for server-side context)
- Full history in every request (exceeds token limits quickly)

## Decision: Text Chunking Strategy for Technical Content

**Rationale**: Proper chunking is essential for retrieval accuracy. Technical content requires chunks that preserve semantic meaning while fitting within embedding model limits.

**Approach**: Use 1000-character chunks with 200-character overlap to preserve context across chunk boundaries. Implement semantic-aware chunking that respects document structure (sections, paragraphs) when possible.

**Implementation**:
- Split documents by natural boundaries (headers, paragraphs) first
- If sections are too large, split by character count (1000 chars)
- Add 200-character overlap to preserve context
- Preserve metadata (chapter, section) for each chunk

**Alternatives considered**:
- Fixed token-based chunking (less predictable for variable-length technical content)
- Sentence-based chunking (may create chunks that are too small for context)
- Header-based chunking only (may create very large chunks that exceed embedding limits)

## Decision: Citation Generation in LLM Responses

**Rationale**: The system must provide proper source attribution to maintain trust and allow users to verify information.

**Approach**: Create a two-step process: first retrieve relevant chunks with source metadata, then prompt the LLM to generate a response that includes inline citations in the format [Chapter X: Section Name]. The generation prompt will include instructions to reference sources appropriately.

**Implementation**:
- Retrieve top 5 relevant chunks with metadata (chapter, section, file path)
- Include source information in the context provided to the LLM
- Use structured prompt that explicitly asks for source attribution
- Format citations as [Chapter X: Section Name] for consistency

**Alternatives considered**:
- Post-processing responses to add citations (may not be contextually appropriate)
- Fixed citation format regardless of relevance (less precise attribution)
- No citations (violates project requirements for source traceability)

## Decision: Frontend Integration with Docusaurus

**Rationale**: The chatbot must be seamlessly integrated into the existing Docusaurus documentation site with a React component that can capture selected text.

**Approach**: Create a React component that can be imported into Docusaurus pages. The component will include:
- Chat interface with message history
- Selected text capture using `window.getSelection()`
- Modal or sidebar display options
- Conversation persistence across page navigation

**Implementation**:
- Create a standalone React component using TypeScript
- Use browser's `selectionchange` event to detect text selection
- Implement conversation state management with localStorage for persistence
- Design responsive UI that works with Docusaurus theme

**Alternatives considered**:
- iframe integration (more complex communication, potential styling issues)
- Separate application (breaks seamless integration with documentation)
- Server-side rendering only (less interactive, doesn't support real-time selection)

## Decision: Error Handling and Fallback Strategies

**Rationale**: The system needs to gracefully handle various failure modes while maintaining usability.

**Approach**: Implement layered error handling with multiple fallback strategies:
- If vector search fails, try keyword-based search
- If LLM call fails, return cached or default response
- If database connection fails, return static error message
- Log all errors for monitoring and debugging

**Implementation**:
- Create error handling middleware in FastAPI
- Implement retry logic for external API calls
- Provide user-friendly error messages
- Include monitoring and alerting for critical failures

**Alternatives considered**:
- Fail fast approach (poor user experience)
- Silent failure with no feedback (confusing for users)
- Single point of failure (system becomes completely unusable)

## Decision: Performance Optimization for 600ms Target

**Rationale**: The system must meet the performance requirement of under 600ms per query to provide a good user experience.

**Approach**: Implement several optimization strategies:
- Pre-compute embeddings during ingestion (not at query time)
- Use Qdrant's efficient vector search capabilities
- Implement caching for frequent queries
- Optimize database queries with proper indexing
- Use async operations throughout the stack

**Implementation**:
- Async FastAPI endpoints to handle multiple requests concurrently
- Connection pooling for database operations
- Efficient embedding model (all-MiniLM-L6-v2) for faster processing
- Caching layer for repeated queries
- Profiling and monitoring to identify bottlenecks

**Alternatives considered**:
- Synchronous processing (would block requests)
- Compute embeddings at query time (too slow)
- No caching (would repeat expensive operations)