import React, { useState } from 'react'
import { Home, LayoutGrid, Info, Search, RotateCcw, Menu, X } from 'lucide-react'
import { PhishShieldLogo } from '../common/PhishShieldLogo'

interface NavbarProps {
  onToggleSidebar?: () => void
  onReplayIntro?: () => void
  onReturnHome?: () => void
  onNavigateAbout?: () => void
  onNavigateDashboard?: () => void
  onSearch?: (query: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({
  onReplayIntro,
  onReturnHome,
  onNavigateAbout,
  onNavigateDashboard,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchTerm(val)
    if (onSearch) {
      onSearch(val)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm.trim())
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#03101F] border-b border-[rgba(0,217,255,0.25)] h-[72px] flex items-center px-4 sm:px-6 lg:px-8 select-none">
      <div className="w-full max-w-[1536px] mx-auto flex items-center justify-between">
        {/* Left: Brand Identity with PhishShield AI Shield Logo, Name, and Tagline */}
        <div
          onClick={onReturnHome}
          className={`flex items-center gap-3 select-none shrink-0 ${onReturnHome ? 'cursor-pointer group' : ''}`}
          title={onReturnHome ? 'Return to Homepage' : undefined}
        >
          <PhishShieldLogo className="w-8 h-9 sm:w-9 sm:h-10 transition-transform duration-300 group-hover:scale-105 shrink-0" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 leading-none whitespace-nowrap">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#F8FAFC]">
                PhishShield <span className="text-[#00D9FF]">AI</span>
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-normal leading-tight tracking-normal mt-0.5 whitespace-nowrap hidden sm:block">
              Intelligent Digital Threat Protection
            </span>
          </div>
        </div>

        {/* Center: Nav Links matching reference blueprint */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <button
            onClick={onReturnHome}
            className="flex items-center gap-2 text-sm font-medium text-[#CBD5E1] hover:text-[#00D9FF] transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          {/* Dashboard: Active Pill with cyan border, background, and neon glow */}
          <button
            data-nav="dashboard"
            onClick={onNavigateDashboard}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D9FF] bg-[#00D9FF]/10 text-[#00D9FF] text-sm font-semibold shadow-[0_0_12px_rgba(0,217,255,0.25)] hover:bg-[#00D9FF]/20 transition-all cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={onNavigateAbout}
            className="flex items-center gap-2 text-sm font-medium text-[#CBD5E1] hover:text-[#00D9FF] transition-colors cursor-pointer"
          >
            <Info className="w-4 h-4" />
            <span>About</span>
          </button>
        </nav>

        {/* Right: Search Input & Controls (Rebalanced after removing Help, Bell, and Profile) */}
        <div className="hidden sm:flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-64 lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 bg-[#04182B] border border-[rgba(0,217,255,0.25)] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.25)] transition-all font-sans"
            />
          </form>

          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-[#00D9FF] hover:bg-[#04182B] border border-transparent hover:border-[#00D9FF]/30 transition-all cursor-pointer"
              title="Replay Cinematic Cyber Intro"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00D9FF]"
              title="Replay Intro"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#CBD5E1] hover:text-[#00D9FF] hover:bg-[#04182B] border border-transparent hover:border-[#00D9FF]/30"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-[#03101F] border-b border-[#00D9FF]/30 p-4 space-y-4 shadow-2xl z-50 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search scans, URLs, or reports..."
              className="w-full pl-9 pr-4 py-2 bg-[#04182B] border border-[rgba(0,217,255,0.30)] rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8]"
            />
          </form>

          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                if (onReturnHome) onReturnHome()
              }}
              className="flex items-center gap-2 p-2.5 rounded-lg text-sm text-[#CBD5E1] hover:bg-[#04182B] hover:text-[#00D9FF]"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <div className="flex items-center gap-2 p-2.5 rounded-lg text-sm text-[#00D9FF] bg-[#00D9FF]/10 border border-[#00D9FF]/30 font-semibold">
              <LayoutGrid className="w-4 h-4" />
              <span>Dashboard</span>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false)
                if (onNavigateAbout) onNavigateAbout()
              }}
              className="flex items-center gap-2 p-2.5 rounded-lg text-sm text-[#CBD5E1] hover:bg-[#04182B] hover:text-[#00D9FF]"
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
