import React, { useState } from 'react'
import {
  AlertTriangle,
  X,
  CheckCircle2,
  Loader2,
  Flag,
  Send,
  Database,
  Building2,
} from 'lucide-react'
import { api, type UrlReportResponse } from '../../services/api'

interface ReportSuspiciousUrlModalProps {
  isOpen: boolean
  url: string
  scanId?: string
  riskScore?: number
  riskCategory?: 'safe' | 'suspicious' | 'high_risk'
  reasons?: string[]
  evidence?: string[]
  onClose: () => void
}

export const ReportSuspiciousUrlModal: React.FC<ReportSuspiciousUrlModalProps> = ({
  isOpen,
  url,
  scanId,
  riskScore,
  riskCategory,
  reasons,
  evidence,
  onClose,
}) => {
  const [explanation, setExplanation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportResult, setReportResult] = useState<UrlReportResponse | null>(null)
  const [confirmedByUser, setConfirmedByUser] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (submitting || reportResult) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await api.reportUrl({
        url,
        scan_id: scanId,
        risk_score: riskScore,
        risk_category: riskCategory,
        user_explanation: explanation.trim() || undefined,
        evidence: evidence || reasons?.slice(0, 5),
      })
      setReportResult(response)
    } catch (err: any) {
      setError(err.message || 'Failed to submit suspicious URL report. Please verify connection to backend.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleModalClose = () => {
    setReportResult(null)
    setError(null)
    setExplanation('')
    setConfirmedByUser(false)
    onClose()
  }

  const isHighRisk = riskCategory === 'high_risk'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="relative w-full max-w-xl rounded-2xl bg-[#04182B] border border-[#EF4444]/40 shadow-[0_0_40px_rgba(239,68,68,0.25)] p-6 sm:p-7 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#EF4444]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${isHighRisk ? 'bg-red-500/15 border-red-500/40 text-red-400' : 'bg-amber-500/15 border-amber-500/40 text-amber-400'} border flex items-center justify-center shadow-lg shrink-0`}>
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 id="report-modal-title" className="text-lg font-bold text-[#F8FAFC]">
                Report Suspicious URL
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Submit threat indicators to security analysis quarantine pipeline
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#061B30] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {reportResult ? (
          <div className="space-y-4 py-2 animate-fadeIn">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-emerald-300">
                  {reportResult.is_duplicate ? 'Report Record Acknowledged' : 'Threat Report Registered'}
                </p>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  {reportResult.message}
                </p>
              </div>
            </div>

            {/* Report Telemetry Badges */}
            <div className="p-3.5 rounded-xl bg-[#061426] border border-[#00D9FF]/20 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Report ID:</span>
                <span className="text-[#00D9FF] font-bold">{reportResult.report_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Target URL:</span>
                <span className="text-[#F8FAFC] truncate max-w-[280px]">{reportResult.url}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Storage Destination:</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" />
                  <span>SQLite Quarantine Vault</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">External Forwarding:</span>
                <span className={reportResult.forwarded_to_external ? 'text-emerald-400' : 'text-[#94A3B8]'}>
                  {reportResult.forwarded_to_external
                    ? `Forwarded (${reportResult.external_department_name})`
                    : 'Local Only (No external department configured)'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-6 py-2.5 rounded-xl bg-[#00D9FF] hover:bg-[#38BDF8] text-[#020B16] font-bold text-xs shadow-[0_0_16px_rgba(0,217,255,0.4)] transition-all cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        ) : (
          /* Report Submission Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Target Pre-filled Information */}
            <div className="space-y-2 p-3.5 rounded-xl bg-[#061426] border border-[#00D9FF]/20 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-[#00D9FF]/10 pb-2">
                <span className="text-[#94A3B8]">Report Target:</span>
                <span className="text-red-400 font-bold truncate max-w-[320px]">{url}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-[#94A3B8]">Scan ID: </span>
                  <span className="text-[#CBD5E1]">{scanId ? scanId.slice(0, 14) + '...' : 'Direct Report'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#94A3B8]">Assessed Threat: </span>
                  <span className={`font-bold ${isHighRisk ? 'text-red-400' : 'text-amber-400'}`}>
                    {riskCategory ? riskCategory.toUpperCase().replace('_', ' ') : 'SUSPICIOUS'} ({riskScore ?? 'N/A'}/100)
                  </span>
                </div>
              </div>
            </div>

            {/* Key Scan Evidence Preview */}
            {(reasons && reasons.length > 0) && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] block">
                  Identified Threat Indicators
                </label>
                <div className="p-3 rounded-xl bg-[#061426]/80 border border-red-500/20 space-y-1.5 max-h-28 overflow-y-auto">
                  {reasons.slice(0, 3).map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#CBD5E1]">
                      <span className="text-red-400">•</span>
                      <span className="line-clamp-2">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Explanation / Context Input */}
            <div className="space-y-1.5">
              <label htmlFor="user-explanation" className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] flex items-center justify-between">
                <span>Optional Explanation / Phishing Lure Context</span>
                <span className="text-[#64748B] text-[10px]">{explanation.length}/1000</span>
              </label>
              <textarea
                id="user-explanation"
                rows={3}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value.slice(0, 1000))}
                placeholder="Where did you find this link? (e.g. unsolicited SMS claiming bank account locked, fraudulent delivery notification, spoofed login portal)..."
                className="w-full rounded-xl bg-[#061426] border border-[#00D9FF]/30 p-3 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] font-mono resize-none shadow-inner"
              />
            </div>

            {/* Department Routing Disclaimer */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#061B30] border border-[#00D9FF]/20 text-[11px] text-[#94A3B8] leading-relaxed">
              <Building2 className="w-4 h-4 text-[#00D9FF] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#CBD5E1] font-semibold">Department Routing Policy</p>
                <p>
                  This report will be archived in the local PhishShield AI quarantine database for threat telemetry. If an external department endpoint is configured, it will be forwarded automatically.
                </p>
              </div>
            </div>

            {/* User Confirmation Checkbox */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="confirm-submit-checkbox"
                checked={confirmedByUser}
                onChange={(e) => setConfirmedByUser(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 text-[#00D9FF] focus:ring-0 bg-[#061426] cursor-pointer"
              />
              <label htmlFor="confirm-submit-checkbox" className="text-xs text-[#CBD5E1] cursor-pointer select-none">
                I confirm this URL appears suspicious or fraudulent and should be flagged for review.
              </label>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#061B30] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !confirmedByUser}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-[0_0_16px_rgba(239,68,68,0.4)] transition-all flex items-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Report...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm & Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
