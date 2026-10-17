# 🛡️ PhishShield AI
### Intelligent Digital Threat Protection

**An AI-powered cybersecurity platform designed to help identify phishing URLs, suspicious files, malicious QR codes, spam phone numbers, unsafe messages, and potentially fraudulent social media profiles.**

PhishShield AI combines machine-learning predictions, explainable security rules, and a unified dashboard to help users understand potential digital threats and make safer decisions online.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Limitations](#-limitations)
- [Future Enhancements](#-future-enhancements)
- [Team](#-team)
- [Disclaimer](#-disclaimer)
- [License](#-license)

---

## 🚀 Overview

PhishShield AI is a multi-layer digital threat analysis platform that helps users assess potentially dangerous online content through a single interface.

Instead of relying on a single detection method, the platform combines machine-learning analysis where available with rule-based security checks to produce risk assessments, supporting findings, and recommended actions.

The project includes a web application, a browser extension, and an integration planned for scanning emails directly from Gmail.

**Project goals:**
- Make digital threat analysis accessible through a unified interface.
- Explain why a URL, file, message, or profile may be suspicious.
- Provide risk classifications and practical safety recommendations.
- Maintain scan history and reports where database persistence is available.
- Build a modular architecture that can be extended with additional security integrations.

## 🎯 Problem Statement

Phishing, fraudulent links, suspicious attachments, QR-code scams, spam calls, and social engineering messages are common digital security risks.

Users may find it difficult to determine whether unfamiliar content is safe, especially when attackers imitate trusted brands or use misleading domains and messages.

PhishShield AI aims to simplify the initial analysis of these threats by providing a unified scanning interface with understandable results.

## ✨ Key Features

### 1. URL Scanner
- Analyze URLs for suspicious structural and domain indicators.
- Combine available machine-learning predictions with security rules.
- Generate a risk score, classification, findings, and recommendations.
- Help users identify potentially misleading or suspicious links.

### 2. File Scanner
- Analyze supported uploaded files using available file-validation and static-analysis checks.
- Inspect supported file properties and suspicious indicators.
- Present findings and a risk assessment.

### 3. QR Code Scanner
- Decode QR codes from supported uploaded images.
- Extract embedded URLs or other supported content.
- Analyze decoded links when applicable.

### 4. Phone Number Spam Checker
- Assess phone numbers using implemented validation and heuristic checks.
- Highlight potential warning indicators.
- Present results with appropriate limitations.

### 5. Email & Message Scanner
- Analyze submitted email or message content for suspicious language, links, and other implemented indicators.
- Help identify potential phishing and social-engineering attempts.
- Provide findings and recommended next steps.

### 6. SocialShield AI
- Analyze supported social media profile information and user-provided content.
- Apply heuristic checks for possible impersonation, scam indicators, and suspicious messages.
- Provide platform-specific analysis experiences where implemented.

> Social media results are heuristic assessments, not confirmation of an account owner's real identity.

### 7. Browser Extension
- Provide a convenient way to submit URLs for analysis.
- Connect users to the PhishShield AI scanning experience.
- Display analysis results through the implemented extension workflow.

### 8. Dashboard & Scan History
- Present scanner results and risk classifications in a centralized dashboard.
- Display scan history and reports when records are successfully persisted.
- Help users review previous analyses and their findings.

### 9. Gmail Integration
- A planned Gmail add-on aims to let users initiate analysis of the currently opened email.
- The integration is intended to use supported Google Workspace authorization and the PhishShield AI backend.
- Availability depends on implementation, configuration, authorization, and deployment status.

---

## ⚙️ How It Works

1. **Submit content:** The user provides a URL, file, QR image, phone number, message, or supported profile information.
2. **Validate input:** The backend validates the input and checks supported formats.
3. **Analyze indicators:** The relevant scanner applies available security rules, heuristics, and machine-learning inference.
4. **Calculate risk:** The analysis service combines available findings according to its scoring policy.
5. **Present results:** The interface displays the risk classification, score, supporting evidence, and recommendations.
6. **Store results:** Scan history is saved when database persistence succeeds.

Risk scores are estimates produced by the implemented detection logic. They should not be interpreted as guarantees that content is safe or malicious.

## 🏗️ System Architecture

```text
                 ┌─────────────────────────┐
                 │       User / Client     │
                 └────────────┬────────────┘
                              │
                 ┌────────────▼────────────┐
                 │     React Web App       │
                 │    Dashboard & UI       │
                 └────────────┬────────────┘
                              │ HTTPS / API
                 ┌────────────▼────────────┐
                 │      FastAPI Backend    │
                 │ Input Validation        │
                 │ Scanner Services        │
                 └────────────┬────────────┘
                              │
               ┌──────────────┼──────────────┐
               │              │              │
      ┌────────▼──────┐ ┌─────▼──────┐ ┌────▼─────────┐
      │ Security Rules│ │ ML Inference│ │ Scan Storage │
      │ & Heuristics  │ │ When Available│ │ PostgreSQL / │
      └───────────────┘ └────────────┘ │ SQLite       │
                                       └──────────────┘
```

The browser extension and any separately deployed integrations communicate with supported backend endpoints. The exact production architecture depends on the configured services and environment variables.

## 🧰 Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| API Validation | Pydantic |
| Database Access | SQLAlchemy |
| Databases | SQLite for local development; PostgreSQL for production when configured |
| Machine Learning | scikit-learn and supporting Python libraries |
| Data Processing | NumPy, pandas |
| Model Utilities | joblib |
| Browser Extension | JavaScript, Chrome Extension Manifest V3 |
| Gmail Add-on | Google Apps Script and CardService, as planned |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Production Database | Supabase PostgreSQL, when correctly configured |
| Version Control | Git and GitHub |

## 📁 Project Structure

The following is a representative structure. Refer to the actual repository for the authoritative file and directory names.

```text
VYOM/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   ├── db/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── tests/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── integrations/
│   └── gmail-addon/     # If integration files have been added
├── extension/           # Actual extension directory may differ
├── README.md
└── .gitignore
```

## 🛠️ Getting Started

### Prerequisites

Install the following before running the project locally:

- Python 3.12 recommended for the backend environment.
- Node.js and npm compatible with the frontend dependencies.
- Git.
- Access to the configured database, if using PostgreSQL instead of local SQLite.

### 1. Clone the repository

```bash
git clone https://github.com/Harshavardhan05-in/VYOM.git
cd VYOM
```

### 2. Set up the backend

Open a terminal in the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

**Windows Command Prompt:**

```bat
.venv\Scripts\activate.bat
```

**Linux / macOS:**

```bash
source .venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables, then start the API:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The local API should be available at:

- API root: `http://127.0.0.1:8000/`
- Interactive API documentation: `http://127.0.0.1:8000/docs`

These addresses apply to the default local development configuration.

### 3. Set up the frontend

Open a second terminal and navigate to the actual frontend directory:

```bash
cd frontend
npm install
```

Create a local environment file if required by the project, then start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

**Important:** If the repository uses a different frontend directory or environment-variable name, follow the existing project configuration rather than creating duplicate files.

---

## 🔐 Environment Configuration

Keep credentials and secrets in environment variables, not in source code.

Typical backend configuration may include:

```env
DATABASE_URL=your_database_connection_url
```

For the frontend, configure the API base URL using the exact variable name expected by the existing codebase, for example:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

These are examples, not a guarantee that the current code uses these exact variable names. Check the configuration and settings files before adding them.

**Security practices:**
- Never commit `.env` files containing credentials.
- Never expose database URLs, API keys, or private tokens in frontend code.
- Use HTTPS for production API communication.
- Configure CORS for the intended frontend origins.
- Apply appropriate authentication, authorization, and rate limiting to protected endpoints.
- Do not store raw email bodies or sensitive user content unnecessarily.

## ☁️ Deployment

The intended deployment arrangement is:

| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | FastAPI backend hosting |
| Supabase | Managed PostgreSQL database |

### Deployment checklist

1. Push the verified project code to GitHub.
2. Configure the frontend project in Vercel.
3. Configure the backend service in Render with the correct root directory, build command, and start command.
4. Add production environment variables through the hosting dashboards.
5. Configure the database connection using the supported connection method for the hosting environment.
6. Allow the production frontend origin in the backend CORS configuration.
7. Verify the API health endpoint and frontend-to-backend connectivity.
8. Run real scans and confirm that the resulting records are persisted and can be retrieved.
9. Verify scanner errors, unavailable services, and database failures are handled correctly.

A successful frontend deployment alone does not prove that the backend, database, or all scanner features are working correctly.

## 🧪 Testing

Run the tests provided by the repository.

For a Python backend using pytest:

```bash
cd backend
pytest
```

Before releasing changes, check:

- Input validation and malformed requests.
- Scanner results for safe and suspicious test inputs.
- Error handling and unavailable dependencies.
- Database persistence and scan-history retrieval.
- Frontend-to-backend API communication.
- Production CORS configuration.
- File upload and QR decoding behavior.
- Responsive layout and browser console errors.
- Privacy and secret-management practices.

Report test results based on the tests actually executed; do not treat unrun tests as passing.

## ⚠️ Limitations

PhishShield AI is a threat-assessment aid, not a replacement for professional security tools or human verification.

- **URL analysis:** Heuristics and ML predictions can produce false positives and false negatives.
- **File analysis:** Static analysis does not guarantee detection of every malicious file and is not equivalent to isolated malware detonation.
- **QR analysis:** Detection depends on successful decoding and the capabilities of the applicable content scanner.
- **Phone analysis:** Heuristic checks cannot independently establish a caller's identity or prove that a number is fraudulent.
- **Email and messages:** Text and URL analysis do not necessarily verify full email authentication, sender identity, or all delivery metadata.
- **SocialShield AI:** User-provided information and heuristics cannot establish the real-world identity of a profile owner or access private platform data without authorized integrations.
- **Threat intelligence:** Live external reputation checks are available only if the relevant integrations are configured and operational.
- **Sandbox analysis:** A simulated analysis workflow should not be confused with execution in a real isolated malware-analysis environment.
- **Gmail integration:** Requires its own implementation, authorization, configuration, and deployment.
- **Persistence:** History and reporting depend on successful database writes and connectivity.

A low risk score does not guarantee that content is safe.

## 🔮 Future Enhancements

- Expand real-time threat-intelligence integrations.
- Improve detection using validated datasets and model evaluation.
- Add more email and messaging platform integrations with appropriate authorization.
- Extend browser-based protection workflows.
- Improve detection explanations and false-positive analysis.
- Add stronger authentication, access control, and audit logging.
- Expand automated integration and security testing.
- Explore privacy-preserving threat reporting and collaboration features.

Future enhancements are proposals and should not be interpreted as currently implemented capabilities.

## 👥 Team

**PhishShield AI — VYOM Project**

- **Harshavardhan Ushakola**
- **Ashwith Gurunathkam**

## ⚖️ Disclaimer

PhishShield AI is developed for educational, research, and defensive cybersecurity purposes. Its results are probabilistic assessments and may be incomplete or incorrect.

Users should independently verify important security decisions. Only scan content you are authorized to analyze, and do not use this project to access private accounts, collect personal information without authorization, or conduct unauthorized security testing.

## 📄 License

No license is specified by this README. Before permitting reuse or redistribution, choose an appropriate open-source license and add the corresponding `LICENSE` file to the repository.
