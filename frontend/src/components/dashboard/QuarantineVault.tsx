import React, { useState, useEffect } from 'react'
import {
  Inbox,
  Trash2,
  Search,
} from 'lucide-react'
import { api, type HistoryItem } from '../../services/api'
import { Badge } from '../common/Badge'

// Sample static quarantined items if database is clean
const fallbackQuarantined = [
  {
    id: 'Q-901',
    scan_id: 'Q-SCAN-901',
    scanner_type: 'url',
    input_target: 'http://paypal-security-update-center.xyz/login',
    risk_score: 96,
    risk_category: 'high_risk',
    findings_count: 5,
    summary: 'Critical homoglyph domain with credential theft payload pattern',
    status: 'quarantined',
    scanned_at: '2026-10-16T14:00:00.000Z',
  },
  {
    id: 'Q-902',
    scan_id: 'Q-SCAN-902',
    scanner_type: 'file',
    input_target: 'Invoice_Q3_Review.pdf\u202Efdp.exe',
    risk_score: 98,
    risk_category: 'high_risk',
    findings_count: 6,
    summary: 'Right-to-Left Override spoofing executable binary with PE header mismatch',
    status: 'quarantined',
    scanned_at: '2026-10-16T13:00:00.000Z',
  },
  {
    id: 'Q-903',
    scan_id: 'Q-SCAN-903',
    scanner_type: 'email',
    input_target: 'Urgent: Wire Transfer Approval Request #8291',
    risk_score: 91,
    risk_category: 'high_risk',
    findings_count: 4,
    summary: 'CEO fraud impersonation with spoofed DKIM headers and phishing redirect',
    status: 'quarantined',
    scanned_at: '2026-10-16T11:00:00.000Z',
  },
]

export const QuarantineVault: React.FC = () => {
  const [quarantinedItems, setQuarantinedItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchQuarantine = async () => {
      try {
        const res = await api.getHistory(undefined, 'high_risk', 50, 0)
        setQuarantinedItems(res.items || [])
      } catch {
        // Fallback
      } finally {
        setLoading(false)
      }
    }
    fetchQuarantine()
  }, [])

  const displayList = quarantinedItems.length > 0 ? quarantinedItems : fallbackQuarantined

  const filtered = displayList.filter(
    (item) =>
      item.input_target.toLowerCase().includes(search.toLowerCase()) ||
      item.scanner_type.toLowerCase().includes(search.toLowerCase())
  )

  const handlePurge = (scanId: string) => {
    if (confirm('Permanently delete this quarantined threat artifact?')) {
      api.deleteHistoryItem(scanId).catch(() => {})
      setQuarantinedItems((prev) => prev.filter((i) => i.scan_id !== scanId))
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 shadow-[0_8px_30px_rgba(2,11,22,0.8)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#061B30] border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shadow-[0_0_14px_rgba(0,217,255,0.25)]">
              <Inbox className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#F8FAFC]">
                  Quarantine Isolation Vault
                </h1>
                <Badge variant="danger" size="sm" dot>
                  Isolated Storage
                </Badge>
              </div>
              <p className="text-xs text-[#CBD5E1]">
                High-risk payloads, malicious URLs, and suspicious artifacts quarantined away from host system execution.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search quarantined artifacts..."
                className="bg-[#061426] border border-[#00D9FF]/30 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vault List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-[#94A3B8]">
            Scanning quarantine vault artifacts...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[#94A3B8]">
            No artifacts found matching criteria.
          </div>
        ) : (
          filtered.map((item) => (
          <div
            key={item.scan_id}
            className="p-4 sm:p-5 rounded-2xl bg-[#04182B] border border-[#EF4444]/30 shadow-[0_4px_20px_rgba(2,11,22,0.6)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 overflow-hidden">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] uppercase font-bold text-[#EF4444] bg-[#EF4444]/15 px-2 py-0.5 rounded border border-[#EF4444]/30">
                  {item.scanner_type}
                </span>
                <span className="font-mono text-xs font-bold text-[#F8FAFC] truncate max-w-md">
                  {item.input_target}
                </span>
                <Badge variant="danger" size="sm">
                  {item.risk_score} / 100 Risk
                </Badge>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {item.summary || 'Critical threat indicators identified. Quarantined for security.'}
              </p>

              <div className="flex items-center gap-3 text-[10px] text-[#64748B] font-mono">
                <span>ID: {item.scan_id}</span>
                <span>•</span>
                <span>Quarantined at: {new Date(item.scanned_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handlePurge(item.scan_id)}
                className="px-3 py-1.5 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] hover:bg-[#EF4444]/25 text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="h-3 w-3" />
                <span>Purge Artifact</span>
              </button>
            </div>
          </div>
        )))}
      </div>
    </div>
  )
}
