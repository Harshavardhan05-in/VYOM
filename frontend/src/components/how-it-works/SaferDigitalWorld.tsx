import React, { useId } from 'react'
import { Shield, EyeOff, RefreshCw, Users } from 'lucide-react'

export const SaferDigitalWorld: React.FC = () => {
  const compId = useId().replace(/:/g, '')

  return (
    <section className="relative w-full py-16 lg:py-28 bg-[#080D1A] border-t border-[#22D3EE]/15 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#22D3EE]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ======================================================== */}
          {/* LEFT COLUMN: GLOWING DIGITAL GLOBE & ORBITING SHIELDS     */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <style>{`
              @keyframes globeRotate${compId} {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes orbitShield1${compId} {
                0% { transform: rotate(0deg) translateX(140px) rotate(0deg); }
                100% { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
              }
              @keyframes orbitShield2${compId} {
                0% { transform: rotate(180deg) translateX(155px) rotate(-180deg); }
                100% { transform: rotate(540deg) translateX(155px) rotate(-540deg); }
              }
              @keyframes orbitShield3${compId} {
                0% { transform: rotate(270deg) translateX(125px) rotate(-270deg); }
                100% { transform: rotate(630deg) translateX(125px) rotate(-630deg); }
              }
              @keyframes pulseNode${compId} {
                0%, 100% { opacity: 0.3; transform: scale(0.9); }
                50% { opacity: 1; transform: scale(1.2); }
              }
            `}</style>

            <div className="relative w-72 sm:w-96 h-72 sm:h-96 flex items-center justify-center select-none">
              {/* Outer Ambient Glow Ring */}
              <div className="absolute inset-0 rounded-full border border-[#22D3EE]/20 shadow-[0_0_50px_rgba(34,211,238,0.15)] pointer-events-none" />

              {/* Orbit Ellipse 1 */}
              <div
                className="absolute w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full border border-dashed border-[#22D3EE]/25 pointer-events-none"
                style={{ transform: 'rotate(25deg)' }}
              />

              {/* Orbit Ellipse 2 */}
              <div
                className="absolute w-[310px] h-[310px] sm:w-[350px] sm:h-[350px] rounded-full border border-[#22D3EE]/15 pointer-events-none"
                style={{ transform: 'rotate(-35deg)' }}
              />

              {/* Central Globe Core (SVG) */}
              <div className="relative w-48 sm:w-60 h-48 sm:h-60 rounded-full bg-[#0D1B2A] border-2 border-[#22D3EE]/40 flex items-center justify-center shadow-[inset_0_0_40px_rgba(34,211,238,0.25),0_0_30px_rgba(34,211,238,0.2)] overflow-hidden">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full opacity-80"
                  style={{ animation: `globeRotate${compId} 45s linear infinite` }}
                >
                  {/* Grid Longitudes & Latitudes */}
                  <circle cx="100" cy="100" r="96" fill="none" stroke="#22D3EE" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                  
                  {/* Parallels */}
                  <ellipse cx="100" cy="100" rx="94" ry="70" fill="none" stroke="#22D3EE" strokeWidth="1" opacity="0.35" />
                  <ellipse cx="100" cy="100" rx="90" ry="40" fill="none" stroke="#22D3EE" strokeWidth="1" opacity="0.4" />
                  <line x1="6" y1="100" x2="194" y2="100" stroke="#22D3EE" strokeWidth="1.2" opacity="0.5" />
                  
                  {/* Meridians */}
                  <ellipse cx="100" cy="100" rx="40" ry="94" fill="none" stroke="#22D3EE" strokeWidth="1" opacity="0.4" />
                  <ellipse cx="100" cy="100" rx="70" ry="94" fill="none" stroke="#22D3EE" strokeWidth="1" opacity="0.35" />
                  <line x1="100" y1="6" x2="100" y2="194" stroke="#22D3EE" strokeWidth="1.2" opacity="0.5" />

                  {/* Interconnected Cyber Nodes & Coordinates */}
                  <g fill="#22D3EE">
                    <circle cx="70" cy="80" r="3.5" filter="drop-shadow(0 0 4px #22D3EE)" />
                    <circle cx="130" cy="75" r="3" filter="drop-shadow(0 0 4px #22D3EE)" />
                    <circle cx="110" cy="125" r="3.5" filter="drop-shadow(0 0 4px #22D3EE)" />
                    <circle cx="60" cy="130" r="2.5" filter="drop-shadow(0 0 4px #22D3EE)" />
                    <circle cx="145" cy="115" r="3" filter="drop-shadow(0 0 4px #22D3EE)" />
                    <circle cx="100" cy="50" r="3.5" filter="drop-shadow(0 0 4px #22D3EE)" />
                  </g>

                  {/* Cyber Connection Arcs */}
                  <path
                    d="M 70 80 Q 100 65 130 75 Q 120 100 110 125 Q 85 135 60 130 Q 65 105 70 80"
                    fill="none"
                    stroke="#22D3EE"
                    strokeWidth="1.2"
                    strokeDasharray="4 2"
                    opacity="0.6"
                  />
                  <path
                    d="M 100 50 L 130 75 L 145 115 L 110 125"
                    fill="none"
                    stroke="#22D3EE"
                    strokeWidth="0.8"
                    opacity="0.4"
                  />
                </svg>

                {/* Central Emblem Badge inside Globe */}
                <div className="absolute h-14 w-14 rounded-full bg-[#081220]/90 border border-[#22D3EE] flex items-center justify-center text-[#22D3EE] shadow-[0_0_24px_rgba(34,211,238,0.5)]">
                  <Shield className="h-7 w-7" />
                </div>
              </div>

              {/* Orbiting Shield Satellite 1 */}
              <div
                className="absolute flex items-center justify-center pointer-events-none"
                style={{ animation: `orbitShield1${compId} 14s linear infinite` }}
              >
                <div className="h-8 w-8 rounded-lg bg-[#111C30] border border-[#22D3EE] flex items-center justify-center text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.6)]">
                  <Shield className="h-4 w-4" />
                </div>
              </div>

              {/* Orbiting Node Satellite 2 */}
              <div
                className="absolute flex items-center justify-center pointer-events-none"
                style={{ animation: `orbitShield2${compId} 18s linear infinite` }}
              >
                <div className="h-7 w-7 rounded-md bg-[#0D1B2A] border border-[#38BDF8] flex items-center justify-center text-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                  <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
                </div>
              </div>

              {/* Orbiting Mini-Shield 3 */}
              <div
                className="absolute flex items-center justify-center pointer-events-none"
                style={{ animation: `orbitShield3${compId} 11s linear infinite` }}
              >
                <div className="h-6 w-6 rounded-md bg-[#111C30] border border-[#22D3EE]/70 flex items-center justify-center text-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                  <Shield className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: HEADINGS & THREE TRUST PILLARS             */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#22D3EE]/30 bg-[#111C30]/70 text-xs font-mono font-medium text-[#22D3EE] uppercase tracking-wider">
                TRUST & RESILIENCE
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8FAFC]">
                Built for a Safer Digital World
              </h2>
              <p className="text-base sm:text-lg text-[#CBD5E1] leading-relaxed">
                PhishShield AI was engineered on fundamental principles of user trust: uncompromising privacy, continuous neural adaptation, and making enterprise-grade defense accessible to all.
              </p>
            </div>

            {/* Three Pillar Cards */}
            <div className="space-y-5">
              {/* Pillar 1 — Privacy Focused */}
              <div className="flex items-start gap-4 p-5 rounded-xl bg-[#0D1B2A] border border-[#22D3EE]/20 hover:border-[#22D3EE]/45 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-[#111C30] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] flex-shrink-0 mt-0.5 shadow-[0_0_12px_rgba(34,211,238,0.15)]">
                  <EyeOff className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#F8FAFC]">
                    Privacy Focused
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    We never log, monetize, or store submitted credentials, personal messages, or private browsing telemetry. All inspections occur in volatile memory sandboxes and are immediately purged after report generation.
                  </p>
                </div>
              </div>

              {/* Pillar 2 — Continuously Improving */}
              <div className="flex items-start gap-4 p-5 rounded-xl bg-[#0D1B2A] border border-[#22D3EE]/20 hover:border-[#22D3EE]/45 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-[#111C30] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] flex-shrink-0 mt-0.5 shadow-[0_0_12px_rgba(34,211,238,0.15)]">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#F8FAFC]">
                    Continuously Improving
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    Threat actors continuously evolve their tactics. Our machine learning models and heuristics dynamically adapt as novel zero-day phishing kits, homoglyph variations, and obfuscation routines emerge worldwide.
                  </p>
                </div>
              </div>

              {/* Pillar 3 — Designed for Everyone */}
              <div className="flex items-start gap-4 p-5 rounded-xl bg-[#0D1B2A] border border-[#22D3EE]/20 hover:border-[#22D3EE]/45 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-[#111C30] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] flex-shrink-0 mt-0.5 shadow-[0_0_12px_rgba(34,211,238,0.15)]">
                  <Users className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#F8FAFC]">
                    Designed for Everyone
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    Digital security should not require a cybersecurity degree. We translate multi-vector forensic indicators into intuitive risk verdicts and concrete, actionable steps that anyone can safely navigate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
