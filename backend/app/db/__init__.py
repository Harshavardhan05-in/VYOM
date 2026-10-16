"""
PhishShield AI Database Package
"""
from app.db.database import Base, engine, SessionLocal, get_db, init_db
from app.db.models import ScanRecordDB

__all__ = ["Base", "engine", "SessionLocal", "get_db", "init_db", "ScanRecordDB"]
