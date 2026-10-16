import React, { useState } from 'react'
import { ArrowRight, Menu, X, RotateCcw } from 'lucide-react'
import { PhishShieldLogo } from '../common/PhishShieldLogo'

interface HomeNavbarProps {
  onOpenDashboard: () => void
  onNavigateSection: (sectionId: string) => void
  onReplayIntro?: () => void
  activeRoute?: string
}

export const HomeNavbar: React.FC<HomeNavbarProps> = ({
  onOpenDashboard,
  onNavigateSection,
  onReplayIntro,
  activeRoute,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [internalActiveLink, setInternalActiveLink] = useState('home')

  const currentActive = activeRoute || internalActiveLink

  const handleLinkClick = (id: string) => {
    setInternalActiveLink(id)
    onNavigateSection(id)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B1120]/90 backdrop-blur-md border-b border-[#00D9FF]/25 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Identity with PhishShield AI Shield Logo, Name, and Tagline */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            handleLinkClick('home')
          }}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <PhishShieldLogo className="w-8 h-9 sm:w-9 sm:h-10 transition-transform duration-300 group-hover:scale-105" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-lg tracking-tight text-[#F8FAFC]">
                PhishShield <span className="text-[#00D9FF]">AI</span>
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-normal leading-tight tracking-normal mt-0.5">
              Intelligent Digital Threat Protection
            </span>
          </div>
        </a>

        {/* Centre: Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('home')
            }}
            className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
              currentActive === 'home'
                ? 'text-[#00D9FF]'
                : 'text-[#F8FAFC] hover:text-[#00D9FF]'
            }`}
          >
            Home
            {currentActive === 'home' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00D9FF] shadow-[0_0_8px_#00D9FF] rounded-full" />
            )}
          </a>

          <a
            href="/#protection"
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('protection')
            }}
            className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
              currentActive === 'protection'
                ? 'text-[#00D9FF]'
                : 'text-[#CBD5E1] hover:text-[#00D9FF]'
            }`}
          >
            Protection
            {currentActive === 'protection' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00D9FF] shadow-[0_0_8px_#00D9FF] rounded-full" />
            )}
          </a>

          <a
            href="/how-it-works"
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('how-it-works')
            }}
            className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
              currentActive === 'how-it-works'
                ? 'text-[#00D9FF]'
                : 'text-[#CBD5E1] hover:text-[#00D9FF]'
            }`}
          >
            How It Works
            {currentActive === 'how-it-works' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00D9FF] shadow-[0_0_8px_#00D9FF] rounded-full" />
            )}
          </a>

          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('about')
            }}
            className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
              currentActive === 'about'
                ? 'text-[#00D9FF]'
                : 'text-[#CBD5E1] hover:text-[#00D9FF]'
            }`}
          >
            About
            {currentActive === 'about' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00D9FF] shadow-[0_0_8px_#00D9FF] rounded-full" />
            )}
          </a>
        </nav>

        {/* Right: Replay Intro & Bright Cyan Open Dashboard Button */}
        <div className="hidden md:flex items-center gap-4">
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              title="Replay 5s Cinematic Intro"
              className="p-2 rounded-lg text-[#94A3B8] hover:text-[#00D9FF] hover:bg-[#111C30] transition-colors border border-transparent hover:border-[#00D9FF]/30"
              aria-label="Replay intro animation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={onOpenDashboard}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00D9FF] text-[#0B1120] font-semibold text-sm tracking-wide shadow-[0_0_20px_rgba(0,217,255,0.35)] hover:bg-[#38BDF8] hover:shadow-[0_0_28px_rgba(0,217,255,0.5)] transition-all duration-200 active:scale-98"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="p-2 rounded-lg text-[#94A3B8] hover:text-[#00D9FF]"
              aria-label="Replay intro"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#CBD5E1] hover:text-[#00D9FF] hover:bg-[#111C30]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111C30] border-b border-[#00D9FF]/25 px-6 py-5 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick('home')
              }}
              className={`text-left text-sm font-medium py-1.5 ${
                currentActive === 'home' ? 'text-[#00D9FF]' : 'text-[#F8FAFC]'
              }`}
            >
              Home
            </a>
            <a
              href="/#protection"
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick('protection')
              }}
              className={`text-left text-sm font-medium py-1.5 ${
                currentActive === 'protection' ? 'text-[#00D9FF]' : 'text-[#CBD5E1]'
              }`}
            >
              Protection
            </a>
            <a
              href="/how-it-works"
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick('how-it-works')
              }}
              className={`text-left text-sm font-medium py-1.5 ${
                currentActive === 'how-it-works' ? 'text-[#00D9FF]' : 'text-[#CBD5E1]'
              }`}
            >
              How It Works
            </a>
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick('about')
              }}
              className={`text-left text-sm font-medium py-1.5 ${
                currentActive === 'about' ? 'text-[#00D9FF]' : 'text-[#CBD5E1]'
              }`}
            >
              About
            </a>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenDashboard()
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#00D9FF] text-[#0B1120] font-semibold text-sm shadow-[0_0_16px_rgba(0,217,255,0.3)]"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
