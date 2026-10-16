import React from 'react'
import { Zap, Search, FileText, QrCode, PhoneCall, AlertTriangle } from 'lucide-react'

interface QuickActionsGridProps {
  onSelectTool: (toolId: string) => void
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onSelectTool,
}) => {
  const actions = [
    {
      id: 'url',
      title: 'Scan a URL',
      subtitle: 'Check website safety',
      icon: Search,
      borderColor: 'border-[#00D9FF]/40',
      bgColor: 'bg-[#00D9FF]/15',
      textColor: 'text-[#00D9FF]',
      shadow: 'hover:shadow-[0_0_18px_rgba(0,217,255,0.3)]',
    },
    {
      id: 'file',
      title: 'Scan a File',
      subtitle: 'Check for malware',
      icon: FileText,
      borderColor: 'border-[#A855F7]/40',
      bgColor: 'bg-[#A855F7]/15',
      textColor: 'text-[#C084FC]',
      shadow: 'hover:shadow-[0_0_18px_rgba(168,85,247,0.3)]',
    },
    {
      id: 'qr',
      title: 'Scan a QR Code',
      subtitle: 'Verify QR code links',
      icon: QrCode,
      borderColor: 'border-[#06B6D4]/40',
      bgColor: 'bg-[#06B6D4]/15',
      textColor: 'text-[#06B6D4]',
      shadow: 'hover:shadow-[0_0_18px_rgba(6,182,212,0.3)]',
    },
    {
      id: 'phone',
      title: 'Check a Phone',
      subtitle: 'Verify phone numbers',
      icon: PhoneCall,
      borderColor: 'border-[#F59E0B]/40',
      bgColor: 'bg-[#F59E0B]/15',
      textColor: 'text-[#F59E0B]',
      shadow: 'hover:shadow-[0_0_18px_rgba(245,158,11,0.3)]',
    },
  ]

  return (
    <div className="rounded-2xl bg-[#04182B] border border-[#00D9FF]/20 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between select-none space-y-3.5">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-[#00D9FF]/15">
        <div className="w-7 h-7 rounded-lg bg-[#00D9FF]/15 border border-[#00D9FF]/35 flex items-center justify-center text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.3)]">
          <Zap className="w-4 h-4 fill-[#00D9FF]" />
        </div>
        <h3 className="text-base font-bold text-[#F8FAFC]">Quick Actions</h3>
      </div>

      {/* 4 Colorful Action Cards in 2x2 Grid Matching Blueprint */}
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon

          return (
            <button
              key={act.id}
              onClick={() => onSelectTool(act.id)}
              className={`p-3 rounded-xl bg-[#061426] border ${act.borderColor} ${act.shadow} transition-all duration-300 text-left flex items-center gap-3 group cursor-pointer hover:border-opacity-100 hover:-translate-y-0.5`}
            >
              <div className={`w-8 h-8 rounded-lg ${act.bgColor} flex items-center justify-center ${act.textColor} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#F8FAFC] group-hover:text-white truncate">
                  {act.title}
                </h4>
                <p className="text-[10px] text-[#94A3B8] leading-tight mt-0.5 truncate">
                  {act.subtitle}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Red-Accented Security Reminder Banner Matching Blueprint */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/40 via-red-950/20 to-[#061426] border border-red-500/40 flex items-center gap-3.5 shadow-[0_0_16px_rgba(239,68,68,0.2)]">
        <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)] shrink-0">
          <AlertTriangle className="w-4 h-4 fill-red-500 text-red-950" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-red-400 tracking-wide">
            Stay Alert, Stay Safe!
          </h4>
          <p className="text-[10px] text-[#94A3B8] mt-0.5 leading-snug truncate">
            Always verify before you click, share, or download.
          </p>
        </div>
      </div>
    </div>
  )
}

