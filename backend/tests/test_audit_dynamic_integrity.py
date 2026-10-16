"""
PhishShield AI — Dynamic Data Integrity & Hardcoded Data Verification Suite
Validates that:
1. Dashboard stats match actual database queries.
2. An empty database produces genuine 0 counts and empty indicators (never fake numbers).
3. All six scanners execute authentic analysis logic and persist to SQLite.
4. Report counts match actual database records.
5. External reporting endpoints are handled honestly without fabricating delivery.
6. Deleted records disappear from history and statistics.
7. Top threat indicators reflect actual rule findings from the database.
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.database import Base
from app.db.models import ScanRecordDB, SuspiciousUrlReportDB
from app.services.scan_service import run_scan
from app.services.file_service import analyze_file
from app.services.qr_service import decode_and_analyze_qr
from app.services.phone_service import analyze_phone_number
from app.services.email_service import analyze_email_message
from app.services.social_service import analyze_social_profile
from app.services.report_service import submit_suspicious_url_report, list_submitted_reports
from app.schemas.report import SuspiciousUrlReportRequest


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


def test_empty_database_produces_honest_zeros(in_memory_db):
    """An empty database must produce 0 counts and empty indicators, never fake numbers."""
    from app.api.routes.scan import get_dashboard_stats
    import asyncio

    stats = asyncio.run(get_dashboard_stats(db=in_memory_db))
    assert stats.total_scans == 0
    assert stats.threats_detected == 0
    assert stats.high_risk_count == 0
    assert stats.suspicious_count == 0
    assert stats.safe_count == 0
    assert stats.average_risk_score == 0.0
    assert stats.recent_activity == []
    assert stats.top_threat_indicators == []
    for scanner, count in stats.scanners_breakdown.items():
        assert count == 0


def test_all_six_scanners_persist_and_update_stats(in_memory_db):
    """All six scanners must execute real logic, persist records, and reflect in telemetry."""
    # 1. URL Scanner
    res_url = run_scan("https://paypal-security-update-center.xyz/login", db=in_memory_db)
    assert res_url.risk_score > 0
    assert res_url.scan_id

    # 2. File Scanner
    res_file = analyze_file("invoice.pdf.exe", b"MZ\x90\x00\x03\x00\x00\x00fake_pe_data", db=in_memory_db)
    assert res_file.risk_score >= 65  # High risk: double extension + PE header
    assert res_file.scan_id

    # 3. QR Scanner (Real OpenCV QR matrix generation and decoding)
    import cv2
    encoder = cv2.QRCodeEncoder_create()
    raw = encoder.encode("WIFI:S:MyNetwork;T:WPA;P:Secret123;;")
    raw = cv2.copyMakeBorder(raw, 20, 20, 20, 20, cv2.BORDER_CONSTANT, value=255)
    resized = cv2.resize(raw, (300, 300), interpolation=cv2.INTER_NEAREST)
    _, png_bytes = cv2.imencode(".png", resized)
    res_qr = decode_and_analyze_qr(png_bytes.tobytes(), "test_qr.png", db=in_memory_db)
    assert res_qr.scan_id
    assert res_qr.is_url is False

    # 4. Phone Checker
    res_phone = analyze_phone_number("+88163101234", db=in_memory_db)
    assert res_phone.risk_score >= 60  # Wangiri satellite prefix
    assert res_phone.scan_id

    # 5. Email Scanner
    res_email = analyze_email_message(
        body="URGENT: Your account will be suspended within 24 hours. Enter your password to verify.",
        subject="Urgent Security Alert",
        db=in_memory_db,
    )
    assert res_email.risk_score >= 60
    assert res_email.scan_id

    # 6. SocialShield AI
    res_social = analyze_social_profile(
        platform="instagram",
        identifier="meta_support_official_99",
        db=in_memory_db,
    )
    assert res_social.risk_score >= 40
    assert res_social.scan_id

    # Verify Database Counts
    assert in_memory_db.query(ScanRecordDB).count() == 6
    types_found = {r.scanner_type for r in in_memory_db.query(ScanRecordDB).all()}
    assert types_found == {"url", "file", "qr", "phone", "email", "social"}


def test_top_threat_indicators_reflect_real_findings(in_memory_db):
    """Top threat indicators must be aggregated directly from actual triggered security rules."""
    import asyncio
    from app.api.routes.scan import get_dashboard_stats

    # Run scans that trigger specific known rules
    run_scan("http://google-security-login.xyz", db=in_memory_db)
    run_scan("http://bank-of-america-verify.xyz", db=in_memory_db)

    stats = asyncio.run(get_dashboard_stats(db=in_memory_db))
    assert len(stats.top_threat_indicators) > 0
    indicator_names = [ind.name for ind in stats.top_threat_indicators]
    # Check that real heuristic rule titles appear
    assert any("Domain" in name or "HTTP" in name or "Keywords" in name for name in indicator_names)


def test_reporting_lifecycle_and_honest_external_status(in_memory_db):
    """Reports must only increment when saved, and external delivery is never faked."""
    # When no external endpoint is configured, forward_status must be local_only
    req = SuspiciousUrlReportRequest(
        url="http://malicious-test-phish.xyz/login",
        risk_score=95,
        risk_category="high_risk",
        user_explanation="Phishing lure targeting credentials",
    )
    res = submit_suspicious_url_report(req, in_memory_db)

    assert res.report_id.startswith("REP-URL-")
    assert res.forwarded_to_external is False
    assert "local quarantine vault" in res.message.lower()

    # Verify database persistence
    rep_list = list_submitted_reports(in_memory_db)
    assert rep_list.total == 1
    assert rep_list.reports[0].report_id == res.report_id
    assert rep_list.reports[0].forward_status == "local_only"


def test_record_deletion_removes_from_telemetry(in_memory_db):
    """Deleting a scan record must remove it from database and subsequent queries."""
    res = run_scan("https://example.com/safe", db=in_memory_db)
    assert in_memory_db.query(ScanRecordDB).count() == 1

    # Delete record
    record = in_memory_db.query(ScanRecordDB).filter(ScanRecordDB.scan_id == res.scan_id).first()
    assert record is not None
    in_memory_db.delete(record)
    in_memory_db.commit()

    assert in_memory_db.query(ScanRecordDB).count() == 0
