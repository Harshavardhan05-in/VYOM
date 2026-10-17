# PhishShield AI — Google Gmail Protection Add-on

Contextual, user-triggered threat intelligence add-on for Google Gmail, powered by the **PhishShield AI** backend detection engine.

---

## 1. Architectural Overview & Security Model

```
 ┌─────────────────┐       User Click        ┌─────────────────────────┐
 │   Gmail Web /   │ ──────────────────────> │ Google Apps Script Host │
 │  Mobile Client  │                         │       (Code.js)         │
 └─────────────────┘                         └────────────┬────────────┘
          ▲                                               │
          │ CardService UI (Push/Update)                  │ HTTPS POST /api/v1/scan/gmail
          │ (Green Safe / Amber Susp / Red Danger)        │ (Bearer / X-PhishShield-Key)
          │                                               ▼
 ┌─────────────────┐                         ┌─────────────────────────┐
 │ PhishShield AI  │ <────────────────────── │  FastAPI Threat Engine  │
 │ Web Dashboard   │   (Open Full Report)    │      (ScanRecordDB)     │
 └─────────────────┘                         └─────────────────────────┘
```

### Core Security Guarantees:
1. **User-Triggered Inspection Only:** The add-on never runs background daemons, cron jobs, or batch whole-inbox scanning. It is activated contextually only when an email is opened, and performs analysis only when the user explicitly clicks **"🛡️ SCAN THIS EMAIL"**.
2. **Least Privilege Google Scopes:** Utilizes the minimal OAuth scope:
   `https://www.googleapis.com/auth/gmail.addons.current.message.readonly`
   Restricted strictly to the currently open message. No mailbox indexing, contact scraping, or draft creation permissions.
3. **Privacy by Design:** In-flight message bodies and HTML are evaluated strictly in memory by heuristic analyzers and are **never persisted** to the database. Only anonymized scan records (`"Gmail: <Subject preview>"`, risk score, and triggered rule identifiers) are recorded.
4. **Zero Client Secrets:** Production API keys and backend URLs are managed through Google Apps Script **Script Properties** (backed by Google Cloud Key-Value store) rather than hardcoded in the client manifest.
5. **Truth-in-Advertising Security Disclaimers:** Safe evaluations display explicit disclaimers clarifying that the message passed available heuristic checks without guaranteeing absolute immunity.

---

## 2. Directory Structure

```
integrations/gmail-addon/
├── appsscript.json        # Google Workspace Add-on manifest with trigger & whitelists
├── Code.js                # Core CardService UI builders, API dispatcher & regex parser
├── setup_properties.js    # Editor utility for initializing Script Properties
├── test_addon_mock.js     # Offline Node.js test harness (27 automated assertions)
└── README.md              # Complete installation, testing, and deployment manual
```

---

## 3. Step-by-Step Installation & Deployment

### Step 1: Create a Google Apps Script Project
1. Navigate to [script.google.com](https://script.google.com/) and click **New project**.
2. Rename the project to **`PhishShield AI Gmail Add-on`**.

### Step 2: Enable Manifest Editing
1. In the left sidebar of the Apps Script editor, click **Project Settings** (gear icon ⚙️).
2. Check the box labeled **"Show 'appsscript.json' manifest file in editor"**.
3. Return to the **Editor** (`< >`).

### Step 3: Copy Add-on Code
1. Open `appsscript.json` in the Apps Script editor and replace its entire content with the contents of [`integrations/gmail-addon/appsscript.json`](./appsscript.json).
2. Open `Code.gs` (rename from `Code.js` if necessary) and replace its content with [`integrations/gmail-addon/Code.js`](./Code.js).
3. Create a second script file named `setup_properties.gs` and paste the contents of [`integrations/gmail-addon/setup_properties.js`](./setup_properties.js).

### Step 4: Configure Script Properties
You can configure properties either via the Script Editor UI or by running the script utility:

**Option A (Recommended — Utility Function):**
1. In the function dropdown at the top of the editor, select `setupPhishShieldProperties`.
2. Click **Run**.
3. Authorize script execution when prompted.

**Option B (Manual via UI):**
1. Click **Project Settings** (⚙️) -> **Script Properties** -> **Add script property**.
2. Add the following keys:
   - `PHISHSHIELD_BACKEND_URL`: `https://phishshield-ai.onrender.com` (or your custom deployment URL)
   - `PHISHSHIELD_API_KEY`: Your integration API key matching `GMAIL_INTEGRATION_API_KEY` (or leave empty if auth is disabled)
   - `PHISHSHIELD_DASHBOARD_URL`: `https://phish-shield-ai-pink.vercel.app`

### Step 5: Test Deployment in Gmail
1. In the upper-right corner of the Apps Script editor, click **Deploy** > **Test deployments**.
2. Under "Select type", choose **Google Workspace Add-on**.
3. Click **Install**.
4. Open [Gmail](https://mail.google.com/) in your browser.
5. In the right-side companion bar, the **PhishShield AI** icon will appear.

---

## 4. Usage Flow

1. Open any email in Gmail.
2. Click the **PhishShield AI** icon in the right side panel.
3. The **Pre-Scan Card** displays the selected email's subject, sender, and inspection scope.
4. Click **🛡️ SCAN THIS EMAIL**.
5. The add-on safely extracts links and text, contacts the PhishShield AI threat engine, and renders the **Result Card**:
   - 🟢 **Safe:** Green badge, passed checks, and truthful security disclaimer.
   - 🟡 **Suspicious:** Amber banner, warning flags, and suspicious link breakdown.
   - 🔴 **High Risk:** Red danger banner, critical alert warning, and extracted malicious links.
6. Click **🌐 View Full Report on PhishShield AI** to open the web dashboard history entry.
7. Click **🔄 Rescan Email** to re-analyze the message at any time.

---

## 5. Offline Testing Suite

To test the add-on logic locally without deploying to Google Cloud:

```bash
# From project root
node integrations/gmail-addon/test_addon_mock.js
```

The test harness mocks Google `CardService`, `UrlFetchApp`, and `GmailApp` across 27 assertions:
- URL extraction heuristics (plain text, HTML `href`, deduplication)
- Pre-scan card construction
- Safe email evaluation flow
- High-risk phishing evaluation flow
- API authentication error handling (401)
- Network failure / cold-start retry handling

---

## 6. Google Workspace Marketplace Publication Checklist

When submitting the add-on for public listing in the Google Workspace Marketplace:

- [x] **OAuth Scopes:** Limited to `https://www.googleapis.com/auth/gmail.addons.current.message.readonly`.
- [x] **Open Source Compliance:** No minified obfuscation; human-readable V8 JavaScript.
- [x] **Privacy Policy:** Published at `/privacy`.
- [x] **Terms of Service:** Published at `/terms`.
- [x] **Universal Context Trigger:** Defined in `appsscript.json` under `gmail.contextualTriggers`.
- [x] **Whitelisted URLs:** `urlFetchWhitelist` includes all target API hosts (`phishshield-ai.onrender.com`, `phish-shield-ai-pink.vercel.app`).
