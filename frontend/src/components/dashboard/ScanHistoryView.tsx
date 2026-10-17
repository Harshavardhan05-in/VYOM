import React, { useState, useEffect } from 'react'
import {
  History,
  Trash2,
  Download,
  Search,
  RefreshCw,
  Fingerprint,
  X,
  FileSpreadsheet,
} from 'lucide-react'
import { api, type HistoryItem } from '../../services/api'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

export const ScanHistoryView: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scannerFilter, setScannerFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getHistory(scannerFilter, categoryFilter, 100, 0)
      setItems(data.items || [])
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve scan history from database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [scannerFilter, categoryFilter])

  const handleDelete = async (scanId: string) => {
    if (!window.confirm('Delete this scan record permanently from the local security database?')) {
      return
    }
    setDeletingId(scanId)
    try {
      await api.deleteHistoryItem(scanId)
      setItems((prev) => prev.filter((i) => i.scan_id !== scanId))
      if (selectedRecord?.scan_id === scanId) {
        setSelectedRecord(null)
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete record.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleInspect = async (scanId: string) => {
    try {
      const detail = await api.getHistoryDetail(scanId)
      setSelectedRecord(detail)
    } catch (err: any) {
      alert('Unable to load scan details: ' + err.message)
    }
  }

  const handleExportCSV = () => {
    if (items.length === 0) return
    const headers = ['Scan ID', 'Scanner Type', 'Target', 'Risk Score', 'Category', 'Findings Count', 'Timestamp']
    const rows = items.map((i) => [
      `"${i.scan_id}"`,
      `"${i.scanner_type}"`,
      `"${(i.input_target || '').replace(/"/g, '""')}"`,
      i.risk_score,
      `"${i.risk_category}"`,
      i.findings_count,
      `"${i.scanned_at}"`,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `phishshield-history-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportJSON = () => {
    if (items.length === 0) return
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `phishshield-history-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      item.input_target.toLowerCase().includes(q) ||
      item.scan_id.toLowerCase().includes(q) ||
      item.scanner_type.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Controls Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 shadow-[0_8px_30px_rgba(2,11,22,0.8)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#00D9FF]/15">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#061B30] border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.2)]">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#F8FAFC]">
                Security Audit Log & Scan History
              </h1>
              <p className="text-xs text-[#CBD5E1]">
                Persistent SQLite records of all inspected URLs, files, QR codes, phone numbers, messages, and social profiles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={items.length === 0}
              icon={<FileSpreadsheet className="h-3.5 w-3.5" />}
            >
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              disabled={items.length === 0}
              icon={<Download className="h-3.5 w-3.5" />}
            >
              JSON
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchHistory}
              disabled={loading}
              icon={<RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by target domain, filename, phone number, or scan ID..."
              className="w-full bg-[#061426] border border-[#00D9FF]/30 rounded-xl pl-9 pr-4 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={scannerFilter}
              onChange={(e) => setScannerFilter(e.target.value)}
              className="w-full bg-[#061426] border border-[#00D9FF]/30 rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF] font-mono cursor-pointer"
            >
              <option value="all">All Scanner Types</option>
              <option value="url">URL Scanner</option>
              <option value="file">File Scanner</option>
              <option value="qr">QR Scanner</option>
              <option value="phone">Phone Checker</option>
              <option value="email">Email & Message</option>
              <option value="social">SocialShield AI</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#061426] border border-[#00D9FF]/30 rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF] font-mono cursor-pointer"
            >
              <option value="all">All Risk Levels</option>
              <option value="safe">Safe Only</option>
              <option value="suspicious">Suspicious Only</option>
              <option value="high_risk">High Risk Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 overflow-hidden shadow-[0_8px_30px_rgba(2,11,22,0.8)]">
        {error && (
          <div className="p-4 bg-[#EF4444]/10 border-b border-[#EF4444]/30 text-xs text-[#EF4444] font-mono">
            {error}
          </div>
        )}
        {loading ? (
          <div className="p-12 text-center text-xs text-[#94A3B8] font-mono flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-6 w-6 text-[#00D9FF] animate-spin" />
            <span>Loading threat history from database...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#94A3B8] font-mono space-y-2">
            <History className="h-8 w-8 text-[#64748B] mx-auto opacity-40" />
            <p>No scan records matching your filter criteria.</p>
            <p className="text-[11px] text-[#64748B]">
              Run an inspection in any of the protection scanners to record persistent audit logs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#00D9FF]/20 bg-[#061426] text-[#94A3B8] font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Target / Resource</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Findings</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00D9FF]/10 text-[#CBD5E1]">
                {filteredItems.map((item) => {
                  const isHigh = item.risk_category === 'high_risk'
                  const isSuspicious = item.risk_category === 'suspicious'
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#061B30]/60 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-[#00D9FF]">
                        <span className="uppercase bg-[#061426] px-2 py-0.5 rounded border border-[#00D9FF]/20 text-[10px]">
                          {item.scanner_type}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono max-w-xs truncate text-[#F8FAFC]" title={item.input_target}>
                        {item.input_target}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold">
                        <span
                          className={
                            isHigh
                              ? 'text-[#EF4444]'
                              : isSuspicious
                              ? 'text-[#F59E0B]'
                              : 'text-[#22C55E]'
                          }
                        >
                          {item.risk_score} / 100
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            isHigh
                              ? 'danger'
                              : isSuspicious
                              ? 'warning'
                              : 'success'
                          }
                          size="sm"
                          dot={isHigh || item.risk_category === 'safe'}
                        >
                          {item.risk_category.replace('_', ' ')}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 font-mono text-[#94A3B8]">
                        {item.findings_count} rule(s)
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-[#94A3B8] whitespace-nowrap">
                        {new Date(item.scanned_at).toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleInspect(item.scan_id)}
                          className="px-2 py-1 rounded bg-[#061B30] border border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/20 text-xs font-mono transition-colors"
                          title="View findings & details"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => handleDelete(item.scan_id)}
                          disabled={deletingId === item.scan_id}
                          className="p-1 rounded text-[#64748B] hover:text-[#EF4444] transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020B16]/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#04182B] border border-[#00D9FF]/40 p-6 space-y-4 shadow-[0_0_50px_rgba(0,217,255,0.25)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#00D9FF]/20">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-[#00D9FF]" />
                <h3 className="text-base font-bold text-[#F8FAFC]">
                  Scan Record Audit
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#061426] border border-[#00D9FF]/15">
                <div>
                  <span className="text-[#64748B] block text-[10px]">SCAN ID</span>
                  <span className="text-[#F8FAFC]">{selectedRecord.scan_id}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">TYPE</span>
                  <span className="text-[#00D9FF] uppercase">{selectedRecord.scanner_type}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">RISK SCORE</span>
                  <span className="text-[#F8FAFC] font-bold">{selectedRecord.risk_score} / 100</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">CATEGORY</span>
                  <span className="uppercase text-[#00D9FF]">{selectedRecord.risk_category}</span>
                </div>
              </div>

              <div>
                <span className="text-[#64748B] block text-[10px] uppercase mb-1">Target Resource</span>
                <p className="p-2.5 rounded bg-[#061426] text-[#F8FAFC] break-all border border-[#00D9FF]/15">
                  {selectedRecord.input_target}
                </p>
              </div>

              {selectedRecord.summary && (
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase mb-1">Audit Summary</span>
                  <p className="p-2.5 rounded bg-[#061426] text-[#CBD5E1] border border-[#00D9FF]/15">
                    {selectedRecord.summary}
                  </p>
                </div>
              )}

              {selectedRecord.findings_json && selectedRecord.findings_json.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[#64748B] block text-[10px] uppercase">
                    Security Findings ({selectedRecord.findings_json.length})
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {selectedRecord.findings_json.map((f: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-[#061426] border border-[#00D9FF]/15 text-[11px] space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#F8FAFC]">{f.title}</span>
                          <span className="text-[#00D9FF]">[{f.severity}]</span>
                        </div>
                        <p className="text-[#94A3B8]">{f.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#00D9FF]/20 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedRecord(null)}
              >
                Close Audit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
