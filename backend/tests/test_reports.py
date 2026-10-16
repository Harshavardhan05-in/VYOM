"""
PhishShield AI — Suspicious URL Reporting Test Suite
"""
import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_submit_valid_suspicious_report():
    unique_host = f"evil-paypal-{uuid.uuid4().hex[:8]}.xyz"
    payload = {
        "url": f"http://{unique_host}/login",
        "scan_id": f"SCAN-TEST-{uuid.uuid4().hex[:6]}",
        "risk_score": 85,
        "risk_category": "high_risk",
        "user_explanation": "Received this via unexpected phishing SMS claiming account locked.",
        "evidence": ["Brand impersonation keywords detected", "Suspicious TLD .xyz"],
    }
    response = client.post("/api/v1/reports", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["report_id"].startswith("REP-URL-")
    assert unique_host in data["url"]
    assert data["forwarded_to_external"] is False
    assert "local quarantine vault" in data["message"]
    assert "locally only" in data["message"]


def test_duplicate_submission_suppression():
    unique_host = f"dup-test-{uuid.uuid4().hex[:8]}.com"
    payload = {
        "url": f"http://{unique_host}/phish",
        "scan_id": f"SCAN-DUP-{uuid.uuid4().hex[:6]}",
        "risk_score": 75,
        "risk_category": "high_risk",
        "user_explanation": "First report attempt",
    }
    # First submission
    res1 = client.post("/api/v1/reports", json=payload)
    assert res1.status_code == 200
    rep1 = res1.json()
    assert rep1["is_duplicate"] is False

    # Second immediate submission of the exact same URL
    res2 = client.post("/api/v1/reports", json=payload)
    assert res2.status_code == 200
    rep2 = res2.json()
    assert rep2["is_duplicate"] is True
    assert rep2["report_id"] == rep1["report_id"]
    assert "already reported recently" in rep2["message"]


def test_reject_invalid_url_scheme():
    payload = {
        "url": "ftp://malicious-files.com/trojan.exe",
        "risk_score": 90,
    }
    response = client.post("/api/v1/reports", json=payload)
    assert response.status_code == 422


def test_reject_empty_url():
    payload = {
        "url": "   ",
    }
    response = client.post("/api/v1/reports", json=payload)
    assert response.status_code == 422


def test_list_reports():
    response = client.get("/api/v1/reports?limit=10")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "reports" in data
    assert isinstance(data["reports"], list)
    assert data["total"] >= 1


def test_api_reports_alias():
    unique_host = f"bank-login-{uuid.uuid4().hex[:8]}.net"
    payload = {
        "url": f"https://{unique_host}/verify",
        "risk_score": 60,
        "risk_category": "suspicious",
    }
    response = client.post("/api/reports", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["report_id"].startswith("REP-URL-")
