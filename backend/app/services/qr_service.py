"""
PhishShield AI — QR Code Scanner Engine
Decodes QR codes from uploaded images using an adaptive multi-stage OpenCV pipeline
and passes extracted URLs through the complete PhishShield URL security analysis engine.
"""
import json
import logging
import re
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Tuple

import cv2
import numpy as np
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.models import ScanRecordDB
from app.schemas.scan import RiskCategory, SecurityFinding
from app.schemas.scanners import QRScanResponse
from app.services.scan_service import run_scan

logger = logging.getLogger("phishshield.qr_service")

QR_LIMITATIONS = [
    "QR decoding relies on matrix integrity, illumination, resolution, and edge contrast.",
    "Decoded destination URLs are evaluated for phishing and structure risk without visiting the destination page.",
    "Physical QR tampering (quishing) where a physical sticker overlays a legitimate code cannot be detected without source context.",
    "Never blindly accept permission prompts or download requests after scanning a QR code.",
]


def load_and_preprocess_image(image_bytes: bytes) -> Tuple[np.ndarray, dict]:
    """
    Validates uploaded image bytes and decodes into a normalized BGR OpenCV matrix.
    Safely composites 4-channel RGBA images onto a solid white background to prevent
    transparent backgrounds from turning into solid black blocks during colour conversion.
    """
    if not image_bytes or len(image_bytes) == 0:
        raise ValueError("Uploaded file is empty (0 bytes). Please upload a valid image file.")

    nparr = np.frombuffer(image_bytes, np.uint8)
    
    # 1. Decode preserving alpha channel if present
    raw_img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)
    if raw_img is None:
        # Fallback to standard color read
        raw_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if raw_img is None:
        raise ValueError("The uploaded file could not be parsed as a valid image. Please ensure the file is an undamaged PNG, JPEG, or WEBP image.")

    h, w = raw_img.shape[:2]
    channels = raw_img.shape[2] if len(raw_img.shape) > 2 else 1

    # 2. Normalize color space and composite alpha transparency
    if channels == 4:
        # RGBA / BGRA format: composite onto white canvas
        alpha = raw_img[:, :, 3].astype(np.float32) / 255.0
        bgr = raw_img[:, :, :3].astype(np.float32)
        white = np.ones_like(bgr, dtype=np.float32) * 255.0
        composited = bgr * alpha[:, :, None] + white * (1.0 - alpha[:, :, None])
        img_bgr = np.clip(composited, 0, 255).astype(np.uint8)
    elif channels == 1:
        img_bgr = cv2.cvtColor(raw_img, cv2.COLOR_GRAY2BGR)
    elif channels == 3:
        img_bgr = raw_img.copy()
    else:
        img_bgr = cv2.cvtColor(raw_img[:, :, :3], cv2.COLOR_BGR2BGR)

    diag_info = {
        "width": w,
        "height": h,
        "channels": channels,
    }
    return img_bgr, diag_info


def extract_qr_payloads(img_bgr: np.ndarray) -> Tuple[List[str], str]:
    """
    Executes a resilient, multi-stage detection strategy using OpenCV detectors
    (QRCodeDetector, WeChatQRCode, QRCodeDetectorAruco) with targeted preprocessing fallbacks:
      Stage 1: Original BGR composite
      Stage 2: Grayscale conversion
      Stage 3: Resizing / dimension normalization (improves OpenCV grid sampling on high-res images)
      Stage 4: Quiet zone padding (restores margin for tightly cropped matrices)
      Stage 5: Color inversion (handles dark-mode / white-on-black QR codes)
      Stage 6: Otsu binary thresholding
      Stage 7: Adaptive Gaussian thresholding
    """
    h, w = img_bgr.shape[:2]

    # Initialize available detectors in priority order
    detectors = []
    
    # Detector A: OpenCV Standard QRCodeDetector
    try:
        detectors.append(("cv2.QRCodeDetector", cv2.QRCodeDetector()))
    except Exception as e:
        logger.warning(f"Could not initialize cv2.QRCodeDetector: {e}")

    # Detector B: OpenCV WeChatQRCode (exceptionally accurate on stylized/me-qr/dark-mode)
    if hasattr(cv2, "wechat_qrcode_WeChatQRCode"):
        try:
            detectors.append(("cv2.WeChatQRCode", cv2.wechat_qrcode_WeChatQRCode()))
        except Exception as e:
            logger.warning(f"Could not initialize cv2.wechat_qrcode_WeChatQRCode: {e}")

    # Detector C: OpenCV QRCodeDetectorAruco
    if hasattr(cv2, "QRCodeDetectorAruco"):
        try:
            detectors.append(("cv2.QRCodeDetectorAruco", cv2.QRCodeDetectorAruco()))
        except Exception as e:
            logger.warning(f"Could not initialize cv2.QRCodeDetectorAruco: {e}")

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    # Prepare progressive preprocessing stages
    stages = [
        ("original_bgr", img_bgr),
        ("grayscale", gray),
    ]

    # Stage: Quiet zone border padding
    pad_px = max(25, int(min(h, w) * 0.08))
    padded_gray = cv2.copyMakeBorder(gray, pad_px, pad_px, pad_px, pad_px, cv2.BORDER_CONSTANT, value=255)
    stages.append(("padded_quiet_zone", padded_gray))

    # Stage: Resolution normalization
    # High-resolution matrices (>750px) often fail standard single-code grid fitting; downsampling to ~500px restores decode ability
    if max(h, w) > 750:
        scale = 500.0 / max(h, w)
        downscaled = cv2.resize(gray, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
        stages.append(("downscaled_500px", downscaled))
    elif max(h, w) < 200:
        scale = 400.0 / max(h, w)
        upscaled = cv2.resize(gray, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_NEAREST)
        stages.append(("upscaled_400px", upscaled))

    # Stage: Inverted grayscale for dark-mode QR codes (white modules on dark background)
    stages.append(("inverted_dark_mode", 255 - gray))

    # Stage: Otsu binary thresholding
    _, otsu = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    stages.append(("otsu_threshold", otsu))

    # Stage: Adaptive Gaussian thresholding for non-uniform lighting
    adaptive = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 51, 10)
    stages.append(("adaptive_gaussian", adaptive))

    # Execute decoding loop
    for stage_name, stage_img in stages:
        for det_name, detector in detectors:
            try:
                if det_name == "cv2.WeChatQRCode":
                    res, _ = detector.detectAndDecode(stage_img)
                    if res and len(res) > 0:
                        valid = [r.strip() for r in res if r and r.strip()]
                        if valid:
                            return valid, f"{det_name} [{stage_name}]"
                else:
                    # Try multi-decode first (more robust on high-res and multi-matrix images)
                    if hasattr(detector, "detectAndDecodeMulti"):
                        ok, decoded_info, _, _ = detector.detectAndDecodeMulti(stage_img)
                        if ok and decoded_info:
                            valid = [t.strip() for t in decoded_info if t and t.strip()]
                            if valid:
                                return valid, f"{det_name}.detectAndDecodeMulti [{stage_name}]"

                    # Try single decode
                    data, _, _ = detector.detectAndDecode(stage_img)
                    if data and data.strip():
                        return [data.strip()], f"{det_name}.detectAndDecode [{stage_name}]"
            except Exception:
                continue

    return [], "none"


def decode_and_analyze_qr(image_bytes: bytes, filename: str = "qr_code.png", db: Optional[Session] = None) -> QRScanResponse:
    scan_id = f"SCAN-QR-{uuid.uuid4().hex[:8].upper()}"
    scanned_at = datetime.now(timezone.utc).isoformat()

    # 1. Parse and validate image
    img_bgr, diag = load_and_preprocess_image(image_bytes)

    # 2. Extract QR payloads via multi-stage OpenCV decoder
    decoded_payloads, detection_method = extract_qr_payloads(img_bgr)

    # Diagnostic logging (dimensions, channels, counts — without logging confidential contents)
    logger.info(
        "QR image audit: file='%s', dims=%dx%d, channels=%d, detected=%s, count=%d, method='%s'",
        filename, diag["width"], diag["height"], diag["channels"],
        bool(decoded_payloads), len(decoded_payloads), detection_method
    )

    if not decoded_payloads:
        raise ValueError(
            "No QR code could be detected or decoded in the uploaded image. "
            "Please ensure the QR code is centered, well-lit, and in focus."
        )

    primary_payload = decoded_payloads[0]

    findings: List[SecurityFinding] = []
    reasons: List[str] = []
    recommendations: List[str] = []
    score = 0
    is_url = False
    url_target = None
    category = RiskCategory.SAFE

    # 3. Handle multiple QR codes if detected in the same image
    if len(decoded_payloads) > 1:
        findings.append(SecurityFinding(
            rule_id="QR-MULTI",
            title="Multiple QR Codes Detected in Single Matrix",
            severity="warning",
            triggered=True,
            evidence=f"Discovered {len(decoded_payloads)} distinct QR code payloads.",
            explanation="The uploaded image contains multiple QR codes. PhishShield analyzed the primary detected payload. Verify destination context before interacting.",
            recommendation="Review all payload destinations carefully to ensure you do not access unintended destinations.",
            score_contribution=10,
        ))
        reasons.append(f"Multiple ({len(decoded_payloads)}) QR codes detected in uploaded image.")
        recommendations.append("Confirm which QR code was intended to be scanned.")

    # 4. Analyze payload: URL vs non-URL data
    url_pattern = re.compile(r"^(https?://|www\.|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$)", re.IGNORECASE)
    
    if url_pattern.match(primary_payload) and " " not in primary_payload:
        is_url = True
        url_target = primary_payload if primary_payload.startswith("http") else f"https://{primary_payload}"

        # Pipe extracted URL through the full PhishShield URL defense engine
        url_res = run_scan(url_target)
        score = max(score, url_res.risk_score)
        category = url_res.risk_category
        findings = findings + url_res.findings
        reasons = [f"QR code decoded destination: {url_target}"] + reasons + url_res.reasons
        recommendations = [
            f"Verify the destination domain '{url_target}' before opening on your mobile device."
        ] + recommendations + url_res.recommended_actions
        analysis_method = f"Adaptive OpenCV Matrix Decoder ({detection_method}) + {url_res.analysis_method}"
    else:
        is_url = False
        findings.append(SecurityFinding(
            rule_id="QR-02",
            title="Non-URL QR Payload Extracted",
            severity="info",
            triggered=True,
            evidence=f"Payload preview: {primary_payload[:60]}...",
            explanation="The QR code encodes plain text, Wi-Fi credentials, contact vCard, or contactless data rather than a direct web URL.",
            recommendation="Review payload text carefully before copying or importing into applications.",
            score_contribution=0,
        ))
        reasons.append(f"Decoded non-URL content ({len(primary_payload)} characters).")
        recommendations.append("Do not import unknown Wi-Fi credentials or contact cards.")
        category = RiskCategory.SAFE
        score = 5
        analysis_method = f"Adaptive OpenCV Matrix Decoder ({detection_method}) [Plain Text Inspection]"

    triggered_findings = [f for f in findings if f.triggered]

    # 5. Persist scan in database
    if db:
        try:
            target_str = url_target if url_target else (primary_payload[:100] if primary_payload else filename)
            findings_data = [
                f.model_dump() if hasattr(f, "model_dump") else f.dict()
                for f in findings
            ]
            record = ScanRecordDB(
                scan_id=scan_id,
                scanner_type="qr",
                input_target=f"QR: {target_str}",
                risk_score=score,
                risk_category=category.value,
                findings_count=len(triggered_findings),
                summary=reasons[0] if reasons else "QR code inspection completed.",
                findings_json=json.dumps(findings_data),
                reasons_json=json.dumps(reasons),
                recommended_actions_json=json.dumps(recommendations),
                status="flagged" if category != RiskCategory.SAFE else "completed",
            )
            db.add(record)
            db.commit()
        except Exception as exc:
            db.rollback()
            logger.error(
                "Failed to persist QR scan record to database for scan_id=%s: %s",
                scan_id,
                exc,
                exc_info=True,
            )
            raise HTTPException(
                status_code=500,
                detail="Database persistence failed: unable to save QR scan record.",
            ) from exc

    return QRScanResponse(
        scan_id=scan_id,
        filename=filename,
        decoded_text=primary_payload,
        is_url=is_url,
        url_target=url_target,
        risk_score=score,
        risk_category=category,
        findings=findings,
        triggered_findings=triggered_findings,
        reasons=reasons,
        recommended_actions=recommendations,
        scanned_at=scanned_at,
        analysis_method=analysis_method,
        limitations=QR_LIMITATIONS,
    )
