"""
Database operations for course progress tracking
Uses asyncpg for PostgreSQL
"""

import asyncpg
import uuid
from typing import Optional, Dict, Any, List
from datetime import datetime

from .config import settings

DATABASE_URL = settings.NEON_DATABASE_URL

async def init_progress_tables():
    """Create or update progress tables"""
    pool = await get_pool()

    async with pool.acquire() as conn:
        # Create user_progress table if it doesn't exist
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS user_progress (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                chapter_id TEXT NOT NULL,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, chapter_id)
            )
        """)

        # Create indexes if they don't exist
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id)")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_user_progress_chapter ON user_progress(chapter_id)")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed_at)")

    print("Progress database tables ready")


async def toggle_chapter_completion(user_id: str, chapter_id: str) -> Dict[str, Any]:
    """Toggle chapter completion status"""
    pool = await get_pool()

    async with pool.acquire() as conn:
        # Convert string UUID to UUID object for query
        uuid_obj = uuid.UUID(user_id)

        # Check if chapter is already completed
        existing = await conn.fetchrow(
            "SELECT id, completed_at FROM user_progress WHERE user_id = $1 AND chapter_id = $2",
            uuid_obj, chapter_id
        )

        if existing:
            # Chapter exists, delete it (mark as incomplete)
            await conn.execute(
                "DELETE FROM user_progress WHERE id = $1",
                existing['id']
            )
            return {
                "chapter_id": chapter_id,
                "completed": False,
                "completed_at": None
            }
        else:
            # Chapter doesn't exist, create it (mark as complete)
            completion_id = uuid.uuid4()
            completed_at = datetime.utcnow()
            await conn.execute(
                "INSERT INTO user_progress (id, user_id, chapter_id, completed_at) VALUES ($1, $2, $3, $4)",
                completion_id, uuid_obj, chapter_id, completed_at
            )
            return {
                "chapter_id": chapter_id,
                "completed": True,
                "completed_at": completed_at.isoformat()
            }


async def get_user_progress(user_id: str) -> List[Dict[str, Any]]:
    """Get all completed chapters for a user"""
    pool = await get_pool()

    async with pool.acquire() as conn:
        # Convert string UUID to UUID object for query
        uuid_obj = uuid.UUID(user_id)

        rows = await conn.fetch("""
            SELECT chapter_id, completed_at
            FROM user_progress
            WHERE user_id = $1
            ORDER BY completed_at DESC
        """, uuid_obj)

        return [
            {
                "chapter_id": row['chapter_id'],
                "completed_at": row['completed_at'].isoformat()
            }
            for row in rows
        ]


async def is_chapter_completed(user_id: str, chapter_id: str) -> bool:
    """Check if a specific chapter is completed by the user"""
    pool = await get_pool()

    async with pool.acquire() as conn:
        # Convert string UUID to UUID object for query
        uuid_obj = uuid.UUID(user_id)

        row = await conn.fetchrow(
            "SELECT id FROM user_progress WHERE user_id = $1 AND chapter_id = $2",
            uuid_obj, chapter_id
        )

        return row is not None


# Pool management functions (shared with auth_db)
async def get_pool() -> asyncpg.Pool:
    from .auth_db import get_pool as auth_get_pool
    return await auth_get_pool()


async def close_pool():
    from .auth_db import close_pool as auth_close_pool
    await auth_close_pool()