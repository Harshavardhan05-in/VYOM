import React, { useEffect } from 'react'
import { HomeNavbar } from '../home/HomeNavbar'
import { Footer } from '../home/Footer'
import { HowItWorksHero } from './HowItWorksHero'
import { ProcessCards } from './ProcessCards'
import { WhatWeAnalyse } from './WhatWeAnalyse'
import { WhatYouGet } from './WhatYouGet'
import { SaferDigitalWorld } from './SaferDigitalWorld'

interface HowItWorksPageProps {
  onOpenDashboard: (tab?: string) => void
  onNavigateHome: () => void
  onNavigateSection: (sectionId: string) => void
  onReplayIntro?: () => void
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onOpenDashboard,
  onNavigateHome,
  onNavigateSection,
  onReplayIntro,
}) => {
  // Ensure top scroll position when page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const handleNavbarNavigate = (sectionId: string) => {
    if (sectionId === 'how-it-works') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (sectionId === 'home') {
      onNavigateHome()
    } else {
      onNavigateSection(sectionId)
    }
  }

  const handleSelectTool = (_toolId: string) => {
    onOpenDashboard('scanner')
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] flex flex-col overflow-x-hidden selection:bg-[#22D3EE]/25 selection:text-[#22D3EE]">
      {/* 1. Shared Navigation Bar with active 'how-it-works' highlight */}
      <HomeNavbar
        activeRoute="how-it-works"
        onOpenDashboard={() => onOpenDashboard('overview')}
        onNavigateSection={handleNavbarNavigate}
        onReplayIntro={onReplayIntro}
      />

      {/* 2. Hero Section: 2 Columns with Badge, Headings & Rotating 3D Security Shield */}
      <HowItWorksHero />

      {/* 3. Three Process Cards Connected by Directional Arrows */}
      <ProcessCards />

      {/* 4. What We Analyse Section: 4 Analysis Categories */}
      <WhatWeAnalyse />

      {/* 5. What You Get Section: 4 Outcome & Deliverable Cards */}
      <WhatYouGet />

      {/* 6. Built for a Safer Digital World: Animated Globe + 3 Trust Pillars */}
      <SaferDigitalWorld />

      {/* 7. Shared Footer */}
      <Footer
        onNavigateSection={onNavigateSection}
        onOpenDashboard={() => onOpenDashboard('overview')}
        onSelectTool={handleSelectTool}
      />
    </div>
  )
}

export default HowItWorksPage
