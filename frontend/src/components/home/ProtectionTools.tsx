import React from 'react'
import {
  Link2,
  FileText,
  QrCode,
  PhoneCall,
  Mail,
  Users,
  ArrowUpRight,
} from 'lucide-react'

export interface ToolCardData {
  id: string
  title: string
  description: string
  icon: React.ElementType
}

interface ProtectionToolsProps {
  onSelectTool: (toolId: string) => void
}

export const ProtectionTools: React.FC<ProtectionToolsProps> = ({ onSelectTool }) => {
  const tools: ToolCardData[] = [
    {
      id: 'url-scanner',
      title: 'URL Scanner',
      description: 'Analyse suspicious URLs, domain characteristics, and reputation signals.',
      icon: Link2,
    },
    {
      id: 'file-scanner',
      title: 'File Scanner',
      description: 'Upload a file for validation, malware detection, and metadata analysis.',
      icon: FileText,
    },
    {
      id: 'qr-scanner',
      title: 'QR Scanner',
      description: 'Decode QR codes and inspect destinations before opening them.',
      icon: QrCode,
    },
    {
      id: 'phone-checker',
      title: 'Phone Checker',
      description: 'Check spam reports and phone-number reputation indicators.',
      icon: PhoneCall,
    },
    {
      id: 'email-message',
      title: 'Email & Message',
      description: 'Inspect suspicious messages, sender indicators, and embedded links.',
      icon: Mail,
    },
    {
      id: 'social-shield',
      title: 'SocialShield AI',
      description: 'Investigate public profiles and detect possible impersonation indicators.',
      icon: Users,
    },
  ]

  return (
    <section id="protection" className="relative w-full pt-4 pb-4 sm:pt-6 sm:pb-6 lg:pt-8 lg:pb-8 bg-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
            Explore Our Protection Tools
          </h2>
          <p className="text-base sm:text-lg text-[#CBD5E1]">
            Choose the type of digital content you want to investigate.
          </p>
        </div>

        {/* Exactly Six Cards in 3 Columns x 2 Rows on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className="group relative flex items-center justify-between p-6 rounded-2xl bg-[#0D1B2A] border border-[#22D3EE]/25 shadow-[0_8px_24px_rgba(0,0,0,0.4)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#22D3EE] hover:shadow-[0_0_24px_rgba(34,211,238,0.22)] overflow-hidden select-none"
              >
                {/* Subtle Left-Edge Blue/Cyan Illumination Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#22D3EE]/60 via-[#22D3EE] to-[#22D3EE]/60 opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Ambient Corner Glow on Hover */}
                <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#22D3EE]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#22D3EE]/20 transition-all duration-300" />

                {/* Left: Icon Container */}
                <div className="flex items-center gap-4 flex-1 pr-3">
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-[#111C30] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] shadow-[0_0_14px_rgba(34,211,238,0.18)] transition-all duration-300 group-hover:border-[#22D3EE] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:scale-105">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Centre: Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight group-hover:text-[#22D3EE] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Right: Circular Outlined Arrow Icon */}
                <div className="h-9 w-9 shrink-0 rounded-full border border-[#22D3EE]/35 bg-[#111C30]/80 flex items-center justify-center text-[#22D3EE] transition-all duration-200 group-hover:bg-[#22D3EE] group-hover:text-[#0B1120] group-hover:scale-110 shadow-sm">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
