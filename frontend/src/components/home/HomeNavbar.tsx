import React, { useState } from 'react'
import { Shield, ArrowRight, Menu, X, RotateCcw } from 'lucide-react'

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
    <header className="sticky top-0 z-40 w-full bg-[#0B1120]/90 backdrop-blur-md border-b border-[#22D3EE]/25 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Identity with Shield Logo, Name, and Tagline */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            handleLinkClick('home')
          }}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div className="h-10 w-10 rounded-xl bg-[#111C30] border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.25)] transition-transform duration-300 group-hover:scale-105">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wide text-[#F8FAFC]">
                PhishShield <span className="text-[#22D3EE]">AI</span>
              </span>
            </div>
            <span className="text-[10px] tracking-wider text-[#94A3B8] font-mono uppercase">
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
                ? 'text-[#22D3EE]'
                : 'text-[#F8FAFC] hover:text-[#22D3EE]'
            }`}
          >
            Home
            {currentActive === 'home' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#22D3EE] shadow-[0_0_8px_#22D3EE] rounded-full" />
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
                ? 'text-[#22D3EE]'
                : 'text-[#CBD5E1] hover:text-[#22D3EE]'
            }`}
          >
            Protection
            {currentActive === 'protection' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#22D3EE] shadow-[0_0_8px_#22D3EE] rounded-full" />
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
                ? 'text-[#22D3EE]'
                : 'text-[#CBD5E1] hover:text-[#22D3EE]'
            }`}
          >
            How It Works
            {currentActive === 'how-it-works' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#22D3EE] shadow-[0_0_8px_#22D3EE] rounded-full" />
            )}
          </a>

          <a
            href="/#about"
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('about')
            }}
            className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
              currentActive === 'about'
                ? 'text-[#22D3EE]'
                : 'text-[#CBD5E1] hover:text-[#22D3EE]'
            }`}
          >
            About
            {currentActive === 'about' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#22D3EE] shadow-[0_0_8px_#22D3EE] rounded-full" />
            )}
          </a>
        </nav>

        {/* Right: Replay Intro & Bright Cyan Open Dashboard Button */}
        <div className="hidden md:flex items-center gap-4">
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              title="Replay 5s Cinematic Intro"
              className="p-2 rounded-lg text-[#94A3B8] hover:text-[#22D3EE] hover:bg-[#111C30] transition-colors border border-transparent hover:border-[#22D3EE]/30"
              aria-label="Replay intro animation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={onOpenDashboard}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#22D3EE] text-[#0B1120] font-semibold text-sm tracking-wide shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:bg-[#38BDF8] hover:shadow-[0_0_28px_rgba(34,211,238,0.5)] transition-all duration-200 active:scale-98"
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
              className="p-2 rounded-lg text-[#94A3B8] hover:text-[#22D3EE]"
              aria-label="Replay intro"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#CBD5E1] hover:text-[#22D3EE] hover:bg-[#111C30]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111C30] border-b border-[#22D3EE]/25 px-6 py-5 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick('home')
              }}
              className={`text-left text-sm font-medium py-1.5 ${
                currentActive === 'home' ? 'text-[#22D3EE]' : 'text-[#F8FAFC]'
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
                currentActive === 'protection' ? 'text-[#22D3EE]' : 'text-[#CBD5E1]'
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
                currentActive === 'how-it-works' ? 'text-[#22D3EE]' : 'text-[#CBD5E1]'
              }`}
            >
              How It Works
            </a>
            <a
              href="/#about"
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick('about')
              }}
              className={`text-left text-sm font-medium py-1.5 ${
                currentActive === 'about' ? 'text-[#22D3EE]' : 'text-[#CBD5E1]'
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
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#22D3EE] text-[#0B1120] font-semibold text-sm shadow-[0_0_16px_rgba(34,211,238,0.3)]"
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
