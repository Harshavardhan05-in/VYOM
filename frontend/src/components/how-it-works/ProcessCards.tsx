import React from 'react'
import { ArrowRight, ArrowDown } from 'lucide-react'

export const ProcessCards: React.FC = () => {

  return (
    <section className="relative w-full py-10 sm:py-12 lg:py-14 bg-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#22D3EE]/30 bg-[#111C30]/60 text-xs font-mono font-medium text-[#22D3EE] uppercase tracking-wider">
            STEP-BY-STEP WORKFLOW
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
            Three Simple Steps to Safety
          </h2>
          <p className="text-base sm:text-lg text-[#CBD5E1]">
            How PhishShield AI analyses and resolves suspicious digital threats in seconds.
          </p>
        </div>

        {/* ======================================================== */}
        {/* THREE ILLUSTRATED PROCESS CARDS CONNECTED BY ARROWS      */}
        {/* ======================================================== */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* ======================================================== */}
          {/* CARD 01 — SUBMIT                                         */}
          {/* ======================================================== */}
          <div className="relative flex flex-col justify-between p-8 rounded-2xl bg-[#0D1B2A] border border-[#22D3EE]/25 shadow-[0_8px_28px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-[#22D3EE]/50 hover:shadow-[0_0_24px_rgba(34,211,238,0.18)] select-none">
            {/* Top Bar: Number & Step Indicator */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-extrabold font-mono text-[#22D3EE] tracking-tight">
                01
              </span>
              <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#111C30] border border-[#22D3EE]/30 text-[#94A3B8]">
                INPUT PHASE
              </span>
            </div>

            {/* Illustration: Laptop, Document, and Upload Symbol */}
            <div className="relative h-44 w-full flex items-center justify-center my-4 overflow-hidden rounded-xl bg-[#081220]/60 border border-[#22D3EE]/15">
              <div
                className="relative flex items-center justify-center"
                style={{ animation: 'cardFloat1 5s ease-in-out infinite' }}
              >
                {/* Laptop & Document SVG Composition */}
                <svg viewBox="0 0 200 140" fill="none" className="w-48 h-36 overflow-visible">
                  {/* Laptop Screen Bezel */}
                  <rect x="35" y="25" width="130" height="85" rx="6" fill="#0D1B2A" stroke="#22D3EE" strokeWidth="1.8" />
                  <rect x="42" y="32" width="116" height="71" rx="3" fill="#061224" />

                  {/* Laptop Base Stand */}
                  <path d="M 20 115 L 180 115 L 170 125 L 30 125 Z" fill="#111C30" stroke="#22D3EE" strokeWidth="1.6" />
                  <line x1="85" y1="117" x2="115" y2="117" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />

                  {/* Floating Document on Laptop Screen */}
                  <g transform="translate(62, 40)">
                    <rect x="0" y="0" width="46" height="56" rx="4" fill="#0B1A32" stroke="#22D3EE" strokeWidth="1.4" />
                    {/* Document folded corner */}
                    <path d="M 32 0 L 46 14 L 32 14 Z" fill="#11253E" stroke="#22D3EE" strokeWidth="1.2" />
                    {/* Document Lines */}
                    <line x1="8" y1="22" x2="38" y2="22" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="8" y1="30" x2="38" y2="30" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="8" y1="38" x2="26" y2="38" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                  </g>

                  {/* Upload Symbol with Restrained Cyan Glow Pulse */}
                  <g
                    transform="translate(100, 68)"
                    style={{ animation: 'uploadPulse 3.2s ease-in-out infinite' }}
                  >
                    <circle cx="0" cy="0" r="16" fill="#111C30" stroke="#22D3EE" strokeWidth="1.8" />
                    <path d="M 0 6 V -6" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />
                    <path d="M -5 -1 L 0 -6 L 5 -1" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Bottom Content: Title & Description */}
            <div className="space-y-2 mt-4">
              <h3 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
                Submit
              </h3>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                Enter a URL, upload a file, or provide the content you want to investigate.
              </p>
            </div>
          </div>

          {/* Desktop Connecting Arrow 01 -> 02 */}
          <div className="hidden lg:flex absolute top-1/2 left-[33.33%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-[#111C30] border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE] shadow-[0_0_14px_rgba(34,211,238,0.3)]">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>

          {/* Mobile Connecting Arrow 01 -> 02 */}
          <div className="flex lg:hidden justify-center -my-2 z-20">
            <div className="h-8 w-8 rounded-full bg-[#111C30] border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.25)]">
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 02 — ANALYSE                                        */}
          {/* ======================================================== */}
          <div className="relative flex flex-col justify-between p-8 rounded-2xl bg-[#0D1B2A] border border-[#22D3EE]/25 shadow-[0_8px_28px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-[#22D3EE]/50 hover:shadow-[0_0_24px_rgba(34,211,238,0.18)] select-none">
            {/* Top Bar: Number & Step Indicator */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-extrabold font-mono text-[#22D3EE] tracking-tight">
                02
              </span>
              <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#111C30] border border-[#22D3EE]/30 text-[#94A3B8]">
                INSPECTION PHASE
              </span>
            </div>

            {/* Illustration: Glowing AI Processor with Scanning Lines */}
            <div className="relative h-44 w-full flex items-center justify-center my-4 overflow-hidden rounded-xl bg-[#081220]/60 border border-[#22D3EE]/15">
              <div
                className="relative flex items-center justify-center"
                style={{ animation: 'processorPulse 4.2s ease-in-out infinite' }}
              >
                <svg viewBox="0 0 180 140" fill="none" className="w-44 h-36 overflow-visible">
                  {/* Outer Circuit Bus Rails */}
                  <g stroke="#22D3EE" strokeWidth="1.2" strokeOpacity="0.5">
                    <line x1="20" y1="50" x2="50" y2="50" />
                    <line x1="20" y1="70" x2="50" y2="70" />
                    <line x1="20" y1="90" x2="50" y2="90" />
                    <line x1="130" y1="50" x2="160" y2="50" />
                    <line x1="130" y1="70" x2="160" y2="70" />
                    <line x1="130" y1="90" x2="160" y2="90" />
                    <line x1="70" y1="15" x2="70" y2="35" />
                    <line x1="90" y1="15" x2="90" y2="35" />
                    <line x1="110" y1="15" x2="110" y2="35" />
                    <line x1="70" y1="105" x2="70" y2="125" />
                    <line x1="90" y1="105" x2="90" y2="125" />
                    <line x1="110" y1="105" x2="110" y2="125" />
                  </g>

                  {/* AI Processor Outer Chip */}
                  <rect x="50" y="35" width="80" height="70" rx="8" fill="#0A1830" stroke="#22D3EE" strokeWidth="2" />
                  <rect x="56" y="41" width="68" height="58" rx="5" fill="#061224" stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.4" />

                  {/* Inner Neural Circuit Matrix */}
                  <g stroke="#22D3EE" strokeWidth="1" opacity="0.75">
                    <circle cx="72" cy="55" r="3" fill="#22D3EE" />
                    <circle cx="108" cy="55" r="3" fill="#22D3EE" />
                    <circle cx="90" cy="70" r="5" fill="#111C30" stroke="#22D3EE" strokeWidth="1.5" />
                    <circle cx="72" cy="85" r="3" fill="#22D3EE" />
                    <circle cx="108" cy="85" r="3" fill="#22D3EE" />
                    <line x1="72" y1="55" x2="90" y2="70" />
                    <line x1="108" y1="55" x2="90" y2="70" />
                    <line x1="72" y1="85" x2="90" y2="70" />
                    <line x1="108" y1="85" x2="90" y2="70" />
                  </g>

                  {/* AI Central Monogram / Micro-text */}
                  <text x="90" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    AI
                  </text>

                  {/* Moving Internal Scanning Beam */}
                  <line
                    x1="52"
                    y1="70"
                    x2="128"
                    y2="70"
                    stroke="#22D3EE"
                    strokeWidth="1.8"
                    style={{ animation: 'chipScan 4.6s ease-in-out infinite' }}
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Content: Title & Description */}
            <div className="space-y-2 mt-4">
              <h3 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
                Analyse
              </h3>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                Our system examines multiple signals using rules, machine-learning models, and threat intelligence.
              </p>
            </div>
          </div>

          {/* Desktop Connecting Arrow 02 -> 03 */}
          <div className="hidden lg:flex absolute top-1/2 left-[66.66%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-[#111C30] border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE] shadow-[0_0_14px_rgba(34,211,238,0.3)]">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>

          {/* Mobile Connecting Arrow 02 -> 03 */}
          <div className="flex lg:hidden justify-center -my-2 z-20">
            <div className="h-8 w-8 rounded-full bg-[#111C30] border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.25)]">
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 03 — UNDERSTAND & ACT                               */}
          {/* ======================================================== */}
          <div className="relative flex flex-col justify-between p-8 rounded-2xl bg-[#0D1B2A] border border-[#22D3EE]/25 shadow-[0_8px_28px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-[#22D3EE]/50 hover:shadow-[0_0_24px_rgba(34,211,238,0.18)] select-none">
            {/* Top Bar: Number & Step Indicator */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-extrabold font-mono text-[#22D3EE] tracking-tight">
                03
              </span>
              <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#111C30] border border-[#22D3EE]/30 text-[#94A3B8]">
                DECISION PHASE
              </span>
            </div>

            {/* Illustration: Security Report Interface with Checklist & Gauge */}
            <div className="relative h-44 w-full flex items-center justify-center my-4 overflow-hidden rounded-xl bg-[#081220]/60 border border-[#22D3EE]/15">
              <div
                className="relative flex items-center justify-center"
                style={{ animation: 'cardFloat3 5.6s ease-in-out infinite' }}
              >
                <svg viewBox="0 0 190 140" fill="none" className="w-48 h-36 overflow-visible">
                  {/* Security Report Card Window */}
                  <rect x="25" y="20" width="140" height="96" rx="6" fill="#0D1B2A" stroke="#22D3EE" strokeWidth="1.8" />
                  <rect x="25" y="20" width="140" height="22" rx="6" fill="#11223A" />

                  {/* Window Controls */}
                  <circle cx="37" cy="31" r="3" fill="#EF4444" opacity="0.8" />
                  <circle cx="47" cy="31" r="3" fill="#F59E0B" opacity="0.8" />
                  <circle cx="57" cy="31" r="3" fill="#10B981" opacity="0.8" />

                  {/* Assessment Badge / Status Meter */}
                  <rect x="100" y="26" width="56" height="11" rx="3" fill="#061224" stroke="#22D3EE" strokeWidth="1" />
                  <text x="128" y="34.5" textAnchor="middle" fill="#22D3EE" fontSize="7" fontWeight="bold" fontFamily="monospace">
                    RISK: LOW
                  </text>

                  {/* Report Findings Checklist */}
                  <g transform="translate(36, 52)">
                    {/* Item 1 */}
                    <circle cx="8" cy="8" r="5" fill="#10B981" opacity="0.9" />
                    <path d="M 6 8 L 7.5 9.5 L 10.5 6.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="20" y1="8" x2="110" y2="8" stroke="#F8FAFC" strokeWidth="1.8" strokeLinecap="round" />

                    {/* Item 2 */}
                    <circle cx="8" cy="24" r="5" fill="#10B981" opacity="0.9" />
                    <path d="M 6 24 L 7.5 25.5 L 10.5 22.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="20" y1="24" x2="95" y2="24" stroke="#F8FAFC" strokeWidth="1.8" strokeLinecap="round" />

                    {/* Item 3 */}
                    <circle cx="8" cy="40" r="5" fill="#22D3EE" opacity="0.9" style={{ animation: 'checkmarkPulse 3.8s ease-in-out infinite' }} />
                    <path d="M 6 40 L 7.5 41.5 L 10.5 38.5" stroke="#0B1120" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="20" y1="40" x2="80" y2="40" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Bottom Content: Title & Description */}
            <div className="space-y-2 mt-4">
              <h3 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
                Understand &amp; Act
              </h3>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                Get a clear risk assessment, detailed findings, and recommended next steps.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS Animations for Process Cards */}
      <style>{`
        @keyframes cardFloat1 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes cardFloat3 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes uploadPulse {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(34, 211, 238, 0.4));
            opacity: 0.85;
          }
          50% {
            filter: drop-shadow(0 0 14px rgba(34, 211, 238, 0.95));
            opacity: 1;
          }
        }

        @keyframes processorPulse {
          0%, 100% {
            filter: drop-shadow(0 0 6px rgba(34, 211, 238, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 18px rgba(34, 211, 238, 0.7));
          }
        }

        @keyframes chipScan {
          0%, 100% {
            transform: translateY(-16px);
            opacity: 0;
          }
          50% {
            transform: translateY(16px);
            opacity: 0.9;
          }
        }

        @keyframes checkmarkPulse {
          0%, 100% {
            opacity: 0.75;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
            filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.8));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div[style*="cardFloat1"],
          div[style*="cardFloat3"],
          g[style*="uploadPulse"],
          div[style*="processorPulse"],
          line[style*="chipScan"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}
