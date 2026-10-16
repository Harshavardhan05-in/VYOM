import React, { useState } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  onReplayIntro?: () => void
  onReturnHome?: () => void
  initialTab?: string
  children: (activeTab: string) => React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({
  onReplayIntro,
  onReturnHome,
  initialTab = 'overview',
  children,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab)

  return (
    <div className="min-h-screen bg-[#0B1120] flex flex-col text-[#F8FAFC]">
      <Navbar onReplayIntro={onReplayIntro} onReturnHome={onReturnHome} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {children(activeTab)}
        </main>
      </div>
    </div>
  )
}
