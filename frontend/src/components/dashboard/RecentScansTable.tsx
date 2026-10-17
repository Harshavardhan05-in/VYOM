import React from 'react'
import { History, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react'
import type { HistoryItem } from '../../services/api'

interface RecentScansTableProps {
  records: HistoryItem[]
  loading?: boolean
  onInspect: (scanId: string) => void
  onViewAll: () => void
}

export const RecentScansTable: React.FC<RecentScansTableProps> = ({
  records,
  loading = false,
  onInspect,
  onViewAll,
}) => {
  const displayItems = records.slice(0, 5)

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Just now'
    try {
      const diffSec = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 1000)
      if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`
      const diffMin = Math.floor(diffSec / 60)
      if (diffMin < 60) return `${diffMin}m ago`
      const diffHr = Math.floor(diffMin / 60)
      if (diffHr < 24) return `${diffHr}h ago`
      return `${Math.floor(diffHr / 24)}d ago`
    } catch {
      return 'Recent'
    }
  }

  return (
    <div className="rounded-2xl bg-[#04182B] border border-[#00D9FF]/20 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#00D9FF]/15">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/15 border border-[#00D9FF]/35 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.25)]">
            <History className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-[#F8FAFC]">Recent Scans</h3>
        </div>

        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-[#00D9FF]/40 bg-[#00D9FF]/5 hover:bg-[#00D9FF]/15 text-[#00D9FF] text-xs font-medium hover:border-[#00D9FF] transition-all cursor-pointer shadow-sm"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Content */}
      <div className="pt-2 overflow-x-auto">
        {/* Table Column Headers */}
        <div className="grid grid-cols-12 gap-2 pb-2 text-[10px] sm:text-[11px] font-mono text-[#64748B] border-b border-[#00D9FF]/10 uppercase tracking-wider">
          <div className="col-span-6">URL / Input</div>
          <div className="col-span-2 text-center">Result</div>
          <div className="col-span-2 text-center">Risk Score</div>
          <div className="col-span-2 text-right">Time</div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs font-mono text-[#94A3B8] animate-pulse">
            Loading telemetry records...
          </div>
        ) : displayItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#94A3B8]">
            No scan records logged yet. Run a scan to see live telemetry.
          </div>
        ) : (
          <div className="space-y-1.5 pt-2">
            {displayItems.map((item) => {
              const isHigh = item.risk_category === 'high_risk'
              const isSusp = item.risk_category === 'suspicious'

              return (
                <div
                  key={item.scan_id}
                  data-testid="recent-scan-row"
                  onClick={() => onInspect(item.scan_id)}
                  className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-[#061426]/60 hover:bg-[#061B30] border border-[#00D9FF]/10 hover:border-[#00D9FF]/30 transition-all cursor-pointer group"
                >
                  {/* Col 1: Icon & URL (Col 6) */}
                  <div className="col-span-6 flex items-center gap-2 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                        isHigh
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : isSusp
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-[#22C55E]/15 text-[#4ADE80] border border-[#22C55E]/40 shadow-[0_0_8px_rgba(34,197,94,0.3)]'
                      }`}
                    >
                      {isHigh ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : isSusp ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-[#CBD5E1] truncate group-hover:text-white" title={item.input_target}>
                      {item.input_target}
                    </span>
                  </div>

                  {/* Col 2: Result Label (Col 2) */}
                  <div className="col-span-2 text-center">
                    <span
                      className={`text-[11px] font-bold ${
                        isHigh
                          ? 'text-red-400'
                          : isSusp
                          ? 'text-amber-400'
                          : 'text-[#4ADE80]'
                      }`}
                    >
                      {isHigh ? 'Malicious' : isSusp ? 'Suspicious' : 'Safe'}
                    </span>
                  </div>

                  {/* Col 3: Risk Score (Col 2) */}
                  <div className="col-span-2 text-center">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isHigh
                          ? 'text-red-400'
                          : isSusp
                          ? 'text-amber-400'
                          : 'text-[#22C55E]'
                      }`}
                    >
                      {item.risk_score}
                    </span>
                  </div>

                  {/* Col 4: Time (Col 2) */}
                  <div className="col-span-2 text-right">
                    <span className="text-[10px] font-mono text-[#64748B]">
                      {formatRelativeTime(item.scanned_at)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
