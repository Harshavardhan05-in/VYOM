"""
PhishShield AI — Suspicious URL Reporting Service
Handles report normalization, duplicate suppression, SQLite persistence,
and optional forwarding to configured cybersecurity reporting endpoints.
"""
import uuid
import json
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Tuple
from urllib.parse import urlparse, urlunparse
import urllib.request
import urllib.error
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.config import settings
from app.db.models import SuspiciousUrlReportDB
from app.schemas.report import (
    SuspiciousUrlReportRequest,
    SuspiciousUrlReportResponse,
    ReportListResponse,
    ReportItem,
)

logger = logging.getLogger("phishshield.report")


def normalize_reporting_url(raw_url: str) -> str:
    """Normalize URL by lowercasing scheme and netloc while preserving path/query."""
    parsed = urlparse(raw_url.strip())
    scheme = parsed.scheme.lower() or "http"
    netloc = parsed.netloc.lower()
    path = parsed.path or "/"
    return urlunparse((scheme, netloc, path, parsed.params, parsed.query, parsed.fragment))


def forward_to_external_department(
    report_id: str,
    url: str,
    risk_score: Optional[int],
    risk_category: Optional[str],
    user_explanation: Optional[str],
    evidence: Optional[List[str]],
) -> Tuple[bool, str]:
    """
    If REPORTING_ENDPOINT_URL is configured in settings, forward report payload.
    Otherwise returns False and 'local_only'.
    Never invents or fabricates external delivery.
    """
    endpoint = settings.reporting_endpoint_url
    if not endpoint or not endpoint.strip():
        return False, "local_only"

    payload = {
        "report_id": report_id,
        "indicator_type": "url",
        "indicator_value": url,
        "risk_score": risk_score,
        "risk_category": risk_category,
        "user_explanation": user_explanation,
        "evidence": evidence or [],
        "source": "PhishShield AI Threat Protection",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    try:
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            endpoint.strip(),
            data=data,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "PhishShield-AI-Reporter/1.0",
                **({"Authorization": f"Bearer {settings.reporting_api_key.strip()}"} if settings.reporting_api_key else {}),
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            if 200 <= response.status < 300:
                logger.info(f"Report {report_id} forwarded to external endpoint successfully: HTTP {response.status}")
                return True, "forwarded"
            else:
                logger.warning(f"External department returned HTTP {response.status} for report {report_id}")
                return False, "forward_failed"
    except Exception as e:
        logger.error(f"Failed to forward report {report_id} to external endpoint: {e}")
        return False, "forward_failed"


def submit_suspicious_url_report(
    req: SuspiciousUrlReportRequest,
    db: Session,
) -> SuspiciousUrlReportResponse:
    """
    Process, validate, de-duplicate, and persist a suspicious URL report.
    """
    normalized = normalize_reporting_url(req.url)
    reported_at = datetime.now(timezone.utc)

    # 1. Duplicate check: Look for identical URL reported within last 5 minutes
    five_min_ago = reported_at - timedelta(minutes=5)
    existing = (
        db.query(SuspiciousUrlReportDB)
        .filter(
            SuspiciousUrlReportDB.normalized_url == normalized,
            SuspiciousUrlReportDB.reported_at >= five_min_ago,
        )
        .first()
    )

    if existing:
        logger.info(f"Duplicate report detected for {normalized} (existing report ID: {existing.report_id})")
        return SuspiciousUrlReportResponse(
            report_id=existing.report_id,
            url=existing.url,
            status=existing.status,
            message=(
                f"This URL was already reported recently (Report ID: {existing.report_id}) "
                "and is currently queued in the analysis pipeline."
            ),
            forwarded_to_external=existing.forward_status == "forwarded",
            external_department_name=existing.external_department,
            reported_at=existing.reported_at.isoformat() if existing.reported_at else reported_at.isoformat(),
            is_duplicate=True,
        )

    # 2. Generate unique report identifier
    unique_suffix = uuid.uuid4().hex[:8].upper()
    report_id = f"REP-URL-{unique_suffix}"

    # 3. Optional external forwarding
    forwarded, forward_status = forward_to_external_department(
        report_id=report_id,
        url=normalized,
        risk_score=req.risk_score,
        risk_category=req.risk_category,
        user_explanation=req.user_explanation,
        evidence=req.evidence,
    )

    dept_name = settings.reporting_department_name if forwarded else None

    if forwarded:
        message = f"Report submitted successfully to the configured department ({dept_name or 'External Authority'})."
    else:
        message = (
            "Report saved securely in local quarantine vault for analyst review. "
            "Note: Stored locally only (no external department endpoint configured)."
        )

    # 4. Save to SQLite database
    record = SuspiciousUrlReportDB(
        report_id=report_id,
        url=req.url.strip(),
        normalized_url=normalized,
        scan_id=req.scan_id.strip() if req.scan_id else None,
        risk_score=req.risk_score,
        risk_category=req.risk_category,
        user_explanation=req.user_explanation,
        evidence_json=json.dumps(req.evidence) if req.evidence else None,
        status="pending_review",
        forward_status=forward_status,
        external_department=dept_name,
        reported_at=reported_at,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    logger.info(f"Suspicious URL report created: {report_id} for target {normalized} [status: {forward_status}]")

    return SuspiciousUrlReportResponse(
        report_id=report_id,
        url=req.url.strip(),
        status=record.status,
        message=message,
        forwarded_to_external=forwarded,
        external_department_name=dept_name,
        reported_at=reported_at.isoformat(),
        is_duplicate=False,
    )


def list_submitted_reports(
    db: Session,
    limit: int = 50,
    offset: int = 0,
) -> ReportListResponse:
    """List persisted suspicious URL reports with pagination."""
    query = db.query(SuspiciousUrlReportDB)
    total = query.count()
    records = (
        query.order_by(desc(SuspiciousUrlReportDB.reported_at))
        .offset(offset)
        .limit(limit)
        .all()
    )

    items = [
        ReportItem(
            id=r.id,
            report_id=r.report_id,
            url=r.url,
            normalized_url=r.normalized_url,
            scan_id=r.scan_id,
            risk_score=r.risk_score,
            risk_category=r.risk_category,
            user_explanation=r.user_explanation,
            status=r.status,
            forward_status=r.forward_status,
            external_department=r.external_department,
            reported_at=r.reported_at.isoformat() if r.reported_at else "",
        )
        for r in records
    ]

    return ReportListResponse(total=total, reports=items)
