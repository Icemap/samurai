from sqlmodel import Session, create_engine, SQLModel
from contextlib import contextmanager
from typing import Iterator

from app.config import settings

# Create engine
engine = create_engine(
    str(settings.SQLALCHEMY_DATABASE_URI), 
    echo=False,
    pool_pre_ping=True,
    pool_recycle=3600,
)

# Session context manager
@contextmanager
def get_session(expire_on_commit=True) -> Iterator[Session]:
    session = Session(engine, expire_on_commit=expire_on_commit)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close() 