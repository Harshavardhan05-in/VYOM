import React from 'react'
import { AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react'
import type { HistoryItem } from '../../services/api'

interface RedAlertBannerProps {
  threatRecord: HistoryItem | null
  onViewReport: (scanId: string) => void
}

export const RedAlertBanner: React.FC<RedAlertBannerProps> = ({
  threatRecord,
  onViewReport,
}) => {
  // If no threat record, render secure state
  if (!threatRecord) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-[#04182B] border border-[#10B981]/30 p-6 sm:p-7 shadow-[0_0_24px_rgba(16,185,129,0.15)] select-none">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shadow-[0_0_16px_rgba(16,185,129,0.25)] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F8FAFC]">System Integrity Secure</h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
                No active critical threats detected in recent telemetry. Real-time protection engine running.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#10B981] px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30">
              Score: 0 / 100 • SAFE
            </span>
          </div>
        </div>
      </div>
    )
  }

  const score = threatRecord.risk_score
  const summaryText =
    threatRecord.summary && threatRecord.summary.trim().length > 0
      ? threatRecord.summary
      : `Critical threat indicators identified during ${threatRecord.scanner_type.toUpperCase()} security inspection.`

  return (
    <div
      data-component="red-alert-banner"
      className="relative overflow-hidden rounded-2xl bg-[#04182B] border border-red-500/40 p-6 sm:p-7 shadow-[0_0_30px_rgba(239,68,68,0.20)] select-none transition-all"
    >
      {/* Background glow and cyber grid styling */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 via-transparent to-red-950/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Warning Icon, Title, Target & Action Button (Cols 1-5) */}
        <div className="lg:col-span-5 flex items-start gap-4">
          {/* Large Glowing Red Triangle Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-500/10 border-2 border-red-500/50 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.35)] shrink-0 animate-pulse mt-1">
            <AlertTriangle className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-red-500 tracking-tight leading-none uppercase">
              HIGH RISK DETECTED!
            </h2>
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
              {threatRecord.scanner_type === 'url' ? 'This URL is likely a malicious website.' : `This ${threatRecord.scanner_type} has active malicious indicators.`}
            </h3>
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed line-clamp-2 max-w-lg" title={summaryText}>
              {summaryText}
            </p>

            <div className="pt-2">
              <button
                onClick={() => onViewReport(threatRecord.scan_id)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>View Full Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Center Column: Cyber-Threat Globe with Red Luminous Rings & Labels (Cols 6-9) */}
        <div className="lg:col-span-4 flex items-center justify-center py-2 sm:py-0">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Background Red Nebula Glow */}
            <div className="absolute w-44 h-44 rounded-full bg-red-600/20 blur-2xl pointer-events-none" />

            {/* Outer Rotating Luminous Ring */}
            <div className="absolute inset-2 rounded-full border border-dashed border-red-500/35 animate-[spin_30s_linear_infinite]" />
            <div className="absolute inset-6 rounded-full border border-red-500/20" />

            {/* Glowing Orbit Rings */}
            <div className="absolute w-full h-20 rounded-full border border-red-500/40 rotate-[25deg] shadow-[0_0_12px_rgba(239,68,68,0.25)]" />
            <div className="absolute w-full h-20 rounded-full border border-red-500/30 -rotate-[25deg]" />

            {/* Central Globe SVG */}
            <svg
              className="w-36 h-36 sm:w-40 sm:h-40 text-red-500/60"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              {/* Globe Outline */}
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1.5" className="text-red-500 shadow-[0_0_14px_rgba(239,68,68,0.5)]" />
              {/* Latitude Lines */}
              <ellipse cx="50" cy="50" rx="44" ry="18" stroke="currentColor" />
              <ellipse cx="50" cy="50" rx="44" ry="32" stroke="currentColor" />
              {/* Longitude Lines */}
              <ellipse cx="50" cy="50" rx="18" ry="44" stroke="currentColor" />
              <ellipse cx="50" cy="50" rx="32" ry="44" stroke="currentColor" />
              <line x1="6" y1="50" x2="94" y2="50" stroke="currentColor" />
              <line x1="50" y1="6" x2="50" y2="94" stroke="currentColor" />

              {/* Glowing Nodes / Attack Points */}
              <circle cx="38" cy="38" r="2.5" fill="#EF4444" className="animate-ping origin-center" />
              <circle cx="38" cy="38" r="2" fill="#F87171" />
              <circle cx="62" cy="46" r="2.5" fill="#EF4444" className="animate-ping origin-center" style={{ animationDelay: '1s' }} />
              <circle cx="62" cy="46" r="2" fill="#F87171" />
              <circle cx="50" cy="65" r="2" fill="#EF4444" />
              <circle cx="28" cy="58" r="2" fill="#EF4444" />
            </svg>

            {/* Central Warning Badge */}
            <div className="absolute w-12 h-12 rounded-xl bg-red-600/30 border border-red-500/60 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)] backdrop-blur-xs animate-pulse">
              <AlertTriangle className="w-7 h-7 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
            </div>

            {/* Symmetrical Floating Threat Tags matching reference */}
            <span className="absolute top-4 left-1 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#04182B]/95 border border-red-500/40 text-red-300 font-semibold shadow-[0_0_8px_rgba(239,68,68,0.3)]">
              PHISHING
            </span>
            <span className="absolute bottom-4 left-2 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#04182B]/95 border border-red-500/40 text-red-300 font-semibold shadow-[0_0_8px_rgba(239,68,68,0.3)]">
              MALWARE
            </span>
            <span className="absolute top-4 right-1 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#04182B]/95 border border-red-500/40 text-red-300 font-semibold shadow-[0_0_8px_rgba(239,68,68,0.3)]">
              FAKE WEBSITE
            </span>
            <span className="absolute top-1/2 -right-2 -translate-y-1/2 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#04182B]/95 border border-red-500/40 text-red-300 font-semibold shadow-[0_0_8px_rgba(239,68,68,0.3)]">
              DATA THEFT
            </span>
            <span className="absolute bottom-4 right-2 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#04182B]/95 border border-red-500/40 text-red-300 font-semibold shadow-[0_0_8px_rgba(239,68,68,0.3)]">
              SUSPICIOUS LINK
            </span>
          </div>
        </div>

        {/* Right Column: Risk Level Card (Cols 10-12) */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-[#061426]/90 border border-red-500/40 p-5 space-y-3 shadow-[0_0_20px_rgba(239,68,68,0.15)] min-w-[180px]">
            <div>
              <span className="text-xs font-medium text-[#94A3B8] block">
                Risk Level
              </span>
              <span className="text-xl font-black text-red-500 tracking-wide uppercase block">
                HIGH RISK
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-4xl font-black text-white tracking-tight">
                  {score}
                </span>
                <span className="text-sm font-semibold text-[#94A3B8]">/ 100</span>
              </div>
            </div>

            {/* Glowing Red Progress Bar */}
            <div className="w-full bg-[#020B16] rounded-full h-2.5 overflow-hidden border border-red-500/30">
              <div
                className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
