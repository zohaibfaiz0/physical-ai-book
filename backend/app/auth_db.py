"""
Database operations for authentication
Uses asyncpg for PostgreSQL
"""

import asyncpg
import os
import uuid
from typing import Optional, Dict, Any

from .config import settings

DATABASE_URL = settings.NEON_DATABASE_URL

_pool: Optional[asyncpg.Pool] = None


async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            DATABASE_URL,
            ssl="require",
            min_size=2,
            max_size=10,
            command_timeout=60
        )
    return _pool


async def close_pool():
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


async def init_auth_tables():
    """Create or update auth tables"""
    pool = await get_pool()

    async with pool.acquire() as conn:
        # Create users table if it doesn't exist
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                name TEXT,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Add name column if it doesn't exist (for compatibility with existing tables)
        try:
            await conn.execute("ALTER TABLE users ADD COLUMN name TEXT")
        except asyncpg.exceptions.DuplicateColumnError:
            # Column already exists, which is fine
            pass

        # Make sure name column is NOT NULL (update existing records first if needed)
        # Update any existing records that might have NULL names
        await conn.execute("""
            UPDATE users SET name = email WHERE name IS NULL OR name = ''
        """)

        # Now make the name column NOT NULL
        await conn.execute("ALTER TABLE users ALTER COLUMN name SET NOT NULL")

        # Create user_profile table if it doesn't exist
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS user_profile (
                id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
                user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                programming_experience TEXT,
                known_languages TEXT[],
                ai_ml_experience TEXT,
                robotics_experience TEXT,
                electronics_experience TEXT,
                microcontroller_experience TEXT[],
                sensor_actuator_experience BOOLEAN DEFAULT FALSE,
                preferred_learning_style TEXT,
                learning_goal TEXT,
                chapter_preferences JSONB DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Create indexes if they don't exist
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_profile_user ON user_profile(user_id)")

    print("Auth database tables ready")


# ============ USER OPERATIONS ============

async def create_user(email: str, password_hash: str, name: str) -> Optional[Dict[str, Any]]:
    pool = await get_pool()

    async with pool.acquire() as conn:
        # Check existing
        existing = await conn.fetchrow("SELECT id FROM users WHERE email = $1", email.lower())
        if existing:
            return None

        # Create user
        user_uuid = uuid.uuid4()
        user_id = str(user_uuid)
        await conn.execute(
            "INSERT INTO users (id, email, name, password_hash) VALUES ($1, $2, $3, $4)",
            user_uuid, email.lower(), name, password_hash
        )

        # Create empty profile
        await conn.execute("INSERT INTO user_profile (user_id) VALUES ($1)", user_uuid)

        return {"id": user_id, "email": email.lower(), "name": name}


async def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id::text as id, email, name, password_hash FROM users WHERE email = $1",
            email.lower()
        )
        return dict(row) if row else None


async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    pool = await get_pool()
    async with pool.acquire() as conn:
        # Convert string UUID to UUID object for query
        uuid_obj = uuid.UUID(user_id)
        row = await conn.fetchrow(
            "SELECT id::text as id, email, name FROM users WHERE id = $1",
            uuid_obj
        )
        return dict(row) if row else None


# ============ PROFILE OPERATIONS ============

async def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    pool = await get_pool()
    async with pool.acquire() as conn:
        # Convert string UUID to UUID object for query
        uuid_obj = uuid.UUID(user_id)
        row = await conn.fetchrow("""
            SELECT programming_experience, known_languages, ai_ml_experience,
                   robotics_experience, electronics_experience, microcontroller_experience,
                   sensor_actuator_experience, preferred_learning_style, learning_goal
            FROM user_profile WHERE user_id = $1
        """, uuid_obj)
        return dict(row) if row else None


async def update_user_profile(user_id: str, profile_data: Dict[str, Any]) -> bool:
    pool = await get_pool()
    async with pool.acquire() as conn:
        # Convert string UUID to UUID object for query
        uuid_obj = uuid.UUID(user_id)
        await conn.execute("""
            INSERT INTO user_profile (
                user_id, programming_experience, known_languages, ai_ml_experience,
                robotics_experience, electronics_experience, microcontroller_experience,
                sensor_actuator_experience, preferred_learning_style, learning_goal
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (user_id) DO UPDATE SET
                programming_experience = EXCLUDED.programming_experience,
                known_languages = EXCLUDED.known_languages,
                ai_ml_experience = EXCLUDED.ai_ml_experience,
                robotics_experience = EXCLUDED.robotics_experience,
                electronics_experience = EXCLUDED.electronics_experience,
                microcontroller_experience = EXCLUDED.microcontroller_experience,
                sensor_actuator_experience = EXCLUDED.sensor_actuator_experience,
                preferred_learning_style = EXCLUDED.preferred_learning_style,
                learning_goal = EXCLUDED.learning_goal,
                updated_at = CURRENT_TIMESTAMP
        """,
            uuid_obj,
            profile_data.get("programming_experience"),
            profile_data.get("known_languages"),
            profile_data.get("ai_ml_experience"),
            profile_data.get("robotics_experience"),
            profile_data.get("electronics_experience"),
            profile_data.get("microcontroller_experience"),
            profile_data.get("sensor_actuator_experience", False),
            profile_data.get("preferred_learning_style"),
            profile_data.get("learning_goal")
        )
        return True