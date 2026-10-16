import React, { useState, useMemo } from 'react'
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Info,
  Copy,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  ExternalLink,
  Flag,
} from 'lucide-react'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import type { SecurityFinding } from '../../services/api'
import { SafeBrowsingConfirmModal } from './SafeBrowsingConfirmModal'
import { ReportSuspiciousUrlModal } from './ReportSuspiciousUrlModal'

interface RiskReportProps {
  title: string
  target: string
  riskScore: number
  riskCategory: 'safe' | 'suspicious' | 'high_risk'
  findings: SecurityFinding[]
  triggeredFindings: SecurityFinding[]
  reasons: string[]
  recommendedActions: string[]
  scannedAt: string
  analysisMethod: string
  limitations: string[]
  scanId: string
  metadata?: Record<string, any>
  onScanAnother: () => void
  scannerType?: 'url' | 'file' | 'qr' | 'phone' | 'email' | 'social'
}

export const RiskReport: React.FC<RiskReportProps> = ({
  title,
  target,
  riskScore,
  riskCategory,
  findings,
  triggeredFindings,
  reasons,
  recommendedActions,
  scannedAt,
  analysisMethod,
  limitations,
  scanId,
  metadata,
  onScanAnother,
  scannerType,
}) => {
  const [copied, setCopied] = useState(false)
  const [showAllFindings, setShowAllFindings] = useState(false)
  const [showLimitations, setShowLimitations] = useState(false)
  const [showSafeBrowsingModal, setShowSafeBrowsingModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  // Identify whether the analyzed target is a URL eligible for browsing/reporting actions
  const isUrlTarget = useMemo(() => {
    if (scannerType) return scannerType === 'url'
    if (!target) return false
    const t = target.trim().toLowerCase()
    return t.startsWith('http://') || t.startsWith('https://') || title.toLowerCase().includes('url')
  }, [target, title, scannerType])

  const handleCopyId = () => {
    navigator.clipboard?.writeText(scanId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const categoryConfig = {
    safe: {
      label: 'Safe / Low Threat',
      badgeVariant: 'success' as const,
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.4)',
      icon: ShieldCheck,
      description: 'No critical malicious heuristics or deceptive indicators were detected.',
    },
    suspicious: {
      label: 'Suspicious Activity',
      badgeVariant: 'warning' as const,
      color: '#F59E0B',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'rgba(245, 158, 11, 0.4)',
      icon: AlertTriangle,
      description: 'Multiple heuristic anomalies detected. Exercise elevated caution before interacting.',
    },
    high_risk: {
      label: 'High Risk / Malicious',
      badgeVariant: 'danger' as const,
      color: '#EF4444',
      bgGlow: 'rgba(239, 68, 68, 0.2)',
      borderColor: 'rgba(239, 68, 68, 0.5)',
      icon: AlertOctagon,
      description: 'Significant threat indicators identified. Do not trust or submit sensitive credentials.',
    },
  }[riskCategory] || {
    label: 'Evaluated',
    badgeVariant: 'neutral' as const,
    color: '#00D9FF',
    bgGlow: 'rgba(0, 217, 255, 0.15)',
    borderColor: 'rgba(0, 217, 255, 0.4)',
    icon: ShieldAlert,
    description: 'Security inspection complete.',
  }

  const CategoryIcon = categoryConfig.icon

  // Gauge calculation for circular SVG meter
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, riskScore)) / 100) * circumference

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Threat Meter Card */}
      <div
        className="relative overflow-hidden rounded-2xl bg-[#04182B] border p-6 sm:p-7 shadow-[0_8px_30px_rgba(2,11,22,0.8)] transition-all"
        style={{ borderColor: categoryConfig.borderColor }}
      >
        {/* Subtle Ambient Glow */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: categoryConfig.bgGlow }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Target Title & Summary */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs uppercase tracking-wider text-[#94A3B8]">
                {title}
              </span>
              <Badge variant={categoryConfig.badgeVariant} size="sm" dot>
                {categoryConfig.label}
              </Badge>
              <span className="font-mono text-[11px] text-[#00D9FF] bg-[#061B30] px-2 py-0.5 rounded border border-[#00D9FF]/30">
                {analysisMethod}
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight break-all font-mono">
                {target}
              </h2>
              <p className="text-xs sm:text-sm text-[#CBD5E1] mt-1">
                {categoryConfig.description}
              </p>
            </div>

            {/* Scan ID & Timestamp */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#94A3B8] font-mono pt-1">
              <span className="flex items-center gap-1.5">
                <Fingerprint className="h-3.5 w-3.5 text-[#00D9FF]" />
                <span>ID: {scanId.slice(0, 16)}...</span>
                <button
                  onClick={handleCopyId}
                  title="Copy full scan ID"
                  className="hover:text-[#00D9FF] text-[#64748B] transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-[#10B981]" /> : <Copy className="h-3 w-3" />}
                </button>
              </span>
              <span>•</span>
              <span>{new Date(scannedAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Circular Score Gauge */}
          <div className="flex flex-col items-center justify-center shrink-0 p-3 sm:p-4 rounded-xl bg-[#061426]/90 border border-[#00D9FF]/20">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#111C30"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Animated Score Progress */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={categoryConfig.color}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span
                  className="text-2xl font-extrabold tracking-tight font-mono"
                  style={{ color: categoryConfig.color }}
                >
                  {riskScore}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8]">
                  / 100 Risk
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Context-Aware Action Banner for Safe or Suspicious URLs */}
      {isUrlTarget && riskCategory === 'safe' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#04182B] to-emerald-950/20 border border-[#10B981]/40 shadow-[0_0_24px_rgba(16,185,129,0.18)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shadow-[0_0_16px_rgba(16,185,129,0.3)] shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-300">
                  No significant threats detected
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  Clean Scan
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] mt-0.5 leading-relaxed">
                Heuristic and machine learning models found no deceptive patterns or malicious signatures on this target.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSafeBrowsingModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#020B16] font-bold text-xs shadow-[0_0_16px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 shrink-0 cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Continue Browsing</span>
          </button>
        </div>
      )}

      {isUrlTarget && (riskCategory === 'suspicious' || riskCategory === 'high_risk') && (
        <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${riskCategory === 'high_risk' ? 'from-red-950/50 border-red-500/50 shadow-[0_0_24px_rgba(239,68,68,0.2)]' : 'from-amber-950/40 border-amber-500/40 shadow-[0_0_24px_rgba(245,158,11,0.18)]'} via-[#04182B] to-transparent border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
          <div className="flex items-start gap-3.5">
            <div className={`w-10 h-10 rounded-xl ${riskCategory === 'high_risk' ? 'bg-red-500/15 border-red-500/40 text-red-400 shadow-[0_0_16px_rgba(239,68,68,0.3)]' : 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.3)]'} border flex items-center justify-center shrink-0 mt-0.5`}>
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${riskCategory === 'high_risk' ? 'text-red-300' : 'text-amber-300'}`}>
                  Threat Indicators Detected — Exercise Caution
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${riskCategory === 'high_risk' ? 'bg-red-500/15 border-red-500/30 text-red-400' : 'bg-amber-500/15 border-amber-500/30 text-amber-400'}`}>
                  {riskCategory === 'high_risk' ? 'Critical Risk' : 'Suspicious Signals'}
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] mt-0.5 leading-relaxed">
                This URL exhibits characteristics commonly associated with credential harvesting or domain impersonation. Submit an official threat report to archive it in the security repository.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className={`px-5 py-2.5 rounded-xl ${riskCategory === 'high_risk' ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-[0_0_16px_rgba(239,68,68,0.4)]' : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-[0_0_16px_rgba(245,158,11,0.4)]'} text-white font-bold text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer self-stretch sm:self-auto justify-center`}
          >
            <Flag className="w-4 h-4" />
            <span>Report Suspicious URL</span>
          </button>
        </div>
      )}

      {/* Metadata Highlights (If present) */}
      {metadata && Object.keys(metadata).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(metadata).map(([key, val]) => (
            <div
              key={key}
              className="p-3 rounded-xl bg-[#04182B] border border-[#00D9FF]/20 space-y-1"
            >
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8] block truncate">
                {key.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-semibold text-[#F8FAFC] font-mono truncate block" title={String(val)}>
                {String(val)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Key Threat Reasons / Triggers */}
      {reasons.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 space-y-3">
          <div className="flex items-center gap-2">
            <CategoryIcon className="h-4 w-4" style={{ color: categoryConfig.color }} />
            <h3 className="text-sm font-bold text-[#F8FAFC] tracking-wide">
              Primary Threat Assessment Indicators
            </h3>
          </div>
          <ul className="space-y-2">
            {reasons.map((reason, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-[#CBD5E1] bg-[#061B30]/60 p-2.5 rounded-lg border border-[#00D9FF]/15"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: categoryConfig.color }}
                />
                <span className="leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Action Protocol */}
      {recommendedActions.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#00D9FF]" />
            <h3 className="text-sm font-bold text-[#F8FAFC] tracking-wide">
              Recommended Defensive Actions
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {recommendedActions.map((action, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 rounded-lg bg-[#061426] border border-[#00D9FF]/20 text-xs text-[#CBD5E1]"
              >
                <span className="text-[#00D9FF] font-bold font-mono">#{idx + 1}</span>
                <span className="leading-relaxed">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comprehensive Security Rule Findings */}
      <div className="p-5 rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#00D9FF]" />
            <h3 className="text-sm font-bold text-[#F8FAFC] tracking-wide">
              Deep Heuristic Rule Inspection
            </h3>
          </div>
          <button
            onClick={() => setShowAllFindings(!showAllFindings)}
            className="text-xs text-[#00D9FF] hover:underline flex items-center gap-1 font-medium font-mono"
          >
            {showAllFindings ? 'Show Triggered Only' : `Show All Rules (${findings.length})`}
            {showAllFindings ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        <div className="divide-y divide-[#00D9FF]/15">
          {(showAllFindings ? findings : (triggeredFindings.length > 0 ? triggeredFindings : findings.slice(0, 3))).map((finding) => (
            <div key={finding.rule_id} className="py-3 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      finding.triggered
                        ? finding.severity === 'critical' || finding.severity === 'high'
                          ? 'bg-[#EF4444] shadow-[0_0_6px_#EF4444]'
                          : 'bg-[#F59E0B]'
                        : 'bg-[#10B981]'
                    }`}
                  />
                  <span className="text-xs font-semibold text-[#F8FAFC]">
                    {finding.title}
                  </span>
                  <span className="font-mono text-[10px] text-[#64748B]">
                    [{finding.rule_id}]
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      finding.severity === 'critical' || finding.severity === 'high'
                        ? 'danger'
                        : finding.severity === 'medium'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {finding.severity}
                  </Badge>
                  {finding.score_contribution > 0 && (
                    <span className="text-[11px] font-mono text-[#F59E0B]">
                      +{finding.score_contribution} pts
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {finding.explanation}
              </p>

              {finding.evidence && (
                <div className="p-2 rounded bg-[#061426] border border-[#00D9FF]/15 text-[11px] font-mono text-[#00D9FF] break-all">
                  <span className="text-[#64748B] mr-2">Evidence:</span>
                  {finding.evidence}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Honest Heuristic Limitations Accordion */}
      {limitations.length > 0 && (
        <div className="rounded-xl border border-[#00D9FF]/20 bg-[#061426]/70 p-4">
          <button
            onClick={() => setShowLimitations(!showLimitations)}
            className="w-full flex items-center justify-between text-left text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-[#00D9FF]" />
              <span>Security Engineering & Methodology Limitations</span>
            </div>
            {showLimitations ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showLimitations && (
            <ul className="mt-3 space-y-1.5 text-[11px] text-[#94A3B8] leading-relaxed list-disc list-inside border-t border-[#00D9FF]/10 pt-3">
              {limitations.map((limitation, i) => (
                <li key={i}>{limitation}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Action Footer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onScanAnother}
          icon={<RotateCcw className="h-3.5 w-3.5" />}
        >
          Scan Another Target
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          {isUrlTarget && riskCategory === 'safe' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSafeBrowsingModal(true)}
              icon={<ExternalLink className="h-3.5 w-3.5" />}
              className="!bg-[#10B981] hover:!bg-[#059669] !text-[#020B16] !border-[#10B981] shadow-[0_0_14px_rgba(16,185,129,0.3)] font-bold cursor-pointer"
            >
              Continue Browsing
            </Button>
          )}

          {isUrlTarget && (riskCategory === 'suspicious' || riskCategory === 'high_risk') && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowReportModal(true)}
              icon={<Flag className="h-3.5 w-3.5" />}
              className="shadow-[0_0_14px_rgba(239,68,68,0.3)] font-bold cursor-pointer"
            >
              Report Suspicious URL
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const blob = new Blob(
                [
                  JSON.stringify(
                    {
                      scan_id: scanId,
                      target,
                      risk_score: riskScore,
                      risk_category: riskCategory,
                      findings,
                      reasons,
                      recommended_actions: recommendedActions,
                      scanned_at: scannedAt,
                      metadata,
                    },
                    null,
                    2
                  ),
                ],
                { type: 'application/json' }
              )
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `phishshield-scan-${scanId.slice(0, 8)}.json`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            Download Audit Report (JSON)
          </Button>
        </div>
      </div>

      {/* 1. Safe Browsing Confirmation Modal */}
      <SafeBrowsingConfirmModal
        isOpen={showSafeBrowsingModal}
        url={target}
        onClose={() => setShowSafeBrowsingModal(false)}
      />

      {/* 2. Report Suspicious URL Modal */}
      <ReportSuspiciousUrlModal
        isOpen={showReportModal}
        url={target}
        scanId={scanId}
        riskScore={riskScore}
        riskCategory={riskCategory}
        reasons={reasons}
        evidence={triggeredFindings.map((f) => `${f.title}: ${f.evidence || f.explanation}`)}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  )
}
