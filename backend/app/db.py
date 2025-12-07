import asyncpg
from typing import List, Optional, Dict, Any
from .config import settings
import uuid
import json
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        self.pool = None

    async def connect(self):
        """Create connection pool to Neon Postgres"""
        try:
            self.pool = await asyncpg.create_pool(
                settings.NEON_DATABASE_URL,
                min_size=2,
                max_size=10,
                command_timeout=60
            )
            logger.info("Connected to Neon Postgres successfully")

            # Initialize tables
            await self._initialize_tables()
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            raise

    async def _initialize_tables(self):
        """Create required tables if they don't exist"""
        async with self.pool.acquire() as conn:
            # Create conversations table
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS conversations (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    title TEXT
                )
            """)

            # Create messages table
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
                    role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
                    content TEXT NOT NULL,
                    sources JSONB, -- Array of source references
                    timestamp TIMESTAMP DEFAULT NOW(),
                    query_type TEXT
                )
            """)

            # Create documents table
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS documents (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    content TEXT NOT NULL,
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            """)

            # Create indexes
            await conn.execute("CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id)")
            await conn.execute("CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp)")
            await conn.execute("CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id)")
            await conn.execute("CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at)")

            logger.info("Tables initialized successfully")

    async def create_conversation(self, user_id: Optional[str] = None, title: Optional[str] = None) -> str:
        """Create a new conversation and return its ID"""
        async with self.pool.acquire() as conn:
            conversation_id = str(uuid.uuid4())
            await conn.execute(
                """
                INSERT INTO conversations (id, user_id, title)
                VALUES ($1, $2, $3)
                """,
                conversation_id,
                user_id,
                title
            )
            return conversation_id

    async def add_message(self, conversation_id: str, role: str, content: str,
                         sources: Optional[List[Dict[str, Any]]] = None,
                         query_type: Optional[str] = None):
        """Add a message to a conversation"""
        async with self.pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO messages (conversation_id, role, content, sources, query_type)
                VALUES ($1, $2, $3, $4, $5)
                """,
                conversation_id,
                role,
                content,
                json.dumps(sources) if sources else None,
                query_type
            )

            # Update conversation's updated_at timestamp
            await conn.execute(
                """
                UPDATE conversations
                SET updated_at = NOW()
                WHERE id = $1
                """,
                conversation_id
            )

    async def get_conversation_history(self, conversation_id: str) -> List[Dict[str, Any]]:
        """Retrieve all messages for a conversation"""
        async with self.pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT id, role, content, sources, timestamp, query_type
                FROM messages
                WHERE conversation_id = $1
                ORDER BY timestamp ASC
                """,
                conversation_id
            )

            return [
                {
                    'id': str(row['id']),
                    'role': row['role'],
                    'content': row['content'],
                    'sources': row['sources'],
                    'timestamp': row['timestamp'],
                    'query_type': row['query_type']
                }
                for row in rows
            ]

    async def clear_conversation(self, conversation_id: str):
        """Clear all messages from a conversation (but keep the conversation record)"""
        async with self.pool.acquire() as conn:
            await conn.execute(
                """
                DELETE FROM messages
                WHERE conversation_id = $1
                """,
                conversation_id
            )

    async def update_conversation_title(self, conversation_id: str, title: str):
        """Update conversation title"""
        async with self.pool.acquire() as conn:
            await conn.execute(
                """
                UPDATE conversations
                SET title = $1
                WHERE id = $2
                """,
                title,
                conversation_id
            )

    async def get_conversation(self, conversation_id: str) -> Optional[Dict[str, Any]]:
        """Get conversation details"""
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                SELECT id, user_id, created_at, updated_at, title
                FROM conversations
                WHERE id = $1
                """,
                conversation_id
            )

            if not row:
                return None

            return {
                'id': str(row['id']),
                'user_id': str(row['user_id']) if row['user_id'] else None,
                'created_at': row['created_at'],
                'updated_at': row['updated_at'],
                'title': row['title']
            }

    async def add_document_chunk(self, content: str, metadata: Dict[str, Any]) -> str:
        """Add a document chunk to the documents table"""
        async with self.pool.acquire() as conn:
            chunk_id = str(uuid.uuid4())
            await conn.execute(
                """
                INSERT INTO documents (id, content, metadata)
                VALUES ($1, $2, $3)
                """,
                chunk_id,
                content,
                json.dumps(metadata)
            )
            return chunk_id

    async def close(self):
        """Close the connection pool"""
        if self.pool:
            await self.pool.close()

# Global database instance
db_manager = DatabaseManager()