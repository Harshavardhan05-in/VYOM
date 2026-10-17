"""
PhishShield AI — Gmail Add-on Integration Backend Test Suite

Validates that:
1. Valid Gmail message input maps correctly to the Email threat engine.
2. URLs extracted from plain text and HTML bodies are analyzed through the URL defense engine.
3. Safe, suspicious, and high-risk classifications are generated accurately.
4. Server-to-server integration API key authentication works when configured.
5. Empty and oversized messages are rejected appropriately.
6. Sensitive body and HTML data are not stored in the database (Privacy by Design).
7. Persistence failure rolls back and raises HTTP 500 without returning a false success.
"""
import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.config import settings
from app.db.database import Base, get_db
from app.db.models import ScanRecordDB
from app.services.email_service import extract_urls_from_text_and_html, analyze_gmail_message


@pytest.fixture
def test_db():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(test_db):
    def override_get_db():
        try:
            yield test_db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def test_extract_urls_from_text_and_html():
    """Verify safe URL extraction from both plain text and HTML href attributes."""
    text = "Review this document at https://legitimate-service.org/docs and www.example.com"
    html_content = '<p>Click <a href="https://hidden-phish-target.xyz/login">here to verify</a> or visit http://another-link.com</p>'

    urls = extract_urls_from_text_and_html(text, html_content)
    assert "https://legitimate-service.org/docs" in urls
    assert "www.example.com" in urls
    assert "https://hidden-phish-target.xyz/login" in urls
    assert "http://another-link.com" in urls
    # Verify deduplication
    assert len(urls) == len(set(u.lower() for u in urls))


def test_gmail_scan_valid_safe_email(client, test_db):
    """Safe legitimate email yields safe assessment, valid web_report_url, and privacy-preserving DB record."""
    payload = {
        "subject": "Quarterly Budget Planning Meeting",
        "sender": "Alice Smith <alice@internal-company.org>",
        "body": "Hi team, please find the meeting agenda for tomorrow afternoon. Let me know if you have any questions.",
    }
    response = client.post("/api/v1/scan/gmail", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["scan_id"].startswith("SCAN-GML-")
    assert data["risk_category"] == "safe"
    assert data["risk_score"] < 30
    assert "No significant threats detected" in data["summary"]
    assert "dashboard?tab=history&scan_id=" in data["web_report_url"]

    # Verify DB persistence: raw body must NOT be stored in DB
    record = test_db.query(ScanRecordDB).filter_by(scan_id=data["scan_id"]).first()
    assert record is not None
    assert record.scanner_type == "email"
    assert record.input_target == "Gmail: Quarterly Budget Planning Meeting"
    # Ensure raw body is not in summary or input_target
    assert payload["body"] not in record.input_target


def test_gmail_scan_phishing_with_embedded_malicious_link(client, test_db):
    """High-risk urgency cue + deceptive link generates high_risk category and evaluates extracted URLs."""
    payload = {
        "subject": "URGENT: Your account will be terminated within 24 hours",
        "sender": "Support <security@paypal-security-update-center.xyz>",
        "body": "Immediate action required. Please enter your password to verify your identity at https://paypal-security-update-center.xyz/login",
    }
    response = client.post("/api/v1/scan/gmail", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["risk_category"] == "high_risk"
    assert data["risk_score"] >= 65
    assert len(data["extracted_urls"]) >= 1
    assert any("paypal-security-update-center.xyz" in u["url"] for u in data["extracted_urls"])
    assert any("Immediate Action Coercion" in r or "Artificial Urgency" in r for r in data["reasons"])


def test_gmail_scan_html_only_body(client, test_db):
    """When plain body is empty, safely derives text and links from html_body without HTML execution."""
    payload = {
        "subject": "Account Verification Alert",
        "sender": "Security Desk <alert@external-verify.com>",
        "body": "",
        "html_body": "<div><p>Click <a href=\"https://paypal-security-update-center.xyz/auth\">here to verify</a> your account immediately.</p></div>",
    }
    response = client.post("/api/v1/scan/gmail", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert len(data["extracted_urls"]) == 1
    assert "paypal-security-update-center.xyz/auth" in data["extracted_urls"][0]["url"]
    # Check that HTML tags were stripped from body_preview
    assert "<div>" not in data["body_preview"]
    assert "<a href" not in data["body_preview"]


def test_gmail_scan_empty_message_rejected(client):
    """Empty body and subject is rejected with HTTP 400."""
    payload = {
        "subject": "",
        "body": "",
        "html_body": "",
    }
    response = client.post("/api/v1/scan/gmail", json=payload)
    assert response.status_code == 400
    assert "empty email" in response.json()["detail"].lower()


def test_gmail_scan_oversized_html_rejected(client):
    """HTML exceeding 256 KB safety limit is rejected with HTTP 422."""
    oversized_html = "<p>" + ("A" * 300000) + "</p>"
    payload = {
        "subject": "Huge Email",
        "body": "Normal body",
        "html_body": oversized_html,
    }
    response = client.post("/api/v1/scan/gmail", json=payload)
    assert response.status_code == 422


def test_gmail_scan_authentication(client, monkeypatch):
    """When gmail_integration_api_key is configured, requests must supply valid key."""
    secret_key = "super-secret-phishshield-key-123"
    monkeypatch.setattr(settings, "gmail_integration_api_key", secret_key)

    payload = {
        "subject": "Test Auth",
        "body": "Testing integration key validation.",
    }

    # 1. No key -> 401
    res_no_auth = client.post("/api/v1/scan/gmail", json=payload)
    assert res_no_auth.status_code == 401

    # 2. Wrong key -> 401
    res_bad_auth = client.post(
        "/api/v1/scan/gmail",
        json=payload,
        headers={"X-PhishShield-Key": "wrong-key"},
    )
    assert res_bad_auth.status_code == 401

    # 3. Valid key via X-PhishShield-Key header -> 200
    res_good_xkey = client.post(
        "/api/v1/scan/gmail",
        json=payload,
        headers={"X-PhishShield-Key": secret_key},
    )
    assert res_good_xkey.status_code == 200

    # 4. Valid key via Authorization: Bearer header -> 200
    res_good_bearer = client.post(
        "/api/v1/scan/gmail",
        json=payload,
        headers={"Authorization": f"Bearer {secret_key}"},
    )
    assert res_good_bearer.status_code == 200


def test_gmail_scan_persistence_failure_raises_500():
    """Persistence failure in analyze_gmail_message must roll back and raise HTTP 500."""
    failing_db = MagicMock()
    failing_db.commit.side_effect = Exception("Simulated DB disk failure")

    with pytest.raises(HTTPException) as exc_info:
        analyze_gmail_message(
            subject="Test Persistence Failure",
            body="Legitimate text here.",
            db=failing_db,
        )

    assert exc_info.value.status_code == 500
    assert "Database persistence failed" in exc_info.value.detail
    assert failing_db.rollback.called
