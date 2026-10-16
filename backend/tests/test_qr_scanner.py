"""
PhishShield AI — QR Code Scanner Comprehensive Test Suite
Acceptance Tests for QR decoding, matrix extraction, URL piping, and edge cases.
"""
import io
import os
import cv2
import numpy as np
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.qr_service import decode_and_analyze_qr

client = TestClient(app)

USER_DOWNLOADED_QR = r"C:\Users\harsh\Downloads\qrcode_415439748_89e307b268735645514d1b8511d573ad.png"


def create_qr_image_bytes(data: str, pad: int = 20, size: int = 300, bg_val: int = 255) -> bytes:
    """Helper to generate standard QR code PNG bytes."""
    encoder = cv2.QRCodeEncoder_create()
    raw = encoder.encode(data)
    if pad > 0:
        raw = cv2.copyMakeBorder(raw, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=bg_val)
    resized = cv2.resize(raw, (size, size), interpolation=cv2.INTER_NEAREST)
    success, png_bytes = cv2.imencode(".png", resized)
    assert success
    return png_bytes.tobytes()


# ── Test 1: Valid QR code containing plain text ──────────────────────────────

def test_qr_scanner_plain_text():
    text_payload = "WIFI:S:PhishShield-Guest;T:WPA;P:Secur3P@ssw0rd;;"
    png_bytes = create_qr_image_bytes(text_payload)

    response = client.post(
        "/api/v1/scan/qr",
        files={"file": ("wifi_qr.png", io.BytesIO(png_bytes), "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_url"] is False
    assert data["decoded_text"] == text_payload
    assert data["risk_score"] <= 20
    assert data["risk_category"] == "safe"
    assert "Plain text" in data["findings"][0]["explanation"] or "Non-URL" in data["findings"][0]["title"]


# ── Test 2: Valid QR code containing an HTTPS URL ────────────────────────────

def test_qr_scanner_https_url():
    url_payload = "https://phishshield-ai.security/portal/verify"
    png_bytes = create_qr_image_bytes(url_payload)

    response = client.post(
        "/api/v1/scan/qr",
        files={"file": ("url_qr.png", io.BytesIO(png_bytes), "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_url"] is True
    assert data["url_target"] == url_payload
    assert 0 <= data["risk_score"] <= 100
    assert "OpenCV" in data["analysis_method"]


# ── Test 3: QR image with white background and sufficient quiet zone ─────────

def test_qr_scanner_white_bg_with_quiet_zone():
    payload = "https://legitimate-service.org/welcome"
    png_bytes = create_qr_image_bytes(payload, pad=40, size=400, bg_val=255)

    response = client.post(
        "/api/v1/scan/qr",
        files={"file": ("clean_qr.png", io.BytesIO(png_bytes), "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["decoded_text"] == payload


# ── Test 4: Resized / Low-resolution QR image ────────────────────────────────

def test_qr_scanner_low_resolution():
    payload = "https://github.com/phishshield"
    # Small 160x160 resolution image
    png_bytes = create_qr_image_bytes(payload, pad=10, size=160)

    response = client.post(
        "/api/v1/scan/qr",
        files={"file": ("low_res.png", io.BytesIO(png_bytes), "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["decoded_text"] == payload


# ── Test 5: Image containing NO QR code ──────────────────────────────────────

def test_qr_scanner_image_with_no_qr():
    # Solid blue / noise image with no 2D matrix
    solid_img = np.zeros((300, 300, 3), dtype=np.uint8)
    solid_img[:] = (200, 100, 50)
    _, png_bytes = cv2.imencode(".png", solid_img)

    response = client.post(
        "/api/v1/scan/qr",
        files={"file": ("blank_photo.png", io.BytesIO(png_bytes.tobytes()), "image/png")},
    )
    assert response.status_code == 400
    data = response.json()
    assert "No QR code could be detected" in data["detail"]


# ── Test 6: Invalid or corrupted image ───────────────────────────────────────

def test_qr_scanner_corrupted_image():
    corrupted_bytes = b"CORRUPTED_NOT_AN_IMAGE_HEADER_99999"

    response = client.post(
        "/api/v1/scan/qr",
        files={"file": ("corrupt.png", io.BytesIO(corrupted_bytes), "image/png")},
    )
    assert response.status_code == 400
    data = response.json()
    assert "could not be parsed as a valid image" in data["detail"]


def test_qr_scanner_empty_file():
    empty_bytes = b""

    response = client.post(
        "/api/v1/scan/qr",
        files={"file": ("empty.png", io.BytesIO(empty_bytes), "image/png")},
    )
    assert response.status_code == 400
    data = response.json()
    assert "empty (0 bytes)" in data["detail"]


# ── Test 7: QR code containing a suspicious URL ──────────────────────────────

def test_qr_scanner_suspicious_url():
    suspicious_url = "http://paypal-security-update-center.xyz/login"
    png_bytes = create_qr_image_bytes(suspicious_url)

    response = client.post(
        "/api/v1/scan/qr",
        files={"file": ("phishing_qr.png", io.BytesIO(png_bytes), "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_url"] is True
    assert data["url_target"] == suspicious_url
    assert data["risk_score"] >= 40
    assert data["risk_category"] in ["suspicious", "high_risk"]
    assert len(data["findings"]) > 0


# ── Test 8: Transparent PNG with alpha channel ───────────────────────────────

def test_qr_scanner_transparent_rgba_composite():
    encoder = cv2.QRCodeEncoder_create()
    raw = encoder.encode("https://transparent-alpha-test.org")
    raw = cv2.copyMakeBorder(raw, 20, 20, 20, 20, cv2.BORDER_CONSTANT, value=255)
    raw = cv2.resize(raw, (300, 300), interpolation=cv2.INTER_NEAREST)

    # RGBA with transparent black background (common in graphics software exports)
    rgba = np.zeros((300, 300, 4), dtype=np.uint8)
    rgba[raw == 0] = [0, 0, 0, 255]     # black modules
    rgba[raw == 255] = [0, 0, 0, 0]     # transparent black background

    _, png_bytes = cv2.imencode(".png", rgba)

    response = client.post(
        "/api/v1/scan/qr",
        files={"file": ("transparent.png", io.BytesIO(png_bytes.tobytes()), "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["decoded_text"] == "https://transparent-alpha-test.org"


# ── Test 9: Exact user-uploaded QR image (if on system) ──────────────────────

def test_qr_scanner_user_uploaded_image():
    if not os.path.exists(USER_DOWNLOADED_QR):
        pytest.skip("User download file not present in local path")

    with open(USER_DOWNLOADED_QR, "rb") as f:
        file_bytes = f.read()

    response = client.post(
        "/api/v1/scan/qr",
        files={"file": ("user_qr.png", io.BytesIO(file_bytes), "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_url"] is True
    assert data["decoded_text"] == "https://q.me-qr.com/dl3g1178"
    assert "https://q.me-qr.com/dl3g1178" in data["url_target"]
    assert "scan_id" in data
