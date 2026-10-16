import React, { useState, useEffect } from 'react'
import { HomePage } from './components/home/HomePage'
import { HowItWorksPage } from './components/how-it-works/HowItWorksPage'
import { AppShell } from './components/layout/AppShell'
import { OverviewDashboard } from './components/dashboard/OverviewDashboard'
import { DigitalAwakeningIntro } from './components/intro/DigitalAwakeningIntro'
import { Card } from './components/common/Card'
import { Badge } from './components/common/Badge'
import { Terminal, Shield, Inbox, Database, Sliders } from 'lucide-react'

export const App: React.FC = () => {
  // Show intro on first visit by default on homepage, and allow replay
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && (window.location.pathname === '/how-it-works' || window.location.search.includes('nointro=true'))) {
        return false
      }
      return !sessionStorage.getItem('phishshield_intro_seen')
    } catch {
      return true
    }
  })

  // View state: 'home' (reference landing page), 'how-it-works', or 'dashboard' (defense console)
  const [currentView, setCurrentView] = useState<'home' | 'how-it-works' | 'dashboard'>(() => {
    try {
      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/how-it-works') {
          return 'how-it-works'
        }
        if (window.location.pathname === '/dashboard') {
          return 'dashboard'
        }
      }
    } catch {
      // Ignore
    }
    return 'home'
  })
  const [dashboardTab, setDashboardTab] = useState<string>('overview')

  // Listen for browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      try {
        if (window.location.pathname === '/how-it-works') {
          setCurrentView('how-it-works')
        } else if (window.location.pathname === '/dashboard') {
          setCurrentView('dashboard')
        } else if (window.location.pathname === '/' || window.location.pathname === '') {
          setCurrentView('home')
        }
      } catch {
        // Fallback
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    try {
      sessionStorage.setItem('phishshield_intro_seen', 'true')
    } catch {
      // Ignore storage restrictions
    }
  }

  const handleReplayIntro = () => {
    setShowIntro(true)
  }

  const handleOpenDashboard = (tab: string = 'overview') => {
    try {
      if (window.location.pathname !== '/dashboard') {
        window.history.pushState({ view: 'dashboard' }, '', '/dashboard')
      }
    } catch {
      // Ignore
    }
    setDashboardTab(tab)
    setCurrentView('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateHowItWorks = () => {
    try {
      if (window.location.pathname !== '/how-it-works') {
        window.history.pushState({ view: 'how-it-works' }, '', '/how-it-works')
      }
    } catch {
      // Ignore
    }
    setCurrentView('how-it-works')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReturnHome = (sectionId?: string) => {
    try {
      if (window.location.pathname !== '/') {
        window.history.pushState({ view: 'home' }, '', '/')
      }
    } catch {
      // Ignore
    }
    setCurrentView('home')
    if (!sectionId || sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 50)
    }
  }

  const handleNavigateSectionFromHowItWorks = (sectionId: string) => {
    if (sectionId === 'how-it-works') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleReturnHome(sectionId)
    }
  }

  return (
    <>
      {/* 1. PHISHSHIELD AI — DIGITAL AWAKENING: 6-Second 3D Cinematic Intro Animation */}
      {showIntro && <DigitalAwakeningIntro onComplete={handleIntroComplete} />}

      {/* 2. Primary Route View: Homepage, How It Works, or Dashboard */}
      {currentView === 'home' ? (
        <HomePage
          onOpenDashboard={handleOpenDashboard}
          onReplayIntro={handleReplayIntro}
          onNavigateHowItWorks={handleNavigateHowItWorks}
        />
      ) : currentView === 'how-it-works' ? (
        <HowItWorksPage
          onOpenDashboard={handleOpenDashboard}
          onNavigateHome={() => handleReturnHome()}
          onNavigateSection={handleNavigateSectionFromHowItWorks}
          onReplayIntro={handleReplayIntro}
        />
      ) : (
        <AppShell
          key={dashboardTab}
          onReplayIntro={handleReplayIntro}
          onReturnHome={() => handleReturnHome()}
          initialTab={dashboardTab}
        >
          {(activeTab) => {
            switch (activeTab) {
              case 'overview':
                return <OverviewDashboard />
              case 'scanner':
                return (
                  <div className="max-w-4xl mx-auto space-y-4">
                    <Card className="p-8 text-center space-y-3 bg-[#0D1B2A] border border-[#22D3EE]/25">
                      <div className="mx-auto h-12 w-12 rounded-xl bg-[#111C30] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.25)]">
                        <Shield className="h-6 w-6" />
                      </div>
                      <h2 className="text-lg font-bold text-[#F8FAFC]">Threat Scanner Console</h2>
                      <p className="text-xs text-[#CBD5E1] max-w-md mx-auto">
                        Analyse suspicious URLs, domain certificates, zero-font evasion, and DKIM/SPF headers.
                      </p>
                      <div className="pt-2">
                        <Badge variant="cyan" size="sm">
                          Scanner Engine Ready
                        </Badge>
                      </div>
                    </Card>
                  </div>
                )
              case 'quarantine':
                return (
                  <div className="max-w-4xl mx-auto space-y-4">
                    <Card className="p-8 text-center space-y-3 bg-[#0D1B2A] border border-[#22D3EE]/25">
                      <div className="mx-auto h-12 w-12 rounded-xl bg-[#111C30] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.25)]">
                        <Inbox className="h-6 w-6" />
                      </div>
                      <h2 className="text-lg font-bold text-[#F8FAFC]">Quarantine Vault</h2>
                      <p className="text-xs text-[#CBD5E1] max-w-md mx-auto">
                        Centralized repository for quarantined malicious payloads, phishing emails, and spoofed headers.
                      </p>
                      <div className="pt-2">
                        <Badge variant="neutral" size="sm">
                          14 Secured Artifacts
                        </Badge>
                      </div>
                    </Card>
                  </div>
                )
              case 'sandbox':
                return (
                  <div className="max-w-4xl mx-auto space-y-4">
                    <Card className="p-8 text-center space-y-3 bg-[#0D1B2A] border border-[#22D3EE]/25">
                      <div className="mx-auto h-12 w-12 rounded-xl bg-[#111C30] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.25)]">
                        <Terminal className="h-6 w-6" />
                      </div>
                      <h2 className="text-lg font-bold text-[#F8FAFC]">Sandbox Matrix</h2>
                      <p className="text-xs text-cyber-textSecondary max-w-md mx-auto">
                        Isolated execution environment placeholder for automated detonation and runtime payload tracing.
                      </p>
                      <div className="pt-2">
                        <Badge variant="warning" size="sm">
                          Detonation Module
                        </Badge>
                      </div>
                    </Card>
                  </div>
                )
              case 'intelligence':
                return (
                  <div className="max-w-4xl mx-auto space-y-4">
                    <Card className="p-8 text-center space-y-3 bg-[#0D1B2A] border border-[#22D3EE]/25">
                      <div className="mx-auto h-12 w-12 rounded-xl bg-[#111C30] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.25)]">
                        <Database className="h-6 w-6" />
                      </div>
                      <h2 className="text-lg font-bold text-[#F8FAFC]">Threat Feeds & Intelligence</h2>
                      <p className="text-xs text-cyber-textSecondary max-w-md mx-auto">
                        Aggregated feeds of newly recognized phishing kits, homoglyph domains, and compromised certificate authorities.
                      </p>
                      <div className="pt-2">
                        <Badge variant="cyan" size="sm">
                          Live Sync Ready
                        </Badge>
                      </div>
                    </Card>
                  </div>
                )
              case 'settings':
                return (
                  <div className="max-w-4xl mx-auto space-y-4">
                    <Card className="p-8 text-center space-y-3 bg-[#0D1B2A] border border-[#22D3EE]/25">
                      <div className="mx-auto h-12 w-12 rounded-xl bg-[#111C30] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.25)]">
                        <Sliders className="h-6 w-6" />
                      </div>
                      <h2 className="text-lg font-bold text-[#F8FAFC]">System Settings</h2>
                      <p className="text-xs text-cyber-textSecondary max-w-md mx-auto">
                        Adjust defense thresholds, sensitivity scores, alert webhooks, and UI customization.
                      </p>
                      <div className="pt-2">
                        <Badge variant="neutral" size="sm">
                          Configuration Matrix
                        </Badge>
                      </div>
                    </Card>
                  </div>
                )
              default:
                return <OverviewDashboard />
            }
          }}
        </AppShell>
      )}
    </>
  )
}

export default App
