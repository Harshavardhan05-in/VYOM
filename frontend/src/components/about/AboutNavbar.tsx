import React, { useState } from 'react'
import { Home, LayoutGrid, Info, Search, Menu, X } from 'lucide-react'
import { PhishShieldLogo } from '../common/PhishShieldLogo'

interface AboutNavbarProps {
  onNavigateHome: () => void
  onOpenDashboard: () => void
  onSearch?: (query: string) => void
}

export const AboutNavbar: React.FC<AboutNavbarProps> = ({
  onNavigateHome,
  onOpenDashboard,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim())
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#03101F] border-b border-[rgba(0,217,255,0.30)] h-[75px] flex items-center px-4 sm:px-8 lg:px-14 select-none">
      <div className="w-full max-w-[1536px] mx-auto flex items-center justify-between">
        {/* Left: Brand Identity with PhishShield AI Shield Logo, Name, and Tagline */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            onNavigateHome()
          }}
          className="flex items-center gap-3 cursor-pointer group"
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

        {/* Center: Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              onNavigateHome()
            }}
            className="flex items-center gap-2 text-sm font-medium text-[#CBD5E1] hover:text-[#00D9FF] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </a>

          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-2 text-sm font-medium text-[#CBD5E1] hover:text-[#00D9FF] transition-colors"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* About: Active Page with cyan border, cyan text, subtle cyan glow */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D9FF] bg-[#00D9FF]/10 text-[#00D9FF] text-sm font-semibold shadow-[0_0_12px_rgba(0,217,255,0.25)] cursor-default">
            <Info className="w-4 h-4" />
            <span>About</span>
          </div>
        </nav>

        {/* Right: Search Input */}
        <div className="hidden sm:flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-64 lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scans, URLs, or reports..."
              className="w-full pl-10 pr-4 py-2 bg-[#04182B] border border-[rgba(0,217,255,0.30)] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.25)] transition-all"
            />
          </form>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#CBD5E1] hover:text-[#00D9FF] hover:bg-[#04182B] border border-transparent hover:border-[#00D9FF]/30"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[75px] left-0 w-full bg-[#03101F] border-b border-[rgba(0,217,255,0.30)] px-6 py-4 flex flex-col gap-4 shadow-xl z-50">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              onNavigateHome()
              setMobileMenuOpen(false)
            }}
            className="flex items-center gap-2 text-sm font-medium text-[#CBD5E1]"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </a>

          <button
            onClick={() => {
              onOpenDashboard()
              setMobileMenuOpen(false)
            }}
            className="flex items-center gap-2 text-sm font-medium text-[#CBD5E1] text-left"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#00D9FF] bg-[#00D9FF]/10 text-[#00D9FF] text-sm font-semibold">
            <Info className="w-4 h-4" />
            <span>About</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full pt-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scans, URLs, or reports..."
              className="w-full pl-10 pr-4 py-2 bg-[#04182B] border border-[rgba(0,217,255,0.30)] rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#00D9FF]"
            />
          </form>
        </div>
      )}
    </header>
  )
}
