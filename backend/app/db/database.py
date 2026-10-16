"""
PhishShield AI — Database Session Management
"""
import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

_BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
_CANONICAL_DB_PATH = (_BACKEND_DIR / "phishshield.db").as_posix()
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{_CANONICAL_DB_PATH}")

# For SQLite, check_same_thread=False allows multi-thread access in FastAPI
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency that yields an active database session and ensures cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create tables if they do not already exist."""
    Base.metadata.create_all(bind=engine)
