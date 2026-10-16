import React from 'react'
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Clock,
  Users,
} from 'lucide-react'
import { AnimatedSecurityLock } from './AnimatedSecurityLock'

interface HeroSectionProps {
  onScanUrl: () => void
  onExploreProtection: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScanUrl,
  onExploreProtection,
}) => {
  return (
    <section className="relative w-full overflow-hidden pt-6 pb-4 sm:pt-8 sm:pb-6 lg:pt-12 lg:pb-8 border-b border-[#00D9FF]/15 bg-gradient-to-b from-[#020B16] via-[#061426]/80 to-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Core Message & CTAs */}
          <div className="lg:col-span-6 space-y-5 lg:space-y-6 z-10">
            {/* Outlined Cyan Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#22D3EE]/40 bg-[#111C30]/80 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
              <span className="text-xs font-mono font-semibold tracking-wider text-[#22D3EE] uppercase">
                AI-Powered Cybersecurity
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              <span className="text-[#F8FAFC] block">Think Before You Click.</span>
              <span className="text-[#22D3EE] block drop-shadow-[0_0_20px_rgba(34,211,238,0.35)] mt-1 sm:mt-2">
                Stay Safe Online.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#CBD5E1] leading-relaxed max-w-xl">
              Detect suspicious links, investigate potential digital threats, and make informed security decisions with PhishShield AI.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onScanUrl}
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#22D3EE] text-[#0B1120] font-bold text-sm tracking-wide shadow-[0_0_24px_rgba(34,211,238,0.4)] hover:bg-[#38BDF8] hover:shadow-[0_0_32px_rgba(34,211,238,0.6)] transition-all duration-200 active:scale-98"
              >
                <span>Scan a Suspicious URL</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreProtection}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-[#22D3EE]/35 bg-[#111C30]/60 text-[#22D3EE] font-semibold text-sm tracking-wide hover:bg-[#111C30] hover:border-[#22D3EE] hover:shadow-[0_0_16px_rgba(34,211,238,0.25)] transition-all duration-200 active:scale-98"
              >
                Explore Protection
              </button>
            </div>

            {/* Four Compact Capability Indicators */}
            <div className="pt-5 border-t border-[#22D3EE]/15">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#111C30] border border-[#22D3EE]/25 text-[#22D3EE]">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-[#F8FAFC]">
                    9 Protection Tools
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#111C30] border border-[#22D3EE]/25 text-[#22D3EE]">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-[#F8FAFC]">
                    AI-Powered Analysis
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#111C30] border border-[#22D3EE]/25 text-[#22D3EE]">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-[#F8FAFC]">
                    24/7 Digital Safety
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#111C30] border border-[#22D3EE]/25 text-[#22D3EE]">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-[#F8FAFC]">
                    Built for Everyday Users
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Exact Reference Master Security Padlock Assembly */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <AnimatedSecurityLock />
          </div>
        </div>
      </div>
    </section>
  )
}
