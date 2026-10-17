"""
PhishShield AI — Database Session Management
"""
import os
import logging
from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session

logger = logging.getLogger("phishshield.db")

_BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
_CANONICAL_DB_PATH = (_BACKEND_DIR / "phishshield.db").as_posix()
RAW_DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{_CANONICAL_DB_PATH}")

# Normalize postgres:// to postgresql:// for SQLAlchemy 1.4+ / 2.0+ compatibility (e.g. Supabase / Heroku)
if RAW_DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = RAW_DATABASE_URL.replace("postgres://", "postgresql://", 1)
else:
    DATABASE_URL = RAW_DATABASE_URL

# Engine configuration: SQLite requires check_same_thread=False; PostgreSQL benefits from pool_pre_ping
engine_kwargs = {"echo": False}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_pre_ping"] = True

engine = create_engine(
    DATABASE_URL,
    **engine_kwargs,
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
    """
    Create tables if they do not already exist.
    Explicitly imports all models so they are registered with Base.metadata.
    """
    # Guarantee all models are registered on Base.metadata before table creation
    from app.db.models import ScanRecordDB, SuspiciousUrlReportDB  # noqa: F401
    Base.metadata.create_all(bind=engine)


def check_db_health(db: Session) -> bool:
    """
    Perform a lightweight database connectivity check (SELECT 1).
    Returns True if reachable and responsive, False otherwise.
    Never exposes credentials or full connection strings.
    """
    try:
        db.execute(text("SELECT 1"))
        return True
    except Exception as exc:
        logger.warning("Database connectivity check failed: %s", exc)
        return False


def get_db_engine_display(db: Session) -> str:
    """
    Determine the human-readable database engine label based on the active SQLAlchemy dialect.
    """
    try:
        bind = db.get_bind()
        dialect_name = getattr(bind.dialect, "name", "unknown") if bind else "unknown"
    except Exception:
        dialect_name = "unknown"

    if dialect_name == "postgresql":
        return "PostgreSQL / SQLAlchemy"
    elif dialect_name == "sqlite":
        return "SQLite / SQLAlchemy"
    elif dialect_name != "unknown":
        return f"{dialect_name.capitalize()} / SQLAlchemy"
    return "SQLAlchemy"

