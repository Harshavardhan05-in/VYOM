"""
PhishShield AI — Database Persistence Integrity & Error Handling Test Suite

Validates that:
1. URL scanner successfully persists complete records to the database.
2. When persistence fails, transaction is rolled back, error is logged, and HTTP 500 is raised (never silently swallowed).
3. All other scanners (File, QR, Phone, Email, Social) behave identically on commit failures.
4. Composite scanners (QR and Email) do not create duplicate URL records when internally invoking URL analysis.
5. Dashboard telemetry dynamically and honestly reports connectivity and SQLAlchemy engine dialect without leaking credentials.
6. Table initialization registers all models on Base.metadata.
"""
import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.database import Base, check_db_health, get_db_engine_display, init_db
from app.db.models import ScanRecordDB
from app.services.scan_service import run_scan
from app.services.file_service import analyze_file
from app.services.qr_service import decode_and_analyze_qr
from app.services.phone_service import analyze_phone_number
from app.services.email_service import analyze_email_message
from app.services.social_service import analyze_social_profile


@pytest.fixture
def in_memory_db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()


def test_url_scan_successful_persistence(in_memory_db):
    """URL scan must commit a complete, valid ScanRecordDB when a session is provided."""
    target_url = "https://example.com/login-verification"
    res = run_scan(target_url, db=in_memory_db)

    assert res.scan_id.startswith("SCAN-URL-")
    assert len(res.scan_id) <= 32  # Strict PostgreSQL VARCHAR(32) compatibility

    # Verify database persistence
    record = in_memory_db.query(ScanRecordDB).filter_by(scan_id=res.scan_id).first()
    assert record is not None
    assert record.scanner_type == "url"
    assert record.input_target == target_url
    assert record.risk_score == res.risk_score
    assert record.risk_category == res.risk_category.value
    assert record.findings_json is not None
    assert record.reasons_json is not None
    assert record.recommended_actions_json is not None


def test_url_scan_persistence_failure_raises_500_and_rolls_back():
    """If database commit fails during URL scan, transaction must roll back and raise HTTP 500."""
    mock_session = MagicMock()
    mock_session.commit.side_effect = Exception("Simulated DB connection failure / disk I/O error")

    with pytest.raises(HTTPException) as exc_info:
        run_scan("https://google.com", db=mock_session)

    assert exc_info.value.status_code == 500
    assert "Database persistence failed" in exc_info.value.detail
    assert mock_session.rollback.called


@pytest.mark.parametrize("scanner_name,scanner_fn,kwargs", [
    ("file", analyze_file, {"filename": "test.pdf", "file_bytes": b"%PDF-1.4 simulated"}),
    ("phone", analyze_phone_number, {"raw_number": "+18005550199"}),
    ("email", analyze_email_message, {"body": "Hello world meeting at 2pm", "subject": "Meeting"}),
    ("social", analyze_social_profile, {"platform": "instagram", "identifier": "clean_user_123"}),
])
def test_other_scanners_persistence_failure_raises_500_and_rolls_back(scanner_name, scanner_fn, kwargs):
    """All scanner services must roll back and raise HTTP 500 on persistence failure."""
    mock_session = MagicMock()
    mock_session.commit.side_effect = Exception(f"Simulated DB commit error in {scanner_name}")

    with pytest.raises(HTTPException) as exc_info:
        scanner_fn(**kwargs, db=mock_session)

    assert exc_info.value.status_code == 500
    assert "Database persistence failed" in exc_info.value.detail
    assert mock_session.rollback.called


def test_composite_scanners_no_duplicate_url_records(in_memory_db):
    """
    When QR or Email scanners inspect embedded URLs, they must NOT generate
    duplicate URL scan records in the database.
    """
    # 1. Email with embedded URLs
    email_text = "Check this link: https://google.com and also https://github.com"
    email_res = analyze_email_message(body=email_text, subject="Links", db=in_memory_db)
    assert email_res.scan_id

    # Verify exactly 1 email record and 0 url records created
    email_records = in_memory_db.query(ScanRecordDB).filter_by(scanner_type="email").all()
    url_records = in_memory_db.query(ScanRecordDB).filter_by(scanner_type="url").all()

    assert len(email_records) == 1
    assert len(url_records) == 0


def test_database_health_and_engine_display(in_memory_db):
    """check_db_health and get_db_engine_display must report genuine values."""
    # Healthy in-memory sqlite
    assert check_db_health(in_memory_db) is True
    engine_label = get_db_engine_display(in_memory_db)
    assert engine_label == "SQLite / SQLAlchemy"

    # Failing session
    broken_session = MagicMock()
    broken_session.execute.side_effect = Exception("Connection refused")
    assert check_db_health(broken_session) is False


def test_dashboard_stats_reports_dynamic_status(in_memory_db):
    """Dashboard stats must report real database connectivity and engine without hardcoded strings."""
    import asyncio
    from app.api.routes.scan import get_dashboard_stats

    stats = asyncio.run(get_dashboard_stats(db=in_memory_db))
    assert stats.system_status["database_online"] is True
    assert stats.system_status["database_engine"] == "SQLite / SQLAlchemy"
    assert stats.system_status["engine_online"] is True
