from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.db.action_repository import ActionRepository

router = APIRouter()

class ActionReport(BaseModel):
    action: str
    email: str
    name: Optional[str] = None

@router.post("/report")
async def report_action(action_data: ActionReport):
    """
    Record a user action in the database.
    """
    try:
        action_report = await ActionRepository.create(
            action=action_data.action,
            email=action_data.email,
            name=action_data.name
        )
        return {"id": action_report.id, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record action: {str(e)}") 