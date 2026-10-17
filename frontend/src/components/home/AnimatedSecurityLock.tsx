import React from 'react'
import { HolographicShield } from '../common/HolographicShield'

interface AnimatedSecurityLockProps {
  isActive?: boolean
}

export const AnimatedSecurityLock: React.FC<AnimatedSecurityLockProps> = ({
  isActive = true,
}) => (
  <div className="relative h-[330px] w-full overflow-hidden sm:h-[420px] lg:h-[480px]">
    <HolographicShield
      mode="hero"
      active={isActive}
      className="select-none"
    />
  </div>
)
