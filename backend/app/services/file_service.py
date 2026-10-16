"""
PhishShield AI — File Scanner Engine
Analyzes uploaded file headers, magic bytes, extensions, and structural indicators.
Never executes uploaded files.
"""
import hashlib
import json
import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session

from app.schemas.scan import RiskCategory, SecurityFinding
from app.schemas.scanners import FileScanResponse
from app.db.models import ScanRecordDB

MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB

FILE_LIMITATIONS = [
    "Analysis is based on static inspection of file headers, magic signatures, hashes, and naming conventions.",
    "No runtime payload execution or dynamic sandbox detonation is performed.",
    "A clean static scan does not guarantee the file is free from zero-day exploits or encrypted payloads.",
    "Always scan unfamiliar files with an endpoint protection suite before opening.",
]

EXECUTABLE_EXTENSIONS = {
    ".exe", ".scr", ".bat", ".cmd", ".vbs", ".js", ".jse", ".hta",
    ".wsf", ".cpl", ".msi", ".dll", ".ps1", ".vbe", ".com", ".pif"
}

ARCHIVE_EXTENSIONS = {".zip", ".rar", ".7z", ".tar", ".gz", ".iso", ".img", ".cab"}
OFFICE_MACRO_EXTENSIONS = {".docm", ".xlsm", ".pptm", ".dotm", ".xltm"}


def _format_size(size_bytes: int) -> str:
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f} MB"


def analyze_file(filename: str, file_bytes: bytes, db: Optional[Session] = None) -> FileScanResponse:
    scan_id = f"SCAN-FILE-{uuid.uuid4().hex[:8].upper()}"
    scanned_at = datetime.now(timezone.utc).isoformat()
    file_size = len(file_bytes)
    if file_size == 0:
        raise ValueError("Uploaded file is empty (0 bytes). Please upload a valid file.")
    sha256 = hashlib.sha256(file_bytes).hexdigest()

    findings = []
    score = 0

    # 1. Check File Size Limit
    if file_size > MAX_FILE_SIZE:
        findings.append(SecurityFinding(
            rule_id="FILE-01",
            title="File Size Exceeds Safety Threshold",
            severity="critical",
            triggered=True,
            evidence=f"Size: {_format_size(file_size)} exceeds limit of {_format_size(MAX_FILE_SIZE)}",
            explanation="Oversized files exceed prototype inspection parameters.",
            recommendation="Inspect file using enterprise malware scanner.",
            score_contribution=40,
        ))
        score += 40

    # 2. Check Right-to-Left Override (RTLO) trick
    if "\u202e" in filename:
        findings.append(SecurityFinding(
            rule_id="FILE-02",
            title="Right-to-Left Override (RTLO) Character Detected",
            severity="critical",
            triggered=True,
            evidence="Unicode RTLO (U+202E) detected in file name",
            explanation="Attackers use the RTLO character to disguise dangerous file extensions (e.g. making .exe look like .pdf).",
            recommendation="Do not open this file under any circumstances.",
            score_contribution=65,
        ))
        score += 65

    # 3. Check Double Extension (e.g. invoice.pdf.exe)
    parts = filename.lower().split(".")
    ext = f".{parts[-1]}" if len(parts) > 1 else ""
    if len(parts) > 2:
        inner_ext = f".{parts[-2]}"
        if inner_ext in {".pdf", ".docx", ".xlsx", ".txt", ".jpg", ".png"} and ext in EXECUTABLE_EXTENSIONS:
            findings.append(SecurityFinding(
                rule_id="FILE-03",
                title="Double Extension Deception Detected",
                severity="critical",
                triggered=True,
                evidence=f"File ends with decoy extension '{inner_ext}' followed by executable extension '{ext}'",
                explanation="Malware authors use double extensions to trick operating systems with hidden file extensions.",
                recommendation="Treat file as high-risk executable payload.",
                score_contribution=60,
            ))
            score += 60

    # 4. Check Direct Executable or Script Extension
    if ext in EXECUTABLE_EXTENSIONS:
        findings.append(SecurityFinding(
            rule_id="FILE-04",
            title="High-Risk Executable / Script Format",
            severity="high",
            triggered=True,
            evidence=f"File extension: {ext}",
            explanation=f"Files with extension {ext} can execute arbitrary code on your system.",
            recommendation="Verify origin directly before running.",
            score_contribution=45,
        ))
        score += 45

    # 5. Check Office Macro Enabled Format
    if ext in OFFICE_MACRO_EXTENSIONS:
        findings.append(SecurityFinding(
            rule_id="FILE-05",
            title="Macro-Enabled Document Format",
            severity="medium",
            triggered=True,
            evidence=f"Document format {ext} supports embedded VBA macro execution",
            explanation="Macro-enabled documents are a primary attack vector for credential harvest and initial access.",
            recommendation="Disable macros unless document source is verified.",
            score_contribution=30,
        ))
        score += 30

    # 6. Magic Bytes & Signature Inspection
    magic_sig = "Unknown / Plain Binary"
    detected_mime = "application/octet-stream"

    if file_bytes.startswith(b"MZ"):
        magic_sig = "DOS / Windows Portable Executable (MZ header)"
        detected_mime = "application/x-dosexec"
        if ext not in {".exe", ".dll", ".sys", ".scr"}:
            findings.append(SecurityFinding(
                rule_id="FILE-06",
                title="MIME / Magic Byte Mismatch (Hidden Windows Executable)",
                severity="critical",
                triggered=True,
                evidence=f"Extension is '{ext}', but file header is MZ Windows executable",
                explanation="The file is masquerading as a non-executable while containing binary PE code.",
                recommendation="Quarantine file immediately.",
                score_contribution=70,
            ))
            score += 70
        else:
            findings.append(SecurityFinding(
                rule_id="FILE-07",
                title="Windows PE Binary Signature Verified",
                severity="medium",
                triggered=True,
                evidence="Standard MZ executable header present",
                explanation="Binary executable detected.",
                recommendation="Scan with local antivirus software.",
                score_contribution=25,
            ))
            score += 25
    elif file_bytes.startswith(b"%PDF-"):
        magic_sig = "Adobe Portable Document Format (PDF)"
        detected_mime = "application/pdf"
        # Check for suspicious embedded streams
        raw_head = file_bytes[:10000]
        if b"/JavaScript" in raw_head or b"/JS" in raw_head or b"/Launch" in raw_head:
            findings.append(SecurityFinding(
                rule_id="FILE-08",
                title="Embedded PDF JavaScript / Launch Action Detected",
                severity="high",
                triggered=True,
                evidence="PDF dictionary contains embedded /JavaScript or /Launch action",
                explanation="Embedded JavaScript in PDFs can trigger automated exploits or external link redirects.",
                recommendation="Open document only in sandboxed PDF reader.",
                score_contribution=40,
            ))
            score += 40
    elif file_bytes.startswith(b"PK\x03\x04"):
        magic_sig = "PKZIP Archive / OpenXML Package"
        detected_mime = "application/zip"
    elif file_bytes.startswith(b"\x7fELF"):
        magic_sig = "Linux ELF Executable"
        detected_mime = "application/x-elf"
        score += 35
    elif file_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        magic_sig = "PNG Image"
        detected_mime = "image/png"
    elif file_bytes.startswith(b"\xff\xd8\xff"):
        magic_sig = "JPEG Image"
        detected_mime = "image/jpeg"

    # Check for script keywords in first 4KB of text
    try:
        sample_text = file_bytes[:4096].decode("utf-8", errors="ignore").lower()
        if any(term in sample_text for term in ["powershell -enc", "wscript.shell", "cmd.exe /c", "eval(base64"]):
            findings.append(SecurityFinding(
                rule_id="FILE-09",
                title="Suspicious Obfuscated Shell Command Detected",
                severity="high",
                triggered=True,
                evidence="Detected powershell / shell invocation strings in file header",
                explanation="Shell script execution strings indicate an evasion or download wrapper.",
                recommendation="Do not execute this script.",
                score_contribution=50,
            ))
            score += 50
    except Exception:
        pass

    final_score = min(100, score)
    if final_score < 30:
        category = RiskCategory.SAFE
    elif final_score < 65:
        category = RiskCategory.SUSPICIOUS
    else:
        category = RiskCategory.HIGH_RISK

    triggered_findings = [f for f in findings if f.triggered]

    reasons = []
    for f in triggered_findings:
        reasons.append(f"{f.title}: {f.explanation}")
    if not reasons:
        reasons.append("Static file header, signature, and extension checks revealed no overt malicious indicators.")

    recommendations = []
    if category == RiskCategory.HIGH_RISK:
        recommendations = [
            "Do not open or execute this file.",
            "Delete or quarantine this file from your machine.",
            "Report the file to your security administrator.",
        ]
    elif category == RiskCategory.SUSPICIOUS:
        recommendations = [
            "Verify the source of this file through an independent channel.",
            "Scan the file with updated antivirus software before opening.",
            "Open in a secure, isolated sandbox environment.",
        ]
    else:
        recommendations = [
            "No static threat signatures were triggered.",
            "Ensure standard endpoint security protection is active.",
            "Verify file origin before granting administrative permissions.",
        ]

    # Save to database if session provided
    if db:
        try:
            record = ScanRecordDB(
                scan_id=scan_id,
                scanner_type="file",
                input_target=f"{filename} ({_format_size(file_size)})",
                risk_score=final_score,
                risk_category=category.value,
                findings_count=len(triggered_findings),
                summary=reasons[0] if reasons else "File static scan completed.",
                findings_json=json.dumps([f.model_dump() for f in findings]),
                reasons_json=json.dumps(reasons),
                recommended_actions_json=json.dumps(recommendations),
                status="flagged" if category != RiskCategory.SAFE else "completed",
            )
            db.add(record)
            db.commit()
        except Exception:
            db.rollback()

    return FileScanResponse(
        scan_id=scan_id,
        filename=filename,
        file_size_bytes=file_size,
        file_size_formatted=_format_size(file_size),
        sha256_hash=sha256,
        detected_mime=detected_mime,
        file_signature=magic_sig,
        risk_score=final_score,
        risk_category=category,
        findings=findings,
        triggered_findings=triggered_findings,
        reasons=reasons,
        recommended_actions=recommendations,
        scanned_at=scanned_at,
        analysis_method="Static Inspection: Header Magic Bytes + Signature Validation + Extension Analysis",
        limitations=FILE_LIMITATIONS,
    )
