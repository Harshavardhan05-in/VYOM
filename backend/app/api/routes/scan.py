"""
PhishShield AI — Comprehensive Multi-Vector Scan & History API Routes
"""
import json
import logging
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Request, Depends, UploadFile, File, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.core.config import settings
from app.schemas.scan import ScanRequest, ScanResponse, HealthResponse, ModelStatusResponse
from app.schemas.scanners import (
    FileScanResponse, QRScanResponse,
    PhoneScanRequest, PhoneScanResponse,
    EmailScanRequest, EmailScanResponse,
    SocialScanRequest, SocialScanResponse,
    HistoryListResponse, HistoryItem, DashboardStatsResponse,
    ThreatIndicatorItem,
    GmailScanRequest, GmailScanResponse,
)
from app.services.scan_service import run_scan
from app.services.file_service import analyze_file
from app.services.qr_service import decode_and_analyze_qr
from app.services.phone_service import analyze_phone_number
from app.services.email_service import analyze_email_message, analyze_gmail_message
from app.services.social_service import analyze_social_profile
from app.ml.model_manager import model_manager
from app.db.database import get_db, check_db_health, get_db_engine_display
from app.db.models import ScanRecordDB

logger = logging.getLogger("phishshield")
router = APIRouter(tags=["scan"])


# ── 1. URL Scanner ────────────────────────────────────────────────────────────

@router.post(
    "/scan",
    response_model=ScanResponse,
    summary="Analyse a URL for phishing indicators",
)
async def scan_url(
    request: Request,
    body: ScanRequest,
    db: Session = Depends(get_db),
):
    """
    Submit a URL for deep heuristic and ML phishing analysis.
    Saves the result to persistent SQLite database.
    """
    try:
        result = run_scan(body.url, db=db)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"URL scan error for {body.url!r}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An internal error occurred during URL analysis. Please try again.",
        )


# ── 2. File Scanner ───────────────────────────────────────────────────────────

@router.post(
    "/scan/file",
    response_model=FileScanResponse,
    summary="Analyse an uploaded file for malicious payload signatures",
)
async def scan_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload a file for static inspection: magic byte verification,
    double extension checks, macro analysis, and SHA-256 calculation.
    """
    try:
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty (0 bytes). Please upload a valid file.",
            )
        if len(content) > 20 * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail="File size exceeds the 20 MB safety threshold limit.",
            )
        filename = file.filename or "uploaded_file"
        result = analyze_file(filename=filename, file_bytes=content, db=db)
        return result
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"File scan error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred while inspecting the uploaded file.",
        )


# ── 3. QR Code Scanner ────────────────────────────────────────────────────────

@router.post(
    "/scan/qr",
    response_model=QRScanResponse,
    summary="Decode and inspect a QR code image",
)
async def scan_qr(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload a QR image, decode payload using OpenCV, and pipe any extracted
    destination URL through the full PhishShield URL defense pipeline.
    """
    try:
        content = await file.read()
        if len(content) > 20 * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail="QR image exceeds the 20 MB safety threshold limit.",
            )
        filename = file.filename or "qr_code.png"
        result = decode_and_analyze_qr(image_bytes=content, filename=filename, db=db)
        return result
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"QR scan error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to decode or inspect the provided QR code image.",
        )


# ── 4. Phone Checker ──────────────────────────────────────────────────────────

@router.post(
    "/scan/phone",
    response_model=PhoneScanResponse,
    summary="Validate phone format and check for Wangiri / premium-rate fraud risk",
)
async def scan_phone(
    body: PhoneScanRequest,
    db: Session = Depends(get_db),
):
    """
    Evaluate telephone number against ITU E.164 standards and detect
    high-tariff Wangiri callback scam prefixes.
    """
    try:
        result = analyze_phone_number(
            raw_number=body.phone_number,
            country_code=body.country_code,
            db=db,
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Phone scan error for {body.phone_number!r}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred while validating the telephone number.",
        )


# ── 5. Email & Message Scanner ────────────────────────────────────────────────

@router.post(
    "/scan/email",
    response_model=EmailScanResponse,
    summary="Analyse message body, urgency manipulation, and embedded links",
)
async def scan_email(
    body: EmailScanRequest,
    db: Session = Depends(get_db),
):
    """
    Inspect message text for coercive urgency cues, credential theft traps,
    sender spoofing, and extract embedded links for structural URL analysis.
    """
    try:
        result = analyze_email_message(
            body=body.body,
            subject=body.subject,
            sender=body.sender,
            raw_headers=body.raw_headers,
            db=db,
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Email scan error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred while evaluating the message content.",
        )


# ── 5b. Gmail Add-on Protection Endpoint ──────────────────────────────────────

@router.post(
    "/scan/gmail",
    response_model=GmailScanResponse,
    summary="Dedicated PhishShield AI scanner endpoint for Google Gmail Add-on",
)
async def scan_gmail(
    request: Request,
    body: GmailScanRequest,
    db: Session = Depends(get_db),
):
    """
    Dedicated endpoint for the PhishShield AI Google Gmail Add-on.
    - Evaluates urgency cues, credential harvesting language, and spoofed senders.
    - Safely parses and extracts links from plain text and HTML bodies.
    - Deep scans embedded URLs through the PhishShield URL defense engine.
    - Enforces integration API key authentication when configured.
    - Preserves privacy: raw email bodies are NEVER stored in the database.
    """
    # 1. Server-to-server integration authentication (if configured in settings)
    if settings.gmail_integration_api_key:
        auth_header = request.headers.get("Authorization", "")
        key_header = request.headers.get("X-PhishShield-Key", "")
        expected_key = settings.gmail_integration_api_key.strip()
        bearer_key = auth_header.replace("Bearer", "").strip() if auth_header.startswith("Bearer") else ""

        if key_header != expected_key and bearer_key != expected_key:
            logger.warning("Unauthorized Gmail Add-on scan attempt: invalid or missing integration key.")
            raise HTTPException(
                status_code=401,
                detail="Unauthorized: invalid or missing PhishShield integration key.",
            )

    # 2. Execute analysis
    try:
        result = analyze_gmail_message(
            subject=body.subject,
            sender=body.sender,
            body=body.body,
            html_body=body.html_body,
            extracted_links=body.extracted_links,
            raw_headers=body.raw_headers,
            db=db,
        )
        return result
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Gmail Add-on scan error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while analyzing the Gmail message.",
        )


# ── 6. SocialShield AI ────────────────────────────────────────────────────────

@router.post(
    "/scan/social",
    response_model=SocialScanResponse,
    summary="Evaluate social profile handles and impersonation indicators",
)
async def scan_social(
    body: SocialScanRequest,
    db: Session = Depends(get_db),
):
    """
    Assess social profile handle for visual homoglyphs, deceptive corporate keywords,
    and bot patterns across Instagram, WhatsApp, Facebook, X, YouTube, and Snapchat.
    """
    try:
        result = analyze_social_profile(
            platform=body.platform,
            identifier=body.identifier,
            profile_details=body.profile_details,
            db=db,
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Social scan error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred while analyzing the social profile.",
        )


# ── 7. Scan History Endpoints ─────────────────────────────────────────────────

@router.get(
    "/history",
    response_model=HistoryListResponse,
    summary="List recent scan records with filtering and pagination",
)
async def get_scan_history(
    scanner_type: Optional[str] = Query(None, description="Filter by scanner (url, file, qr, phone, email, social)"),
    risk_category: Optional[str] = Query(None, description="Filter by risk category (safe, suspicious, high_risk)"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """Retrieve persisted scan records from SQLite."""
    try:
        query = db.query(ScanRecordDB)
        if scanner_type:
            query = query.filter(ScanRecordDB.scanner_type == scanner_type.lower())
        if risk_category:
            query = query.filter(ScanRecordDB.risk_category == risk_category.lower())

        total = query.count()
        records = query.order_by(desc(ScanRecordDB.scanned_at)).offset(offset).limit(limit).all()

        items = [
            HistoryItem(
                id=r.id,
                scan_id=r.scan_id,
                scanner_type=r.scanner_type,
                input_target=r.input_target,
                risk_score=r.risk_score,
                risk_category=r.risk_category,
                findings_count=r.findings_count,
                summary=r.summary,
                status=r.status,
                scanned_at=r.scanned_at.isoformat() if r.scanned_at else "",
            )
            for r in records
        ]
        return HistoryListResponse(total_count=total, items=items)
    except Exception as e:
        logger.error(f"History fetch error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve scan history.")


@router.get(
    "/history/{scan_id}",
    summary="Get full individual scan report from persistent storage",
)
async def get_scan_detail(
    scan_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve detailed scan record including findings and recommendations."""
    record = db.query(ScanRecordDB).filter(ScanRecordDB.scan_id == scan_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Scan record not found.")
    return record.to_dict()


@router.delete(
    "/history/{scan_id}",
    summary="Delete a scan record from history",
)
async def delete_scan_record(
    scan_id: str,
    db: Session = Depends(get_db),
):
    """Remove a scan record from persistent storage."""
    record = db.query(ScanRecordDB).filter(ScanRecordDB.scan_id == scan_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Scan record not found.")
    db.delete(record)
    db.commit()
    return {"status": "deleted", "scan_id": scan_id}


# ── 8. Real Dashboard Aggregated Telemetry ────────────────────────────────────

@router.get(
    "/dashboard/stats",
    response_model=DashboardStatsResponse,
    summary="Get aggregated security telemetry computed from persistent storage",
)
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Returns authentic aggregated metrics calculated from actual scan records.
    Provides fallback baseline if database is newly initialized.
    """
    try:
        total = db.query(ScanRecordDB).count()
        high_risk = db.query(ScanRecordDB).filter(ScanRecordDB.risk_category == "high_risk").count()
        suspicious = db.query(ScanRecordDB).filter(ScanRecordDB.risk_category == "suspicious").count()
        safe = db.query(ScanRecordDB).filter(ScanRecordDB.risk_category == "safe").count()
        avg_score_row = db.query(func.avg(ScanRecordDB.risk_score)).scalar()
        avg_score = round(float(avg_score_row), 1) if avg_score_row else 0.0

        # Breakdown by scanner type
        types = ["url", "file", "qr", "phone", "email", "social"]
        breakdown = {}
        for t in types:
            breakdown[t] = db.query(ScanRecordDB).filter(ScanRecordDB.scanner_type == t).count()

        recent = (
            db.query(ScanRecordDB)
            .order_by(desc(ScanRecordDB.scanned_at))
            .limit(10)
            .all()
        )
        recent_items = [
            HistoryItem(
                id=r.id,
                scan_id=r.scan_id,
                scanner_type=r.scanner_type,
                input_target=r.input_target,
                risk_score=r.risk_score,
                risk_category=r.risk_category,
                findings_count=r.findings_count,
                summary=r.summary,
                status=r.status,
                scanned_at=r.scanned_at.isoformat() if r.scanned_at else "",
            )
            for r in recent
        ]

        # Aggregate authentic top threat indicators from persisted findings
        finding_records = (
            db.query(ScanRecordDB)
            .filter(ScanRecordDB.findings_count > 0)
            .order_by(desc(ScanRecordDB.scanned_at))
            .limit(250)
            .all()
        )
        indicator_counts = {}
        indicator_severities = {}
        for fr in finding_records:
            if fr.findings_json:
                try:
                    f_list = json.loads(fr.findings_json)
                    for f in f_list:
                        if f.get("triggered"):
                            title = f.get("title", "").strip()
                            if title:
                                indicator_counts[title] = indicator_counts.get(title, 0) + 1
                                if title not in indicator_severities:
                                    indicator_severities[title] = f.get("severity", "medium")
                except Exception:
                    pass

        sorted_indicators = sorted(indicator_counts.items(), key=lambda x: -x[1])[:6]
        top_indicators = [
            ThreatIndicatorItem(
                id=f"ind-{idx + 1}",
                name=title,
                count=count,
                severity=indicator_severities.get(title, "medium"),
            )
            for idx, (title, count) in enumerate(sorted_indicators)
        ]

        db_online = check_db_health(db)
        db_engine = get_db_engine_display(db)

        return DashboardStatsResponse(
            total_scans=total,
            threats_detected=high_risk + suspicious,
            high_risk_count=high_risk,
            suspicious_count=suspicious,
            safe_count=safe,
            average_risk_score=avg_score,
            scanners_breakdown=breakdown,
            recent_activity=recent_items,
            top_threat_indicators=top_indicators,
            system_status={
                "engine_online": True,
                "ml_model_loaded": model_manager.is_available(),
                "database_online": db_online,
                "database_engine": db_engine,
            },
        )
    except Exception as e:
        logger.error(f"Dashboard stats error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to calculate dashboard telemetry.")


# ── 9. Health & Model Status ──────────────────────────────────────────────────

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Backend health check",
)
async def health():
    return HealthResponse(
        status="ok",
        version="1.0.0",
        ml_model_available=model_manager.is_available(),
        rule_engine_available=True,
    )


@router.get(
    "/model-status",
    response_model=ModelStatusResponse,
    summary="ML model availability and metadata",
)
async def model_status():
    available = model_manager.is_available()
    return ModelStatusResponse(
        available=available,
        model_version=model_manager.model_version if available else None,
        feature_count=model_manager.get_feature_count(),
        training_note=(
            "Random Forest trained on URL-structure features derived from "
            "PhishTank phishing URLs and Tranco legitimate URLs."
        ) if available else (
            "Model not loaded. Run train_model.py to generate the model file."
        ),
        limitations=[
            "Model trained on publicly available URL datasets with known geographic and temporal biases.",
            "Model features are URL-structure only — no page content or WHOIS data.",
            "Model confidence is the class probability from Random Forest, not a calibrated score.",
            "The model is not updated in real time and may miss new phishing patterns.",
        ],
    )
