from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime

from ..auth import get_current_user
from ..progress_db import toggle_chapter_completion, get_user_progress
from pydantic import BaseModel

progress_router = APIRouter(prefix="/progress", tags=["Progress"])

# Pydantic models
class ToggleProgressRequest(BaseModel):
    chapter_id: str

class ProgressResponse(BaseModel):
    chapter_id: str
    completed: bool
    completed_at: str = None

class UserProgressResponse(BaseModel):
    chapter_id: str
    completed_at: str

class ProgressListResponse(BaseModel):
    progress: List[UserProgressResponse]


@progress_router.post("/toggle", response_model=ProgressResponse)
async def toggle_progress(
    request: ToggleProgressRequest,
    current_user: dict = Depends(get_current_user)
):
    """Toggle chapter completion status"""
    try:
        result = await toggle_chapter_completion(
            user_id=current_user["id"],
            chapter_id=request.chapter_id
        )

        return ProgressResponse(
            chapter_id=result["chapter_id"],
            completed=result["completed"],
            completed_at=result["completed_at"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update progress: {str(e)}"
        )


@progress_router.get("", response_model=ProgressListResponse)
async def get_progress(
    current_user: dict = Depends(get_current_user)
):
    """Get user's completed chapters"""
    try:
        progress_list = await get_user_progress(current_user["id"])

        return ProgressListResponse(progress=progress_list)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve progress: {str(e)}"
        )