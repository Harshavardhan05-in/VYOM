import React, { useState } from 'react'
import {
  Mail,
  Search,
  Loader2,
  AlertCircle,
  FileCode,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { api, type EmailScanResponse } from '../../services/api'
import { RiskReport } from './RiskReport'

export const EmailScannerView: React.FC = () => {
  const [sender, setSender] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [rawHeaders, setRawHeaders] = useState('')
  const [showHeaders, setShowHeaders] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<EmailScanResponse | null>(null)

  const samplePhishing = {
    sender: 'security@micros0ft-support-alert.com',
    subject: 'URGENT: Your Office 365 Account Will Be Suspended Within 24 Hours',
    body: `Dear Valued Customer,\n\nWe detected an unauthorized login attempt from Russia. Your account credentials must be verified immediately to prevent permanent termination.\n\nPlease visit the official verification portal below:\nhttp://paypal-security-update-center.xyz/login\n\nFailure to verify within 24 hours will result in loss of mailbox data.\n\nIT Support Team`,
    headers: `From: "IT Support" <security@micros0ft-support-alert.com>\nReply-To: phisher@attacker-server.ru\nReceived: from unknown (HELO spoofed.local) (198.51.100.24)\nAuthentication-Results: spf=fail; dkim=fail`,
  }

  const sampleLegitimate = {
    sender: 'notifications@github.com',
    subject: '[GitHub] A personal access token has expired',
    body: `Hi developer,\n\nYour personal access token "CI-Pipeline" expired today. If you still need this token, you can generate a new one at https://github.com/settings/tokens.\n\nThanks,\nThe GitHub Team`,
    headers: `From: GitHub <notifications@github.com>\nAuthentication-Results: spf=pass; dkim=pass`,
  }

  const handleScan = async () => {
    if (!body.trim()) {
      setError('Please provide message or email body content to inspect.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api.scanEmail(body, subject, sender, rawHeaders)
      setResult(response)
    } catch (err: any) {
      setError(err.message || 'Email analysis failed. Ensure backend engine is online.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <RiskReport
        title="Email & Message Threat Assessment"
        target={result.subject || result.sender || 'Direct Message Inspection'}
        scannerType="email"
        riskScore={result.risk_score}
        riskCategory={result.risk_category}
        findings={result.findings}
        triggeredFindings={result.triggered_findings}
        reasons={result.reasons}
        recommendedActions={result.recommended_actions}
        scannedAt={result.scanned_at}
        analysisMethod={result.analysis_method}
        limitations={result.limitations}
        scanId={result.scan_id}
        metadata={{
          Sender_Analyzed: result.sender || 'Not Specified',
          Extracted_URLs: `${result.extracted_urls.length} link(s) found`,
          Threat_Vectors: result.detected_vectors.join(', ') || 'None Detected',
        }}
        onScanAnother={() => {
          setResult(null)
          setBody('')
          setSubject('')
          setSender('')
          setRawHeaders('')
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Input Console */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 shadow-[0_8px_30px_rgba(2,11,22,0.8)] space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#00D9FF]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#F8FAFC]">
              Email, SMS & Direct Message Threat Inspection
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#CBD5E1]">
            Inspect email content and messaging lures for urgency triggers, credential harvesting language, zero-font evasion, SPF/DKIM header tampering, and embedded malicious links.
          </p>
        </div>

        {/* Sender & Subject Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-1.5">
              Sender Email or Display Name (Optional)
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. security-team@paypal-support.xyz"
              className="w-full bg-[#061426] border border-[#00D9FF]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-1.5">
              Subject Line (Optional)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Urgent: Account Verification Required"
              className="w-full bg-[#061426] border border-[#00D9FF]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF]"
            />
          </div>
        </div>

        {/* Body Textarea */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-1.5">
            Message Body / Content (Required)
          </label>
          <textarea
            rows={5}
            value={body}
            onChange={(e) => {
              setBody(e.target.value)
              if (error) setError(null)
            }}
            placeholder="Paste the raw text of the suspicious email, SMS, or chat message here..."
            className="w-full bg-[#061426] border border-[#00D9FF]/30 rounded-xl p-3.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF]/30 font-mono resize-y"
          />
        </div>

        {/* Optional Raw Headers Accordion */}
        <div className="rounded-xl border border-[#00D9FF]/20 bg-[#061426]/60 p-3">
          <button
            type="button"
            onClick={() => setShowHeaders(!showHeaders)}
            className="w-full flex items-center justify-between text-left text-xs font-semibold text-[#CBD5E1] hover:text-[#00D9FF] transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-[#00D9FF]" />
              <span>Include Raw Email Headers (SPF, DKIM, Received Hops)</span>
            </div>
            {showHeaders ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showHeaders && (
            <div className="mt-3 pt-3 border-t border-[#00D9FF]/15">
              <textarea
                rows={4}
                value={rawHeaders}
                onChange={(e) => setRawHeaders(e.target.value)}
                placeholder="Paste RFC 822 / 5322 headers (e.g. Authentication-Results, Received:, Reply-To:)..."
                className="w-full bg-[#020B16] border border-[#00D9FF]/20 rounded-lg p-2.5 text-[11px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] font-mono"
              />
            </div>
          )}
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Sample Loaders & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-[#94A3B8]">Load Sample:</span>
            <button
              type="button"
              onClick={() => {
                setSender(samplePhishing.sender)
                setSubject(samplePhishing.subject)
                setBody(samplePhishing.body)
                setRawHeaders(samplePhishing.headers)
                setShowHeaders(true)
              }}
              className="text-xs px-2.5 py-1 rounded bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/25 transition-colors font-mono"
            >
              Phishing Lure
            </button>
            <button
              type="button"
              onClick={() => {
                setSender(sampleLegitimate.sender)
                setSubject(sampleLegitimate.subject)
                setBody(sampleLegitimate.body)
                setRawHeaders(sampleLegitimate.headers)
                setShowHeaders(true)
              }}
              className="text-xs px-2.5 py-1 rounded bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981]/25 transition-colors font-mono"
            >
              Safe Notification
            </button>
          </div>

          <button
            onClick={handleScan}
            disabled={loading || !body.trim()}
            className="px-6 py-2.5 rounded-lg bg-[#00D9FF] text-[#020B16] hover:bg-[#38BDF8] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-xs transition-all shadow-[0_0_12px_rgba(0,217,255,0.3)] flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Parsing Message...</span>
              </>
            ) : (
              <>
                <Search className="h-3.5 w-3.5" />
                <span>Inspect Message Content</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
