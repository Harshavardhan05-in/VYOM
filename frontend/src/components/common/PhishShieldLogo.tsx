import React from 'react'

interface PhishShieldLogoProps {
  className?: string
}

export const PhishShieldLogo: React.FC<PhishShieldLogoProps> = ({
  className = 'w-9 h-10',
}) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 80 88"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(0,217,255,0.65)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="psShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#008CFF" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#020B16" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="psStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#00D9FF" />
            <stop offset="100%" stopColor="#008CFF" />
          </linearGradient>
          <filter id="psGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Shield Plate with Cyan Glow */}
        <path
          d="M 40 3 Q 58 7 77 11 Q 74 44 63 62 Q 51 76 40 85 Q 29 76 17 62 Q 6 44 3 11 Q 22 7 40 3 Z"
          fill="url(#psShieldGrad)"
          stroke="url(#psStrokeGrad)"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {/* Inner Cyan Bevel Contour */}
        <path
          d="M 40 9 Q 55 12 69 16 Q 66 42 57 56 Q 48 68 40 76 Q 32 68 23 56 Q 14 42 11 16 Q 25 12 40 9 Z"
          stroke="#00D9FF"
          strokeWidth="1.2"
          strokeOpacity="0.55"
          fill="none"
        />

        {/* Stylized Cyber 'P' Emblem */}
        <path
          d="
            M 30 23
            H 46
            C 54 23 58 28 58 35
            C 58 42 54 46 46 46
            H 38
            V 58
            L 30 64
            V 23
            Z
            M 38 30
            V 39
            H 45
            C 48 39 50 37 50 35
            C 50 32 48 30 45 30
            H 38
            Z
          "
          fill="#00D9FF"
          filter="url(#psGlow)"
        />

        {/* Specular White Highlight on P Loop */}
        <path
          d="M 39 25 H 46 C 51 25 54 27 55 31"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />
      </svg>
    </div>
  )
}
