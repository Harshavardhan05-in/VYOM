import React from 'react'
import { AlertCircle, ArrowRight, Globe, Clock, Search, Lock, ShieldAlert, Code } from 'lucide-react'

interface TopThreatIndicatorsProps {
  onViewDetails: () => void
}

export const TopThreatIndicators: React.FC<TopThreatIndicatorsProps> = ({
  onViewDetails,
}) => {
  const indicators = [
    {
      id: 'ind-1',
      name: 'Suspicious Domain',
      icon: Globe,
      count: '15 detections',
      color: '#EF4444',
    },
    {
      id: 'ind-2',
      name: 'Newly Registered Domain',
      icon: Clock,
      count: '12 detections',
      color: '#EF4444',
    },
    {
      id: 'ind-3',
      name: 'Phishing Keywords',
      icon: Search,
      count: '11 detections',
      color: '#EF4444',
    },
    {
      id: 'ind-4',
      name: 'SSL Certificate Issues',
      icon: Lock,
      count: '9 detections',
      color: '#F59E0B',
    },
    {
      id: 'ind-5',
      name: 'Listed in Threat Databases',
      icon: ShieldAlert,
      count: '7 detections',
      color: '#EF4444',
    },
    {
      id: 'ind-6',
      name: 'Deceptive URL Structure',
      icon: Code,
      count: '6 detections',
      color: '#EF4444',
    },
  ]

  return (
    <div className="rounded-2xl bg-[#04182B] border border-[#00D9FF]/20 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#00D9FF]/15">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500">
            <AlertCircle className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-[#F8FAFC]">Top Threat Indicators</h3>
        </div>

        <button
          onClick={onViewDetails}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-[#00D9FF]/40 bg-[#00D9FF]/5 hover:bg-[#00D9FF]/15 text-[#00D9FF] text-xs font-medium hover:border-[#00D9FF] transition-all cursor-pointer shadow-sm"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Ranked Indicators List Matching Reference */}
      <div className="pt-2 space-y-1.5">
        {indicators.map((ind) => {
          const Icon = ind.icon
          const isAmber = ind.color === '#F59E0B'

          return (
            <div
              key={ind.id}
              onClick={onViewDetails}
              className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#061426]/60 hover:bg-[#061B30] border border-[#00D9FF]/10 hover:border-[#00D9FF]/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${
                    isAmber
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                      : 'bg-red-500/15 border-red-500/30 text-red-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <span className="text-xs font-medium text-[#CBD5E1] group-hover:text-white truncate">
                  {ind.name}
                </span>
              </div>

              <span className="text-[11px] font-mono text-[#94A3B8] shrink-0">
                {ind.count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
