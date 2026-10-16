import React, { useState } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  onReplayIntro?: () => void
  onReturnHome?: () => void
  onNavigateAbout?: () => void
  onNavigateHowItWorks?: () => void
  initialTab?: string
  initialScannerTool?: string
  children: (
    activeTab: string,
    onTabChange: (tab: string, scannerTool?: string) => void,
    searchQuery: string,
    selectedScannerTool: string
  ) => React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({
  onReplayIntro,
  onReturnHome,
  onNavigateAbout,
  onNavigateHowItWorks,
  initialTab = 'overview',
  initialScannerTool = 'url',
  children,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab)
  const [activeScannerTool, setActiveScannerTool] = useState<string>(initialScannerTool)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleTabChange = (tab: string, scannerTool?: string) => {
    setActiveTab(tab)
    if (scannerTool) {
      setActiveScannerTool(scannerTool)
    }
  }

  return (
    <div className="min-h-screen bg-[#020B16] flex flex-col text-[#F8FAFC]">
      <Navbar
        onReplayIntro={onReplayIntro}
        onReturnHome={onReturnHome}
        onNavigateAbout={onNavigateAbout}
        onNavigateDashboard={() => handleTabChange('overview')}
        onSearch={setSearchQuery}
      />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Hidden on overview to match reference full-width blueprint, visible on large desktop for tools */}
        <div className={activeTab === 'overview' ? 'hidden' : 'hidden lg:block shrink-0'}>
          <Sidebar
            activeTab={activeTab}
            activeScannerTool={activeScannerTool}
            onTabChange={(tab, tool) => handleTabChange(tab, tool)}
            onNavigateHowItWorks={onNavigateHowItWorks}
            onNavigateAbout={onNavigateAbout}
          />
        </div>
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 max-w-[1536px] mx-auto w-full">
          {children(activeTab, handleTabChange, searchQuery, activeScannerTool)}
        </main>
      </div>
    </div>
  )
}
