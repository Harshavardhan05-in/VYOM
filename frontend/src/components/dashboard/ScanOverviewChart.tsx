import React, { useState, useMemo } from 'react'
import { Activity } from 'lucide-react'
import type { HistoryItem } from '../../services/api'

interface ScanOverviewChartProps {
  historyRecords: HistoryItem[]
  stats?: {
    safe_count: number
    suspicious_count: number
    high_risk_count: number
    total_scans: number
  } | null
}

type DateRange = '7d' | '30d' | 'all'

export const ScanOverviewChart: React.FC<ScanOverviewChartProps> = ({
  historyRecords,
  stats,
}) => {
  const [dateRange, setDateRange] = useState<DateRange>('7d')
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; count: number; x: number; y: number } | null>(null)

  // 1. Filter records by date range
  const filteredRecords = useMemo(() => {
    if (!historyRecords || historyRecords.length === 0) return []
    const now = new Date().getTime()
    if (dateRange === 'all') return historyRecords

    const days = dateRange === '7d' ? 7 : 30
    const cutoff = now - days * 24 * 60 * 60 * 1000

    return historyRecords.filter((r) => {
      if (!r.scanned_at) return true
      const t = new Date(r.scanned_at).getTime()
      return isNaN(t) || t >= cutoff
    })
  }, [historyRecords, dateRange])

  // 2. Aggregate counts by date for line chart
  const timelineData = useMemo(() => {
    const daysCount = dateRange === '7d' ? 7 : dateRange === '30d' ? 14 : 10
    const groups: { [key: string]: number } = {}
    const now = new Date()

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // Initialize date buckets with Month Day format
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(now.getDate() - i)
      const key = `${monthNames[d.getMonth()]} ${d.getDate()}`
      groups[key] = 0
    }

    // Populate from real records
    filteredRecords.forEach((r) => {
      if (r.scanned_at) {
        try {
          const d = new Date(r.scanned_at)
          const key = `${monthNames[d.getMonth()]} ${d.getDate()}`
          if (groups[key] !== undefined) {
            groups[key] += 1
          } else {
            const latestKey = Object.keys(groups)[Object.keys(groups).length - 1]
            if (latestKey) groups[latestKey] += 1
          }
        } catch {
          // ignore malformed date
        }
      }
    })

    return Object.entries(groups).map(([date, count]) => ({ date, count }))
  }, [filteredRecords, dateRange])

  // SVG Line Chart Coordinate Calculations
  const chartWidth = 380
  const chartHeight = 150
  const paddingX = 35
  const paddingY = 22

  // Dynamic maximum scale adapting to actual scan volume (minimum ceiling of 10)
  const maxVal = Math.max(10, ...timelineData.map((d) => d.count))
  const innerW = chartWidth - paddingX - 15
  const innerH = chartHeight - paddingY * 2

  const points = timelineData.map((d, idx) => {
    const x = paddingX + (idx / Math.max(1, timelineData.length - 1)) * innerW
    const clampedCount = Math.max(0, d.count)
    const y = chartHeight - paddingY - (clampedCount / maxVal) * innerH
    return { ...d, x, y }
  })

  // Smooth Bezier Curve generator (Catmull-Rom to Cubic Bezier)
  const getCurvedPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return ''
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`
    let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[Math.min(pts.length - 1, i + 2)]
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6
      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
    }
    return d
  }

  const pathD = getCurvedPath(points)

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x.toFixed(1)},${chartHeight - paddingY} L ${points[0].x.toFixed(1)},${chartHeight - paddingY} Z`
    : ''

  // 3. Donut Chart Calculations for Risk Distribution
  const riskCounts = useMemo(() => {
    let safe = 0
    let susp = 0
    let high = 0

    if (filteredRecords.length > 0) {
      filteredRecords.forEach((r) => {
        if (r.risk_category === 'safe') safe++
        else if (r.risk_category === 'suspicious') susp++
        else if (r.risk_category === 'high_risk') high++
      })
    } else if (stats) {
      safe = stats.safe_count
      susp = stats.suspicious_count
      high = stats.high_risk_count
    }

    const total = safe + susp + high
    return {
      safe,
      susp,
      high,
      total,
      safePct: total > 0 ? Math.round((safe / total) * 100) : 0,
      suspPct: total > 0 ? Math.round((susp / total) * 100) : 0,
      highPct: total > 0 ? Math.round((high / total) * 100) : 0,
    }
  }, [filteredRecords, stats])

  // SVG Donut Circle Math (Radius = 38, Circumference = 2 * PI * 38 ≈ 238.76)
  const radius = 38
  const circumference = 2 * Math.PI * radius

  const safeOffset = 0
  const safeDash = (riskCounts.safePct / 100) * circumference

  const suspOffset = safeDash
  const suspDash = (riskCounts.suspPct / 100) * circumference

  const highOffset = safeDash + suspDash
  const highDash = (riskCounts.highPct / 100) * circumference

  return (
    <div className="rounded-2xl bg-[#04182B] border border-[#00D9FF]/20 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#00D9FF]/15">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#061B30] border border-[#00D9FF]/35 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.2)]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Scan Overview</h3>
            <p className="text-xs text-[#94A3B8]">Your recent scanning activity</p>
          </div>
        </div>

        {/* Date-Range Selector Dropdown matching reference */}
        <div className="relative">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="bg-[#061426] border border-[#00D9FF]/30 rounded-xl text-xs font-mono text-[#CBD5E1] px-3 py-1.5 focus:outline-none focus:border-[#00D9FF] cursor-pointer shadow-sm hover:border-[#00D9FF]/50 transition-colors"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 items-center">
        {/* Left: Line / Area Chart for Activity (Cols 1-7) */}
        <div className="md:col-span-7 space-y-2">
          <div className="relative w-full overflow-hidden bg-[#061426]/50 rounded-xl p-3 border border-[#00D9FF]/10">
            <svg
              viewBox={`0 0 380 150`}
              className="w-full h-40 overflow-visible"
            >
              <defs>
                <linearGradient id="scanWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#FF2E63" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="neonLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00D9FF" />
                  <stop offset="42%" stopColor="#00D9FF" />
                  <stop offset="58%" stopColor="#FF2E63" />
                  <stop offset="100%" stopColor="#FF2E63" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid Lines & Labels: 100, 80, 60, 40, 20, 0 */}
              {[100, 80, 60, 40, 20, 0].map((v, i) => {
                const yPos = 15 + i * 22
                return (
                  <g key={v}>
                    <text x="24" y={yPos + 3} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">
                      {v}
                    </text>
                    <line x1="32" y1={yPos} x2="370" y2={yPos} stroke="rgba(0,217,255,0.08)" strokeDasharray={v === 0 ? 'none' : '3 3'} />
                  </g>
                )
              })}

              {/* Area fill */}
              {areaD && <path d={areaD} fill="url(#scanWaveGrad)" />}

              {/* Line path with neon glow and cyan-to-pink gradient */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#neonLineGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_10px_rgba(0,217,255,0.6)]"
                />
              )}

              {/* Points: Cyan on left (indices 0-2), Pink/Red on right (indices 3+) */}
              {points.map((p, i) => {
                const isCyan = i < 3
                const dotColor = isCyan ? '#00D9FF' : '#FF2E63'

                return (
                  <g key={i}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={hoveredPoint?.date === p.date ? 5.5 : 4}
                      fill="#020B16"
                      stroke={dotColor}
                      strokeWidth="2.5"
                      className="cursor-pointer transition-all duration-200"
                      style={{ filter: `drop-shadow(0 0 6px ${dotColor})` }}
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {/* X-Axis Date labels along the bottom */}
                    <text
                      x={p.x}
                      y="142"
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {p.date}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute z-20 pointer-events-none px-2.5 py-1 rounded-lg bg-[#020B16] border border-[#00D9FF]/50 text-[10px] font-mono text-[#F8FAFC] shadow-xl -translate-x-1/2 -translate-y-8"
                style={{ left: `${(hoveredPoint.x / 380) * 100}%`, top: `${(hoveredPoint.y / 150) * 100}%` }}
              >
                <span className="text-[#00D9FF] font-bold">{hoveredPoint.count}</span> scans on {hoveredPoint.date}
              </div>
            )}
          </div>
        </div>

        {/* Right: Donut Chart for Risk Distribution (Cols 8-12) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="flex items-center gap-6">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#0B1120" strokeWidth="12" />

                {/* Safe Segment (Prominent Green #22C55E) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="12"
                  strokeDasharray={`${safeDash} ${circumference}`}
                  strokeDashoffset={-safeOffset}
                  className="transition-all duration-700 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]"
                />

                {/* Suspicious Segment (Yellow/Amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  strokeDasharray={`${suspDash} ${circumference}`}
                  strokeDashoffset={-suspOffset}
                  className="transition-all duration-700 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                />

                {/* High Risk Segment (Red) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="12"
                  strokeDasharray={`${highDash} ${circumference}`}
                  strokeDashoffset={-highOffset}
                  className="transition-all duration-700 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                />
              </svg>

              {/* Center Globe Background & Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {/* Cyber Globe wireframe circles */}
                <svg className="absolute w-20 h-20 text-[#00D9FF]/15 pointer-events-none" viewBox="0 0 60 60" fill="none" stroke="currentColor">
                  <circle cx="30" cy="30" r="26" strokeWidth="0.8" />
                  <ellipse cx="30" cy="30" rx="26" ry="10" strokeWidth="0.8" />
                  <ellipse cx="30" cy="30" rx="10" ry="26" strokeWidth="0.8" />
                  <line x1="4" y1="30" x2="56" y2="30" strokeWidth="0.8" />
                </svg>

                <span className="relative z-10 text-2xl font-black text-[#F8FAFC] font-mono leading-none tracking-tight">
                  {riskCounts.total}
                </span>
                <span className="relative z-10 text-[9px] font-sans text-[#94A3B8] mt-1 font-medium">
                  Total Scans
                </span>
              </div>
            </div>

            {/* Legend Matching Reference Screenshot */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)] shrink-0" />
                <span className="text-[#CBD5E1] text-[11px] w-20">High Risk</span>
                <span className="text-white font-mono font-bold w-6 text-right">{riskCounts.high}</span>
                <span className="text-[#94A3B8] font-mono text-[11px]">{riskCounts.highPct}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B] shadow-[0_0_6px_rgba(245,158,11,0.6)] shrink-0" />
                <span className="text-[#CBD5E1] text-[11px] w-20">Medium Risk</span>
                <span className="text-white font-mono font-bold w-6 text-right">{riskCounts.susp}</span>
                <span className="text-[#94A3B8] font-mono text-[11px]">{riskCounts.suspPct}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.7)] shrink-0" />
                <span className="text-[#CBD5E1] text-[11px] w-20 font-medium">Safe / Clean</span>
                <span className="text-white font-mono font-bold w-6 text-right">{riskCounts.safe}</span>
                <span className="text-[#4ADE80] font-mono text-[11px] font-bold">{riskCounts.safePct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
