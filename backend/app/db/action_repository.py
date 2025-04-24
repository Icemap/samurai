import logging
from typing import List, Optional
from sqlmodel import select
from app.models.action import Action
from app.db.database import get_session
from app.utils.logger import get_logger

logger = get_logger("action_repository")

class ActionRepository:
    @staticmethod
    async def create(
        action: str,
        email: str,
        name: Optional[str] = None
    ) -> Action:
        """
        Create a new action report in the database.
        """
        logger.info(f"Creating new action report with email: {email}, action: {action}")
            
        action_report = Action(
            action=action,
            email=email,
            name=name
        )
        
        with get_session(expire_on_commit=False) as session:
            session.add(action_report)
            session.commit()
            session.refresh(action_report)
            logger.info(f"Successfully created action report with ID: {action_report.id}")
            return action_report
    
    @staticmethod
    async def get_all() -> List[Action]:
        """
        Get all action reports from the database.
        """
        logger.debug("Getting all action reports from the database")
        with get_session() as session:
            statement = select(Action)
            result = session.exec(statement).all()
            logger.debug(f"Retrieved {len(result)} action reports from the database")
            return result
    
    @staticmethod
    async def get_by_email(email: str) -> List[Action]:
        """
        Get all action reports for a specific email.
        """
        logger.debug(f"Getting action reports for email: {email}")
        with get_session() as session:
            statement = select(Action).where(Action.email == email)
            result = session.exec(statement).all()
            logger.debug(f"Retrieved {len(result)} action reports for email: {email}")
            return result 