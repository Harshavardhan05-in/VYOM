import React from 'react'
import { Code2, Globe, Cpu, Activity, Check } from 'lucide-react'

interface AnalysisCategory {
  id: string
  number: string
  title: string
  icon: React.ElementType
  description: string
  tags: string[]
  metrics: string[]
}

const categories: AnalysisCategory[] = [
  {
    id: 'structure-content',
    number: '01',
    title: 'Structure & Content',
    icon: Code2,
    description:
      'Inspects underlying webpage architecture, DOM components, script integrity, and visual presentation for evasive tampering.',
    tags: ['DOM Structure', 'Hidden Fields', 'Redirects', 'Homoglyphs'],
    metrics: [
      'Hidden form action targets & iframe overlays',
      'Unicode homoglyph & punycode domain trickery',
      'Obfuscated JavaScript & zero-font evasion',
      'Misleading CSS branding & visual cloning',
    ],
  },
  {
    id: 'reputation-signals',
    number: '02',
    title: 'Reputation Signals',
    icon: Globe,
    description:
      'Queries multi-source infrastructure telemetry, domain genesis records, certificate credibility, and global reputation networks.',
    tags: ['Domain Age', 'SSL Validity', 'DNS/MX Records', 'Blacklist Feeds'],
    metrics: [
      'Domain registration age & registrar trust history',
      'SSL/TLS certificate authenticity & authority check',
      'SPF, DKIM, and DMARC mail spoofing validation',
      'Cross-referenced global threat intelligence feeds',
    ],
  },
  {
    id: 'ai-ml',
    number: '03',
    title: 'AI & Machine Learning',
    icon: Cpu,
    description:
      'Deploys multimodal language models and neural computer vision to expose deceptive psychological manipulation and cloned brand assets.',
    tags: ['NLP Intent', 'Brand Similarity', 'Anomaly Scoring', 'Neural Ensembles'],
    metrics: [
      'Natural language analysis for coercion & urgency',
      'Computer vision brand trademark comparison',
      'Heuristic anomaly scoring against known phishing kits',
      'Dynamic detection of polymorphic zero-day vectors',
    ],
  },
  {
    id: 'behavioural-analysis',
    number: '04',
    title: 'Behavioural Analysis',
    icon: Activity,
    description:
      'Monitors client-side execution lifecycle to isolate automated payload delivery, deceptive keystroke traps, and silent redirection chains.',
    tags: ['Credential Harvesting', 'DOM Mutation', 'Clickjacking', 'Payload Tracing'],
    metrics: [
      'Interactive credential interception routines',
      'Dynamic runtime JavaScript mutation tracing',
      'Clickjacking & transparent click-stealing frames',
      'Automated background binary download attempts',
    ],
  },
]

export const WhatWeAnalyse: React.FC = () => {
  return (
    <section className="relative w-full py-10 sm:py-12 lg:py-14 bg-[#080D1A] border-t border-[#22D3EE]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-8 sm:mb-9">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#22D3EE]/30 bg-[#111C30]/70 text-xs font-mono font-medium text-[#22D3EE] uppercase tracking-wider">
            DETECTION HEURISTICS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
            What We Analyse
          </h2>
          <p className="text-base sm:text-lg text-[#CBD5E1]">
            Every target is inspected across four coordinated security dimensions to uncover hidden threat vectors.
          </p>
        </div>

        {/* 4 Responsive Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {categories.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#0D1B2A] border border-[#22D3EE]/25 transition-all duration-300 hover:border-[#22D3EE]/60 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(34,211,238,0.18)]"
              >
                {/* Subtle card top glow */}
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#22D3EE]/40 to-transparent group-hover:via-[#22D3EE]" />

                <div>
                  {/* Card Header: Icon & Category Number */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="h-12 w-12 rounded-xl bg-[#111C30] border border-[#22D3EE]/35 flex items-center justify-center text-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.2)] transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-[#111C30] text-[#94A3B8] border border-[#22D3EE]/20">
                      {item.number}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-[#F8FAFC] tracking-wide mb-2.5 group-hover:text-[#22D3EE] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-5">
                    {item.description}
                  </p>

                  {/* Metric Breakdown */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-[#22D3EE]/15">
                    {item.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#CBD5E1]">
                        <div className="mt-0.5 h-3.5 w-3.5 rounded-full bg-[#111C30] border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE] flex-shrink-0">
                          <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                        </div>
                        <span className="leading-snug">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Tags */}
                <div className="pt-4 border-t border-[#22D3EE]/15 flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111C30]/80 text-[#22D3EE]/80 border border-[#22D3EE]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
