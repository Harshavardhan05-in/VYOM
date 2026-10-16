import React from 'react'
import {
  Database,
  Radio,
} from 'lucide-react'
import { Badge } from '../common/Badge'

export const ThreatIntelligence: React.FC = () => {
  const activeFeeds = [
    { source: 'PhishShield ThreatCloud AI', iocCount: '1,492,040', status: 'Live Sync', latency: '12ms', type: 'Zero-Day URLs & Kits' },
    { source: 'Global Homoglyph Domain Watch', iocCount: '348,190', status: 'Live Sync', latency: '18ms', type: 'Punycode & Typosquats' },
    { source: 'High-Risk TLD Reputation Feed', iocCount: '84,102', status: 'Active', latency: '24ms', type: '.xyz, .top, .work, .click' },
    { source: 'ITU Wangiri Telephony DB', iocCount: '41,920', status: 'Active', latency: '35ms', type: 'Satellite & High-Tariff Ranges' },
  ]

  const recentIOCs = [
    { ioc: 'paypal-security-update-center.xyz', type: 'Domain', confidence: '99.4%', threat: 'Financial Phishing Kit' },
    { ioc: 'invoice-overdue-statement.pdf.exe', type: 'SHA-256 Hash', confidence: '98.8%', threat: 'Trojan Dropper' },
    { ioc: '+88163101234', type: 'Phone MSISDN', confidence: '95.0%', threat: 'Wangiri Auto-Dialer' },
    { ioc: 'login.microsoftonline.portal-auth.net', type: 'FQDN', confidence: '99.1%', threat: 'Office 365 Harvester' },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
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
                  Threat Feeds & Global Indicators of Compromise (IOC)
                </h1>
                <Badge variant="cyan" size="sm" dot>
                  Continuous Ingestion
                </Badge>
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Real-time threat intelligence feeds continuously synchronizing with phishing kit signatures, compromised certificate authorities, and rogue autonomous systems.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeFeeds.map((feed, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#04182B] border border-[#00D9FF]/20 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#00D9FF] uppercase">{feed.type}</span>
              <span className="text-[10px] font-mono text-[#10B981] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                {feed.status}
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#F8FAFC] leading-snug">{feed.source}</h4>
            <div className="pt-1 flex items-baseline justify-between font-mono text-xs">
              <span className="text-[#94A3B8]">Active IOCs:</span>
              <span className="font-bold text-[#F8FAFC]">{feed.iocCount}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Stream Table */}
      <div className="rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 overflow-hidden shadow-[0_8px_30px_rgba(2,11,22,0.8)]">
        <div className="p-4 bg-[#061426] border-b border-[#00D9FF]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-[#00D9FF] animate-pulse" />
            <span className="text-xs font-bold text-[#F8FAFC]">Newly Correlated Indicators of Compromise</span>
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8]">Updated Real-Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#00D9FF]/15 text-[#94A3B8] text-[10px] uppercase">
                <th className="py-2.5 px-4">Indicator / Artifact</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Threat Family</th>
                <th className="py-2.5 px-4 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00D9FF]/10 text-[#CBD5E1]">
              {recentIOCs.map((row, i) => (
                <tr key={i} className="hover:bg-[#061B30]/50 transition-colors">
                  <td className="py-3 px-4 text-[#00D9FF] font-semibold">{row.ioc}</td>
                  <td className="py-3 px-4 text-[#94A3B8]">{row.type}</td>
                  <td className="py-3 px-4 text-[#F8FAFC]">{row.threat}</td>
                  <td className="py-3 px-4 text-right text-[#10B981] font-bold">{row.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
