"""
Authentication API routes
No external AI dependencies - uses rule-based personalization
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import Optional, List

try:
    from .auth import (
        UserCreate, UserLogin, UserProfileUpdate, UserProfile,
        UserResponse, TokenResponse, PersonalizeRequest, PersonalizeResponse,
        verify_password, get_password_hash, create_access_token,
        get_current_user, get_current_user_optional
    )
    from .auth_db import (
        create_user, get_user_by_email, get_user_by_id,
        get_user_profile, update_user_profile
    )
except ImportError:
    from auth import (
        UserCreate, UserLogin, UserProfileUpdate, UserProfile,
        UserResponse, TokenResponse, PersonalizeRequest, PersonalizeResponse,
        verify_password, get_password_hash, create_access_token,
        get_current_user, get_current_user_optional
    )
    from auth_db import (
        create_user, get_user_by_email, get_user_by_id,
        get_user_profile, update_user_profile
    )

auth_router = APIRouter(prefix="/api", tags=["Authentication"])


# ============ AUTH ENDPOINTS ============

@auth_router.post("/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    """Create a new user account"""
    password_hash = get_password_hash(user_data.password)

    user = await create_user(
        email=user_data.email,
        password_hash=password_hash,
        name=user_data.name
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"], "name": user["name"]}
    )

    return TokenResponse(
        access_token=access_token,
        user=UserResponse(id=user["id"], email=user["email"], name=user["name"])
    )


@auth_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login with email and password"""
    user = await get_user_by_email(credentials.email)

    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    profile_data = await get_user_profile(user["id"])
    profile = UserProfile(**profile_data) if profile_data else None

    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"], "name": user["name"]}
    )

    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            profile=profile
        )
    )


@auth_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    user = await get_user_by_id(current_user["id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile_data = await get_user_profile(current_user["id"])
    profile = UserProfile(**profile_data) if profile_data else None

    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        profile=profile
    )


# ============ PROFILE ENDPOINTS ============

@auth_router.get("/user/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get user profile"""
    profile = await get_user_profile(current_user["id"])
    return profile or {}


@auth_router.post("/user/profile")
async def save_profile(
    profile: UserProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Save user profile for personalization"""
    success = await update_user_profile(
        current_user["id"],
        profile.model_dump(exclude_none=True)
    )

    if not success:
        raise HTTPException(status_code=500, detail="Failed to save profile")

    return {"success": True, "message": "Profile saved"}


# ============ PERSONALIZATION (Rule-Based, No AI) ============

def get_experience_level(profile: dict) -> str:
    """Determine overall experience level from profile"""
    levels = {
        "none": 0,
        "beginner": 1,
        "intermediate": 2,
        "advanced": 3,
        "expert": 4
    }

    scores = []
    for field in ["programming_experience", "ai_ml_experience", "robotics_experience", "electronics_experience"]:
        value = profile.get(field)
        if value and value in levels:
            scores.append(levels[value])

    if not scores:
        return "beginner"

    avg = sum(scores) / len(scores)
    if avg < 1:
        return "beginner"
    elif avg < 2:
        return "intermediate"
    elif avg < 3:
        return "advanced"
    else:
        return "expert"


def get_recommendations(profile: dict, level: str) -> List[str]:
    """Generate learning recommendations based on profile"""
    recommendations = []

    prog_exp = profile.get("programming_experience", "none")
    robotics_exp = profile.get("robotics_experience", "none")
    electronics_exp = profile.get("electronics_experience", "none")

    if prog_exp in ["none", "beginner"]:
        recommendations.append("Start with Python basics before diving into robotics code")
        recommendations.append("Focus on understanding code examples step-by-step")

    if robotics_exp in ["none", "beginner"]:
        recommendations.append("Pay extra attention to the robotics fundamentals chapters")
        recommendations.append("Try the simulation exercises before working with real hardware")

    if electronics_exp in ["none", "beginner"]:
        recommendations.append("Review the electronics basics section carefully")
        recommendations.append("Start with simple sensor projects")

    if level in ["advanced", "expert"]:
        recommendations.append("Explore the advanced optimization techniques")
        recommendations.append("Consider contributing to open-source robotics projects")

    known_langs = profile.get("known_languages", [])
    if known_langs:
        if "Python" in known_langs:
            recommendations.append("You can leverage your Python skills for ROS and ML components")
        if "C++" in known_langs:
            recommendations.append("Your C++ knowledge will help with performance-critical robotics code")

    learning_style = profile.get("preferred_learning_style")
    if learning_style == "hands-on":
        recommendations.append("Focus on the practical exercises and projects")
    elif learning_style == "visual":
        recommendations.append("Pay attention to diagrams and video demonstrations")
    elif learning_style == "reading":
        recommendations.append("The detailed explanations will suit your learning style")

    return recommendations[:5]  # Return top 5 recommendations


@auth_router.post("/personalize/chapter", response_model=PersonalizeResponse)
async def personalize_chapter(
    request: PersonalizeRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Personalize chapter content based on user profile.
    Returns content with personalization metadata (no AI rewriting).
    Frontend can use this info to show/hide sections or add tooltips.
    """
    profile = await get_user_profile(current_user["id"])

    if not profile:
        return PersonalizeResponse(
            content=request.content,
            personalized=False,
            user_level=None,
            recommendations=None
        )

    # Determine user level
    level = get_experience_level(profile)

    # Get recommendations
    recommendations = get_recommendations(profile, level)

    # Build user level info
    user_level = {
        "overall": level,
        "programming": profile.get("programming_experience", "unknown"),
        "robotics": profile.get("robotics_experience", "unknown"),
        "electronics": profile.get("electronics_experience", "unknown"),
        "ai_ml": profile.get("ai_ml_experience", "unknown"),
        "known_languages": profile.get("known_languages", []),
        "learning_style": profile.get("preferred_learning_style", "unknown")
    }

    return PersonalizeResponse(
        content=request.content,  # Return original content
        personalized=True,
        user_level=user_level,
        recommendations=recommendations
    )


@auth_router.get("/personalize/recommendations")
async def get_personalized_recommendations(
    current_user: dict = Depends(get_current_user)
):
    """Get learning recommendations based on user profile"""
    profile = await get_user_profile(current_user["id"])

    if not profile:
        return {
            "level": "beginner",
            "recommendations": ["Complete your profile for personalized recommendations"]
        }

    level = get_experience_level(profile)
    recommendations = get_recommendations(profile, level)

    return {
        "level": level,
        "recommendations": recommendations,
        "profile_summary": {
            "programming": profile.get("programming_experience"),
            "robotics": profile.get("robotics_experience"),
            "electronics": profile.get("electronics_experience")
        }
    }