import React from 'react'
import { HomeNavbar } from './HomeNavbar'
import { HeroSection } from './HeroSection'
import { ProtectionTools } from './ProtectionTools'
import { FinalCTA } from './FinalCTA'
import { Footer } from './Footer'

interface HomePageProps {
  onOpenDashboard: (tab?: string, toolId?: string) => void
  onReplayIntro?: () => void
  onNavigateHowItWorks: () => void
  onNavigateAbout: () => void
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenDashboard,
  onReplayIntro,
  onNavigateHowItWorks,
  onNavigateAbout,
}) => {
  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (sectionId === 'how-it-works') {
      onNavigateHowItWorks()
    } else if (sectionId === 'about') {
      onNavigateAbout()
    } else if (sectionId === 'protection') {
      const el = document.getElementById('protection')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleSelectTool = (toolId: string) => {
    // Navigate to appropriate scanner console or social view in dashboard
    if (toolId.includes('social')) {
      onOpenDashboard('social', 'social')
    } else {
      onOpenDashboard('scanner', toolId)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] flex flex-col overflow-x-hidden selection:bg-[#22D3EE]/25 selection:text-[#22D3EE]">
      {/* 1. Navigation Bar */}
      <HomeNavbar
        activeRoute="home"
        onOpenDashboard={() => onOpenDashboard('overview')}
        onNavigateSection={handleNavigateSection}
        onReplayIntro={onReplayIntro}
      />

      {/* 2. Hero Section with continuously rotating 3D lock */}
      <HeroSection
        onScanUrl={() => onOpenDashboard('scanner')}
        onExploreProtection={() => handleNavigateSection('protection')}
      />

      {/* 3. Exactly Six Protection Tool Cards */}
      <ProtectionTools onSelectTool={handleSelectTool} />

      {/* 4. Final CTA Panel */}
      <FinalCTA onOpenDashboard={() => onOpenDashboard('overview')} />

      {/* 5. Professional Multi-Column Footer */}
      <Footer
        className="pt-6 sm:pt-8 lg:pt-10"
        onNavigateSection={handleNavigateSection}
        onOpenDashboard={() => onOpenDashboard('overview')}
        onSelectTool={handleSelectTool}
      />
    </div>
  )
}
