"""
PhishShield AI — Suspicious URL Report Schemas
"""
from pydantic import BaseModel, field_validator
from typing import Optional, List
import re
from urllib.parse import urlparse


class SuspiciousUrlReportRequest(BaseModel):
    url: str
    scan_id: Optional[str] = None
    risk_score: Optional[int] = None
    risk_category: Optional[str] = None
    user_explanation: Optional[str] = None
    evidence: Optional[List[str]] = None

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("URL must not be empty.")
        if len(v) > 2048:
            raise ValueError("URL exceeds the maximum allowed length of 2048 characters.")

        # Ensure scheme is present
        if not re.match(r"^https?://", v, re.IGNORECASE):
            v = "http://" + v

        parsed = urlparse(v)
        if parsed.scheme.lower() not in ("http", "https"):
            raise ValueError("Only http:// and https:// URLs are permitted for reporting.")

        if not parsed.netloc or "." not in parsed.netloc:
            # Check for localhost / loopback IP or valid hostname
            if parsed.netloc.lower() not in ("localhost", "127.0.0.1"):
                raise ValueError("The submitted value does not appear to be a valid domain or host URL.")

        return v

    @field_validator("risk_score")
    @classmethod
    def validate_score(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and not (0 <= v <= 100):
            raise ValueError("Risk score must be between 0 and 100.")
        return v

    @field_validator("user_explanation")
    @classmethod
    def validate_explanation(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if len(v) > 1000:
                return v[:1000]
        return v


class SuspiciousUrlReportResponse(BaseModel):
    report_id: str
    url: str
    status: str
    message: str
    forwarded_to_external: bool
    external_department_name: Optional[str] = None
    reported_at: str
    is_duplicate: bool = False


class ReportItem(BaseModel):
    id: str
    report_id: str
    url: str
    normalized_url: str
    scan_id: Optional[str] = None
    risk_score: Optional[int] = None
    risk_category: Optional[str] = None
    user_explanation: Optional[str] = None
    status: str
    forward_status: str
    external_department: Optional[str] = None
    reported_at: str


class ReportListResponse(BaseModel):
    total: int
    reports: List[ReportItem]
