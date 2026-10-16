import React from 'react'
import { ArrowRight, ShieldCheck, Lock, CheckCircle2, Zap } from 'lucide-react'

interface FinalCTAProps {
  onOpenDashboard: () => void
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenDashboard }) => {
  return (
    <section className="relative w-full pt-4 pb-4 sm:pt-6 sm:pb-6 lg:pt-8 lg:pb-8 bg-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#04182B] to-[#061B30] border border-[#00D9FF]/35 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[0_0_36px_rgba(0,217,255,0.12)]">
          {/* Subtle Ambient Cyan Corner Glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Column: Heading, Description & Action Button */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8FAFC]">
                Your Digital Safety Starts Here.
              </h2>
              <p className="text-base sm:text-lg text-[#CBD5E1] max-w-xl mx-auto lg:mx-0">
                Be aware. Be informed. Be protected with PhishShield AI.
              </p>
              <div className="pt-2 flex justify-center lg:justify-start">
                <button
                  onClick={onOpenDashboard}
                  className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#00D9FF] text-[#020B16] font-bold text-base tracking-wide shadow-[0_0_24px_rgba(0,217,255,0.4)] hover:bg-[#38BDF8] hover:shadow-[0_0_32px_rgba(0,217,255,0.6)] transition-all duration-200 active:scale-98"
                >
                  <span>Open Security Dashboard</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Column: Complementary Futuristic Shield & Platform Illustration */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                {/* Holographic Concentric Rings */}
                <div className="absolute inset-0 rounded-full border border-[#00D9FF]/20 animate-spin" style={{ animationDuration: '30s' }} />
                <div className="absolute inset-6 rounded-full border border-[#00D9FF]/30 border-dashed animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />

                {/* Base Holographic Platform */}
                <div className="absolute bottom-2 w-48 h-14 bg-gradient-to-t from-[#00D9FF]/20 to-transparent rounded-[50%] blur-sm pointer-events-none" />

                {/* Central Floating Cyber Shield Emblem */}
                <div className="relative z-10 p-6 rounded-2xl bg-[#0B1120]/90 border border-[#00D9FF]/45 shadow-[0_0_28px_rgba(0,217,255,0.35)] flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105">
                  <div className="h-16 w-16 rounded-xl bg-[#111C30] border border-[#00D9FF]/50 flex items-center justify-center text-[#00D9FF] shadow-[0_0_16px_rgba(0,217,255,0.4)]">
                    <ShieldCheck className="h-9 w-9" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-wider text-[#00D9FF] uppercase mt-3">
                    Active Defense
                  </span>
                </div>

                {/* Small Complementary Orbiting Security Icons */}
                <div className="absolute top-4 left-6 p-2 rounded-lg bg-[#04182B] border border-[#00D9FF]/30 text-[#00D9FF] shadow-sm">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="absolute bottom-10 right-4 p-2 rounded-lg bg-[#04182B] border border-[#00D9FF]/30 text-[#00D9FF] shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="absolute top-12 right-6 p-2 rounded-lg bg-[#04182B] border border-[#00D9FF]/30 text-[#00D9FF] shadow-sm">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
