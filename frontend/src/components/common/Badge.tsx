import React from 'react'
import { cn } from '../../utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'danger' | 'warning' | 'success' | 'neutral'
  size?: 'sm' | 'md'
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
  ...props
}) => {
  const variantStyles = {
    cyan: 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30',
    danger: 'bg-cyber-danger/10 text-cyber-danger border-cyber-danger/30',
    warning: 'bg-cyber-warning/10 text-cyber-warning border-cyber-warning/30',
    success: 'bg-[#22C55E]/20 text-[#4ADE80] border-[#22C55E]/45 shadow-[0_0_10px_rgba(34,197,94,0.25)] font-semibold',
    neutral: 'bg-cyber-panel text-cyber-textSecondary border-cyber-border',
  }

  const dotColors = {
    cyan: 'bg-cyber-cyan',
    danger: 'bg-cyber-danger',
    warning: 'bg-cyber-warning',
    success: 'bg-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.8)]',
    neutral: 'bg-cyber-textSecondary',
  }

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-mono transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full animate-pulse', dotColors[variant])}
        />
      )}
      {children}
    </span>
  )
}
