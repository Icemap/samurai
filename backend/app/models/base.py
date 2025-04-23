from datetime import datetime
from typing import Optional
from sqlmodel import Field, DateTime, func, SQLModel
from sqlalchemy.types import TypeDecorator, LargeBinary, Integer


class UpdatableBaseModel(SQLModel):
    # Use sa_type instead of sa_column, refer to https://github.com/tiangolo/sqlmodel/discussions/743
    created_at: Optional[datetime] = Field(
        default=None,
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": func.now()},
    )
    updated_at: Optional[datetime] = Field(
        default=None,
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()},
    )

class IntEnumType(TypeDecorator):
    """
    IntEnumType is a custom TypeDecorator that handles conversion between
    integer values in the database and Enum types in Python.

    This replaces the previous SmallInteger implementation to resolve Pydantic
    serialization warnings. When using SmallInteger, SQLAlchemy would return raw
    integers from the database (e.g., 0 or 1), causing Pydantic validation warnings
    since it expects proper Enum types.
    """

    impl = Integer

    def __init__(self, enum_class, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.enum_class = enum_class

    def process_bind_param(self, value, dialect):
        # enum -> int
        if isinstance(value, self.enum_class):
            return value.value
        elif value is None:
            return None
        raise ValueError(f"Invalid value for {self.enum_class}: {value}")

    def process_result_value(self, value, dialect):
        # int -> enum
        if value is not None:
            return self.enum_class(value)
        return None
