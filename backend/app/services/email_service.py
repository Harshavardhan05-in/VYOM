"""
PhishShield AI — Email & Message Phishing Scanner Engine
Analyzes message text, urgency cues, credential theft keywords,
sender domain spoofing, and extracts & scans embedded links.
"""
import re
import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas.scan import RiskCategory, SecurityFinding
from app.schemas.scanners import EmailScanResponse
from app.services.scan_service import run_scan
from app.db.models import ScanRecordDB

logger = logging.getLogger("phishshield.email")

EMAIL_LIMITATIONS = [
    "Text heuristics and keyword triggers evaluate psychological coercion and phishing patterns.",
    "Raw header inspection checks text tokens only; it does not perform live DNS/DKIM cryptographic key verification.",
    "Never click links or open attachments in unsolicited messages requesting password resets or wire transfers.",
    "Legitimate organizations will not threaten account termination within hours via unsolicited emails.",
]

URGENCY_PHRASES = [
    ("immediate action required", 35, "Immediate Action Coercion"),
    ("account suspended", 40, "Account Suspension Threat"),
    ("unauthorized login detected", 35, "Fake Security Alert"),
    ("within 24 hours", 30, "Artificial Time Limit"),
    ("within 12 hours", 35, "Artificial Urgency Deadline"),
    ("your account will be terminated", 45, "Termination Coercion"),
    ("verify your identity immediately", 35, "Identity Verification Coercion"),
    ("password expiration", 30, "Fake Password Expiry"),
    ("failed delivery attempt", 25, "Package Delivery Lure"),
    ("invoice overdue", 25, "Urgent Financial Lure"),
]

CREDENTIAL_HARVEST_PHRASES = [
    ("enter your password", 45, "Direct Password Solicitation"),
    ("confirm your pin", 45, "Direct PIN Solicitation"),
    ("provide your social security", 50, "SSN / PII Solicitation"),
    ("update your credit card", 45, "Payment Card Harvesting"),
    ("share your one-time code", 50, "2FA/OTP Interception Attempt"),
    ("log in to restore access", 35, "Restoration Credential Trap"),
    ("click here to verify", 30, "Generic Call-to-Action Link Lure"),
]


def analyze_email_message(
    body: str,
    subject: Optional[str] = "",
    sender: Optional[str] = "",
    raw_headers: Optional[str] = None,
    db: Optional[Session] = None,
) -> EmailScanResponse:
    scan_id = f"SCAN-MSG-{uuid.uuid4().hex[:8].upper()}"
    scanned_at = datetime.now(timezone.utc).isoformat()

    full_text = f"{subject or ''}\n{body}".lower()
    findings = []
    detected_vectors = []
    score = 0

    # 1. Analyze Urgency and Coercive Phrases
    for phrase, pts, title in URGENCY_PHRASES:
        if phrase in full_text:
            findings.append(SecurityFinding(
                rule_id=f"MSG-URG-{title[:6].upper().replace(' ', '')}",
                title=title,
                severity="high" if pts >= 35 else "medium",
                triggered=True,
                evidence=f"Detected trigger phrase: '{phrase}'",
                explanation="Phishing emails exploit urgency and panic to coerce victims into bypassing critical verification.",
                recommendation="Do not act under artificial time pressure.",
                score_contribution=pts,
            ))
            detected_vectors.append("Artificial Urgency / Coercion")
            score += pts
            break  # Cap urgency stacking

    # 2. Analyze Credential Harvesting Cues
    for phrase, pts, title in CREDENTIAL_HARVEST_PHRASES:
        if phrase in full_text:
            findings.append(SecurityFinding(
                rule_id=f"MSG-CRD-{title[:6].upper().replace(' ', '')}",
                title=title,
                severity="critical" if pts >= 45 else "high",
                triggered=True,
                evidence=f"Detected credential harvesting language: '{phrase}'",
                explanation="Legitimate institutions do not solicit passwords, PINs, or one-time codes via email or message.",
                recommendation="Never supply credentials or OTPs in response to unsolicited requests.",
                score_contribution=pts,
            ))
            detected_vectors.append("Credential Solicitation")
            score += pts
            break

    # 3. Analyze Sender Address & Domain Discrepancies
    sender_clean = (sender or "").strip().lower()
    if sender_clean:
        # Check mismatched display name vs domain (e.g. "PayPal Support <info@random-server.xyz>")
        match = re.search(r"^(.*?)\s*<([^>]+)>$", sender_clean)
        display_name = ""
        email_addr = sender_clean
        if match:
            display_name = match.group(1).strip()
            email_addr = match.group(2).strip()

        # Check for free webmail sender claiming to be a financial institution / tech giant
        known_brands = ["paypal", "microsoft", "google", "apple", "netflix", "amazon", "chase", "bank of america"]
        for b in known_brands:
            if b in display_name or b in full_text[:200]:
                if any(free in email_addr for free in ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com"]):
                    findings.append(SecurityFinding(
                        rule_id="MSG-SND-FREE",
                        title=f"Brand Impersonation via Free Mail Provider ({b.title()})",
                        severity="critical",
                        triggered=True,
                        evidence=f"Display claims {b.title()}, but sender address uses free webmail: {email_addr}",
                        explanation="Official corporate communications are never transmitted via personal consumer email accounts.",
                        recommendation="Mark message as spam/phishing immediately.",
                        score_contribution=60,
                    ))
                    detected_vectors.append("Free Mail Impersonation")
                    score += 60
                    break

    # 4. Extract and Inspect Embedded URLs
    # Regex to find links
    url_pattern = r"https?://[^\s<>\"']+|www\.[^\s<>\"']+"
    found_urls = re.findall(url_pattern, body)
    extracted_urls: List[Dict[str, Any]] = []

    highest_url_score = 0
    for u in found_urls[:5]:  # Analyze up to 5 links
        try:
            norm_u = u if u.startswith("http") else f"http://{u}"
            url_scan = run_scan(norm_u)
            extracted_urls.append({
                "url": u,
                "risk_score": url_scan.risk_score,
                "risk_category": url_scan.risk_category.value,
                "triggered_rules": [f.title for f in url_scan.triggered_findings],
            })
            if url_scan.risk_score > highest_url_score:
                highest_url_score = url_scan.risk_score
        except Exception:
            extracted_urls.append({"url": u, "risk_score": 0, "risk_category": "unknown", "triggered_rules": []})

    if highest_url_score >= 65:
        findings.append(SecurityFinding(
            rule_id="MSG-URL-HIGH",
            title="High-Risk Embedded Phishing Link Detected",
            severity="critical",
            triggered=True,
            evidence=f"Embedded URL scored {highest_url_score}/100 in deep structural inspection",
            explanation="The message contains an embedded URL exhibiting strong phishing indicators.",
            recommendation="Do not click or preview links contained in this email.",
            score_contribution=50,
        ))
        detected_vectors.append("Malicious Embedded Links")
        score += 50
    elif highest_url_score >= 35:
        findings.append(SecurityFinding(
            rule_id="MSG-URL-SUSP",
            title="Suspicious Embedded URL Detected",
            severity="medium",
            triggered=True,
            evidence=f"Embedded URL scored {highest_url_score}/100",
            explanation="A link inside the message triggered heuristic warning flags.",
            recommendation="Verify destination before interacting.",
            score_contribution=25,
        ))
        score += 25

    # 5. Header Inspection (if raw headers supplied)
    if raw_headers:
        headers_lower = raw_headers.lower()
        if "spf=fail" in headers_lower or "spf=softfail" in headers_lower:
            findings.append(SecurityFinding(
                rule_id="MSG-HDR-SPF",
                title="SPF (Sender Policy Framework) Authentication Failure",
                severity="high",
                triggered=True,
                evidence="Header contains 'spf=fail' or 'spf=softfail'",
                explanation="The sending IP address is not authorized by the domain's published SPF policy.",
                recommendation="Treat message as potentially spoofed.",
                score_contribution=35,
            ))
            detected_vectors.append("SPF Header Failure")
            score += 35
        if "dkim=fail" in headers_lower:
            findings.append(SecurityFinding(
                rule_id="MSG-HDR-DKIM",
                title="DKIM (DomainKeys Identified Mail) Signature Failure",
                severity="high",
                triggered=True,
                evidence="Header contains 'dkim=fail'",
                explanation="The cryptographic email signature does not validate against the sender's public key.",
                recommendation="Message integrity cannot be verified.",
                score_contribution=35,
            ))
            detected_vectors.append("DKIM Signature Failure")
            score += 35

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
        reasons.append("No overt phishing coercion, credential solicitation, or high-risk links detected in message body.")

    recommendations = []
    if category == RiskCategory.HIGH_RISK:
        recommendations = [
            "Do NOT click any links or download attachments from this email.",
            "Do not reply or provide any personal, financial, or authentication details.",
            "Report this message to your email provider as phishing and mark as junk.",
        ]
    elif category == RiskCategory.SUSPICIOUS:
        recommendations = [
            "Contact the purported sender using a known, trusted phone number or email address.",
            "Inspect all embedded links manually without clicking.",
            "Never share 2FA/MFA codes with anyone.",
        ]
    else:
        recommendations = [
            "No high-confidence deception indicators triggered.",
            "Remain cautious of unexpected attachments or requests for urgent financial transfers.",
        ]

    # Save to database if session provided
    if db:
        try:
            target_str = f"Subject: {subject[:60]}" if subject else f"Message: {body[:60]}"
            findings_data = [
                f.model_dump() if hasattr(f, "model_dump") else f.dict()
                for f in findings
            ]
            record = ScanRecordDB(
                scan_id=scan_id,
                scanner_type="email",
                input_target=target_str,
                risk_score=final_score,
                risk_category=category.value,
                findings_count=len(triggered_findings),
                summary=reasons[0] if reasons else "Email scan completed.",
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
                "Failed to persist email scan record to database for scan_id=%s: %s",
                scan_id,
                exc,
                exc_info=True,
            )
            raise HTTPException(
                status_code=500,
                detail="Database persistence failed: unable to save email scan record.",
            ) from exc

    return EmailScanResponse(
        scan_id=scan_id,
        subject=subject or "No Subject",
        sender=sender or "Unknown Sender",
        body_preview=body[:150] + ("..." if len(body) > 150 else ""),
        extracted_urls=extracted_urls,
        detected_vectors=list(set(detected_vectors)),
        risk_score=final_score,
        risk_category=category,
        findings=findings,
        triggered_findings=triggered_findings,
        reasons=reasons,
        recommended_actions=recommendations,
        scanned_at=scanned_at,
        analysis_method="Heuristic NLP Threat Engine + Embedded URL Inspector + Header Verifier",
        limitations=EMAIL_LIMITATIONS,
    )
