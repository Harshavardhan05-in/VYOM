import React, { useState, useEffect } from 'react'
import { HomePage } from './components/home/HomePage'
import { HowItWorksPage } from './components/how-it-works/HowItWorksPage'
import { AboutUsPage } from './components/about/AboutUsPage'
import { AppShell } from './components/layout/AppShell'
import { OverviewDashboard } from './components/dashboard/OverviewDashboard'
import { ScannerConsole } from './components/dashboard/ScannerConsole'
import { ScanHistoryView } from './components/dashboard/ScanHistoryView'
import { QuarantineVault } from './components/dashboard/QuarantineVault'
import { SandboxMatrix } from './components/dashboard/SandboxMatrix'
import { ThreatIntelligence } from './components/dashboard/ThreatIntelligence'
import { SystemSettings } from './components/dashboard/SystemSettings'
import { SocialShieldPage } from './components/scanners/SocialShieldPage'
import { DigitalAwakeningIntro } from './components/intro/DigitalAwakeningIntro'

export const App: React.FC = () => {
  // Show intro on first visit by default on homepage, and allow replay
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      if (
        typeof window !== 'undefined' &&
        (window.location.pathname === '/about' ||
          window.location.pathname === '/how-it-works' ||
          window.location.pathname === '/social' ||
          window.location.pathname === '/social-shield' ||
          window.location.search.includes('nointro=true'))
      ) {
        return false
      }
      return !sessionStorage.getItem('phishshield_intro_seen')
    } catch {
      return true
    }
  })

  // View state: 'home' (reference landing page), 'how-it-works', 'about', or 'dashboard' (defense console)
  const [currentView, setCurrentView] = useState<'home' | 'how-it-works' | 'about' | 'dashboard'>(() => {
    try {
      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/about') {
          return 'about'
        }
        if (window.location.pathname === '/how-it-works') {
          return 'how-it-works'
        }
        if (
          window.location.pathname === '/dashboard' ||
          window.location.pathname === '/social' ||
          window.location.pathname === '/social-shield'
        ) {
          return 'dashboard'
        }
      }
    } catch {
      // Ignore
    }
    return 'home'
  })

  const [dashboardTab, setDashboardTab] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const tabParam = params.get('tab')
        if (tabParam) return tabParam
        if (window.location.pathname === '/social' || window.location.pathname === '/social-shield') {
          return 'social'
        }
      }
    } catch {
      // Ignore
    }
    return 'overview'
  })

  const [selectedScannerTool, setSelectedScannerTool] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const toolParam = params.get('tool')
        if (toolParam) return toolParam
        if (window.location.pathname === '/social' || window.location.pathname === '/social-shield') {
          return 'social'
        }
      }
    } catch {
      // Ignore
    }
    return 'url'
  })

  // Listen for browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      try {
        if (window.location.pathname === '/about') {
          setCurrentView('about')
        } else if (window.location.pathname === '/how-it-works') {
          setCurrentView('how-it-works')
        } else if (
          window.location.pathname === '/social' ||
          window.location.pathname === '/social-shield'
        ) {
          setDashboardTab('social')
          setSelectedScannerTool('social')
          setCurrentView('dashboard')
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

  const handleOpenDashboard = (tab: string = 'overview', initialScannerTool?: string) => {
    try {
      if (window.location.pathname !== '/dashboard') {
        window.history.pushState({ view: 'dashboard' }, '', '/dashboard')
      }
    } catch {
      // Ignore
    }
    if (initialScannerTool) {
      setSelectedScannerTool(initialScannerTool)
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

  const handleNavigateAbout = () => {
    try {
      if (window.location.pathname !== '/about') {
        window.history.pushState({ view: 'about' }, '', '/about')
      }
    } catch {
      // Ignore
    }
    setCurrentView('about')
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
    } else if (sectionId === 'about') {
      handleNavigateAbout()
    } else {
      handleReturnHome(sectionId)
    }
  }

  return (
    <>
      {/* 1. PHISHSHIELD AI — DIGITAL AWAKENING: 4-Second Cinematic Intro Animation (3550ms + 450ms transition) */}
      {showIntro && <DigitalAwakeningIntro onComplete={handleIntroComplete} />}

      {/* 2. Primary Route View: Homepage, How It Works, About, or Dashboard */}
      {currentView === 'home' ? (
        <HomePage
          onOpenDashboard={handleOpenDashboard}
          onReplayIntro={handleReplayIntro}
          onNavigateHowItWorks={handleNavigateHowItWorks}
          onNavigateAbout={handleNavigateAbout}
        />
      ) : currentView === 'how-it-works' ? (
        <HowItWorksPage
          onOpenDashboard={handleOpenDashboard}
          onNavigateHome={() => handleReturnHome()}
          onNavigateSection={handleNavigateSectionFromHowItWorks}
          onReplayIntro={handleReplayIntro}
        />
      ) : currentView === 'about' ? (
        <AboutUsPage
          onNavigateHome={() => handleReturnHome()}
          onOpenDashboard={handleOpenDashboard}
        />
      ) : (
        <AppShell
          key={`${dashboardTab}-${selectedScannerTool}`}
          onReplayIntro={handleReplayIntro}
          onReturnHome={() => handleReturnHome()}
          onNavigateAbout={handleNavigateAbout}
          onNavigateHowItWorks={handleNavigateHowItWorks}
          initialTab={dashboardTab}
          initialScannerTool={selectedScannerTool}
        >
          {(activeTab, onTabChange, searchQuery, currentScannerTool) => {
            switch (activeTab) {
              case 'overview':
                return <OverviewDashboard onNavigateTab={onTabChange} externalSearch={searchQuery} />
              case 'social':
                return (
                  <SocialShieldPage
                    onNavigateTab={onTabChange}
                    onNavigateHome={handleReturnHome}
                    onNavigateHowItWorks={handleNavigateHowItWorks}
                    onNavigateAbout={handleNavigateAbout}
                  />
                )
              case 'scanner':
                if (currentScannerTool === 'social') {
                  return (
                    <SocialShieldPage
                      onNavigateTab={onTabChange}
                      onNavigateHome={handleReturnHome}
                      onNavigateHowItWorks={handleNavigateHowItWorks}
                      onNavigateAbout={handleNavigateAbout}
                    />
                  )
                }
                return <ScannerConsole initialTool={currentScannerTool} />
              case 'history':
                return <ScanHistoryView />
              case 'quarantine':
                return <QuarantineVault />
              case 'sandbox':
                return <SandboxMatrix />
              case 'intelligence':
                return <ThreatIntelligence />
              case 'settings':
                return <SystemSettings />
              default:
                return <OverviewDashboard onNavigateTab={onTabChange} externalSearch={searchQuery} />
            }
          }}
        </AppShell>
      )}
    </>
  )
}

export default App
