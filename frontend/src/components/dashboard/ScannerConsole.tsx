import React, { useState, useEffect } from 'react'
import {
  Link2,
  FileText,
  QrCode,
  PhoneCall,
  Mail,
  Users,
  Shield,
  Zap,
} from 'lucide-react'
import { UrlScannerView } from '../scanners/UrlScannerView'
import { FileScannerView } from '../scanners/FileScannerView'
import { QrScannerView } from '../scanners/QrScannerView'
import { PhoneScannerView } from '../scanners/PhoneScannerView'
import { EmailScannerView } from '../scanners/EmailScannerView'
import { SocialScannerView } from '../scanners/SocialScannerView'

export type ScannerToolType = 'url' | 'file' | 'qr' | 'phone' | 'email' | 'social'

interface ScannerConsoleProps {
  initialTool?: string
}

function normalizeToolId(tool?: string): ScannerToolType {
  if (!tool) return 'url'
  if (tool.includes('file')) return 'file'
  if (tool.includes('qr')) return 'qr'
  if (tool.includes('phone')) return 'phone'
  if (tool.includes('email') || tool.includes('message')) return 'email'
  if (tool.includes('social')) return 'social'
  return 'url'
}

export const ScannerConsole: React.FC<ScannerConsoleProps> = ({ initialTool }) => {
  const [activeTool, setActiveTool] = useState<ScannerToolType>(() => normalizeToolId(initialTool))

  useEffect(() => {
    if (initialTool) {
      setActiveTool(normalizeToolId(initialTool))
    }
  }, [initialTool])

  const tools: Array<{
    id: ScannerToolType
    label: string
    shortLabel: string
    icon: React.ElementType
    badge?: string
  }> = [
    { id: 'url', label: 'URL Scanner', shortLabel: 'URL', icon: Link2, badge: 'ML + Rules' },
    { id: 'file', label: 'File Scanner', shortLabel: 'File', icon: FileText, badge: 'Safe Static' },
    { id: 'qr', label: 'QR Scanner', shortLabel: 'QR', icon: QrCode, badge: 'OpenCV' },
    { id: 'phone', label: 'Phone Checker', shortLabel: 'Phone', icon: PhoneCall, badge: 'ITU-T E.164' },
    { id: 'email', label: 'Email & Message', shortLabel: 'Email/SMS', icon: Mail, badge: 'NLP + Links' },
    { id: 'social', label: 'SocialShield AI', shortLabel: 'Social', icon: Users, badge: 'Heuristic' },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Tool Switcher Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 shadow-[0_8px_30px_rgba(2,11,22,0.8)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#00D9FF]/15">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#061B30] border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.2)]">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                Threat Scanner Console
              </h1>
              <p className="text-[11px] text-[#94A3B8] font-mono">
                Unified Multi-Vector Cyber Defense Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-[#00D9FF] font-mono bg-[#061426] px-2.5 py-1 rounded-md border border-[#00D9FF]/30">
              <Zap className="h-3 w-3 animate-pulse" />
              <span>Real-Time Engine Active</span>
            </span>
          </div>
        </div>

        {/* Horizontal Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {tools.map((tool) => {
            const Icon = tool.icon
            const isActive = activeTool === tool.id
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isActive
                    ? 'bg-[#00D9FF]/15 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_16px_rgba(0,217,255,0.25)]'
                    : 'bg-[#061426] border-[#00D9FF]/20 text-[#CBD5E1] hover:text-[#00D9FF] hover:border-[#00D9FF]/50 hover:bg-[#061B30]'
                }`}
              >
                <Icon className={`h-5 w-5 mb-1.5 ${isActive ? 'text-[#00D9FF]' : 'text-[#94A3B8]'}`} />
                <span className="text-xs font-bold leading-tight">{tool.label}</span>
                {tool.badge && (
                  <span
                    className={`mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#00D9FF]/25 text-[#00D9FF]'
                        : 'bg-[#111C30] text-[#64748B]'
                    }`}
                  >
                    {tool.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Scanner View Container */}
      <div className="transition-all duration-200">
        {activeTool === 'url' && <UrlScannerView />}
        {activeTool === 'file' && <FileScannerView />}
        {activeTool === 'qr' && <QrScannerView />}
        {activeTool === 'phone' && <PhoneScannerView />}
        {activeTool === 'email' && <EmailScannerView />}
        {activeTool === 'social' && <SocialScannerView />}
      </div>
    </div>
  )
}
