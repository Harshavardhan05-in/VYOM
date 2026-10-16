"""
PhishShield AI — Multi-Vector Scanner & History Unit Tests
Tests: File, QR, Phone, Email, Social, History, Dashboard Stats
"""
import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# ── File Scanner Tests ────────────────────────────────────────────────────────

def test_file_scanner_text_file():
    content = b"This is a legitimate plain text readme document."
    response = client.post(
        "/api/v1/scan/file",
        files={"file": ("readme.txt", io.BytesIO(content), "text/plain")},
    )
    assert response.status_code == 200
    data = response.json()
    assert "scan_id" in data
    assert data["filename"] == "readme.txt"
    assert data["file_size_bytes"] == len(content)
    assert "sha256_hash" in data
    assert 0 <= data["risk_score"] <= 100
    assert data["risk_category"] == "safe"


def test_file_scanner_double_extension_deception():
    content = b"MZ\x90\x00\x03\x00\x00\x00"  # PE binary header
    response = client.post(
        "/api/v1/scan/file",
        files={"file": ("invoice.pdf.exe", io.BytesIO(content), "application/octet-stream")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] >= 65
    assert data["risk_category"] == "high_risk"
    rule_ids = [f["rule_id"] for f in data["triggered_findings"]]
    assert "FILE-03" in rule_ids or "FILE-04" in rule_ids


# ── Phone Checker Tests ───────────────────────────────────────────────────────

def test_phone_checker_standard_valid_number():
    response = client.post(
        "/api/v1/scan/phone",
        json={"phone_number": "+1 800 555 0199"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid_format"] is True
    assert data["country_calling_code"] == "+1"
    assert 0 <= data["risk_score"] <= 100


def test_phone_checker_too_short():
    response = client.post(
        "/api/v1/scan/phone",
        json={"phone_number": "123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid_format"] is False
    assert data["risk_score"] >= 35


# ── Email Scanner Tests ───────────────────────────────────────────────────────

def test_email_scanner_benign_message():
    response = client.post(
        "/api/v1/scan/email",
        json={
            "subject": "Team Lunch on Friday",
            "sender": "colleague@company.org",
            "body": "Hi team, let's meet at noon on Friday for lunch. Thanks!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] < 30
    assert data["risk_category"] == "safe"


def test_email_scanner_phishing_urgency_and_credentials():
    response = client.post(
        "/api/v1/scan/email",
        json={
            "subject": "CRITICAL: Account Suspended within 24 hours",
            "sender": "PayPal Support <security@gmail.com>",
            "body": "Immediate action required: Your account will be terminated. Enter your password and update your credit card at https://fake-paypaI.com/login",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] >= 65
    assert data["risk_category"] == "high_risk"
    assert len(data["detected_vectors"]) > 0
    assert len(data["extracted_urls"]) > 0


# ── SocialShield AI Tests ─────────────────────────────────────────────────────

def test_social_scanner_legitimate_handle():
    response = client.post(
        "/api/v1/scan/social",
        json={"platform": "instagram", "identifier": "nationalgeographic"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] < 25
    assert data["risk_category"] == "safe"


def test_social_scanner_impersonation_keywords():
    response = client.post(
        "/api/v1/scan/social",
        json={
            "platform": "x",
            "identifier": "binance_support_official9942",
            "profile_details": "Official 24/7 Binance Support. DM to invest and double your crypto giveaway.",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] >= 65
    assert data["risk_category"] == "high_risk"
    assert len(data["impersonation_indicators"]) > 0


# ── History & Dashboard Stats Tests ───────────────────────────────────────────

def test_history_and_dashboard_stats():
    # 1. Fetch history list
    hist_res = client.get("/api/v1/history?limit=10")
    assert hist_res.status_code == 200
    hist_data = hist_res.json()
    assert "total_count" in hist_data
    assert isinstance(hist_data["items"], list)

    # 2. Fetch dashboard stats
    stats_res = client.get("/api/v1/dashboard/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert "total_scans" in stats
    assert "threats_detected" in stats
    assert "scanners_breakdown" in stats
    assert stats["system_status"]["engine_online"] is True
