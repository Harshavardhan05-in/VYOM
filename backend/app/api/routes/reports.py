"""
PhishShield AI — Suspicious URL Reporting API Endpoints
"""
import logging
from fastapi import APIRouter, HTTPException, Depends, Query, Request
from sqlalchemy.orm import Session

from app.schemas.report import (
    SuspiciousUrlReportRequest,
    SuspiciousUrlReportResponse,
    ReportListResponse,
)
from app.services.report_service import (
    submit_suspicious_url_report,
    list_submitted_reports,
)
from app.db.database import get_db

logger = logging.getLogger("phishshield.reports")
router = APIRouter(tags=["reports"])


@router.post(
    "/reports",
    response_model=SuspiciousUrlReportResponse,
    summary="Submit a suspicious or malicious URL report",
)
async def create_report(
    body: SuspiciousUrlReportRequest,
    db: Session = Depends(get_db),
):
    """
    Submit a suspicious or malicious URL to the security reporting pipeline.
    Validates URL, checks for duplicates, saves to SQLite quarantine vault,
    and forwards to configured cybersecurity endpoint if available.
    """
    try:
        result = submit_suspicious_url_report(req=body, db=db)
        return result
    except Exception as e:
        logger.error(f"Error submitting report for {body.url!r}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing the suspicious URL report.",
        )


@router.get(
    "/reports",
    response_model=ReportListResponse,
    summary="List submitted suspicious URL reports",
)
async def get_reports(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """Retrieve list of submitted threat reports from persistent SQLite storage."""
    try:
        return list_submitted_reports(db=db, limit=limit, offset=offset)
    except Exception as e:
        logger.error(f"Error listing reports: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred while retrieving submitted reports.",
        )
