import React from 'react'
import { AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { HistoryItem } from '../../services/api'

interface RedAlertBannerProps {
  threatRecord: HistoryItem | null
  safeRecord?: HistoryItem | null
  onViewReport: (scanId: string) => void
  activeView?: 'threat' | 'safe'
  onToggleView?: (view: 'threat' | 'safe') => void
}

export const RedAlertBanner: React.FC<RedAlertBannerProps> = ({
  threatRecord,
  safeRecord,
  onViewReport,
  activeView = 'threat',
  onToggleView,
}) => {
  // Determine whether to display the red threat view or the green safe view
  const isSafeMode = activeView === 'safe' || (!threatRecord && safeRecord) || (!threatRecord && !safeRecord)

  // =========================================================================
  // 1. PROMINENT GREEN SAFE / SECURE BANNER (Equal in size & visual hierarchy)
  // =========================================================================
  if (isSafeMode) {
    const displaySafe = safeRecord || null
    const safeScore = displaySafe ? displaySafe.risk_score : 0
    const safeTarget = displaySafe ? displaySafe.input_target : 'Autonomous Protection Engine'
    const safeSummary = displaySafe?.summary && displaySafe.summary.trim().length > 0
      ? displaySafe.summary
      : 'No significant threats detected. All inspected endpoints and active telemetry passed security heuristics with zero malicious signatures.'

    return (
      <div
        data-component="safe-alert-banner"
        className="relative overflow-hidden rounded-2xl bg-[#04182B] border-2 border-[#22C55E]/45 p-6 sm:p-7 shadow-[0_0_30px_rgba(34,197,94,0.20)] select-none transition-all animate-fadeIn"
      >
        {/* Background glow and cyber grid styling */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#052E1A]/40 via-transparent to-[#052E1A]/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />

        {/* View Switcher Pills (If both threat and safe records exist) */}
        {threatRecord && onToggleView && (
          <div className="relative z-20 flex items-center justify-end gap-2 mb-4 pb-3 border-b border-[#22C55E]/20">
            <span className="text-[11px] font-mono text-[#94A3B8] mr-1">Preview Banner State:</span>
            <button
              type="button"
              onClick={() => onToggleView('threat')}
              className="px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all bg-[#061426] border border-red-500/40 text-red-400 hover:bg-red-500/15 cursor-pointer"
            >
              🚨 Active Threat Alert
            </button>
            <button
              type="button"
              onClick={() => onToggleView('safe')}
              className="px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all bg-[#22C55E]/20 border border-[#22C55E]/60 text-[#4ADE80] shadow-[0_0_12px_rgba(34,197,94,0.3)] cursor-pointer"
            >
              🛡️ System Defense (Safe)
            </button>
          </div>
        )}

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Shield Icon, Title, Description & Action Button (Cols 1-5) */}
          <div className="lg:col-span-5 flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#22C55E]/15 border-2 border-[#22C55E]/50 flex items-center justify-center text-[#4ADE80] shadow-[0_0_30px_rgba(34,197,94,0.35)] shrink-0 mt-1">
              <ShieldCheck className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.9)] animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-black text-[#4ADE80] tracking-tight leading-none uppercase">
                  SYSTEM INTEGRITY SECURE
                </h2>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                {displaySafe ? `Verified Clean Target: ${safeTarget.slice(0, 32)}...` : 'Zero Active Threat Detections in Telemetry'}
              </h3>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed line-clamp-2 max-w-lg" title={safeSummary}>
                {safeSummary}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onViewReport(displaySafe ? displaySafe.scan_id : '')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#22C55E] hover:from-emerald-500 hover:to-[#4ADE80] text-[#020B16] font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#020B16]" />
                  <span>{displaySafe ? 'Inspect Verified Telemetry' : 'Audit Security Database'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Center Column: Cyber-Defense Shield & Globe with Green Luminous Rings (Cols 6-9) */}
          <div className="lg:col-span-4 flex items-center justify-center py-2 sm:py-0">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              {/* Background Green Nebula Glow */}
              <div className="absolute w-44 h-44 rounded-full bg-[#22C55E]/20 blur-2xl pointer-events-none" />

              {/* Outer Rotating Luminous Ring */}
              <div className="absolute inset-2 rounded-full border border-dashed border-[#22C55E]/40 animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-6 rounded-full border border-[#22C55E]/25" />

              {/* Glowing Orbit Rings */}
              <div className="absolute w-full h-20 rounded-full border border-[#22C55E]/45 rotate-[25deg] shadow-[0_0_14px_rgba(34,197,94,0.30)]" />
              <div className="absolute w-full h-20 rounded-full border border-[#22C55E]/35 -rotate-[25deg]" />

              {/* Central Globe SVG */}
              <svg
                className="w-36 h-36 sm:w-40 sm:h-40 text-[#22C55E]/60"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                {/* Globe Outline */}
                <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1.5" className="text-[#22C55E] shadow-[0_0_14px_rgba(34,197,94,0.5)]" />
                {/* Latitude Lines */}
                <ellipse cx="50" cy="50" rx="44" ry="18" stroke="currentColor" />
                <ellipse cx="50" cy="50" rx="44" ry="32" stroke="currentColor" />
                {/* Longitude Lines */}
                <ellipse cx="50" cy="50" rx="18" ry="44" stroke="currentColor" />
                <ellipse cx="50" cy="50" rx="32" ry="44" stroke="currentColor" />
                <line x1="6" y1="50" x2="94" y2="50" stroke="currentColor" />
                <line x1="50" y1="6" x2="50" y2="94" stroke="currentColor" />

                {/* Glowing Green Defense Nodes */}
                <circle cx="38" cy="38" r="2.5" fill="#22C55E" className="animate-ping origin-center" />
                <circle cx="38" cy="38" r="2" fill="#4ADE80" />
                <circle cx="62" cy="46" r="2.5" fill="#22C55E" className="animate-ping origin-center" style={{ animationDelay: '1s' }} />
                <circle cx="62" cy="46" r="2" fill="#4ADE80" />
                <circle cx="50" cy="65" r="2" fill="#22C55E" />
                <circle cx="28" cy="58" r="2" fill="#22C55E" />
              </svg>

              {/* Central Shield Badge */}
              <div className="absolute w-12 h-12 rounded-xl bg-[#22C55E]/30 border border-[#22C55E]/60 flex items-center justify-center text-[#4ADE80] shadow-[0_0_20px_rgba(34,197,94,0.7)] backdrop-blur-xs">
                <ShieldCheck className="w-7 h-7 drop-shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
              </div>

              {/* Symmetrical Floating Defense Tags */}
              <span className="absolute top-4 left-1 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#04182B]/95 border border-[#22C55E]/50 text-[#4ADE80] font-bold shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                PROTECTED
              </span>
              <span className="absolute bottom-4 left-2 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#04182B]/95 border border-[#22C55E]/50 text-[#4ADE80] font-bold shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                CLEAN SYSTEM
              </span>
              <span className="absolute top-4 right-1 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#04182B]/95 border border-[#22C55E]/50 text-[#4ADE80] font-bold shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                ZERO THREATS
              </span>
              <span className="absolute top-1/2 -right-2 -translate-y-1/2 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#04182B]/95 border border-[#22C55E]/50 text-[#4ADE80] font-bold shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                ENCRYPTED
              </span>
              <span className="absolute bottom-4 right-2 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#04182B]/95 border border-[#22C55E]/50 text-[#4ADE80] font-bold shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                HEURISTICS OK
              </span>
            </div>
          </div>

          {/* Right Column: Security Rating Card (Cols 10-12) */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-[#052E1A]/85 border-2 border-[#22C55E]/45 p-5 space-y-3 shadow-[0_0_24px_rgba(34,197,94,0.20)] min-w-[180px]">
              <div>
                <span className="text-xs font-medium text-[#CBD5E1] block">
                  Assessment Status
                </span>
                <span className="text-xl font-black text-[#4ADE80] tracking-wide uppercase block">
                  SAFE / LOW RISK
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-4xl font-black text-white tracking-tight">
                    {safeScore}
                  </span>
                  <span className="text-sm font-semibold text-[#CBD5E1]">/ 100 Risk</span>
                </div>
              </div>

              {/* Glowing Green Progress Bar */}
              <div className="w-full bg-[#020B16] rounded-full h-2.5 overflow-hidden border border-[#22C55E]/30">
                <div
                  className="bg-gradient-to-r from-emerald-600 via-[#22C55E] to-[#4ADE80] h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(34,197,94,0.8)]"
                  style={{ width: `${Math.max(5, Math.min(100, safeScore === 0 ? 5 : safeScore))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // 2. PRESERVED RED THREAT WARNING BANNER (High-Risk / Suspicious)
  // =========================================================================
  if (!threatRecord) {
    return null
  }

  const score = threatRecord.risk_score
  const summaryText =
    threatRecord.summary && threatRecord.summary.trim().length > 0
      ? threatRecord.summary
      : `Critical threat indicators identified during ${threatRecord.scanner_type.toUpperCase()} security inspection.`

  return (
    <div
      data-component="red-alert-banner"
      className="relative overflow-hidden rounded-2xl bg-[#04182B] border-2 border-red-500/50 p-6 sm:p-7 shadow-[0_0_30px_rgba(239,68,68,0.25)] select-none transition-all animate-fadeIn"
    >
      {/* Background glow and cyber grid styling */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 via-transparent to-red-950/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* View Switcher Pills */}
      {onToggleView && (
        <div className="relative z-20 flex items-center justify-end gap-2 mb-4 pb-3 border-b border-red-500/20">
          <span className="text-[11px] font-mono text-[#94A3B8] mr-1">Preview Banner State:</span>
          <button
            type="button"
            onClick={() => onToggleView('threat')}
            className="px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all bg-red-500/20 border border-red-500/60 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)] cursor-pointer"
          >
            🚨 Active Threat Alert
          </button>
          <button
            type="button"
            onClick={() => onToggleView('safe')}
            className="px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all bg-[#061426] border border-[#22C55E]/40 text-[#4ADE80] hover:bg-[#22C55E]/15 cursor-pointer"
          >
            🛡️ System Defense (Safe)
          </button>
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Warning Icon, Title, Target & Action Button (Cols 1-5) */}
        <div className="lg:col-span-5 flex items-start gap-4">
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
                type="button"
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

            {/* Symmetrical Floating Threat Tags */}
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
