import React from 'react'
import { Card } from './Card'
import { cn } from '../../utils/cn'

export interface StatCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  helperText?: string
  variant?: 'cyan' | 'warning' | 'danger' | 'success'
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  helperText,
  variant = 'cyan',
}) => {
  const iconVariants = {
    cyan: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/20',
    warning: 'text-cyber-warning bg-cyber-warning/10 border-cyber-warning/20',
    danger: 'text-cyber-danger bg-cyber-danger/10 border-cyber-danger/20',
    success: 'text-cyber-success bg-cyber-success/10 border-cyber-success/20',
  }

  return (
    <Card className="p-5 relative overflow-hidden group">
      {/* Subtle background ambient corner highlight */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyber-cyan/5 rounded-full blur-2xl group-hover:bg-cyber-cyan/10 transition-all duration-300 pointer-events-none" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-cyber-textMuted mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold font-mono tracking-tight text-cyber-textPrimary">
            {value}
          </h3>
        </div>
        <div
          className={cn(
            'p-2.5 rounded-lg border transition-transform duration-200 group-hover:scale-105',
            iconVariants[variant]
          )}
        >
          {icon}
        </div>
      </div>

      {(change || helperText) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={cn(
                'font-mono font-medium',
                trend === 'up' && 'text-cyber-success',
                trend === 'down' && 'text-cyber-cyan',
                trend === 'neutral' && 'text-cyber-textSecondary'
              )}
            >
              {change}
            </span>
          )}
          {helperText && <span className="text-cyber-textMuted">{helperText}</span>}
        </div>
      )}
    </Card>
  )
}
