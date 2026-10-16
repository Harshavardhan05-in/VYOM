import React from 'react'
import { Shield, Bell, Search, Activity, Cpu, RotateCcw, Home } from 'lucide-react'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

interface NavbarProps {
  onToggleSidebar?: () => void
  onReplayIntro?: () => void
  onReturnHome?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onReplayIntro, onReturnHome }) => {
  return (
    <header className="h-16 border-b border-cyber-border bg-[#0B1120]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & Status */}
      <div className="flex items-center gap-4">
        <div
          onClick={onReturnHome}
          className={`flex items-center gap-3 ${onReturnHome ? 'cursor-pointer group' : ''}`}
          title={onReturnHome ? 'Return to Homepage' : undefined}
        >
          <div className="h-9 w-9 rounded-lg bg-[#111C30] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.2)]">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wide text-[#F8FAFC]">
                PhishShield <span className="text-[#22D3EE] font-mono">AI</span>
              </span>
              <Badge variant="cyan" size="sm" dot>
                Online
              </Badge>
            </div>
            <p className="text-[10px] text-[#94A3B8] tracking-wider uppercase font-mono">
              Autonomous Cybersecurity Shield
            </p>
          </div>
        </div>
      </div>

      {/* Global Search / Action Bar */}
      <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search threats, quarantined URLs, headers, or logs..."
            className="w-full bg-[#0D1B2A] border border-[#22D3EE]/25 rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/40 transition-all font-sans"
            readOnly
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#94A3B8] border border-[#22D3EE]/20 rounded px-1.5 py-0.5">
            ⌘K
          </span>
        </div>
      </div>

      {/* Action Controls & User Presence */}
      <div className="flex items-center gap-3">
        {onReturnHome && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReturnHome}
            icon={<Home className="h-3.5 w-3.5 text-[#22D3EE]" />}
            title="Return to Homepage"
          >
            Homepage
          </Button>
        )}

        {onReplayIntro && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReplayIntro}
            icon={<RotateCcw className="h-3.5 w-3.5 text-[#22D3EE]" />}
            title="Replay Cinematic Cyber Intro"
          >
            Replay Intro
          </Button>
        )}

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-[#111C30] border border-[#22D3EE]/20 text-xs font-mono text-[#CBD5E1]">
          <Cpu className="h-3.5 w-3.5 text-[#22D3EE]" />
          <span>Core: Idle</span>
        </div>

        <button
          className="relative p-2 rounded-lg text-[#CBD5E1] hover:text-[#22D3EE] hover:bg-[#111C30] transition-colors border border-transparent hover:border-[#22D3EE]/30"
          aria-label="Alerts"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#22D3EE] animate-pulse" />
        </button>

        <div className="h-4 w-px bg-[#22D3EE]/20 mx-1" />

        <Button variant="outline" size="sm" icon={<Activity className="h-3.5 w-3.5" />}>
          Telemetry
        </Button>
      </div>
    </header>
  )
}
