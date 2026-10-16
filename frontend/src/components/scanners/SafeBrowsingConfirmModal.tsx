import React, { useMemo } from 'react'
import {
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  X,
  Lock,
  Globe,
} from 'lucide-react'

interface SafeBrowsingConfirmModalProps {
  isOpen: boolean
  url: string
  onClose: () => void
}

export const SafeBrowsingConfirmModal: React.FC<SafeBrowsingConfirmModalProps> = ({
  isOpen,
  url,
  onClose,
}) => {
  // Safe URL parsing
  const parsed = useMemo(() => {
    try {
      const trimmed = url.trim()
      const u = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`)
      const isHttpOrHttps = u.protocol === 'http:' || u.protocol === 'https:'
      return {
        isValid: isHttpOrHttps,
        protocol: u.protocol,
        hostname: u.hostname,
        fullUrl: u.href,
        isHttps: u.protocol === 'https:',
      }
    } catch {
      return {
        isValid: false,
        protocol: '',
        hostname: '',
        fullUrl: url,
        isHttps: false,
      }
    }
  }, [url])

  if (!isOpen) return null

  const handleProceed = () => {
    if (!parsed.isValid) return
    // Safe user-initiated new tab with strict protection against window.opener access
    window.open(parsed.fullUrl, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safe-browsing-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-[#04182B] border border-[#10B981]/40 shadow-[0_0_40px_rgba(16,185,129,0.25)] p-6 sm:p-7 space-y-6 animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#10B981]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shadow-[0_0_16px_rgba(16,185,129,0.3)] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 id="safe-browsing-title" className="text-lg font-bold text-[#F8FAFC]">
                Continue to External Website
              </h3>
              <p className="text-xs text-[#94A3B8]">
                User confirmation required before opening destination
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#061B30] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Destination Information */}
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Destination Hostname</span>
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#061426] border border-[#10B981]/30">
              <span className="font-mono text-sm font-bold text-[#F8FAFC]">
                {parsed.isValid ? parsed.hostname : 'Invalid Hostname'}
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${parsed.isHttps ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                {parsed.protocol.toUpperCase().replace(':', '')}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>Complete Destination URL</span>
            </label>
            <div className="p-3 rounded-xl bg-[#061426] border border-[#00D9FF]/20 font-mono text-xs text-[#CBD5E1] break-all max-h-24 overflow-y-auto">
              {parsed.fullUrl}
            </div>
          </div>
        </div>

        {/* Security Advisory Warning */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-200 mb-0.5">Automated Scan Advisory</p>
            <p className="text-amber-300/90 text-[11px]">
              While our heuristic and machine learning checks detected no significant phishing signals, automated scans cannot guarantee absolute safety. Always verify site authenticity before entering passwords, sensitive information, or credit card details.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#061B30] transition-colors cursor-pointer"
          >
            Cancel & Stay Here
          </button>
          <button
            type="button"
            onClick={handleProceed}
            disabled={!parsed.isValid}
            className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-[#020B16] font-bold text-xs shadow-[0_0_16px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Proceed to Website</span>
          </button>
        </div>
      </div>
    </div>
  )
}
