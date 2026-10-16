import React from 'react'
import { cn } from '../../utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  interactive?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  glow = false,
  interactive = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-cyber-card/90 backdrop-blur-md rounded-xl border border-cyber-border shadow-cyber-card transition-all duration-200',
        glow && 'hover:border-cyber-cyan/40 hover:shadow-glow-cyan',
        interactive && 'cursor-pointer hover:bg-cyber-panelHover hover:translate-y-[-1px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
