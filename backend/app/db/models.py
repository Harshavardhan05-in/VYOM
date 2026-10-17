"""
PhishShield AI — Database Models
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Text, DateTime
from app.db.database import Base


class ScanRecordDB(Base):
    """Persistent storage for all security scan evaluations across all scanner engines."""
    __tablename__ = "scan_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scan_id = Column(String(64), unique=True, index=True, nullable=False)
    scanner_type = Column(String(20), index=True, nullable=False)  # url, file, qr, phone, email, social
    input_target = Column(String(2048), nullable=False)           # Sanitized URL, filename, phone, handle, etc.
    risk_score = Column(Integer, nullable=False, default=0)       # 0–100
    risk_category = Column(String(20), index=True, nullable=False) # safe, suspicious, high_risk
    findings_count = Column(Integer, default=0)
    summary = Column(Text, nullable=True)
    findings_json = Column(Text, nullable=True)                  # JSON list of SecurityFinding objects
    reasons_json = Column(Text, nullable=True)                   # JSON list of top reason strings
    recommended_actions_json = Column(Text, nullable=True)       # JSON list of recommendations
    ml_prediction = Column(String(50), nullable=True)            # phishing / legitimate / null
    ml_confidence = Column(Float, nullable=True)                 # 0.0–1.0
    status = Column(String(20), default="completed")             # completed, flagged, quarantined
    scanned_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "scan_id": self.scan_id,
            "scanner_type": self.scanner_type,
            "input_target": self.input_target,
            "risk_score": self.risk_score,
            "risk_category": self.risk_category,
            "findings_count": self.findings_count,
            "summary": self.summary,
            "findings": json.loads(self.findings_json) if self.findings_json else [],
            "reasons": json.loads(self.reasons_json) if self.reasons_json else [],
            "recommended_actions": json.loads(self.recommended_actions_json) if self.recommended_actions_json else [],
            "ml_prediction": self.ml_prediction,
            "ml_confidence": self.ml_confidence,
            "status": self.status,
            "scanned_at": self.scanned_at.isoformat() if self.scanned_at else datetime.utcnow().isoformat(),
        }


class SuspiciousUrlReportDB(Base):
    """Persistent storage for reported suspicious/malicious URLs."""
    __tablename__ = "url_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    report_id = Column(String(32), unique=True, index=True, nullable=False)
    url = Column(String(2048), nullable=False, index=True)
    normalized_url = Column(String(2048), nullable=False)
    scan_id = Column(String(64), nullable=True, index=True)
    risk_score = Column(Integer, nullable=True)
    risk_category = Column(String(20), nullable=True)
    user_explanation = Column(Text, nullable=True)
    evidence_json = Column(Text, nullable=True)
    status = Column(String(30), default="pending_review", index=True)
    forward_status = Column(String(30), default="local_only")
    external_department = Column(String(100), nullable=True)
    reported_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "report_id": self.report_id,
            "url": self.url,
            "normalized_url": self.normalized_url,
            "scan_id": self.scan_id,
            "risk_score": self.risk_score,
            "risk_category": self.risk_category,
            "user_explanation": self.user_explanation,
            "evidence": json.loads(self.evidence_json) if self.evidence_json else [],
            "status": self.status,
            "forward_status": self.forward_status,
            "external_department": self.external_department,
            "reported_at": self.reported_at.isoformat() if self.reported_at else datetime.now(timezone.utc).isoformat(),
        }

