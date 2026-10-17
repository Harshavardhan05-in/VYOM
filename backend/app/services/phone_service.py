"""
PhishShield AI — Phone Number & Fraud Checker Engine
Validates ITU-T E.164 compliance, country allocation, numbering plans,
and detects premium-rate / Wangiri callback scam indicators.
"""
import re
import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas.scan import RiskCategory, SecurityFinding
from app.schemas.scanners import PhoneScanResponse
from app.db.models import ScanRecordDB

logger = logging.getLogger("phishshield.phone")

PHONE_LIMITATIONS = [
    "Format and numbering plan validation confirms whether a number adheres to telecommunication standards.",
    "A valid phone format does NOT prove the caller is trustworthy or legitimate.",
    "Caller ID spoofing allows malicious actors to display arbitrary numbers on recipient screens.",
    "Do not return unprompted missed calls from unfamiliar international numbers (Wangiri fraud risk).",
]

# Major Country Calling Codes dictionary: code -> (Country Name, Min Digits, Max Digits)
COUNTRY_CALLING_CODES = {
    "1": ("United States / Canada / Caribbean (NANP)", 10, 10),
    "44": ("United Kingdom", 9, 10),
    "91": ("India", 10, 10),
    "61": ("Australia", 9, 9),
    "49": ("Germany", 10, 11),
    "33": ("France", 9, 9),
    "81": ("Japan", 9, 10),
    "86": ("China", 11, 11),
    "65": ("Singapore", 8, 8),
    "971": ("United Arab Emirates", 9, 9),
    "234": ("Nigeria", 10, 10),
    "254": ("Kenya", 9, 9),
    "7": ("Russia / Kazakhstan", 10, 10),
    "880": ("Bangladesh", 10, 10),
    "92": ("Pakistan", 10, 10),
    "55": ("Brazil", 10, 11),
    "52": ("Mexico", 10, 10),
    "27": ("South Africa", 9, 9),
    "82": ("South Korea", 9, 10),
}

# Known High-Risk Premium / Scam Prefixes (e.g. 1-900 in US, 090 in UK, 190 in Australia, satellite codes)
WANGIRI_SUSPICIOUS_COUNTRY_CODES = {
    "881": "Global Mobile Satellite System",
    "882": "International Networks",
    "232": "Sierra Leone",
    "247": "Ascension Island",
    "269": "Comoros",
    "688": "Tuvalu",
    "674": "Nauru",
    "236": "Central African Republic",
}


def analyze_phone_number(raw_number: str, country_code: Optional[str] = None, db: Optional[Session] = None) -> PhoneScanResponse:
    scan_id = f"SCAN-PHN-{uuid.uuid4().hex[:8].upper()}"
    scanned_at = datetime.now(timezone.utc).isoformat()

    # Clean input
    cleaned = raw_number.strip()
    # Normalize digits
    digits_only = re.sub(r"[^\d]", "", cleaned)
    has_plus = cleaned.startswith("+")

    findings = []
    score = 0
    is_valid_format = False
    detected_country = "International / Unknown"
    calling_code = None
    line_type = "Standard Telephony"
    reputation = "Neutral"

    # 1. Check ITU-T E.164 Global Length Rules (min 7 digits, max 15 digits)
    if len(digits_only) < 7:
        findings.append(SecurityFinding(
            rule_id="PHN-01",
            title="Incomplete Phone Number (Too Short)",
            severity="high",
            triggered=True,
            evidence=f"Length: {len(digits_only)} digits (minimum is 7)",
            explanation="The provided string has too few digits to represent a valid routable E.164 telephone number.",
            recommendation="Include the complete telephone number including regional prefix.",
            score_contribution=40,
        ))
        score += 40
    elif len(digits_only) > 15:
        findings.append(SecurityFinding(
            rule_id="PHN-02",
            title="Invalid Phone Number (Exceeds ITU 15-Digit Limit)",
            severity="medium",
            triggered=True,
            evidence=f"Length: {len(digits_only)} digits (ITU-T limit is 15)",
            explanation="E.164 international numbering standards limit phone numbers to a maximum of 15 digits.",
            recommendation="Verify the number was entered without extra punctuation or extensions.",
            score_contribution=30,
        ))
        score += 30
    else:
        is_valid_format = True

    # 2. Identify Country Calling Code
    normalized_with_code = digits_only
    if country_code and country_code.startswith("+"):
        prefix = country_code.replace("+", "").strip()
        if not digits_only.startswith(prefix):
            normalized_with_code = prefix + digits_only

    for cc, (cname, min_n, max_n) in sorted(COUNTRY_CALLING_CODES.items(), key=lambda x: -len(x[0])):
        if normalized_with_code.startswith(cc):
            calling_code = f"+{cc}"
            detected_country = cname
            national_num = normalized_with_code[len(cc):]
            if len(national_num) < min_n or len(national_num) > max_n:
                findings.append(SecurityFinding(
                    rule_id="PHN-03",
                    title="National Numbering Plan Length Discrepancy",
                    severity="low",
                    triggered=True,
                    evidence=f"Country {cname} expects {min_n}–{max_n} digits after code; found {len(national_num)}",
                    explanation="The digit count does not align with the standard numbering allocation for this jurisdiction.",
                    recommendation="Double check standard mobile/landline digit allocation.",
                    score_contribution=15,
                ))
                score += 15
            break

    # 3. Check for Known Wangiri / Satellite High-Cost Calling Codes
    for s_code, s_name in WANGIRI_SUSPICIOUS_COUNTRY_CODES.items():
        if normalized_with_code.startswith(s_code):
            calling_code = f"+{s_code}"
            detected_country = s_name
            reputation = "High Risk"
            findings.append(SecurityFinding(
                rule_id="PHN-04",
                title="High-Tariff / Potential Wangiri Callback Scam Prefix",
                severity="critical",
                triggered=True,
                evidence=f"Country/Satellite prefix: +{s_code} ({s_name})",
                explanation="Scammers use high-tariff international destinations to execute 'one-ring' missed call scams, generating exorbitant callback charges.",
                recommendation="Do not call this number back under any circumstances.",
                score_contribution=65,
            ))
            score += 65
            break

    # 4. Check Number Type Patterns (Toll-Free vs Premium-Rate vs Mobile)
    # North American Toll-free: 800, 888, 877, 866, 855, 844, 833
    if normalized_with_code.startswith("1") and len(normalized_with_code) == 11:
        npa = normalized_with_code[1:4]
        if npa in {"800", "888", "877", "866", "855", "844", "833"}:
            line_type = "Toll-Free Number (Inbound)"
            findings.append(SecurityFinding(
                rule_id="PHN-05",
                title="Toll-Free Inbound Prefix Detected",
                severity="low",
                triggered=True,
                evidence=f"NANP Toll-Free Area Code: {npa}",
                explanation="Toll-free numbers are frequently spoofed in tech support and bank imposter fraud.",
                recommendation="Verify caller identity independently before sharing account details.",
                score_contribution=20,
            ))
            score += 20
        elif npa == "900":
            line_type = "Premium-Rate (Charge Per Minute)"
            reputation = "High Risk"
            findings.append(SecurityFinding(
                rule_id="PHN-06",
                title="Premium-Rate 900 Number Detected",
                severity="high",
                triggered=True,
                evidence="NANP 900 Area Code",
                explanation="Calls to 900 area codes incur direct per-minute telephone bill charges.",
                recommendation="Do not call unless you explicitly intend to pay commercial charges.",
                score_contribution=50,
            ))
            score += 50
    # UK Premium: 09xx
    elif normalized_with_code.startswith("44") and normalized_with_code[2:4] == "09":
        line_type = "Premium-Rate (UK)"
        score += 45

    # 5. Check Repeated or Dummy Sequences (e.g. 1111111111, 1234567890)
    if re.search(r"(\d)\1{6,}", digits_only) or "12345678" in digits_only:
        findings.append(SecurityFinding(
            rule_id="PHN-07",
            title="Synthetic or Repetitive Test Digit Sequence",
            severity="medium",
            triggered=True,
            evidence="Sequence contains highly repetitive or sequential digits",
            explanation="Repetitive sequences often indicate placeholder test numbers or VoIP spoofing templates.",
            recommendation="Confirm the authenticity of the contact.",
            score_contribution=25,
        ))
        score += 25

    final_score = min(100, score)
    if final_score < 25:
        category = RiskCategory.SAFE
    elif final_score < 60:
        category = RiskCategory.SUSPICIOUS
    else:
        category = RiskCategory.HIGH_RISK

    triggered_findings = [f for f in findings if f.triggered]

    reasons = []
    for f in triggered_findings:
        reasons.append(f"{f.title}: {f.explanation}")
    if not reasons:
        reasons.append(f"Format conforms to ITU-T standards for {detected_country}. No high-tariff scam prefixes detected.")

    recommendations = []
    if category == RiskCategory.HIGH_RISK:
        recommendations = [
            "Do not return missed calls from this number.",
            "Block this contact in your phone settings to prevent further harassment.",
            "Report the number to your carrier's spam/fraud reporting service (e.g. forward to 7726).",
        ]
    elif category == RiskCategory.SUSPICIOUS:
        recommendations = [
            "Be cautious if the caller claims to represent your bank, tax authority, or tech support.",
            "Never share OTPs, PINs, or passwords over the phone.",
            "Hang up and call the organization back using their official verified telephone number.",
        ]
    else:
        recommendations = [
            "Standard telecommunications format confirmed.",
            "Remember that caller ID can be spoofed; verify unexpected financial requests independently.",
        ]

    # Save to database if session provided
    if db:
        try:
            findings_data = [
                f.model_dump() if hasattr(f, "model_dump") else f.dict()
                for f in findings
            ]
            record = ScanRecordDB(
                scan_id=scan_id,
                scanner_type="phone",
                input_target=f"Phone: +{digits_only} ({detected_country})",
                risk_score=final_score,
                risk_category=category.value,
                findings_count=len(triggered_findings),
                summary=reasons[0] if reasons else "Phone validation completed.",
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
                "Failed to persist phone scan record to database for scan_id=%s: %s",
                scan_id,
                exc,
                exc_info=True,
            )
            raise HTTPException(
                status_code=500,
                detail="Database persistence failed: unable to save phone scan record.",
            ) from exc

    return PhoneScanResponse(
        scan_id=scan_id,
        raw_input=raw_number,
        normalized_number=f"+{digits_only}" if has_plus or digits_only.startswith("1") else digits_only,
        is_valid_format=is_valid_format,
        detected_country=detected_country,
        country_calling_code=calling_code,
        line_type=line_type,
        reputation_status=reputation,
        risk_score=final_score,
        risk_category=category,
        findings=findings,
        triggered_findings=triggered_findings,
        reasons=reasons,
        recommended_actions=recommendations,
        scanned_at=scanned_at,
        analysis_method="ITU-T E.164 Format & Prefix Verification + Wangiri Heuristics",
        limitations=PHONE_LIMITATIONS,
    )
