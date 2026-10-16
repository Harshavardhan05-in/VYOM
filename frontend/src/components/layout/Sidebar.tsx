import React from 'react'
import {
  LayoutDashboard,
  ShieldAlert,
  Inbox,
  Terminal,
  Database,
  Sliders,
  ChevronRight,
  Lock,
} from 'lucide-react'
import { cn } from '../../utils/cn'

interface SidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuGroups = [
    {
      group: 'Defense Operations',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'scanner', label: 'Threat Scanner', icon: ShieldAlert, badge: 'Live' },
        { id: 'quarantine', label: 'Quarantine Vault', icon: Inbox, badge: '14' },
      ],
    },
    {
      group: 'Analysis & Intel',
      items: [
        { id: 'sandbox', label: 'Sandbox Matrix', icon: Terminal },
        { id: 'intelligence', label: 'Threat Feeds', icon: Database },
      ],
    },
    {
      group: 'Configuration',
      items: [{ id: 'settings', label: 'System Settings', icon: Sliders }],
    },
  ]

  return (
    <aside className="w-64 border-r border-cyber-border bg-cyber-deep/90 flex flex-col shrink-0 select-none">
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            <h4 className="px-3 text-[11px] font-semibold text-cyber-textMuted uppercase tracking-wider font-mono">
              {group.group}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group',
                      isActive
                        ? 'bg-cyber-panel text-cyber-cyan border border-cyber-cyan/30 shadow-glow-cyan-sm'
                        : 'text-cyber-textSecondary hover:text-cyber-textPrimary hover:bg-cyber-card/60'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          'h-4 w-4 transition-colors',
                          isActive
                            ? 'text-cyber-cyan'
                            : 'text-cyber-textMuted group-hover:text-cyber-textSecondary'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded font-mono font-medium',
                            isActive
                              ? 'bg-cyber-cyan/20 text-cyber-cyan'
                              : 'bg-cyber-panel text-cyber-textMuted group-hover:text-cyber-textSecondary'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="h-3 w-3 text-cyber-cyan" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Engine Status Footer */}
      <div className="p-4 border-t border-cyber-border bg-cyber-card/40 m-3 rounded-xl border">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center text-cyber-cyan shrink-0">
            <Lock className="h-3.5 w-3.5" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-cyber-textPrimary truncate">
                Shield Defense v1.0
              </span>
            </div>
            <p className="text-[10px] text-cyber-textMuted truncate font-mono">
              Zero-Trust Architecture
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
