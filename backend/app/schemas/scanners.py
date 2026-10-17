"""
PhishShield AI — Multi-Vector Scanner Pydantic Schemas
"""
from pydantic import BaseModel, field_validator
from typing import Optional, List, Dict, Any
from enum import Enum
from app.schemas.scan import RiskCategory, SecurityFinding


class ScannerType(str, Enum):
    URL = "url"
    FILE = "file"
    QR = "qr"
    PHONE = "phone"
    EMAIL = "email"
    SOCIAL = "social"


# ── File Scanner Schemas ───────────────────────────────────────────────────────

class FileScanResponse(BaseModel):
    scan_id: str
    filename: str
    file_size_bytes: int
    file_size_formatted: str
    sha256_hash: str
    detected_mime: str
    file_signature: str
    risk_score: int                        # 0–100
    risk_category: RiskCategory
    findings: List[SecurityFinding]
    triggered_findings: List[SecurityFinding]
    reasons: List[str]
    recommended_actions: List[str]
    scanned_at: str
    analysis_method: str
    limitations: List[str]


# ── QR Scanner Schemas ────────────────────────────────────────────────────────

class QRScanResponse(BaseModel):
    scan_id: str
    filename: Optional[str] = "Uploaded QR Code"
    decoded_text: str
    is_url: bool
    url_target: Optional[str] = None
    risk_score: int                        # 0–100
    risk_category: RiskCategory
    findings: List[SecurityFinding]
    triggered_findings: List[SecurityFinding]
    reasons: List[str]
    recommended_actions: List[str]
    scanned_at: str
    analysis_method: str
    limitations: List[str]


# ── Phone Checker Schemas ─────────────────────────────────────────────────────

class PhoneScanRequest(BaseModel):
    phone_number: str
    country_code: Optional[str] = None

    @field_validator("phone_number")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Phone number cannot be empty.")
        if len(v) > 32:
            raise ValueError("Phone number exceeds maximum length of 32 characters.")
        return v


class PhoneScanResponse(BaseModel):
    scan_id: str
    raw_input: str
    normalized_number: str
    is_valid_format: bool
    detected_country: Optional[str] = None
    country_calling_code: Optional[str] = None
    line_type: Optional[str] = None        # Mobile, VoIP, Toll-Free, Premium, Fixed, Unknown
    reputation_status: str                 # Neutral, Suspicious, High Risk, Unknown
    risk_score: int                        # 0–100
    risk_category: RiskCategory
    findings: List[SecurityFinding]
    triggered_findings: List[SecurityFinding]
    reasons: List[str]
    recommended_actions: List[str]
    scanned_at: str
    analysis_method: str
    limitations: List[str]


# ── Email & Message Scanner Schemas ───────────────────────────────────────────

class EmailScanRequest(BaseModel):
    subject: Optional[str] = ""
    sender: Optional[str] = ""
    body: str
    raw_headers: Optional[str] = None

    @field_validator("body")
    @classmethod
    def validate_body(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Message body or email content cannot be empty.")
        if len(v) > 65536:
            raise ValueError("Message body exceeds maximum size of 64 KB.")
        return v


class EmailScanResponse(BaseModel):
    scan_id: str
    subject: str
    sender: str
    body_preview: str
    extracted_urls: List[Dict[str, Any]]
    detected_vectors: List[str]
    risk_score: int                        # 0–100
    risk_category: RiskCategory
    findings: List[SecurityFinding]
    triggered_findings: List[SecurityFinding]
    reasons: List[str]
    recommended_actions: List[str]
    scanned_at: str
    analysis_method: str
    limitations: List[str]


# ── SocialShield AI Schemas ───────────────────────────────────────────────────

class SocialScanRequest(BaseModel):
    platform: str                          # instagram, whatsapp, facebook, x, youtube, snapchat
    identifier: str                        # Username, handle, phone number, or URL
    profile_details: Optional[str] = None

    @field_validator("identifier")
    @classmethod
    def validate_id(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Profile identifier or URL cannot be empty.")
        return v


class SocialScanResponse(BaseModel):
    scan_id: str
    platform: str
    identifier: str
    account_type_assessed: str
    risk_score: int                        # 0–100
    risk_category: RiskCategory
    findings: List[SecurityFinding]
    triggered_findings: List[SecurityFinding]
    impersonation_indicators: List[str]
    reasons: List[str]
    recommended_actions: List[str]
    scanned_at: str
    analysis_method: str
    limitations: List[str]


# ── History & Dashboard Schemas ───────────────────────────────────────────────

class HistoryItem(BaseModel):
    id: str
    scan_id: str
    scanner_type: str
    input_target: str
    risk_score: int
    risk_category: str
    findings_count: int
    summary: Optional[str] = None
    status: str
    scanned_at: str


class HistoryListResponse(BaseModel):
    total_count: int
    items: List[HistoryItem]


class ThreatIndicatorItem(BaseModel):
    id: str
    name: str
    count: int
    severity: str = "medium"


class DashboardStatsResponse(BaseModel):
    total_scans: int
    threats_detected: int
    high_risk_count: int
    suspicious_count: int
    safe_count: int
    average_risk_score: float
    scanners_breakdown: Dict[str, int]
    recent_activity: List[HistoryItem]
    top_threat_indicators: List[ThreatIndicatorItem] = []
    system_status: Dict[str, Any]


# ── Gmail Add-on Protection Schemas ──────────────────────────────────────────

class GmailScanRequest(BaseModel):
    subject: Optional[str] = ""
    sender: Optional[str] = ""
    body: Optional[str] = ""
    html_body: Optional[str] = None
    extracted_links: Optional[List[str]] = None
    raw_headers: Optional[str] = None
    message_id: Optional[str] = None
    thread_id: Optional[str] = None

    @field_validator("body")
    @classmethod
    def validate_body(cls, v: Optional[str]) -> str:
        return (v or "").strip()

    @field_validator("html_body")
    @classmethod
    def validate_html(cls, v: Optional[str]) -> Optional[str]:
        if v and len(v) > 262144:
            raise ValueError("Email HTML exceeds maximum safety size limit of 256 KB.")
        return v


class GmailScanResponse(BaseModel):
    scan_id: str
    subject: str
    sender: str
    body_preview: str
    extracted_urls: List[Dict[str, Any]]
    detected_vectors: List[str]
    risk_score: int                        # 0–100
    risk_category: RiskCategory
    summary: str
    findings: List[SecurityFinding]
    triggered_findings: List[SecurityFinding]
    reasons: List[str]
    recommended_actions: List[str]
    web_report_url: str
    scanned_at: str
    analysis_method: str
    limitations: List[str]


