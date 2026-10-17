"""
PhishShield AI — SocialShield AI Impersonation & Profile Risk Engine
Evaluates social media profiles, handles, and URLs across major platforms
(Instagram, WhatsApp, Facebook, X, YouTube, Snapchat) for impersonation,
homoglyph deception, and credential harvesting lures.
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
from app.schemas.scanners import SocialScanResponse
from app.db.models import ScanRecordDB

logger = logging.getLogger("phishshield.social")

SOCIAL_LIMITATIONS = [
    "Analysis evaluates handle syntax, impersonation keywords, URL structures, and user-provided metadata.",
    "This system does not bypass platform authentication, access private accounts, or scrape protected user data.",
    "Detection of an impersonation indicator does not legally prove a profile is fraudulent.",
    "Always look for official in-platform verification badges and cross-verify with official public channels.",
]

HIGH_VALUE_BRANDS = [
    "support", "official", "helpdesk", "security", "verify", "customer",
    "binance", "coinbase", "metamask", "apple", "microsoft", "paypal",
    "meta", "instagram", "whatsapp", "twitter", "elonmusk", "vitalik"
]


def analyze_social_profile(
    platform: str,
    identifier: str,
    profile_details: Optional[str] = None,
    db: Optional[Session] = None,
) -> SocialScanResponse:
    scan_id = f"SCAN-SOC-{uuid.uuid4().hex[:8].upper()}"
    scanned_at = datetime.now(timezone.utc).isoformat()

    clean_id = identifier.strip().lower()
    platform_clean = platform.strip().lower()

    findings = []
    impersonation_indicators = []
    score = 0

    # Extract username if URL passed
    handle = clean_id
    if "/" in handle:
        handle = handle.rstrip("/").split("/")[-1].replace("@", "")
    else:
        handle = handle.replace("@", "")

    # 1. Platform Specific Syntax & Checks
    if platform_clean == "whatsapp":
        # Check if phone number is valid E.164
        digits = re.sub(r"[^\d]", "", handle)
        if len(digits) < 8:
            findings.append(SecurityFinding(
                rule_id="SOC-WA-01",
                title="Invalid WhatsApp Business / Contact Format",
                severity="medium",
                triggered=True,
                evidence=f"Identifier '{handle}' does not contain valid phone number digits",
                explanation="WhatsApp contact links must resolve to a valid international telephone number.",
                recommendation="Verify the full international country code and number.",
                score_contribution=25,
            ))
            score += 25
        else:
            findings.append(SecurityFinding(
                rule_id="SOC-WA-02",
                title="Direct WhatsApp Messaging Endpoint",
                severity="info",
                triggered=True,
                evidence=f"Direct chat target: +{digits}",
                explanation="WhatsApp operates via phone number endpoints. Unverified business accounts can be operated anonymously.",
                recommendation="Do not send cryptocurrency, gift cards, or credentials over chat.",
                score_contribution=10,
            ))
            score += 10
    else:
        # 2. Check for Impersonation Trailing Digits & Random Suffixes (e.g. elonmusk_official_9841)
        if re.search(r"[_\.](official|support|help|desk|care|agent|verify)[\d_]*$", handle):
            findings.append(SecurityFinding(
                rule_id="SOC-IMP-01",
                title="Synthetic Corporate Suffix Deception Pattern",
                severity="high",
                triggered=True,
                evidence=f"Handle '{handle}' appends institutional keywords with trailing digits",
                explanation="Scammers routinely add 'official', 'support', or 'helpdesk' suffixes to mimic legitimate brand channels.",
                recommendation="Check the brand's verified website for their authentic social handles.",
                score_contribution=45,
            ))
            impersonation_indicators.append(f"Synthetic suffix in handle: '{handle}'")
            score += 45

        # 2b. Check Direct High-Value Brand Impersonation with Scam/Lure Terms
        scam_suffixes = ["airdrop", "giveaway", "bonus", "reward", "crypto", "eth", "btc", "claim", "promo"]
        for b in HIGH_VALUE_BRANDS:
            if b in handle and handle != b:
                for term in scam_suffixes + ["official", "support", "help", "care", "agent", "verify"]:
                    if term in handle:
                        findings.append(SecurityFinding(
                            rule_id="SOC-IMP-BRAND",
                            title=f"Brand Impersonation with Lure/Affiliation Vector ({b})",
                            severity="critical",
                            triggered=True,
                            evidence=f"Handle combines recognized brand '{b}' with lure/credential keyword '{term}'",
                            explanation="Scammers combine high-profile public figures and corporate brands with reward/support promises to deceive victims.",
                            recommendation="Do not engage. Check verified official channels.",
                            score_contribution=55,
                        ))
                        impersonation_indicators.append(f"Brand impersonation: {b} + {term}")
                        score += 55
                        break
                if any(f.rule_id == "SOC-IMP-BRAND" for f in findings):
                    break

        # 3. Check Homoglyphs / Character Substitutions in Handle
        homoglyphs = [("0", "o"), ("1", "l"), ("vv", "w"), ("rn", "m")]
        for sub, orig in homoglyphs:
            if sub in handle:
                # Check if substituting yields a recognized brand
                test_handle = handle.replace(sub, orig)
                for b in HIGH_VALUE_BRANDS:
                    if b in test_handle and b not in handle:
                        findings.append(SecurityFinding(
                            rule_id="SOC-IMP-02",
                            title=f"Lookalike Homoglyph Substitution ({sub} for {orig})",
                            severity="critical",
                            triggered=True,
                            evidence=f"Detected deceptive character '{sub}' masquerading as '{orig}' for brand '{b}'",
                            explanation="Attackers substitute visually identical glyphs (such as '0' for 'o' or 'vv' for 'w') to register fake accounts.",
                            recommendation="Avoid following or communicating with this lookalike account.",
                            score_contribution=65,
                        ))
                        impersonation_indicators.append(f"Visual glyph deception: {sub} replacing {orig}")
                        score += 65
                        break

        # 4. Check Excessive Trailing Numbers (bot/throwaway profile indicator)
        if re.search(r"\d{4,}$", handle):
            findings.append(SecurityFinding(
                rule_id="SOC-IMP-03",
                title="Excessive Trailing Digits (Automated Account Pattern)",
                severity="medium",
                triggered=True,
                evidence=f"Handle ends with 4+ numeric digits: '{handle}'",
                explanation="Large clusters of trailing digits typically indicate autogenerated burner accounts or disposable bot profiles.",
                recommendation="Verify profile account creation date and activity history.",
                score_contribution=25,
            ))
            impersonation_indicators.append("Automated number suffix pattern")
            score += 25

    # 5. Check User-Provided Profile Bio / Context
    if profile_details:
        details_lower = profile_details.lower()
        crypto_scam_words = [
            "giveaway", "giving away", "airdrop", "send eth", "send btc",
            "send 0.", "double your", "double your crypto", "whatsapp only",
            "dm to invest", "guaranteed profit", "free air drop", "claim your",
            "free crypto", "eth to receive", "btc to receive"
        ]
        for scam in crypto_scam_words:
            if scam in details_lower:
                findings.append(SecurityFinding(
                    rule_id="SOC-BIO-01",
                    title="Financial Solicitation / Crypto Lure in Profile",
                    severity="critical",
                    triggered=True,
                    evidence=f"Profile text contains fraudulent solicitation string: '{scam}'",
                    explanation="Unsolicited investment guarantees and giveaway offers are universal indicators of account compromise or fraud.",
                    recommendation="Report profile to platform trust and safety team.",
                    score_contribution=60,
                ))
                impersonation_indicators.append(f"Financial lure: '{scam}'")
                score += 60
                break

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
        reasons.append(f"No homoglyphs, deceptive corporate keywords, or bot suffix patterns found in handle @{handle}.")

    recommendations = []
    if category == RiskCategory.HIGH_RISK:
        recommendations = [
            "Do not send money, cryptocurrency, or personal information to this profile.",
            "Report the profile directly through the platform's 'Report Impersonation' feature.",
            "Block this account to prevent targeted phishing direct messages.",
        ]
    elif category == RiskCategory.SUSPICIOUS:
        recommendations = [
            "Verify this account by checking for an official platform verification badge (Blue checkmark).",
            "Navigate to the entity's verified website to find their authentic social channels.",
            "Be skeptical of unsolicited direct messages offering giveaways, support, or investments.",
        ]
    else:
        recommendations = [
            "Handle syntax conforms to standard naming conventions.",
            "Always verify verification badges directly inside the platform application.",
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
                scanner_type="social",
                input_target=f"Social ({platform_clean.title()}): @{handle}",
                risk_score=final_score,
                risk_category=category.value,
                findings_count=len(triggered_findings),
                summary=reasons[0] if reasons else "Social profile risk assessment completed.",
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
                "Failed to persist social scan record to database for scan_id=%s: %s",
                scan_id,
                exc,
                exc_info=True,
            )
            raise HTTPException(
                status_code=500,
                detail="Database persistence failed: unable to save social scan record.",
            ) from exc

    return SocialScanResponse(
        scan_id=scan_id,
        platform=platform_clean.title(),
        identifier=handle,
        account_type_assessed=f"{platform_clean.title()} Public Handle / Contact",
        risk_score=final_score,
        risk_category=category,
        findings=findings,
        triggered_findings=triggered_findings,
        impersonation_indicators=impersonation_indicators,
        reasons=reasons,
        recommended_actions=recommendations,
        scanned_at=scanned_at,
        analysis_method="Heuristic Handle Deception Detector + Lookalike Homoglyph Analyzer",
        limitations=SOCIAL_LIMITATIONS,
    )
