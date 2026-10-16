import React, { useState, useEffect } from 'react'
import {
  FileCode,
  Shield,
  FileCheck2,
  HardDrive,
  Hash,
  Radio,
} from 'lucide-react'
import { Badge } from '../common/Badge'
import { api, type HistoryItem } from '../../services/api'

export const SandboxMatrix: React.FC = () => {
  const [fileScans, setFileScans] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFileScans = async () => {
      try {
        const res = await api.getHistory('file', undefined, 50, 0)
        setFileScans(res.items || [])
      } catch {
        setFileScans([])
      } finally {
        setLoading(false)
      }
    }
    fetchFileScans()
  }, [])

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 shadow-[0_8px_30px_rgba(2,11,22,0.8)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#061B30] border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shadow-[0_0_14px_rgba(0,217,255,0.25)]">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#F8FAFC]">
                  Static Payload & File Inspection Matrix
                </h1>
                <Badge variant="cyan" size="sm" dot>
                  Static Analysis
                </Badge>
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Static analysis of uploaded files: magic byte verification, RTLO character trick detection, double extension checks, and SHA-256 fingerprinting.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-[#94A3B8] block">Execution Policy</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">Zero-Execution (Static Only)</span>
          </div>
        </div>
      </div>

      {/* Static Inspection Architecture Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#04182B] border border-[#00D9FF]/20 flex items-center gap-3">
          <FileCheck2 className="h-8 w-8 text-[#00D9FF] p-1.5 rounded-lg bg-[#061B30] border border-[#00D9FF]/30 shrink-0" />
          <div>
            <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Inspection Engine</span>
            <p className="text-sm font-bold text-[#F8FAFC] font-mono">Static Heuristic Parser</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#04182B] border border-[#00D9FF]/20 flex items-center gap-3">
          <HardDrive className="h-8 w-8 text-[#00D9FF] p-1.5 rounded-lg bg-[#061B30] border border-[#00D9FF]/30 shrink-0" />
          <div>
            <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Signature Scope</span>
            <p className="text-sm font-bold text-[#F8FAFC] font-mono">PE, ELF, PDF, OLE, RTLO</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#04182B] border border-[#00D9FF]/20 flex items-center gap-3">
          <Hash className="h-8 w-8 text-[#00D9FF] p-1.5 rounded-lg bg-[#061B30] border border-[#00D9FF]/30 shrink-0" />
          <div>
            <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Cryptographic Integrity</span>
            <p className="text-sm font-bold text-[#10B981] font-mono">SHA-256 Digesting</p>
          </div>
        </div>
      </div>

      {/* Notice Alert */}
      <div className="p-3.5 rounded-xl bg-[#061426] border border-[#00D9FF]/20 flex items-start gap-3 text-xs text-[#94A3B8]">
        <Shield className="h-4 w-4 text-[#00D9FF] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#F8FAFC]">Integrity Disclosure:</strong> PhishShield AI inspects files using safe static heuristics and signature validation. The platform does not detonate hostile binaries inside a virtual machine kernel to prevent unauthorized execution risks.
        </p>
      </div>

      {/* Real Inspected Payloads Table */}
      <div className="rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 overflow-hidden shadow-[0_8px_30px_rgba(2,11,22,0.8)]">
        <div className="p-4 bg-[#061426] border-b border-[#00D9FF]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-[#00D9FF] animate-pulse" />
            <span className="text-xs font-bold text-[#F8FAFC]">
              Inspected File Payloads ({fileScans.length} Persisted)
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8]">
            Source: SQLite Security Database
          </span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-[#94A3B8]">
              Loading inspected files from database...
            </div>
          ) : fileScans.length === 0 ? (
            <div className="p-10 text-center space-y-1">
              <p className="text-sm font-semibold text-[#F8FAFC]">No File Payloads Inspected Yet</p>
              <p className="text-xs text-[#94A3B8]">
                Upload files to the File Scanner to evaluate magic bytes, double extensions, and SHA-256 hashes.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#00D9FF]/15 text-[#94A3B8] text-[10px] uppercase">
                  <th className="py-2.5 px-4">Filename / Target</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Risk Score</th>
                  <th className="py-2.5 px-4">Findings Summary</th>
                  <th className="py-2.5 px-4 text-right">Inspected At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00D9FF]/10 text-[#CBD5E1]">
                {fileScans.map((row) => (
                  <tr key={row.scan_id} className="hover:bg-[#061B30]/50 transition-colors">
                    <td className="py-3 px-4 text-[#00D9FF] font-semibold truncate max-w-xs" title={row.input_target}>
                      {row.input_target}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase border ${
                        row.risk_category === 'high_risk'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : row.risk_category === 'suspicious'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {row.risk_category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">
                      <span className={row.risk_category === 'high_risk' ? 'text-red-400' : 'text-[#10B981]'}>
                        {row.risk_score} / 100
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#CBD5E1] truncate max-w-sm" title={row.summary || ''}>
                      {row.summary || 'Static inspection completed'}
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
