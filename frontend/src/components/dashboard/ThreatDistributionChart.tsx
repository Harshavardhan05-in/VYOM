import React, { useState } from 'react'
import { Sparkles, ShieldAlert, Bug, Lock, AlertTriangle, Users } from 'lucide-react'

interface ThreatDistributionProps {
  breakdown?: {
    url?: number
    file?: number
    qr?: number
    phone?: number
    email?: number
    social?: number
    [key: string]: number | undefined
  }
}

export const ThreatDistributionChart: React.FC<ThreatDistributionProps> = ({
  breakdown = {},
}) => {
  const [filterType, setFilterType] = useState<'all' | 'web' | 'identity'>('all')

  const rawCategories = [
    {
      id: 'phishing',
      label: 'Phishing',
      count: breakdown.url ? Math.round(breakdown.url * 0.55) : 0,
      icon: ShieldAlert,
      color: '#EF4444',
      group: 'web',
    },
    {
      id: 'malware',
      label: 'Malware',
      count: breakdown.file || 0,
      icon: Bug,
      color: '#F97316',
      group: 'web',
    },
    {
      id: 'links',
      label: 'Suspicious Links',
      count: (breakdown.qr || 0) + (breakdown.url ? Math.round(breakdown.url * 0.45) : 0),
      icon: AlertTriangle,
      color: '#F59E0B',
      group: 'web',
    },
    {
      id: 'websites',
      label: 'Fake Websites',
      count: breakdown.email || 0,
      icon: Lock,
      color: '#10B981',
      group: 'web',
    },
    {
      id: 'scams',
      label: 'Scams & Fraud',
      count: breakdown.phone || 0,
      icon: AlertTriangle,
      color: '#00D9FF',
      group: 'identity',
    },
    {
      id: 'identity',
      label: 'Identity Theft',
      count: breakdown.social || 0,
      icon: Users,
      color: '#A855F7',
      group: 'identity',
    },
  ]

  // Filter categories
  const categories = rawCategories.filter((c) => {
    if (filterType === 'web') return c.group === 'web'
    if (filterType === 'identity') return c.group === 'identity'
    return true
  })

  const totalFilteredCount = categories.reduce((sum, c) => sum + c.count, 0)

  return (
    <div className="rounded-2xl bg-[#04182B] border border-[#00D9FF]/20 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#00D9FF]/15">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/15 border border-[#00D9FF]/35 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.25)]">
            <Sparkles className="w-4 h-4 text-[#00D9FF]" />
          </div>
          <h3 className="text-base font-bold text-[#F8FAFC]">Threat Type Distribution</h3>
        </div>

        {/* Working Filter Select */}
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-[#061426] border border-[#00D9FF]/30 rounded-xl text-xs font-mono text-[#CBD5E1] px-3 py-1.5 focus:outline-none focus:border-[#00D9FF] cursor-pointer shadow-sm hover:border-[#00D9FF]/50 transition-colors"
          >
            <option value="all">All Scans</option>
            <option value="web">Web & Payloads</option>
            <option value="identity">Identity & Social</option>
          </select>
        </div>
      </div>

      {/* Horizontal Progress Rows Matching Reference Blueprint */}
      <div className="space-y-3.5 pt-4">
        {totalFilteredCount === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[#94A3B8]">
            No threat distribution records logged for this category yet.
          </div>
        ) : (
          categories.map((cat) => {
            const Icon = cat.icon
            const pct = totalFilteredCount > 0 ? Math.round((cat.count / totalFilteredCount) * 100) : 0

            return (
              <div key={cat.id} data-testid="threat-bar" className="flex items-center gap-3 text-xs">
                {/* Category Icon in Rounded Square */}
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${cat.color}20`,
                    borderColor: `${cat.color}45`,
                    color: cat.color,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Category Label */}
                <span className="text-[#CBD5E1] font-medium text-xs w-28 sm:w-32 truncate shrink-0">
                  {cat.label}
                </span>

                {/* Inline Progress Bar */}
                <div className="flex-1 bg-[#061426] rounded-full h-2.5 overflow-hidden border border-[#00D9FF]/10">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: cat.color,
                      boxShadow: pct > 0 ? `0 0 10px ${cat.color}88` : 'none',
                    }}
                  />
                </div>

                {/* Count & Percentage Readout */}
                <div className="flex items-center gap-3 font-mono text-xs shrink-0 w-16 justify-end">
                  <span className="text-[#94A3B8]">{cat.count}</span>
                  <span className="font-semibold text-right w-8" style={{ color: cat.color }}>
                    {pct}%
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
