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
  icon?: React.ElementType
}

interface ProtectionToolsProps {
  onSelectTool: (toolId: string) => void
}

/**
 * 1. URL Scanner Icon
 * Cyan chain-link icon in dark-blue outlined container with subtle scanning highlight
 */
const UrlScannerIcon: React.FC = () => (
  <div className="relative w-14 h-14 shrink-0 rounded-xl bg-[#061B30] border border-[#00D9FF]/35 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.18)] transition-all duration-300 group-hover:border-[#00D9FF] group-hover:shadow-[0_0_22px_rgba(0,217,255,0.4)] overflow-hidden">
    {/* Subtle scanning highlight sweep */}
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        background: 'linear-gradient(115deg, transparent 20%, rgba(0, 217, 255, 0.45) 50%, transparent 80%)',
        animation: 'urlScanSweep 3.2s ease-in-out infinite',
      }}
    />
    {/* Ambient center cyan flare */}
    <div className="absolute w-7 h-7 rounded-full bg-[#00D9FF]/15 blur-sm pointer-events-none" />
    {/* Central chain-link icon */}
    <Link2 className="relative z-10 w-6 h-6 text-[#00D9FF] transition-transform duration-300 group-hover:scale-105" strokeWidth={2} />
  </div>
)

/**
 * 2. File Scanner Icon
 * Cyan document icon with restrained scanning-line animation
 */
const FileScannerIcon: React.FC = () => (
  <div className="relative w-14 h-14 shrink-0 rounded-xl bg-[#061B30] border border-[#00D9FF]/35 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.18)] transition-all duration-300 group-hover:border-[#00D9FF] group-hover:shadow-[0_0_22px_rgba(0,217,255,0.4)] overflow-hidden">
    {/* Ambient center cyan flare */}
    <div className="absolute w-7 h-7 rounded-full bg-[#00D9FF]/12 blur-sm pointer-events-none" />
    {/* Document icon */}
    <FileText className="relative z-10 w-6 h-6 text-[#00D9FF] transition-transform duration-300 group-hover:scale-105" strokeWidth={2} />
    {/* Restrained horizontal laser scanning line */}
    <div
      className="absolute left-3 right-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent shadow-[0_0_6px_#00D9FF] z-20 pointer-events-none"
      style={{ animation: 'fileLaserScan 2.6s ease-in-out infinite' }}
    />
  </div>
)

/**
 * 3. QR Scanner Icon
 * Cyan QR icon with subtle scanning effect that preserves icon's legibility
 */
const QrScannerIcon: React.FC = () => (
  <div className="relative w-14 h-14 shrink-0 rounded-xl bg-[#061B30] border border-[#00D9FF]/35 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.18)] transition-all duration-300 group-hover:border-[#00D9FF] group-hover:shadow-[0_0_22px_rgba(0,217,255,0.4)] overflow-hidden">
    {/* 4 subtle corner reticle markers */}
    <div className="absolute inset-2 border-t-2 border-l-2 border-[#00D9FF]/40 w-2 h-2 rounded-tl pointer-events-none group-hover:border-[#00D9FF]" />
    <div className="absolute inset-2 left-auto border-t-2 border-r-2 border-[#00D9FF]/40 w-2 h-2 rounded-tr pointer-events-none group-hover:border-[#00D9FF]" />
    <div className="absolute inset-2 top-auto border-b-2 border-l-2 border-[#00D9FF]/40 w-2 h-2 rounded-bl pointer-events-none group-hover:border-[#00D9FF]" />
    <div className="absolute inset-2 top-auto left-auto border-b-2 border-r-2 border-[#00D9FF]/40 w-2 h-2 rounded-br pointer-events-none group-hover:border-[#00D9FF]" />
    {/* QR code icon */}
    <QrCode className="relative z-10 w-6 h-6 text-[#00D9FF] transition-transform duration-300 group-hover:scale-105" strokeWidth={2} />
    {/* Subtle sweeping scan beam */}
    <div
      className="absolute left-2.5 right-2.5 h-[1.5px] bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent shadow-[0_0_8px_#00D9FF] z-20 pointer-events-none"
      style={{ animation: 'qrLaserScan 2.4s linear infinite' }}
    />
  </div>
)

/**
 * 4. Phone Checker Icon
 * Cyan phone icon with gentle illumination pulse
 */
const PhoneCheckerIcon: React.FC = () => (
  <div className="relative w-14 h-14 shrink-0 rounded-xl bg-[#061B30] border border-[#00D9FF]/35 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.18)] transition-all duration-300 group-hover:border-[#00D9FF] group-hover:shadow-[0_0_22px_rgba(0,217,255,0.4)] overflow-hidden">
    {/* Concentric sonar illumination pulses */}
    <span
      className="absolute w-7 h-7 rounded-full border border-[#00D9FF]/45 pointer-events-none"
      style={{ animation: 'phoneSonar 2.8s cubic-bezier(0.1, 0.7, 0.4, 1) infinite' }}
    />
    <span
      className="absolute w-7 h-7 rounded-full border border-[#00D9FF]/30 pointer-events-none"
      style={{ animation: 'phoneSonar 2.8s cubic-bezier(0.1, 0.7, 0.4, 1) infinite', animationDelay: '1.4s' }}
    />
    {/* Phone icon with subtle pulse */}
    <PhoneCall
      className="relative z-10 w-6 h-6 text-[#00D9FF] transition-transform duration-300 group-hover:scale-105"
      style={{ animation: 'phonePulseGlow 3s ease-in-out infinite' }}
      strokeWidth={2}
    />
  </div>
)

/**
 * 5. Email & Message Scanner Icon
 * Cyan envelope icon with soft light sweep
 */
const EmailScannerIcon: React.FC = () => (
  <div className="relative w-14 h-14 shrink-0 rounded-xl bg-[#061B30] border border-[#00D9FF]/35 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.18)] transition-all duration-300 group-hover:border-[#00D9FF] group-hover:shadow-[0_0_22px_rgba(0,217,255,0.4)] overflow-hidden">
    {/* Luminous light sweep across envelope */}
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(0, 217, 255, 0.35) 50%, transparent 100%)',
        animation: 'mailLightSweep 3s ease-in-out infinite',
      }}
    />
    {/* Status beacon dot at top right */}
    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#00D9FF] shadow-[0_0_6px_#00D9FF] animate-pulse z-20 pointer-events-none" />
    {/* Mail icon */}
    <Mail className="relative z-10 w-6 h-6 text-[#00D9FF] transition-transform duration-300 group-hover:scale-105" strokeWidth={2} />
  </div>
)

/**
 * 6. SocialShield AI Icon
 * Cyan people/profile icon with restrained shield-inspired glow
 */
const SocialShieldIcon: React.FC = () => (
  <div className="relative w-14 h-14 shrink-0 rounded-xl bg-[#061B30] border border-[#00D9FF]/35 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.18)] transition-all duration-300 group-hover:border-[#00D9FF] group-hover:shadow-[0_0_22px_rgba(0,217,255,0.4)] overflow-hidden">
    {/* Shield contour outline glow behind the users */}
    <svg
      className="absolute w-9 h-9 text-[#00D9FF] pointer-events-none"
      style={{ animation: 'shieldAuraPulse 3.2s ease-in-out infinite' }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
    {/* Users icon */}
    <Users className="relative z-10 w-6 h-6 text-[#00D9FF] transition-transform duration-300 group-hover:scale-105" strokeWidth={2} />
  </div>
)

export const ProtectionTools: React.FC<ProtectionToolsProps> = ({ onSelectTool }) => {
  const tools: ToolCardData[] = [
    {
      id: 'url-scanner',
      title: 'URL Scanner',
      description: 'Analyse suspicious URLs, domain characteristics, and reputation signals.',
    },
    {
      id: 'file-scanner',
      title: 'File Scanner',
      description: 'Upload a file for validation, malware detection, and metadata analysis.',
    },
    {
      id: 'qr-scanner',
      title: 'QR Scanner',
      description: 'Decode QR codes and inspect destinations before opening them.',
    },
    {
      id: 'phone-checker',
      title: 'Phone Checker',
      description: 'Check spam reports and phone-number reputation indicators.',
    },
    {
      id: 'email-message',
      title: 'Email & Message',
      description: 'Inspect suspicious messages, sender indicators, and embedded links.',
    },
    {
      id: 'social-shield',
      title: 'SocialShield AI',
      description: 'Investigate public profiles and detect possible impersonation indicators.',
    },
  ]

  const renderToolIcon = (toolId: string) => {
    switch (toolId) {
      case 'url-scanner':
        return <UrlScannerIcon />
      case 'file-scanner':
        return <FileScannerIcon />
      case 'qr-scanner':
        return <QrScannerIcon />
      case 'phone-checker':
        return <PhoneCheckerIcon />
      case 'email-message':
        return <EmailScannerIcon />
      case 'social-shield':
        return <SocialShieldIcon />
      default:
        return null
    }
  }

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
          {tools.map((tool) => (
            <div
              key={tool.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectTool(tool.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectTool(tool.id)
                }
              }}
              aria-label={`Open ${tool.title}: ${tool.description}`}
              className="group relative flex items-center justify-between p-5 sm:p-6 rounded-2xl bg-[#04182B] border border-[rgba(0,217,255,0.22)] shadow-[0_4px_20px_rgba(2,11,22,0.6)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#00D9FF]/80 hover:shadow-[0_12px_28px_rgba(2,11,22,0.8),0_0_24px_rgba(0,217,255,0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120] overflow-hidden select-none"
            >
              {/* Ambient Corner Glow on Hover */}
              <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#00D9FF]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#00D9FF]/20 group-hover:scale-125 transition-all duration-500" />

              {/* Subtle Top-Edge Cyan Glow Line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D9FF]/25 to-transparent group-hover:via-[#00D9FF]/70 transition-all duration-300" />

              {/* Subtle Card Hover Light Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D9FF]/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

              {/* Left: Custom Animated Icon Container */}
              <div className="flex items-center gap-4 flex-1 pr-3 relative z-10">
                {renderToolIcon(tool.id)}

                {/* Centre: Title & Description */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight group-hover:text-[#00D9FF] transition-colors duration-200">
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </div>

              {/* Right: Circular Outlined Arrow Button */}
              <div className="h-9 w-9 shrink-0 rounded-full border border-[#00D9FF]/30 bg-[#061B30]/90 flex items-center justify-center text-[#00D9FF] transition-all duration-300 group-hover:bg-[#00D9FF] group-hover:text-[#020B16] group-hover:border-[#00D9FF] group-hover:scale-105 group-hover:shadow-[0_0_14px_rgba(0,217,255,0.4)] relative z-10">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded CSS Keyframes for Subtle Tool Icon Animations */}
      <style>{`
        @keyframes urlScanSweep {
          0% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
          30% { opacity: 0.8; }
          60% { transform: translateX(150%) skewX(-20deg); opacity: 0; }
          100% { transform: translateX(150%) skewX(-20deg); opacity: 0; }
        }

        @keyframes fileLaserScan {
          0%, 100% { top: 20%; opacity: 0.25; }
          50% { top: 78%; opacity: 0.95; }
        }

        @keyframes qrLaserScan {
          0% { top: 18%; opacity: 0; }
          15% { opacity: 0.9; }
          85% { opacity: 0.9; }
          100% { top: 82%; opacity: 0; }
        }

        @keyframes phoneSonar {
          0% { transform: scale(0.6); opacity: 0.85; }
          100% { transform: scale(1.65); opacity: 0; }
        }

        @keyframes phonePulseGlow {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(0, 217, 255, 0.3)); }
          50% { filter: drop-shadow(0 0 7px rgba(0, 217, 255, 0.85)); }
        }

        @keyframes mailLightSweep {
          0% { transform: translateX(-130%) skewX(-25deg); opacity: 0; }
          25% { opacity: 0.7; }
          55% { transform: translateX(130%) skewX(-25deg); opacity: 0; }
          100% { transform: translateX(130%) skewX(-25deg); opacity: 0; }
        }

        @keyframes shieldAuraPulse {
          0%, 100% {
            transform: scale(0.92);
            opacity: 0.25;
            filter: drop-shadow(0 0 2px rgba(0, 217, 255, 0.2));
          }
          50% {
            transform: scale(1.06);
            opacity: 0.75;
            filter: drop-shadow(0 0 8px rgba(0, 217, 255, 0.65));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div[style*="animation"],
          span[style*="animation"],
          svg[style*="animation"] {
            animation: none !important;
          }
          .group:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}
