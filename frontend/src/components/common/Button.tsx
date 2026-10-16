import React from 'react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }

  const variantStyles = {
    primary:
      'bg-cyber-cyan text-cyber-deep font-semibold hover:bg-cyber-neon hover:shadow-glow-cyan active:scale-[0.98]',
    secondary:
      'bg-cyber-panel text-cyber-textPrimary border border-cyber-border hover:bg-cyber-panelHover hover:border-cyber-borderHighlight active:scale-[0.98]',
    outline:
      'bg-transparent text-cyber-cyan border border-cyber-cyan/40 hover:bg-cyber-cyan/10 hover:border-cyber-cyan active:scale-[0.98]',
    ghost:
      'bg-transparent text-cyber-textSecondary hover:text-cyber-textPrimary hover:bg-cyber-panel/60 active:scale-[0.98]',
    danger:
      'bg-cyber-danger/15 text-cyber-danger border border-cyber-danger/30 hover:bg-cyber-danger/25 active:scale-[0.98]',
  }

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  )
}
