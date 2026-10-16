import React from 'react'
import { X, Fingerprint, CheckCircle } from 'lucide-react'

interface ScanDetailModalProps {
  record: any | null
  onClose: () => void
}

export const ScanDetailModal: React.FC<ScanDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null

  const isHigh = record.risk_category === 'high_risk'
  const isSusp = record.risk_category === 'suspicious'

  const findings = record.findings || []
  const triggeredFindings = findings.filter((f: any) => f.triggered || f.score_contribution > 0)
  const recommendations = record.recommended_actions || record.recommendations || []
  const reasons = record.reasons || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020B16]/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#04182B] border border-[#00D9FF]/40 p-6 sm:p-7 space-y-5 shadow-[0_0_50px_rgba(0,217,255,0.25)] text-[#F8FAFC]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#00D9FF]/20">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                isHigh
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                  : isSusp
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]/40'
              }`}
            >
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                Threat Inspection Report
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
          <div className="p-3 rounded-xl bg-[#061426] border border-[#00D9FF]/15">
            <span className="text-[10px] font-mono text-[#64748B] block uppercase">Risk Score</span>
            <span
              className={`text-xl font-extrabold font-mono ${
                isHigh ? 'text-red-400' : isSusp ? 'text-amber-400' : 'text-[#00D9FF]'
              }`}
            >
              {record.risk_score} / 100
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#061426] border border-[#00D9FF]/15">
            <span className="text-[10px] font-mono text-[#64748B] block uppercase">Severity</span>
            <span
              className={`text-xs font-bold font-mono uppercase ${
                isHigh ? 'text-red-400' : isSusp ? 'text-amber-400' : 'text-[#00D9FF]'
              }`}
            >
              {record.risk_category}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#061426] border border-[#00D9FF]/15">
            <span className="text-[10px] font-mono text-[#64748B] block uppercase">Vector Type</span>
            <span className="text-xs font-bold font-mono text-[#F8FAFC] uppercase">
              {record.scanner_type}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#061426] border border-[#00D9FF]/15">
            <span className="text-[10px] font-mono text-[#64748B] block uppercase">Findings</span>
            <span className="text-xs font-bold font-mono text-[#00D9FF]">
              {triggeredFindings.length} Triggered
            </span>
          </div>
        </div>

        {/* Target Resource Box */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase text-[#94A3B8]">Target Resource</span>
          <div className="p-3 rounded-xl bg-[#061426] border border-[#00D9FF]/20 font-mono text-xs text-[#F8FAFC] break-all select-text">
            {record.input_target}
          </div>
        </div>

        {/* Summary Description */}
        {record.summary && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-[#94A3B8]">Executive Threat Summary</span>
            <p className="p-3 rounded-xl bg-[#061426] border border-[#00D9FF]/15 text-xs text-[#CBD5E1] leading-relaxed">
              {record.summary}
            </p>
          </div>
        )}

        {/* Reasons / Core Findings */}
        {reasons.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase text-[#94A3B8]">Detection Observations</span>
            <div className="space-y-1.5">
              {reasons.map((r: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#CBD5E1] bg-[#061426]/60 p-2.5 rounded-lg border border-[#00D9FF]/10">
                  <span className="text-[#00D9FF] font-bold">•</span>
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
                <div key={i} className="flex items-start gap-2 text-xs text-[#CBD5E1] bg-[#061426] p-2 rounded-lg border border-[#00D9FF]/15">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00D9FF] shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-[#00D9FF]/15 flex items-center justify-between text-[11px] font-mono text-[#64748B]">
          <span>Analysis Method: {record.analysis_method || 'Heuristic & ML Pipeline'}</span>
          <span>{record.scanned_at ? new Date(record.scanned_at).toLocaleString() : ''}</span>
        </div>
      </div>
    </div>
  )
}
