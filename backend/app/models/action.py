from typing import List, Optional, Any
from sqlmodel import Field, Column, JSON, Text, String
from .base import UpdatableBaseModel

class Action(UpdatableBaseModel, table=True):
    """
    Database model for storing actions.
    """
    id: int = Field(default=None, primary_key=True)
    action: str = Field(sa_column=Column(String(length=32)))
    email: str = Field(sa_column=Column(String(length=32)))
    name: Optional[str] = Field(default=None, max_length=32)

    __tablename__ = "actions"