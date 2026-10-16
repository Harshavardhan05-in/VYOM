import React from 'react'
import { ShieldCheck, FileSearch, Compass, FileText, CheckCircle2 } from 'lucide-react'

interface BenefitCard {
  id: string
  title: string
  icon: React.ElementType
  badge: string
  description: string
  deliverables: string[]
}

const benefits: BenefitCard[] = [
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    icon: ShieldCheck,
    badge: '0–100 SCORING',
    description:
      'Clear, calibrated threat score with an unambiguous categorical verdict — Safe, Suspicious, or Dangerous — allowing rapid decision-making.',
    deliverables: [
      'Calibrated 0 to 100 risk score',
      'Categorical safety verdict indicator',
      'Confidence level & certainty rating',
      'Immediate action advisory',
    ],
  },
  {
    id: 'detailed-findings',
    title: 'Detailed Findings',
    icon: FileSearch,
    badge: 'FULL TRANSPARENCY',
    description:
      'Granular breakdown of every triggered rule, lexical anomaly, punycode spoof, and behavioral indicator discovered during the inspection.',
    deliverables: [
      'Complete heuristic trigger timeline',
      'Lexical entropy & token decomposition',
      'SSL & DNS infrastructure signals',
      'Zero blackbox obfuscation',
    ],
  },
  {
    id: 'practical-recommendations',
    title: 'Practical Recommendations',
    icon: Compass,
    badge: 'ACTION ORIENTED',
    description:
      'Actionable, plain-language guidance on whether to block, isolate, whitelist, or report the suspicious asset to administrators or registrars.',
    deliverables: [
      'Step-by-step mitigation instructions',
      'Account credential safeguard protocols',
      'Abuse reporting contacts & templates',
      'Employee awareness advisory notes',
    ],
  },
  {
    id: 'clean-reports',
    title: 'Clean Reports',
    icon: FileText,
    badge: 'AUDIT READY',
    description:
      'Exportable, human-readable summaries equipped with cryptographic SHA-256 hashes, exact scan timestamps, and raw JSON telemetry.',
    deliverables: [
      'Timestamped verification records',
      'Cryptographic payload hashes',
      'Exportable JSON & summary views',
      'Compliance & audit logging trail',
    ],
  },
]

export const WhatYouGet: React.FC = () => {
  return (
    <section className="relative w-full py-16 lg:py-24 bg-[#0B1120] border-t border-[#22D3EE]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#22D3EE]/30 bg-[#111C30]/70 text-xs font-mono font-medium text-[#22D3EE] uppercase tracking-wider">
            OUTCOMES & DELIVERABLES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
            What You Get
          </h2>
          <p className="text-base sm:text-lg text-[#CBD5E1]">
            Comprehensive threat intelligence translated into actionable clarity, confidence, and audit-ready records.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {benefits.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.id}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#0D1B2A] border border-[#22D3EE]/25 transition-all duration-300 hover:border-[#22D3EE]/60 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(34,211,238,0.18)]"
              >
                {/* Glowing top line */}
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#22D3EE]/40 to-transparent group-hover:via-[#22D3EE]" />

                <div>
                  {/* Badge & Icon Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="h-12 w-12 rounded-xl bg-[#111C30] border border-[#22D3EE]/35 flex items-center justify-center text-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.2)] transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#111C30] text-[#22D3EE] border border-[#22D3EE]/30">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-[#F8FAFC] tracking-wide mb-2.5 group-hover:text-[#22D3EE] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
                    {card.description}
                  </p>

                  {/* Bullet Points */}
                  <div className="space-y-2.5 pt-4 border-t border-[#22D3EE]/15">
                    {card.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#CBD5E1]">
                        <CheckCircle2 className="h-4 w-4 text-[#22D3EE] flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
