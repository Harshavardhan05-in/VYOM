/**
 * PhishShield AI — Google Gmail Add-on Mock Verification Suite
 * 
 * Verifies Google Apps Script Add-on logic locally using Node.js:
 * - CardService object structure and builder chains
 * - URL regex extraction from plain text and HTML href attributes
 * - onGmailMessageOpen card building and parameter binding
 * - onScanEmailClick network calling, status code handling, and result rendering
 * - Error handling, retry mechanics, and edge case safety
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ── 1. CardService & Google Apps Script Mock Framework ───────────────────────
class MockCardBuilder {
  constructor() {
    this.header = null;
    this.sections = [];
  }
  setHeader(header) {
    this.header = header;
    return this;
  }
  addSection(section) {
    this.sections.push(section);
    return this;
  }
  build() {
    return {
      type: "Card",
      header: this.header,
      sections: this.sections
    };
  }
}

class MockCardHeader {
  constructor() {
    this.title = "";
    this.subtitle = "";
    this.imageStyle = null;
  }
  setTitle(t) { this.title = t; return this; }
  setSubtitle(s) { this.subtitle = s; return this; }
  setImageStyle(is) { this.imageStyle = is; return this; }
}

class MockCardSection {
  constructor() {
    this.header = "";
    this.widgets = [];
  }
  setHeader(h) { this.header = h; return this; }
  addWidget(w) { this.widgets.push(w); return this; }
}

class MockDecoratedText {
  constructor() {
    this.topLabel = "";
    this.text = "";
    this.wrapText = false;
  }
  setTopLabel(l) { this.topLabel = l; return this; }
  setText(t) { this.text = t; return this; }
  setWrapText(w) { this.wrapText = w; return this; }
}

class MockTextParagraph {
  constructor() { this.text = ""; }
  setText(t) { this.text = t; return this; }
}

class MockTextButton {
  constructor() {
    this.text = "";
    this.style = null;
    this.bgColor = null;
    this.action = null;
    this.openLink = null;
  }
  setText(t) { this.text = t; return this; }
  setTextButtonStyle(s) { this.style = s; return this; }
  setBackgroundColor(c) { this.bgColor = c; return this; }
  setOnClickAction(a) { this.action = a; return this; }
  setOpenLink(l) { this.openLink = l; return this; }
}

class MockAction {
  constructor() {
    this.functionName = "";
    this.parameters = {};
  }
  setFunctionName(fn) { this.functionName = fn; return this; }
  setParameters(p) { this.parameters = p; return this; }
}

class MockOpenLink {
  constructor() {
    this.url = "";
    this.openAs = null;
    this.onClose = null;
  }
  setUrl(u) { this.url = u; return this; }
  setOpenAs(o) { this.openAs = o; return this; }
  setOnClose(c) { this.onClose = c; return this; }
}

class MockNavigation {
  constructor() {
    this.card = null;
    this.navType = null;
  }
  pushCard(card) {
    this.card = card;
    this.navType = "pushCard";
    return this;
  }
  updateCard(card) {
    this.card = card;
    this.navType = "updateCard";
    return this;
  }
}

class MockNotification {
  constructor() { this.text = ""; }
  setText(t) { this.text = t; return this; }
}

class MockActionResponseBuilder {
  constructor() {
    this.navigation = null;
    this.notification = null;
  }
  setNavigation(nav) { this.navigation = nav; return this; }
  setNotification(notif) { this.notification = notif; return this; }
  build() {
    return {
      type: "ActionResponse",
      navigation: this.navigation,
      notification: this.notification
    };
  }
}

const mockCardService = {
  ImageStyle: { SQUARE: "SQUARE", CIRCLE: "CIRCLE" },
  TextButtonStyle: { FILLED: "FILLED", TEXT: "TEXT" },
  OpenAs: { FULL_SIZE: "FULL_SIZE" },
  OnClose: { NOTHING: "NOTHING" },
  newCardBuilder: () => new MockCardBuilder(),
  newCardHeader: () => new MockCardHeader(),
  newCardSection: () => new MockCardSection(),
  newDecoratedText: () => new MockDecoratedText(),
  newTextParagraph: () => new MockTextParagraph(),
  newTextButton: () => new MockTextButton(),
  newAction: () => new MockAction(),
  newOpenLink: () => new MockOpenLink(),
  newNavigation: () => new MockNavigation(),
  newNotification: () => new MockNotification(),
  newActionResponseBuilder: () => new MockActionResponseBuilder()
};

// ── 2. Mock Environment State ────────────────────────────────────────────────
let mockScriptProperties = {
  "PHISHSHIELD_BACKEND_URL": "https://phishshield-ai.onrender.com",
  "PHISHSHIELD_API_KEY": "test-key-mock",
  "PHISHSHIELD_DASHBOARD_URL": "https://phish-shield-ai-pink.vercel.app"
};

let mockMessages = {};
let mockFetchResponse = null;
let mockFetchException = null;

const mockPropertiesService = {
  getScriptProperties: () => ({
    getProperty: (k) => mockScriptProperties[k] || null,
    getProperties: () => ({ ...mockScriptProperties }),
    setProperties: (obj) => { Object.assign(mockScriptProperties, obj); }
  })
};

const mockGmailApp = {
  getMessageById: (id) => mockMessages[id] || null
};

const mockUrlFetchApp = {
  fetch: (url, options) => {
    if (mockFetchException) {
      throw mockFetchException;
    }
    return {
      getResponseCode: () => mockFetchResponse.status,
      getContentText: () => mockFetchResponse.text
    };
  }
};

const sandbox = {
  CardService: mockCardService,
  PropertiesService: mockPropertiesService,
  GmailApp: mockGmailApp,
  UrlFetchApp: mockUrlFetchApp,
  console: console,
  Logger: { log: (...args) => {} }
};

// Load Code.js into VM context
const codePath = path.join(__dirname, 'Code.js');
const codeContent = fs.readFileSync(codePath, 'utf8');
vm.createContext(sandbox);
vm.runInContext(codeContent, sandbox);

// ── 3. Test Runner ───────────────────────────────────────────────────────────
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    testsFailed++;
    throw new Error(message);
  } else {
    testsPassed++;
    console.log(`  ✅ PASSED: ${message}`);
  }
}

console.log("================================================================================");
console.log("   PHISHSHIELD AI — GMAIL ADD-ON OFFLINE CARD SERVICE & LOGIC TEST SUITE        ");
console.log("================================================================================");

// Test 1: URL Extraction Heuristics
console.log("\n▶ [TEST 1] URL Extraction Heuristics (Plain Text, HTML href, Deduplication)");
{
  const plainText = "Hello, check our site at https://secure-bank.example.com/login and http://update-portal.net/verify.";
  const htmlBody = '<p>Click <a href="https://evil-phish.xyz/harvest?token=123">here</a> or visit https://secure-bank.example.com/login</p>';
  
  const extracted = sandbox.extractUrls(plainText, htmlBody);
  assert(Array.isArray(extracted), "Result is an array");
  assert(extracted.includes("https://secure-bank.example.com/login"), "Extracts plain text URL");
  assert(extracted.includes("http://update-portal.net/verify"), "Extracts second plain text URL");
  assert(extracted.includes("https://evil-phish.xyz/harvest?token=123"), "Extracts HTML href target safely");
  
  // Verify deduplication
  const countBank = extracted.filter(u => u === "https://secure-bank.example.com/login").length;
  assert(countBank === 1, "Duplicate URLs correctly deduplicated");
}

// Test 2: onGmailMessageOpen with Valid Message
console.log("\n▶ [TEST 2] onGmailMessageOpen: Initial Pre-Scan Card Construction");
{
  mockMessages["msg-101"] = {
    getSubject: () => "Urgent: Verify Your Microsoft Account Within 24h",
    getFrom: () => "security@micro-soft-verify.com",
    getDate: () => new Date("2026-10-17T06:00:00Z"),
    getPlainBody: () => "Please click link below.",
    getBody: () => "<a href='http://phish.com'>Verify</a>"
  };

  const card = sandbox.onGmailMessageOpen({ gmail: { messageId: "msg-101" } });
  assert(card.type === "Card", "Returns Card object");
  assert(card.header.title.includes("PhishShield AI"), "Header contains brand title");
  assert(card.sections.length >= 3, "Contains at least 3 sections (Context, Scope, Privacy)");
  
  // Check action button
  const actionSection = card.sections[1];
  const scanBtn = actionSection.widgets.find(w => w.text && w.text.includes("SCAN THIS EMAIL"));
  assert(scanBtn !== undefined, "Contains 'SCAN THIS EMAIL' action button");
  assert(scanBtn.action.functionName === "onScanEmailClick", "Button triggers onScanEmailClick");
  assert(scanBtn.action.parameters.messageId === "msg-101", "Action carries messageId parameter");
}

// Test 3: onGmailMessageOpen with Missing Message ID
console.log("\n▶ [TEST 3] onGmailMessageOpen: Missing Message Graceful Handling");
{
  const errorCard = sandbox.onGmailMessageOpen(null);
  assert(errorCard.type === "Card", "Returns Error Card");
  assert(errorCard.header.title.includes("No Active Email Found"), "Displays clear error title");
}

// Test 4: onScanEmailClick Safe Email Evaluation
console.log("\n▶ [TEST 4] onScanEmailClick: Safe Email Evaluation Flow");
{
  mockMessages["msg-safe"] = {
    getSubject: () => "Quarterly Team Sync Agenda",
    getFrom: () => "alex@company.com",
    getPlainBody: () => "Here is the agenda for our team meeting.",
    getBody: () => "<p>Here is the agenda for our team meeting.</p>"
  };

  mockFetchResponse = {
    status: 200,
    text: JSON.stringify({
      scan_id: "scan-safe-001",
      risk_score: 5,
      risk_category: "safe",
      summary: "Clean email communication. No significant indicators of phishing or social engineering.",
      triggered_findings: [],
      extracted_urls: [],
      recommended_actions: ["Standard caution applies."],
      web_report_url: "https://phish-shield-ai-pink.vercel.app/history"
    })
  };
  mockFetchException = null;

  const response = sandbox.onScanEmailClick({ parameters: { messageId: "msg-safe" } });
  assert(response.type === "ActionResponse", "Returns ActionResponse");
  assert(response.navigation.navType === "pushCard", "Pushes Result Card to navigation");
  
  const resultCard = response.navigation.card;
  assert(resultCard.header.title.includes("VERIFIED CLEAN"), "Displays green verified clean badge");
  assert(resultCard.header.subtitle.includes("Risk Score: 5 / 100"), "Displays accurate risk score");
  
  // Verify truth-in-advertising disclaimer in safe summary
  const summarySec = resultCard.sections[0];
  const disclaimerWidget = summarySec.widgets.find(w => w.text && w.text.includes("Truthful Security Disclaimer"));
  assert(disclaimerWidget !== undefined, "Presents truthful security disclaimer for safe results");
}

// Test 5: onScanEmailClick High Risk Threat Evaluation
console.log("\n▶ [TEST 5] onScanEmailClick: High Risk Malicious Phishing Email Flow");
{
  mockMessages["msg-phish"] = {
    getSubject: () => "CRITICAL: Immediate Account Suspension Notice",
    getFrom: () => "billing@paypal-security-alert.xyz",
    getPlainBody: () => "Your account will be deleted in 12 hours. Update payment immediately: http://paypal-fake-login.biz",
    getBody: () => "<a href='http://paypal-fake-login.biz'>Update Now</a>"
  };

  mockFetchResponse = {
    status: 200,
    text: JSON.stringify({
      scan_id: "scan-phish-999",
      risk_score: 94,
      risk_category: "high_risk",
      summary: "High risk phishing attack detected with multiple critical deception indicators.",
      triggered_findings: [
        { title: "Psychological Coercion & Urgency", severity: "high", explanation: "Imposes strict time penalty." },
        { title: "Embedded High-Risk URL", severity: "critical", explanation: "Target URL flagged as malicious." }
      ],
      extracted_urls: [
        { url: "http://paypal-fake-login.biz", risk_score: 95, risk_category: "high_risk" }
      ],
      recommended_actions: [
        "Do NOT click any links in this email.",
        "Forward this email to your security operations center."
      ],
      web_report_url: "https://phish-shield-ai-pink.vercel.app/history"
    })
  };
  mockFetchException = null;

  const response = sandbox.onScanEmailClick({ parameters: { messageId: "msg-phish" } });
  const resultCard = response.navigation.card;
  
  assert(resultCard.header.title.includes("HIGH RISK THREAT DETECTED"), "Displays Red Threat Alert badge");
  assert(resultCard.header.subtitle.includes("Risk Score: 94 / 100"), "Displays high threat score");
  
  // Check findings section
  const findingsSec = resultCard.sections.find(s => s.header && s.header.includes("Detected Security Flags"));
  assert(findingsSec !== undefined, "Displays Detected Security Flags section");
  assert(findingsSec.widgets.length === 2, "Lists all 2 triggered findings");

  // Check URL section
  const urlSec = resultCard.sections.find(s => s.header && s.header.includes("Inspected Embedded Links"));
  assert(urlSec !== undefined, "Displays Inspected Embedded Links section");
  assert(urlSec.widgets[0].topLabel.includes("MALICIOUS (95/100)"), "Renders extracted URL as malicious");
}

// Test 6: Backend Authentication Error (HTTP 401)
console.log("\n▶ [TEST 6] onScanEmailClick: API Key Authentication Failure (401)");
{
  mockFetchResponse = {
    status: 401,
    text: JSON.stringify({ detail: "Invalid or missing X-PhishShield-Key header" })
  };
  mockFetchException = null;

  const response = sandbox.onScanEmailClick({ parameters: { messageId: "msg-phish" } });
  const errCard = response.navigation.card;
  assert(errCard.header.title.includes("Authentication Required"), "Displays Authentication Required card");
}

// Test 7: Network Exception / Backend Cold Start
console.log("\n▶ [TEST 7] onScanEmailClick: Network Failure / Render Cold Start Handling");
{
  mockFetchException = new Error("DNS resolution failed or connection timed out");

  const response = sandbox.onScanEmailClick({ parameters: { messageId: "msg-phish" } });
  const errCard = response.navigation.card;
  assert(errCard.header.title.includes("Connection Failure"), "Displays Connection Failure card");
  
  // Verify retry button exists
  const retrySec = errCard.sections[0];
  const retryBtn = retrySec.widgets.find(w => w.text && w.text.includes("Retry Analysis"));
  assert(retryBtn !== undefined, "Includes 'Retry Analysis' button for retryable network errors");
}

console.log("\n================================================================================");
console.log(`   TOTAL TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
console.log("================================================================================\n");

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
