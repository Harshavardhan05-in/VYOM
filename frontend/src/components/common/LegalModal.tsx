import React from 'react'
import {
  X,
  Shield,
  FileText,
  Lock,
  BookOpen,
  LifeBuoy,
  CheckCircle2,
} from 'lucide-react'

export type LegalModalType =
  | 'privacy'
  | 'terms'
  | 'security-tips'
  | 'documentation'
  | 'support'
  | null

interface LegalModalProps {
  type: LegalModalType
  onClose: () => void
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null

  const contentMap: Record<
    Exclude<LegalModalType, null>,
    { title: string; subtitle: string; icon: React.ElementType; body: React.ReactNode }
  > = {
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Transparency regarding data processing and privacy commitments',
      icon: Lock,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
          <p className="font-semibold text-[#F8FAFC]">
            Effective Date: October 2026 • PhishShield AI v1.0
          </p>
          <div className="space-y-2">
            <h4 className="font-bold text-[#00D9FF]">1. Local-First Processing Commitment</h4>
            <p>
              PhishShield AI adheres to a strict privacy-first principle. Scans performed via our platform (including URLs, file headers, QR codes, phone numbers, and message bodies) are processed by your local or self-hosted PhishShield API engine. We do not sell, rent, or monetize your scan data with third-party advertisers.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-[#00D9FF]">2. What Data is Collected & Stored</h4>
            <p>
              When a scan is initiated, the target string, file metadata, hash (SHA-256), and calculated risk indicators are stored strictly in the application’s local SQLite database (`phishshield.db`) for your personal review in the Scan History tab.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-[#00D9FF]">3. Safe Static File Handling</h4>
            <p>
              Uploaded files are read in-memory to extract magic bytes, format headers, and calculate cryptographic hashes. Uploaded files are never executed on the host server or sent to cloud storage buckets.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-[#00D9FF]">4. User Data Control & Deletion</h4>
            <p>
              You maintain 100% control over your audit logs. Any record in the Scan History can be permanently deleted at any time with a single click, immediately purging it from the database.
            </p>
          </div>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Guidelines and disclaimers for using PhishShield AI',
      icon: FileText,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
          <p className="font-semibold text-[#F8FAFC]">
            Last Updated: October 2026
          </p>
          <div className="space-y-2">
            <h4 className="font-bold text-[#00D9FF]">1. Acceptance of Terms</h4>
            <p>
              By accessing PhishShield AI and using our defense tools, you agree to comply with these Terms of Service. If you disagree with any portion, please refrain from using the platform.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-[#00D9FF]">2. Permitted Security & Defensive Use</h4>
            <p>
              PhishShield AI is provided for defensive cybersecurity awareness, phishing triage, and research purposes. You agree not to use the engine to reverse-engineer security filters or conduct denial-of-service attempts.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-[#00D9FF]">3. Heuristic & Algorithmic Disclaimers</h4>
            <p>
              PhishShield AI employs automated machine learning and heuristic pattern evaluation. While our rules detect high percentages of known phishing patterns, no automated security solution guarantees 100% detection of novel zero-day threats. The user remains ultimately responsible for exercising personal vigilance when handling suspicious communications.
            </p>
          </div>
        </div>
      ),
    },
    'security-tips': {
      title: 'Cybersecurity Best Practices & Tips',
      subtitle: 'Actionable guidelines to safeguard your personal & organizational digital footprint',
      icon: Shield,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
          <div className="p-3 rounded-xl bg-[#061426] border border-[#00D9FF]/20 space-y-2">
            <div className="flex items-center gap-2 text-[#00D9FF] font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>1. Inspect the Address Bar & Exact Domain Spelling</span>
            </div>
            <p className="text-xs text-[#CBD5E1]">
              Phishers frequently register lookalike domains using Cyrillic homoglyphs or hyphenated suffixes (e.g., `micros0ft.com` or `paypal-login-security.com`). Always verify the exact root domain before entering credentials.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#061426] border border-[#00D9FF]/20 space-y-2">
            <div className="flex items-center gap-2 text-[#00D9FF] font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>2. Beware of Artificial Urgency & Fear Tactics</span>
            </div>
            <p className="text-xs text-[#CBD5E1]">
              Legitimate organizations rarely demand password resets within strict 24-hour windows under threat of account deletion. Stop, take a breath, and contact the service through official verified channels.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#061426] border border-[#00D9FF]/20 space-y-2">
            <div className="flex items-center gap-2 text-[#00D9FF] font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>3. Scan QR Codes Before Opening URLs</span>
            </div>
            <p className="text-xs text-[#CBD5E1]">
              Quishing attacks trick mobile users into scanning posters, parking meters, or email graphics. Use the PhishShield QR Scanner to decode the underlying target before visiting it.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#061426] border border-[#00D9FF]/20 space-y-2">
            <div className="flex items-center gap-2 text-[#00D9FF] font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>4. Verify File Extensions for Double Extensions</span>
            </div>
            <p className="text-xs text-[#CBD5E1]">
              Windows hides known file extensions by default. An attacker may name a malware executable `Resume.pdf.exe`. PhishShield File Scanner safely inspects header magic bytes to detect disguised formats.
            </p>
          </div>
        </div>
      ),
    },
    documentation: {
      title: 'Platform Documentation & Architecture',
      subtitle: 'Technical specifications of the PhishShield AI engine',
      icon: BookOpen,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed font-mono">
          <div className="space-y-2">
            <h4 className="font-bold text-[#00D9FF]">Multi-Scanner Defense Pipeline</h4>
            <p className="text-xs">
              PhishShield AI features 6 specialized defensive intelligence engines:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-[#94A3B8]">
              <li><strong>URL Scanner:</strong> 15+ deterministic heuristic rules + scikit-learn classifier.</li>
              <li><strong>File Scanner:</strong> Static PE headers, magic bytes, RTLO character spoofing, SHA-256.</li>
              <li><strong>QR Scanner:</strong> OpenCV QRCodeDetector decoding with downstream URL analysis.</li>
              <li><strong>Phone Checker:</strong> ITU-T E.164 compliance, country detection, Wangiri prefix checks.</li>
              <li><strong>Email Scanner:</strong> Credential harvesting triggers, urgency NLP, extracted URL analysis.</li>
              <li><strong>SocialShield AI:</strong> Lookalike handle analysis, financial fraud & crypto doubling heuristics.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[#00D9FF]">API Endpoints (FastAPI)</h4>
            <div className="p-2.5 rounded bg-[#061426] border border-[#00D9FF]/20 text-[11px] space-y-1">
              <div><code>POST /api/v1/scan</code> - URL Threat Inspection</div>
              <div><code>POST /api/v1/scan/file</code> - Static File Analysis</div>
              <div><code>POST /api/v1/scan/qr</code> - QR Code Matrix Analysis</div>
              <div><code>POST /api/v1/scan/phone</code> - Phone Reputation Check</div>
              <div><code>POST /api/v1/scan/email</code> - Message & Header Audit</div>
              <div><code>POST /api/v1/scan/social</code> - Social Profile Impersonation</div>
              <div><code>GET  /api/v1/history</code> - Query persistent scan records</div>
              <div><code>GET  /api/v1/dashboard/stats</code> - Real telemetry statistics</div>
            </div>
          </div>
        </div>
      ),
    },
    support: {
      title: 'Help & Support Desk',
      subtitle: 'Community resources and technical assistance',
      icon: LifeBuoy,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
          <p>
            PhishShield AI is an open defensive security project. If you encounter an unclassified phishing kit, false positive, or wish to contribute signatures to the rule engine:
          </p>
          <div className="p-4 rounded-xl bg-[#061426] border border-[#00D9FF]/25 space-y-3">
            <div className="flex items-center gap-2 text-[#00D9FF] font-bold">
              <LifeBuoy className="h-4 w-4" />
              <span>Direct Incident Reporting</span>
            </div>
            <p className="text-xs">
              To report new phishing lures or submit zero-day signatures, export the JSON audit log from your Scan History and file a pull request on the repository.
            </p>
          </div>
        </div>
      ),
    },
  }

  const current = contentMap[type]
  const Icon = current.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020B16]/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-[#04182B] border border-[#00D9FF]/40 shadow-[0_0_50px_rgba(0,217,255,0.25)] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#00D9FF]/20 flex items-center justify-between shrink-0 bg-[#061426]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#111C30] border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.2)]">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                {current.title}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                {current.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111C30] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {current.body}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#00D9FF]/20 flex items-center justify-end shrink-0 bg-[#061426]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#00D9FF] text-[#020B16] font-semibold text-xs hover:bg-[#38BDF8] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
