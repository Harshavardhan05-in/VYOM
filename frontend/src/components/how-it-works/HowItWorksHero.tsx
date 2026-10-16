import React, { useId } from 'react'
import { Shield } from 'lucide-react'

export const HowItWorksHero: React.FC = () => {
  const filterId = useId().replace(/:/g, '')

  return (
    <section className="relative w-full overflow-hidden pt-6 pb-8 lg:pt-10 lg:pb-12 border-b border-[#22D3EE]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* ======================================================== */}
          {/* LEFT COLUMN: BADGE, HEADINGS, SUBTITLE, DESCRIPTION      */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 space-y-5 lg:space-y-6 z-10">
            {/* Outlined Cyan Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#22D3EE]/40 bg-[#111C30]/80 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
              <span className="text-xs font-mono font-semibold tracking-wider text-[#22D3EE] uppercase">
                OUR PROCESS
              </span>
            </div>

            {/* Main Heading & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                <span className="text-[#F8FAFC] block">How PhishShield AI</span>
                <span className="text-[#22D3EE] block drop-shadow-[0_0_20px_rgba(34,211,238,0.35)] mt-1 sm:mt-2">
                  Works
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-semibold text-[#22D3EE] tracking-wide">
                A simple process. Powerful protection.
              </p>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#CBD5E1] leading-relaxed max-w-xl">
              PhishShield AI combines advanced analysis, machine learning, and threat intelligence to help you detect and understand potential digital threats before you take action.
            </p>

            {/* Supporting Micro-Specs */}
            <div className="pt-4 flex items-center gap-6 text-xs font-mono text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                <span>Real-time Inspection</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                <span>Multi-Vector Signals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                <span>Actionable Guidance</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: CONTINUOUSLY ROTATING 3D SECURITY SHIELD   */}
          {/* 12-18s cycle (15s), holographic platform & rings         */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <div
              className="relative w-full h-[400px] sm:h-[450px] lg:h-[480px] flex items-center justify-center select-none overflow-visible group"
              aria-label="PhishShield AI Continuous 3D Security Shield Illustration"
            >
              {/* 1. Deep Ambient Radial Atmosphere & Cyan Glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.16) 0%, rgba(17, 28, 48, 0.35) 45%, transparent 70%)',
                }}
              />

              {/* 2. Floating Cyan Holographic Micro-Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[
                  { top: '15%', left: '20%', size: 'w-1.5 h-1.5', delay: '0s', dur: '4.8s' },
                  { top: '22%', left: '80%', size: 'w-2 h-2', delay: '1.2s', dur: '6.2s' },
                  { top: '65%', left: '14%', size: 'w-1 h-1', delay: '0.6s', dur: '5.4s' },
                  { top: '70%', left: '86%', size: 'w-1.5 h-1.5', delay: '2.1s', dur: '7.8s' },
                  { top: '36%', left: '12%', size: 'w-2 h-2', delay: '1.8s', dur: '8.5s' },
                  { top: '40%', left: '90%', size: 'w-1 h-1', delay: '0.4s', dur: '4.5s' },
                  { top: '10%', left: '50%', size: 'w-1.5 h-1.5', delay: '2.4s', dur: '5.8s' },
                ].map((p, i) => (
                  <div
                    key={i}
                    className={`absolute rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE] ${p.size}`}
                    style={{
                      top: p.top,
                      left: p.left,
                      animation: `heroParticleDrift ${p.dur} ease-in-out infinite`,
                      animationDelay: p.delay,
                    }}
                  />
                ))}
              </div>

              {/* 3. Concentric Holographic Security Rings (Independent Slow Rotations) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Outer Segmented HUD Ring (Clockwise ~24s) */}
                <svg
                  className="absolute w-[440px] sm:w-[500px] h-[440px] sm:h-[500px]"
                  viewBox="0 0 500 500"
                  fill="none"
                  style={{ animation: 'howRingRotateCW 24s linear infinite' }}
                >
                  <circle
                    cx="250"
                    cy="250"
                    r="230"
                    stroke="#22D3EE"
                    strokeWidth="1.2"
                    strokeDasharray="24 14 6 14"
                    strokeOpacity="0.38"
                  />
                  <circle
                    cx="250"
                    cy="250"
                    r="215"
                    stroke="#22D3EE"
                    strokeWidth="0.8"
                    strokeDasharray="4 8"
                    strokeOpacity="0.22"
                  />
                  {/* Telemetry Bracket Points */}
                  <path d="M 20 250 H 35" stroke="#22D3EE" strokeWidth="2.5" strokeOpacity="0.7" />
                  <path d="M 465 250 H 480" stroke="#22D3EE" strokeWidth="2.5" strokeOpacity="0.7" />
                  <path d="M 250 20 V 35" stroke="#22D3EE" strokeWidth="2.5" strokeOpacity="0.7" />
                  <path d="M 250 465 V 480" stroke="#22D3EE" strokeWidth="2.5" strokeOpacity="0.7" />
                </svg>

                {/* Middle Precision Ring (Counter-Clockwise ~18s) */}
                <svg
                  className="absolute w-[360px] sm:w-[410px] h-[360px] sm:h-[410px]"
                  viewBox="0 0 400 400"
                  fill="none"
                  style={{ animation: 'howRingRotateCCW 18s linear infinite' }}
                >
                  <circle
                    cx="200"
                    cy="200"
                    r="185"
                    stroke="#22D3EE"
                    strokeWidth="1"
                    strokeDasharray="10 12"
                    strokeOpacity="0.3"
                  />
                  {/* Diamond Nodes */}
                  <polygon points="200,10 204,15 200,20 196,15" fill="#22D3EE" opacity="0.8" />
                  <polygon points="200,380 204,385 200,390 196,385" fill="#22D3EE" opacity="0.8" />
                  <polygon points="10,200 15,204 20,200 15,196" fill="#22D3EE" opacity="0.8" />
                  <polygon points="380,200 385,204 390,200 385,196" fill="#22D3EE" opacity="0.8" />
                </svg>
              </div>

              {/* 4. Circular Holographic Platform at Base (~4s cycle) */}
              <div className="absolute bottom-3 sm:bottom-6 w-[360px] sm:w-[440px] h-[90px] pointer-events-none flex items-center justify-center">
                {/* Platform Projection Cone */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#22D3EE]/15 via-[#22D3EE]/5 to-transparent blur-md rounded-[50%]"
                  style={{ animation: 'howPlatformPulse 4s ease-in-out infinite' }}
                />
                <svg className="w-full h-full overflow-visible" viewBox="0 0 440 90" fill="none">
                  <ellipse
                    cx="220"
                    cy="45"
                    rx="210"
                    ry="40"
                    stroke="#22D3EE"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                    fill="rgba(13, 27, 42, 0.65)"
                  />
                  <ellipse
                    cx="220"
                    cy="45"
                    rx="165"
                    ry="30"
                    stroke="#22D3EE"
                    strokeWidth="1.2"
                    strokeDasharray="8 6"
                    strokeOpacity="0.55"
                  />
                  <ellipse
                    cx="220"
                    cy="45"
                    rx="115"
                    ry="20"
                    stroke="#22D3EE"
                    strokeWidth="1"
                    strokeOpacity="0.75"
                  />
                  <circle cx="220" cy="45" r="4.5" fill="#22D3EE" className="shadow-[0_0_12px_#22D3EE]" />
                </svg>
              </div>

              {/* 5. MANDATORY CONTINUOUS 3D-ROTATING CENTRAL SECURITY SHIELD */}
              {/* Target one complete rotation every ~15 seconds (12-18s range) */}
              <div
                className="relative z-20 w-[240px] sm:w-[270px] h-[300px] sm:h-[340px] flex items-center justify-center"
                style={{
                  perspective: '1200px',
                }}
              >
                <div
                  className="w-full h-full relative"
                  style={{
                    transformStyle: 'preserve-3d',
                    animation: 'howShield3DRotate 15s linear infinite',
                  }}
                >
                  {/* FRONT FACE OF SECURITY SHIELD (translateZ 16px) */}
                  <div
                    className="absolute inset-0 flex items-center justify-center backface-visible"
                    style={{
                      transform: 'translateZ(16px)',
                    }}
                  >
                    <svg
                      viewBox="0 0 280 340"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full overflow-visible drop-shadow-[0_0_28px_rgba(34,211,238,0.45)]"
                    >
                      <defs>
                        <filter id={`howGlow_${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <linearGradient id={`howShieldGrad_${filterId}`} x1="140" y1="60" x2="140" y2="280" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#11253E" stopOpacity="0.96" />
                          <stop stopColor="#071220" stopOpacity="0.99" />
                        </linearGradient>
                        <linearGradient id={`howNeonRim_${filterId}`} x1="40" y1="40" x2="240" y2="300" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#22D3EE" />
                          <stop stopColor="#38BDF8" />
                          <stop stopColor="#06B6D4" />
                          <stop stopColor="#22D3EE" />
                        </linearGradient>
                      </defs>

                      {/* Master Cyber Shield Plate */}
                      <g filter={`url(#howGlow_${filterId})`}>
                        {/* Outer Shield Shell */}
                        <path
                          d="
                            M 140 50
                            Q 195 58 240 70
                            Q 232 170 205 228
                            Q 175 272 140 295
                            Q 105 272 75 228
                            Q 48 170 40 70
                            Q 85 58 140 50
                            Z
                          "
                          fill={`url(#howShieldGrad_${filterId})`}
                          stroke={`url(#howNeonRim_${filterId})`}
                          strokeWidth="3.4"
                        />

                        {/* Inset Contour Bevel */}
                        <path
                          d="
                            M 140 64
                            Q 188 71 224 82
                            Q 218 165 194 216
                            Q 168 255 140 276
                            Q 112 255 86 216
                            Q 62 165 56 82
                            Q 92 71 140 64
                            Z
                          "
                          stroke="#38BDF8"
                          strokeWidth="1.2"
                          strokeOpacity="0.6"
                          fill="none"
                        />

                        {/* Internal Digital Circuit Traces & Micro Nodes */}
                        <path
                          d="
                            M 85 110 H 115 V 135 H 130
                            M 85 180 H 118 V 195 H 130
                            M 195 110 H 165 V 135 H 150
                            M 195 180 H 162 V 195 H 150
                            M 140 75 V 110
                            M 140 230 V 265
                          "
                          stroke="#22D3EE"
                          strokeWidth="1.4"
                          strokeOpacity="0.75"
                        />
                        <circle cx="115" cy="135" r="2.2" fill="#22D3EE" />
                        <circle cx="118" cy="195" r="2.2" fill="#22D3EE" />
                        <circle cx="165" cy="135" r="2.2" fill="#22D3EE" />
                        <circle cx="162" cy="195" r="2.2" fill="#22D3EE" />

                        {/* Central Luminous Core Badge */}
                        <circle cx="140" cy="165" r="34" fill="#0D1B2A" stroke="#22D3EE" strokeWidth="1.8" />
                        <circle cx="140" cy="165" r="28" fill="rgba(34, 211, 238, 0.12)" stroke="#22D3EE" strokeWidth="1" strokeDasharray="6 4" />
                        <Shield className="h-8 w-8 text-[#22D3EE] absolute" style={{ transform: 'translate(124px, 149px)' }} />

                        {/* Vertical Scanning Light Ray Sweep */}
                        <line
                          x1="55"
                          y1="165"
                          x2="225"
                          y2="165"
                          stroke="#22D3EE"
                          strokeWidth="2"
                          style={{ animation: 'howScanSweep 3s ease-in-out infinite' }}
                        />
                      </g>
                    </svg>
                  </div>

                  {/* LATERAL VOLUMETRIC FACETS (Left and Right 32px depth) */}
                  <div
                    className="absolute w-[32px] h-[220px] rounded-sm bg-[#081422] border-y border-[#22D3EE]/50 backface-visible flex items-center justify-center overflow-hidden"
                    style={{
                      transform: 'translateX(64px) translateY(60px) rotateY(-90deg) translateZ(85px)',
                      boxShadow: 'inset 0 0 10px rgba(34, 211, 238, 0.4)',
                    }}
                  >
                    <div className="w-0.5 h-full bg-[#22D3EE] opacity-60 shadow-[0_0_6px_#22D3EE]" />
                  </div>

                  <div
                    className="absolute w-[32px] h-[220px] rounded-sm bg-[#081422] border-y border-[#22D3EE]/50 backface-visible flex items-center justify-center overflow-hidden"
                    style={{
                      transform: 'translateX(174px) translateY(60px) rotateY(90deg) translateZ(85px)',
                      boxShadow: 'inset 0 0 10px rgba(34, 211, 238, 0.4)',
                    }}
                  >
                    <div className="w-0.5 h-full bg-[#22D3EE] opacity-60 shadow-[0_0_6px_#22D3EE]" />
                  </div>

                  {/* REAR FACE OF SECURITY SHIELD (rotateY 180deg translateZ 16px) */}
                  <div
                    className="absolute inset-0 flex items-center justify-center backface-visible"
                    style={{
                      transform: 'rotateY(180deg) translateZ(16px)',
                    }}
                  >
                    <svg
                      viewBox="0 0 280 340"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full overflow-visible drop-shadow-[0_0_28px_rgba(34,211,238,0.45)]"
                    >
                      <path
                        d="
                          M 140 50
                          Q 195 58 240 70
                          Q 232 170 205 228
                          Q 175 272 140 295
                          Q 105 272 75 228
                          Q 48 170 40 70
                          Q 85 58 140 50
                          Z
                        "
                        fill={`url(#howShieldGrad_${filterId})`}
                        stroke={`url(#howNeonRim_${filterId})`}
                        strokeWidth="3.4"
                      />
                      <circle cx="140" cy="165" r="32" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
                      <circle cx="140" cy="165" r="16" fill="#0D1B2A" stroke="#22D3EE" strokeWidth="1" />
                      <polygon points="140,153 150,165 140,177 130,165" fill="#22D3EE" opacity="0.8" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Embedded CSS Keyframes for Hero Continuous Motion */}
              <style>{`
                @keyframes howShield3DRotate {
                  0% {
                    transform: rotateY(0deg);
                  }
                  100% {
                    transform: rotateY(360deg);
                  }
                }

                @keyframes howRingRotateCW {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }

                @keyframes howRingRotateCCW {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(-360deg);
                  }
                }

                @keyframes howPlatformPulse {
                  0%, 100% {
                    opacity: 0.5;
                    transform: scale(1);
                  }
                  50% {
                    opacity: 0.85;
                    transform: scale(1.04);
                  }
                }

                @keyframes howScanSweep {
                  0%, 100% {
                    transform: translateY(-40px);
                    opacity: 0;
                  }
                  50% {
                    transform: translateY(40px);
                    opacity: 0.85;
                  }
                }

                @keyframes heroParticleDrift {
                  0%, 100% {
                    transform: translateY(0px) scale(1);
                    opacity: 0.3;
                  }
                  50% {
                    transform: translateY(-16px) scale(1.25);
                    opacity: 0.85;
                  }
                }

                @media (prefers-reduced-motion: reduce) {
                  .backface-visible,
                  div[style*="howShield3DRotate"],
                  svg[style*="howRingRotateCW"],
                  svg[style*="howRingRotateCCW"] {
                    animation: none !important;
                  }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
