import React from 'react'
import { X, CheckCircle, ShieldCheck, AlertOctagon, AlertTriangle } from 'lucide-react'

interface ScanDetailModalProps {
  record: any | null
  onClose: () => void
}

export const ScanDetailModal: React.FC<ScanDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null

  const isHigh = record.risk_category === 'high_risk'
  const isSusp = record.risk_category === 'suspicious'
  const isSafe = !isHigh && !isSusp

  const findings = record.findings || []
  const triggeredFindings = findings.filter((f: any) => f.triggered || f.score_contribution > 0)
  const recommendations = record.recommended_actions || record.recommendations || []
  const reasons = record.reasons || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020B16]/85 backdrop-blur-md animate-fadeIn select-none">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#04182B] p-6 sm:p-7 space-y-5 text-[#F8FAFC] transition-all ${
          isHigh
            ? 'border-2 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.25)]'
            : isSusp
            ? 'border-2 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.20)]'
            : 'border-2 border-[#22C55E]/45 shadow-[0_0_50px_rgba(34,197,94,0.25)]'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${isSafe ? 'border-[#22C55E]/20' : 'border-[#00D9FF]/20'}`}>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${
                isHigh
                  ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_14px_rgba(239,68,68,0.35)]'
                  : isSusp
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-[#22C55E]/20 text-[#4ADE80] border-[#22C55E]/50 shadow-[0_0_16px_rgba(34,197,94,0.35)]'
              }`}
            >
              {isHigh ? (
                <AlertOctagon className="w-5 h-5" />
              ) : isSusp ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                {isHigh
                  ? 'High-Risk Threat Inspection Report'
                  : isSusp
                  ? 'Suspicious Signal Assessment Report'
                  : 'Security Assessment & Integrity Report'}
              </h3>
              <p className="text-xs font-mono text-[#94A3B8]">
                ID: {record.scan_id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#061426] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className={`p-3 rounded-xl bg-[#061426] border ${isSafe ? 'border-[#22C55E]/25' : 'border-[#00D9FF]/15'}`}>
            <span className="text-[10px] font-mono text-[#64748B] block uppercase">Risk Score</span>
            <span
              className={`text-xl font-extrabold font-mono ${
                isHigh ? 'text-red-400' : isSusp ? 'text-amber-400' : 'text-[#4ADE80]'
              }`}
            >
              {record.risk_score} / 100
            </span>
          </div>

          <div className={`p-3 rounded-xl bg-[#061426] border ${isSafe ? 'border-[#22C55E]/25' : 'border-[#00D9FF]/15'}`}>
            <span className="text-[10px] font-mono text-[#64748B] block uppercase">Severity</span>
            <span
              className={`text-xs font-bold font-mono uppercase ${
                isHigh ? 'text-red-400' : isSusp ? 'text-amber-400' : 'text-[#22C55E]'
              }`}
            >
              {isSafe ? 'SAFE / CLEAN' : record.risk_category}
            </span>
          </div>

          <div className={`p-3 rounded-xl bg-[#061426] border ${isSafe ? 'border-[#22C55E]/25' : 'border-[#00D9FF]/15'}`}>
            <span className="text-[10px] font-mono text-[#64748B] block uppercase">Vector Type</span>
            <span className="text-xs font-bold font-mono text-[#F8FAFC] uppercase">
              {record.scanner_type}
            </span>
          </div>

          <div className={`p-3 rounded-xl bg-[#061426] border ${isSafe ? 'border-[#22C55E]/25' : 'border-[#00D9FF]/15'}`}>
            <span className="text-[10px] font-mono text-[#64748B] block uppercase">Findings</span>
            <span className={`text-xs font-bold font-mono ${isSafe ? 'text-[#4ADE80]' : 'text-[#00D9FF]'}`}>
              {triggeredFindings.length} Triggered
            </span>
          </div>
        </div>

        {/* Prominent Green Success Banner for Safe Telemetry */}
        {isSafe && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#052E1A] via-[#04182B] to-[#052E1A]/80 border-2 border-[#22C55E]/45 shadow-[0_0_24px_rgba(34,197,94,0.2)] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/50 flex items-center justify-center text-[#4ADE80] shadow-[0_0_12px_rgba(34,197,94,0.3)] shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#4ADE80]">
                  No significant threats detected
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#4ADE80]">
                  SAFE SCAN
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                No significant threats detected. The scanned item passed the available security checks with zero active malicious signatures.
              </p>
            </div>
          </div>
        )}

        {/* Target Resource Box */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase text-[#94A3B8]">Target Resource</span>
          <div className={`p-3 rounded-xl font-mono text-xs text-[#F8FAFC] break-all select-text border ${
            isSafe ? 'bg-[#052E1A]/35 border-[#22C55E]/30' : 'bg-[#061426] border-[#00D9FF]/20'
          }`}>
            {record.input_target}
          </div>
        </div>

        {/* Summary Description */}
        {record.summary && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-[#94A3B8]">Executive Security Summary</span>
            <p className={`p-3 rounded-xl border text-xs text-[#CBD5E1] leading-relaxed ${
              isSafe ? 'bg-[#052E1A]/30 border-[#22C55E]/25' : 'bg-[#061426] border-[#00D9FF]/15'
            }`}>
              {record.summary}
            </p>
          </div>
        )}

        {/* Reasons / Core Findings */}
        {reasons.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase text-[#94A3B8]">
              {isSafe ? 'Integrity Observations' : 'Detection Observations'}
            </span>
            <div className="space-y-1.5">
              {reasons.map((r: string, i: number) => (
                <div key={i} className={`flex items-start gap-2 text-xs text-[#CBD5E1] p-2.5 rounded-lg border ${
                  isSafe ? 'bg-[#052E1A]/30 border-[#22C55E]/25' : 'bg-[#061426]/60 border-[#00D9FF]/10'
                }`}>
                  <span className={`font-bold ${isSafe ? 'text-[#4ADE80]' : 'text-[#00D9FF]'}`}>•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Findings Detail */}
        {triggeredFindings.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-mono uppercase text-[#94A3B8]">Triggered Heuristic Rules</span>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {triggeredFindings.map((f: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-[#061426] border border-red-500/20 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
                      <span className="text-red-400 font-mono text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30">
                        {f.rule_id}
                      </span>
                      {f.title}
                    </span>
                    <span className="text-[11px] font-mono text-red-400 font-bold">
                      +{f.score_contribution} pts
                    </span>
                  </div>

                  <p className="text-[11px] text-[#94A3B8]">{f.explanation}</p>

                  {f.evidence && (
                    <div className="text-[10px] font-mono text-[#CBD5E1] bg-[#020B16] p-1.5 rounded border border-[#00D9FF]/10 truncate">
                      Evidence: {f.evidence}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        {recommendations.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-mono uppercase text-[#94A3B8]">Recommended Actions</span>
            <div className="space-y-1.5">
              {recommendations.map((rec: string, i: number) => (
                <div key={i} className={`flex items-start gap-2 text-xs text-[#CBD5E1] p-2 rounded-lg border ${
                  isSafe ? 'bg-[#052E1A]/30 border-[#22C55E]/25' : 'bg-[#061426] border-[#00D9FF]/15'
                }`}>
                  <CheckCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSafe ? 'text-[#4ADE80]' : 'text-[#00D9FF]'}`} />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className={`pt-3 border-t flex items-center justify-between text-[11px] font-mono text-[#64748B] ${isSafe ? 'border-[#22C55E]/20' : 'border-[#00D9FF]/15'}`}>
          <span>Analysis Method: {record.analysis_method || 'Heuristic & ML Pipeline'}</span>
          <span>{record.scanned_at ? new Date(record.scanned_at).toLocaleString() : ''}</span>
        </div>
      </div>
    </div>
  )
}
