import React, { useState } from 'react'
import { Shield, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { LegalModal, type LegalModalType } from '../common/LegalModal'
import { PhishShieldLogo } from '../common/PhishShieldLogo'

interface FooterProps {
  onNavigateSection: (sectionId: string) => void
  onOpenDashboard: () => void
  onSelectTool: (toolId: string) => void
  className?: string
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenDashboard,
  onSelectTool,
  className = 'pt-16',
}) => {
  const [email, setEmail] = useState('')
  const [subscribeStatus, setSubscribeStatus] = useState<
    'idle' | 'invalid' | 'unavailable'
  >('idle')
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@') || !email.includes('.')) {
      setSubscribeStatus('invalid')
      return
    }
    // Genuine honesty: no external subscription backend is configured yet
    setSubscribeStatus('unavailable')
  }

  return (
    <>
      <footer className={`w-full bg-[#080D1A] border-t border-[#00D9FF]/25 text-[#CBD5E1] pb-12 select-none ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main 5-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-[#00D9FF]/15">
            {/* Column 1 — Brand (Spans 4 columns on large screens) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <PhishShieldLogo className="w-8 h-9 transition-transform duration-300 group-hover:scale-105" />
                <div>
                  <span className="font-extrabold text-lg text-[#F8FAFC] tracking-tight">
                    PhishShield <span className="text-[#00D9FF]">AI</span>
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-[#94A3B8] font-normal leading-tight tracking-normal mt-0.5">
                    Intelligent Digital Threat Protection
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-sm">
                A unified AI-powered platform to detect, analyse, and help protect against potential digital threats across URLs, files, QR codes, messages, phone numbers, and social profiles.
              </p>
            </div>

            {/* Column 2 — Quick Links (Spans 2 columns) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault()
                      onNavigateSection('home')
                    }}
                    className="hover:text-[#00D9FF] transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/#protection"
                    onClick={(e) => {
                      e.preventDefault()
                      onNavigateSection('protection')
                    }}
                    className="hover:text-[#00D9FF] transition-colors"
                  >
                    Protection
                  </a>
                </li>
                <li>
                  <a
                    href="/how-it-works"
                    onClick={(e) => {
                      e.preventDefault()
                      onNavigateSection('how-it-works')
                    }}
                    className="hover:text-[#00D9FF] transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    onClick={(e) => {
                      e.preventDefault()
                      onNavigateSection('about')
                    }}
                    className="hover:text-[#00D9FF] transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <button
                    onClick={onOpenDashboard}
                    className="hover:text-[#00D9FF] transition-colors font-medium text-[#00D9FF]"
                  >
                    Dashboard
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 — Our Tools (Spans 2 columns) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono">
                Our Tools
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => onSelectTool('url-scanner')}
                    className="hover:text-[#00D9FF] transition-colors"
                  >
                    URL Scanner
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTool('file-scanner')}
                    className="hover:text-[#00D9FF] transition-colors"
                  >
                    File Scanner
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTool('qr-scanner')}
                    className="hover:text-[#00D9FF] transition-colors"
                  >
                    QR Scanner
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTool('phone-checker')}
                    className="hover:text-[#00D9FF] transition-colors"
                  >
                    Phone Checker
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTool('email-message')}
                    className="hover:text-[#00D9FF] transition-colors"
                  >
                    Email & Message
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTool('social-shield')}
                    className="hover:text-[#00D9FF] transition-colors"
                  >
                    SocialShield AI
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4 — Resources (Spans 2 columns) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono">
                Resources
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#94A3B8]">
                <li>
                  <button
                    onClick={() => setActiveLegalModal('security-tips')}
                    className="hover:text-[#00D9FF] cursor-pointer transition-colors text-left"
                  >
                    Security Tips
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveLegalModal('privacy')}
                    className="hover:text-[#00D9FF] cursor-pointer transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveLegalModal('terms')}
                    className="hover:text-[#00D9FF] cursor-pointer transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveLegalModal('documentation')}
                    className="hover:text-[#00D9FF] cursor-pointer transition-colors text-left"
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveLegalModal('support')}
                    className="hover:text-[#00D9FF] cursor-pointer transition-colors text-left"
                  >
                    Help & Support
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5 — Stay Updated (Spans 2 columns) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono">
                Stay Updated
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Get the latest security tips, updates, and features.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (subscribeStatus !== 'idle') setSubscribeStatus('idle')
                    }}
                    placeholder="Enter your email"
                    className="w-full bg-[#111C30] border border-[#00D9FF]/30 rounded-lg pl-3 pr-10 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF]/40 transition-all font-sans"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-[#00D9FF] text-[#020B16] hover:bg-[#38BDF8] transition-colors"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {subscribeStatus === 'invalid' && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#EF4444] font-medium pt-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>Please provide a valid email address.</span>
                  </div>
                )}

                {subscribeStatus === 'unavailable' && (
                  <div className="flex items-start gap-1.5 text-[11px] text-[#00D9FF] font-medium pt-1 bg-[#111C30] p-2 rounded border border-[#00D9FF]/25">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>Email service is currently in staging and will activate in the next release.</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
            <p>© 2026 PhishShield AI. All rights reserved.</p>

            <div className="flex items-center gap-2 text-[#00D9FF] font-medium tracking-wide">
              <Shield className="h-3.5 w-3.5" />
              <span>Stay Safe Online. Think Before You Click.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Render Legal & Resource Modal when clicked */}
      <LegalModal
        type={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />
    </>
  )
}
