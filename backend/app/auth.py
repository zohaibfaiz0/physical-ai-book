"""
Authentication module - JWT-based auth with user profiles
No external API dependencies
"""

from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr, Field
from .config import settings

# ============ CONFIG ============

SECRET_KEY = settings.JWT_SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)


# ============ MODELS ============

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=1)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfileUpdate(BaseModel):
    programming_experience: Optional[str] = None  # none, beginner, intermediate, advanced, expert
    known_languages: Optional[List[str]] = None
    ai_ml_experience: Optional[str] = None
    robotics_experience: Optional[str] = None
    electronics_experience: Optional[str] = None
    microcontroller_experience: Optional[List[str]] = None
    sensor_actuator_experience: Optional[bool] = False
    preferred_learning_style: Optional[str] = None  # visual, reading, hands-on, video
    learning_goal: Optional[str] = None


class UserProfile(BaseModel):
    programming_experience: Optional[str] = None
    known_languages: Optional[List[str]] = None
    ai_ml_experience: Optional[str] = None
    robotics_experience: Optional[str] = None
    electronics_experience: Optional[str] = None
    microcontroller_experience: Optional[List[str]] = None
    sensor_actuator_experience: Optional[bool] = False
    preferred_learning_style: Optional[str] = None
    learning_goal: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    profile: Optional[UserProfile] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class PersonalizeRequest(BaseModel):
    chapter_id: str
    content: str


class PersonalizeResponse(BaseModel):
    content: str
    personalized: bool
    user_level: Optional[dict] = None
    recommendations: Optional[List[str]] = None


# ============ PASSWORD UTILS ============

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# ============ JWT UTILS ============

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


# ============ DEPENDENCIES ============

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[dict]:
    """Get current user or None if not authenticated"""
    if not credentials:
        return None

    payload = decode_token(credentials.credentials)
    if not payload or not payload.get("sub"):
        return None

    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "name": payload.get("name")
    }


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """Get current user or raise 401"""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_token(credentials.credentials)
    if not payload or not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "name": payload.get("name")
    }


# Aliases
require_auth = get_current_user
optional_auth = get_current_user_optional
