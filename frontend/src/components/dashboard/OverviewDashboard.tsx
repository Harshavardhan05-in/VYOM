import React, { useState, useEffect, useMemo } from 'react'
import {
  ShieldCheck,
  Shield,
  Skull,
  Users,
  RefreshCw,
} from 'lucide-react'
import { api, type DashboardStatsResponse, type HistoryItem } from '../../services/api'
import { RedAlertBanner } from './RedAlertBanner'
import { ScanOverviewChart } from './ScanOverviewChart'
import { ThreatDistributionChart } from './ThreatDistributionChart'
import { RecentScansTable } from './RecentScansTable'
import { TopThreatIndicators } from './TopThreatIndicators'
import { QuickActionsGrid } from './QuickActionsGrid'
import { ScanDetailModal } from './ScanDetailModal'

interface OverviewDashboardProps {
  onNavigateTab?: (tabId: string, initialScannerTool?: string) => void
  activeSubTab?: string
  externalSearch?: string
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigateTab,
  activeSubTab: _activeSubTab = 'overview',
  externalSearch = '',
}) => {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null)
  const [historyRecords, setHistoryRecords] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedRecordDetail, setSelectedRecordDetail] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Sync external search from top navbar if provided
  useEffect(() => {
    if (externalSearch) {
      setSearchQuery(externalSearch)
    }
  }, [externalSearch])

  const loadData = async () => {
    try {
      const [statsData, historyData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getHistory(undefined, undefined, 200).catch(() => ({ total_count: 0, items: [] })),
      ])

      if (statsData) setStats(statsData)
      if (historyData?.items) setHistoryRecords(historyData.items)
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  // Find latest high risk threat record for the alert banner (prefer URL threat matching reference)
  const highRiskThreat = useMemo(() => {
    if (historyRecords.length > 0) {
      const highUrl = historyRecords.find((r) => r.risk_category === 'high_risk' && r.scanner_type === 'url')
      if (highUrl) return highUrl

      const high = historyRecords.find((r) => r.risk_category === 'high_risk')
      if (high) return high
    }
    // Fallback to recent activity from stats
    if (stats?.recent_activity) {
      const highUrl = stats.recent_activity.find((r) => r.risk_category === 'high_risk' && r.scanner_type === 'url')
      if (highUrl) return highUrl
      const high = stats.recent_activity.find((r) => r.risk_category === 'high_risk')
      if (high) return high
    }
    return null
  }, [historyRecords, stats])

  // Handle Inspect Full Report Modal
  const handleInspect = async (scanId: string) => {
    try {
      const detail = await api.getHistoryDetail(scanId)
      setSelectedRecordDetail(detail)
    } catch (err: any) {
      alert('Unable to load scan report: ' + (err.message || 'Network error'))
    }
  }

  // Filtered records by search query (target, scan_id, scanner_type, summary)
  const filteredRecentScans = useMemo(() => {
    if (!searchQuery.trim()) return historyRecords
    const q = searchQuery.toLowerCase().trim()
    return historyRecords.filter(
      (r) =>
        r.input_target.toLowerCase().includes(q) ||
        r.scan_id.toLowerCase().includes(q) ||
        r.scanner_type.toLowerCase().includes(q) ||
        (r.summary && r.summary.toLowerCase().includes(q))
    )
  }, [historyRecords, searchQuery])


  // KPI Metrics
  const totalScans = stats?.total_scans ?? historyRecords.length
  const threatsDetected = stats?.threats_detected ?? historyRecords.filter((r) => r.risk_category !== 'safe').length
  const safeCount = stats?.safe_count ?? historyRecords.filter((r) => r.risk_category === 'safe').length
  const profilesChecked = stats?.scanners_breakdown?.social ?? historyRecords.filter((r) => r.scanner_type === 'social').length

  return (
    <div className="space-y-6 max-w-[1536px] mx-auto select-none">
      {/* ======================================================== */}
      {/* 1. TOP TITLE & 4 COMPACT KPI CARDS ROW                   */}
      {/* ======================================================== */}
      <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
        {/* Left: Heading & Subtitle */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
              Dashboard
            </h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00D9FF] hover:bg-[#061B30] border border-transparent hover:border-[#00D9FF]/30 transition-all cursor-pointer"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#00D9FF]' : ''}`} />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Your digital security overview
          </p>
        </div>

        {/* Right: Four Compact KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full xl:w-auto">
          {/* Card 1: Total Scans */}
          <div className="kpi-card p-3.5 sm:p-4 rounded-2xl bg-[#04182B] border border-[#00D9FF]/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-between gap-3 min-w-[170px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/15 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] shrink-0 shadow-[0_0_12px_rgba(0,217,255,0.25)]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-[#94A3B8] font-medium leading-none block mb-1">
                  Total Scans
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#F8FAFC] font-mono leading-none">
                  {loading ? '...' : totalScans}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] font-mono text-[#00D9FF] font-bold">↑ 12%</span>
              <div className="flex items-end gap-0.5 h-4">
                <div className="w-1 bg-[#00D9FF]/40 rounded-full h-1.5" />
                <div className="w-1 bg-[#00D9FF]/60 rounded-full h-2.5" />
                <div className="w-1 bg-[#00D9FF]/80 rounded-full h-3" />
                <div className="w-1 bg-[#00D9FF] rounded-full h-4 shadow-[0_0_6px_rgba(0,217,255,0.6)]" />
              </div>
            </div>
          </div>

          {/* Card 2: Threats Detected */}
          <div className="kpi-card p-3.5 sm:p-4 rounded-2xl bg-[#04182B] border border-red-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-between gap-3 min-w-[170px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.25)]">
                <Skull className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-[#94A3B8] font-medium leading-none block mb-1">
                  Threats Detected
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono leading-none">
                  {loading ? '...' : threatsDetected}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] font-mono text-red-400 font-bold">↑ 28%</span>
              <div className="flex items-end gap-0.5 h-4">
                <div className="w-1 bg-red-500/40 rounded-full h-1.5" />
                <div className="w-1 bg-red-500/60 rounded-full h-2.5" />
                <div className="w-1 bg-red-500/80 rounded-full h-3" />
                <div className="w-1 bg-red-500 rounded-full h-4 shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
              </div>
            </div>
          </div>

          {/* Card 3: Safe Results */}
          <div className="kpi-card p-3.5 sm:p-4 rounded-2xl bg-[#04182B] border border-[#10B981]/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-between gap-3 min-w-[170px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-[#94A3B8] font-medium leading-none block mb-1">
                  Safe Results
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono leading-none">
                  {loading ? '...' : safeCount}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] font-mono text-[#10B981] font-bold">↑ 18%</span>
              <div className="flex items-end gap-0.5 h-4">
                <div className="w-1 bg-[#10B981]/40 rounded-full h-2" />
                <div className="w-1 bg-[#10B981]/60 rounded-full h-3" />
                <div className="w-1 bg-[#10B981]/80 rounded-full h-3.5" />
                <div className="w-1 bg-[#10B981] rounded-full h-4 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              </div>
            </div>
          </div>

          {/* Card 4: Profiles Checked */}
          <div className="kpi-card p-3.5 sm:p-4 rounded-2xl bg-[#04182B] border border-[#A855F7]/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-between gap-3 min-w-[170px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A855F7]/15 border border-[#A855F7]/40 flex items-center justify-center text-[#C084FC] shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-[#94A3B8] font-medium leading-none block mb-1">
                  Profiles Checked
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono leading-none">
                  {loading ? '...' : profilesChecked}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] font-mono text-[#C084FC] font-bold">↑ 33%</span>
              <div className="flex items-end gap-0.5 h-4">
                <div className="w-1 bg-[#A855F7]/40 rounded-full h-1.5" />
                <div className="w-1 bg-[#A855F7]/60 rounded-full h-2.5" />
                <div className="w-1 bg-[#A855F7]/80 rounded-full h-3.5" />
                <div className="w-1 bg-[#A855F7] rounded-full h-4 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. HIGH-RISK THREAT ALERT BANNER                         */}
      {/* ======================================================== */}
      <RedAlertBanner
        threatRecord={highRiskThreat}
        onViewReport={handleInspect}
      />

      {/* ======================================================== */}
      {/* 4. ANALYTICS ROW: SCAN OVERVIEW & THREAT DISTRIBUTION    */}
      {/* ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Scan Overview (Area Chart + Risk Donut) */}
        <div className="lg:col-span-7 flex flex-col">
          <ScanOverviewChart
            historyRecords={historyRecords}
            stats={stats}
          />
        </div>

        {/* Right: Threat Type Distribution (Horizontal Bars) */}
        <div className="lg:col-span-5 flex flex-col">
          <ThreatDistributionChart
            breakdown={stats?.scanners_breakdown}
          />
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. BOTTOM ROW: RECENT SCANS, TOP INDICATORS, ACTIONS     */}
      {/* ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Col 1: Recent Scans (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <RecentScansTable
            records={filteredRecentScans}
            loading={loading}
            onInspect={handleInspect}
            onViewAll={() => onNavigateTab && onNavigateTab('history')}
          />
        </div>

        {/* Col 2: Top Threat Indicators (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <TopThreatIndicators
            onViewDetails={() => onNavigateTab && onNavigateTab('intelligence')}
          />
        </div>

        {/* Col 3: Quick Actions & Security Reminder (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col">
          <QuickActionsGrid
            onSelectTool={(toolId) => {
              if (onNavigateTab) {
                onNavigateTab('scanner', toolId)
              }
            }}
          />
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. INSPECTION REPORT MODAL                               */}
      {/* ======================================================== */}
      <ScanDetailModal
        record={selectedRecordDetail}
        onClose={() => setSelectedRecordDetail(null)}
      />
    </div>
  )
}
