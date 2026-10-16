import React, { useState, useEffect } from 'react'
import {
  Database,
  Radio,
} from 'lucide-react'
import { Badge } from '../common/Badge'
import { api, type HistoryItem, type DashboardStatsResponse } from '../../services/api'

export const ThreatIntelligence: React.FC = () => {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null)
  const [highRiskItems, setHighRiskItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          api.getDashboardStats().catch(() => null),
          api.getHistory(undefined, 'high_risk', 50, 0).catch(() => ({ total_count: 0, items: [] })),
        ])
        if (statsRes) setStats(statsRes)
        if (historyRes?.items) setHighRiskItems(historyRes.items)
      } catch {
        // Fallback
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Authentic detection engines and heuristic signatures implemented in PhishShield AI
  const activeEngines = [
    {
      source: 'URL Heuristic & ML Engine',
      ruleCount: '12 Heuristic Rules + Random Forest',
      status: stats?.system_status?.ml_model_loaded ? 'Model Online' : 'Rules Active',
      latency: 'Local Engine',
      type: 'Homoglyphs, TLDs, Entropy & URL Structure',
    },
    {
      source: 'Static File & PE Inspector',
      ruleCount: '9 Signature Rules',
      status: 'Active',
      latency: 'Local Engine',
      type: 'Magic Bytes, RTLO, Macros, Shell Scripts',
    },
    {
      source: 'QR Code Matrix Pipeline',
      ruleCount: 'OpenCV Multi-Stage Detector',
      status: 'Active',
      latency: 'Local Engine',
      type: 'Adaptive Thresholding & URL Defense',
    },
    {
      source: 'ITU-T E.164 Wangiri Telephony',
      ruleCount: 'E.164 Plans + 8 Satellite Codes',
      status: 'Active',
      latency: 'Local Engine',
      type: 'High-Tariff Prefixes & Repetitive Patterns',
    },
    {
      source: 'Messaging Coercion Engine',
      ruleCount: '17 Phishing Lexicon Rules',
      status: 'Active',
      latency: 'Local Engine',
      type: 'Urgency Manipulation & Credential Harvesting',
    },
    {
      source: 'SocialShield Impersonation AI',
      ruleCount: '6 Platform Profiles',
      status: 'Active',
      latency: 'Local Engine',
      type: 'Synthetic Suffixes, Homoglyphs & Bio Text',
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 shadow-[0_8px_30px_rgba(2,11,22,0.8)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#061B30] border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shadow-[0_0_14px_rgba(0,217,255,0.25)]">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#F8FAFC]">
                  Local Threat Intelligence & Detection Rule Base
                </h1>
                <Badge variant="cyan" size="sm" dot>
                  Local Telemetry
                </Badge>
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Real-time security telemetry derived from persistent database records and autonomous heuristic detection rules.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-[#94A3B8] block">External Intel Feeds</span>
            <span className="text-xs font-mono text-amber-400 font-semibold">Autonomous / Local Only</span>
          </div>
        </div>
      </div>

      {/* Engine Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeEngines.map((engine, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#04182B] border border-[#00D9FF]/20 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#00D9FF] uppercase">{engine.type}</span>
              <span className="text-[10px] font-mono text-[#10B981] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                {engine.status}
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#F8FAFC] leading-snug">{engine.source}</h4>
            <div className="pt-1 flex items-baseline justify-between font-mono text-xs">
              <span className="text-[#94A3B8]">Rule Coverage:</span>
              <span className="font-bold text-[#F8FAFC]">{engine.ruleCount}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Real High-Risk Indicators Table */}
      <div className="rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 overflow-hidden shadow-[0_8px_30px_rgba(2,11,22,0.8)]">
        <div className="p-4 bg-[#061426] border-b border-[#00D9FF]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-[#00D9FF] animate-pulse" />
            <span className="text-xs font-bold text-[#F8FAFC]">
              Identified Threat Artifacts ({highRiskItems.length} Logged)
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8]">
            Source: SQLite Security Database
          </span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-[#94A3B8]">
              Loading threat records from local database...
            </div>
          ) : highRiskItems.length === 0 ? (
            <div className="p-10 text-center space-y-1">
              <p className="text-sm font-semibold text-[#F8FAFC]">No High-Risk Threat Indicators Logged</p>
              <p className="text-xs text-[#94A3B8]">
                As scans identify suspicious URLs, executable payloads, or impersonation attempts, they will appear here.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#00D9FF]/15 text-[#94A3B8] text-[10px] uppercase">
                  <th className="py-2.5 px-4">Artifact / Input Target</th>
                  <th className="py-2.5 px-4">Scanner</th>
                  <th className="py-2.5 px-4">Risk Score</th>
                  <th className="py-2.5 px-4">Primary Indicator</th>
                  <th className="py-2.5 px-4 text-right">Detected At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00D9FF]/10 text-[#CBD5E1]">
                {highRiskItems.slice(0, 15).map((row) => (
                  <tr key={row.scan_id} className="hover:bg-[#061B30]/50 transition-colors">
                    <td className="py-3 px-4 text-[#00D9FF] font-semibold truncate max-w-xs" title={row.input_target}>
                      {row.input_target}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                        {row.scanner_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-red-400">
                      {row.risk_score} / 100
                    </td>
                    <td className="py-3 px-4 text-[#CBD5E1] truncate max-w-sm" title={row.summary || ''}>
                      {row.summary || 'Elevated threat signals'}
                    </td>
                    <td className="py-3 px-4 text-right text-[#94A3B8]">
                      {row.scanned_at ? new Date(row.scanned_at).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
