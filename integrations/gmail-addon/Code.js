/**
 * PhishShield AI — Google Gmail Protection Add-on
 * 
 * Contextual threat detection add-on for Google Gmail.
 * Inspects selected emails for phishing lures, psychological coercion,
 * brand impersonation, and embedded malicious links using the PhishShield AI
 * threat intelligence backend.
 * 
 * Platform: Google Workspace Add-on (CardService / V8 Runtime)
 * Scopes: https://www.googleapis.com/auth/gmail.addons.current.message.readonly
 */

// ── Design Tokens & Brand Configuration ──────────────────────────────────────
var PHISHSHIELD_BRAND = {
  NAME: "PhishShield AI",
  TAGLINE: "Intelligent Digital Threat Protection",
  PRIMARY_CYAN: "#00D9FF",
  DARK_NAVY: "#04182B",
  SAFE_GREEN: "#22C55E",
  SUSPICIOUS_AMBER: "#F59E0B",
  DANGER_RED: "#EF4444",
  TEXT_MUTED: "#64748B",
  DEFAULT_BACKEND_URL: "https://phishshield-ai.onrender.com",
  DEFAULT_DASHBOARD_URL: "https://phish-shield-ai-pink.vercel.app"
};

/**
 * Retrieve deployment configuration from Script Properties with fallback to defaults.
 * Allows administrators to configure custom backend URL or integration API key
 * via Google Apps Script Script Properties without touching source code.
 */
function getConfig() {
  var props = PropertiesService.getScriptProperties();
  var backendUrl = props.getProperty("PHISHSHIELD_BACKEND_URL") || PHISHSHIELD_BRAND.DEFAULT_BACKEND_URL;
  var apiKey = props.getProperty("PHISHSHIELD_API_KEY") || "";
  var dashboardUrl = props.getProperty("PHISHSHIELD_DASHBOARD_URL") || PHISHSHIELD_BRAND.DEFAULT_DASHBOARD_URL;

  // Normalize backendUrl: strip trailing slash
  backendUrl = backendUrl.replace(/\/+$/, "");
  dashboardUrl = dashboardUrl.replace(/\/+$/, "");

  return {
    backendUrl: backendUrl,
    apiKey: apiKey,
    dashboardUrl: dashboardUrl
  };
}

/**
 * Contextual Trigger: Fired when user opens a message in Gmail.
 * Renders the initial Pre-Scan Card with email metadata and a clear "Scan This Email" action.
 * Does NOT scan the entire mailbox or poll in the background.
 */
function onGmailMessageOpen(e) {
  try {
    if (!e || !e.gmail || !e.gmail.messageId) {
      return buildErrorCard(
        "No Active Email Found",
        "Please select an open email in Gmail to inspect with PhishShield AI.",
        false
      );
    }

    var messageId = e.gmail.messageId;
    var message = GmailApp.getMessageById(messageId);
    if (!message) {
      return buildErrorCard(
        "Unable to Access Message",
        "The selected message could not be loaded. Please ensure permissions are granted.",
        true,
        messageId
      );
    }

    var subject = message.getSubject() || "(No Subject)";
    var sender = message.getFrom() || "Unknown Sender";
    var date = message.getDate() ? message.getDate().toLocaleString() : "Unknown Date";

    // ── Build Pre-Scan Card ───────────────────────────────────────────────────
    var card = CardService.newCardBuilder();
    card.setHeader(
      CardService.newCardHeader()
        .setTitle("PhishShield AI Threat Protection")
        .setSubtitle("Intelligent Email & Link Security Analysis")
        .setImageStyle(CardService.ImageStyle.SQUARE)
    );

    // Section 1: Message Overview
    var metaSection = CardService.newCardSection()
      .setHeader("<b>Selected Message Context</b>")
      .addWidget(
        CardService.newDecoratedText()
          .setTopLabel("Subject")
          .setText("<b>" + escapeHtml(truncate(subject, 70)) + "</b>")
          .setWrapText(true)
      )
      .addWidget(
        CardService.newDecoratedText()
          .setTopLabel("From")
          .setText(escapeHtml(truncate(sender, 60)))
          .setWrapText(true)
      )
      .addWidget(
        CardService.newDecoratedText()
          .setTopLabel("Received")
          .setText(escapeHtml(date))
      );
    card.addSection(metaSection);

    // Section 2: Security Scope & Action
    var actionSection = CardService.newCardSection()
      .setHeader("<b>Threat Inspection Capabilities</b>")
      .addWidget(
        CardService.newTextParagraph()
          .setText(
            "PhishShield AI will evaluate this email against:<br>" +
            "• <b>Urgency & Coercion:</b> Artificial time limits and psychological pressure.<br>" +
            "• <b>Credential Harvesting:</b> Solicitations for passwords, OTPs, or financial data.<br>" +
            "• <b>Sender Impersonation:</b> Free webmail spoofing and lookalike corporate domains.<br>" +
            "• <b>Embedded Links:</b> Deep heuristic URL matrix inspection for malware and phishing."
          )
      )
      .addWidget(
        CardService.newTextButton()
          .setText("🛡️ SCAN THIS EMAIL")
          .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
          .setBackgroundColor(PHISHSHIELD_BRAND.PRIMARY_CYAN)
          .setOnClickAction(
            CardService.newAction()
              .setFunctionName("onScanEmailClick")
              .setParameters({ messageId: messageId })
          )
      );
    card.addSection(actionSection);

    // Section 3: Privacy Assurance
    var privacySection = CardService.newCardSection()
      .addWidget(
        CardService.newTextParagraph()
          .setText(
            "<font color=\"#64748B\"><i>Privacy by Design: Your email body is evaluated in-flight and is never permanently stored in the threat database. Only anonymized security heuristics are recorded.</i></font>"
          )
      );
    card.addSection(privacySection);

    return card.build();
  } catch (err) {
    return buildErrorCard(
      "Add-on Initialization Error",
      "An unexpected error occurred while loading the add-on: " + (err.message || err.toString()),
      true,
      e && e.gmail ? e.gmail.messageId : null
    );
  }
}

/**
 * Action Handler: Fired when user clicks "Scan This Email".
 * Retrieves the email body, extracts links, calls the deployed backend,
 * and displays the actual security report card.
 */
function onScanEmailClick(e) {
  var messageId = e.parameters ? e.parameters.messageId : null;
  if (!messageId) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText("Error: Message ID missing."))
      .build();
  }

  try {
    var message = GmailApp.getMessageById(messageId);
    if (!message) {
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().updateCard(
          buildErrorCard("Message Unavailable", "Could not retrieve the email content for analysis.", true, messageId)
        ))
        .build();
    }

    var subject = message.getSubject() || "";
    var sender = message.getFrom() || "";
    var plainBody = message.getPlainBody() || "";
    var htmlBody = message.getBody() || "";

    // Safely extract links from text and HTML
    var extractedLinks = extractUrls(plainBody, htmlBody);

    // Validate size constraints
    if (!plainBody && !htmlBody && !subject) {
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().updateCard(
          buildErrorCard("Empty Email", "The selected email does not contain any readable text or subject to analyze.", false)
        ))
        .build();
    }

    // Truncate plain body to 64 KB safety limit if oversized
    if (plainBody.length > 65536) {
      plainBody = plainBody.substring(0, 65536);
    }
    // Truncate html body to 128 KB safety limit
    if (htmlBody.length > 131072) {
      htmlBody = htmlBody.substring(0, 131072);
    }

    var config = getConfig();
    var apiUrl = config.backendUrl + "/api/v1/scan/gmail";

    var payload = {
      subject: subject,
      sender: sender,
      body: plainBody,
      html_body: htmlBody,
      extracted_links: extractedLinks,
      message_id: messageId
    };

    var headers = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    if (config.apiKey) {
      headers["X-PhishShield-Key"] = config.apiKey;
      headers["Authorization"] = "Bearer " + config.apiKey;
    }

    var options = {
      method: "post",
      contentType: "application/json",
      headers: headers,
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(apiUrl, options);
    var statusCode = response.getResponseCode();
    var responseText = response.getContentText();

    if (statusCode === 200) {
      var scanData = JSON.parse(responseText);
      var resultCard = buildResultCard(scanData, messageId);
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(resultCard))
        .build();
    } else if (statusCode === 401) {
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(
          buildErrorCard(
            "Authentication Required",
            "The PhishShield AI backend rejected the request due to missing or invalid integration credentials. Please verify your Script Properties API Key.",
            false
          )
        ))
        .build();
    } else if (statusCode === 413) {
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(
          buildErrorCard(
            "Message Exceeds Size Limit",
            "This email is unusually large and exceeds the maximum size limit for real-time security analysis.",
            false
          )
        ))
        .build();
    } else {
      var detail = "HTTP " + statusCode;
      try {
        var errObj = JSON.parse(responseText);
        if (errObj.detail) detail = errObj.detail;
      } catch (ex) {}
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(
          buildErrorCard(
            "Analysis Engine Unavailable",
            "PhishShield AI backend returned an error (" + detail + "). The server may be cold-starting or updating.",
            true,
            messageId
          )
        ))
        .build();
    }
  } catch (netErr) {
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().pushCard(
        buildErrorCard(
          "Connection Failure",
          "Could not reach PhishShield AI backend: " + (netErr.message || netErr.toString()) + ". If using Render free tier, the service may be spinning up.",
          true,
          messageId
        )
      ))
      .build();
  }
}

/**
 * Build Results Card displaying the actual threat intelligence evaluation.
 * Adapts visual language: Safe (Green), Suspicious (Amber), High Risk (Red).
 */
function buildResultCard(data, messageId) {
  var card = CardService.newCardBuilder();
  var isSafe = data.risk_category === "safe";
  var isSusp = data.risk_category === "suspicious";
  var isHigh = data.risk_category === "high_risk";

  var statusColor = isSafe ? PHISHSHIELD_BRAND.SAFE_GREEN : (isSusp ? PHISHSHIELD_BRAND.SUSPICIOUS_AMBER : PHISHSHIELD_BRAND.DANGER_RED);
  var statusBadge = isSafe ? "VERIFIED CLEAN / LOW RISK" : (isSusp ? "SUSPICIOUS DETECTED" : "HIGH RISK THREAT DETECTED");
  var statusIcon = isSafe ? "🛡️" : (isSusp ? "⚠️" : "🚨");

  card.setHeader(
    CardService.newCardHeader()
      .setTitle(statusIcon + " " + statusBadge)
      .setSubtitle("Risk Score: " + data.risk_score + " / 100 • Scan ID: " + data.scan_id)
  );

  // Section 1: Executive Threat Summary
  var summarySection = CardService.newCardSection()
    .setHeader("<b>Assessment Summary</b>")
    .addWidget(
      CardService.newTextParagraph()
        .setText(
          "<font color=\"" + statusColor + "\"><b>" + escapeHtml(data.summary) + "</b></font>"
        )
    );

  if (isSafe) {
    summarySection.addWidget(
      CardService.newTextParagraph()
        .setText(
          "<font color=\"#64748B\"><i>Truthful Security Disclaimer: No significant threats detected. The scanned item passed the available security checks. This result reflects static & heuristic indicators, not an absolute guarantee of safety.</i></font>"
        )
    );
  } else if (isHigh) {
    summarySection.addWidget(
      CardService.newTextParagraph()
        .setText(
          "<font color=\"" + PHISHSHIELD_BRAND.DANGER_RED + "\"><b>CRITICAL: Do NOT click any links, open attachments, or reply to this message. Report to your security team immediately.</b></font>"
        )
    );
  }

  card.addSection(summarySection);

  // Section 2: Triggered Heuristic Findings (if any)
  var findings = data.triggered_findings || [];
  if (findings.length > 0) {
    var findingsSection = CardService.newCardSection()
      .setHeader("<b>Detected Security Flags (" + findings.length + ")</b>");

    for (var i = 0; i < findings.length; i++) {
      var f = findings[i];
      var sevColor = f.severity === "critical" || f.severity === "high" ? PHISHSHIELD_BRAND.DANGER_RED : PHISHSHIELD_BRAND.SUSPICIOUS_AMBER;
      findingsSection.addWidget(
        CardService.newDecoratedText()
          .setTopLabel("Flag: " + (f.severity ? f.severity.toUpperCase() : "WARNING"))
          .setText("<b>" + escapeHtml(f.title) + "</b><br><font color=\"#94A3B8\">" + escapeHtml(f.explanation) + "</font>")
          .setWrapText(true)
      );
    }
    card.addSection(findingsSection);
  }

  // Section 3: Extracted URLs & Deep Inspection Results
  var urls = data.extracted_urls || [];
  if (urls.length > 0) {
    var urlSection = CardService.newCardSection()
      .setHeader("<b>Inspected Embedded Links (" + urls.length + ")</b>");

    for (var j = 0; j < Math.min(urls.length, 6); j++) {
      var u = urls[j];
      var uSafe = u.risk_category === "safe";
      var uSusp = u.risk_category === "suspicious";
      var uHigh = u.risk_category === "high_risk";
      var uColor = uSafe ? PHISHSHIELD_BRAND.SAFE_GREEN : (uSusp ? PHISHSHIELD_BRAND.SUSPICIOUS_AMBER : PHISHSHIELD_BRAND.DANGER_RED);
      var uLabel = uSafe ? "SAFE (" + u.risk_score + "/100)" : (uSusp ? "SUSPICIOUS (" + u.risk_score + "/100)" : "MALICIOUS (" + u.risk_score + "/100)");

      urlSection.addWidget(
        CardService.newDecoratedText()
          .setTopLabel(uLabel)
          .setText("<font color=\"" + uColor + "\">" + escapeHtml(truncate(u.url, 55)) + "</font>")
          .setWrapText(true)
      );
    }
    card.addSection(urlSection);
  }

  // Section 4: Recommended Actions
  var recommendations = data.recommended_actions || [];
  if (recommendations.length > 0) {
    var recSection = CardService.newCardSection()
      .setHeader("<b>Recommended Safety Protocol</b>");

    var recText = "";
    for (var k = 0; k < recommendations.length; k++) {
      recText += "• " + escapeHtml(recommendations[k]) + "<br>";
    }
    recSection.addWidget(
      CardService.newTextParagraph().setText(recText)
    );
    card.addSection(recSection);
  }

  // Section 5: External Actions & Navigation
  var actionSection = CardService.newCardSection()
    .addWidget(
      CardService.newTextButton()
        .setText("🌐 View Full Report on PhishShield AI")
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setBackgroundColor(PHISHSHIELD_BRAND.PRIMARY_CYAN)
        .setOpenLink(
          CardService.newOpenLink()
            .setUrl(data.web_report_url || PHISHSHIELD_BRAND.DEFAULT_DASHBOARD_URL)
            .setOpenAs(CardService.OpenAs.FULL_SIZE)
            .setOnClose(CardService.OnClose.NOTHING)
        )
    )
    .addWidget(
      CardService.newTextButton()
        .setText("🔄 Rescan Email")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName("onScanEmailClick")
            .setParameters({ messageId: messageId })
        )
    );

  card.addSection(actionSection);

  return card.build();
}

/**
 * Build a user-friendly error card with optional retry button.
 */
function buildErrorCard(title, message, isRetryable, messageId) {
  var card = CardService.newCardBuilder();
  card.setHeader(
    CardService.newCardHeader()
      .setTitle("⚠️ " + title)
      .setSubtitle("PhishShield AI Security Notice")
  );

  var section = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph()
        .setText("<font color=\"#EF4444\">" + escapeHtml(message) + "</font>")
    );

  if (isRetryable && messageId) {
    section.addWidget(
      CardService.newTextButton()
        .setText("🔄 Retry Analysis")
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setBackgroundColor(PHISHSHIELD_BRAND.PRIMARY_CYAN)
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName("onScanEmailClick")
            .setParameters({ messageId: messageId })
        )
    );
  }

  card.addSection(section);
  return card.build();
}

// ── Utility Functions ────────────────────────────────────────────────────────

/**
 * Safely extract URLs from plain text and HTML content without script execution.
 */
function extractUrls(plainText, htmlText) {
  var urlPattern = /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+/gi;
  var urls = [];

  if (plainText) {
    var textMatches = plainText.match(urlPattern);
    if (textMatches) urls = urls.concat(textMatches);
  }

  if (htmlText) {
    var hrefPattern = /href=["'](https?:\/\/[^"']+)["']/gi;
    var match;
    while ((match = hrefPattern.exec(htmlText)) !== null) {
      if (match[1]) urls.push(match[1]);
    }
    var htmlMatches = htmlText.match(urlPattern);
    if (htmlMatches) urls = urls.concat(htmlMatches);
  }

  var seen = {};
  var cleanList = [];
  for (var i = 0; i < urls.length; i++) {
    var u = urls[i].replace(/[.,;:)"'>]+$/, "").trim();
    if (u && !seen[u.toLowerCase()]) {
      seen[u.toLowerCase()] = true;
      cleanList.push(u);
    }
  }

  return cleanList;
}

function truncate(str, maxLen) {
  if (!str) return "";
  return str.length > maxLen ? str.substring(0, maxLen - 3) + "..." : str;
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
