import React from 'react'
import { motion } from 'framer-motion'

interface CyberShieldLockProps {
  phase: 1 | 2 | 3 | 4
  className?: string
}

export const CyberShieldLock: React.FC<CyberShieldLockProps> = ({
  phase,
  className = '',
}) => {
  const isFormed = phase >= 1
  const isShieldRevealed = phase >= 2
  const isActivated = phase >= 3
  const isBrandPhase = phase >= 4

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 1. Deep Ambient Cyan & Electric Blue Atmosphere */}
      <motion.div
        initial={{ opacity: 0.15, scale: 0.8 }}
        animate={{
          opacity: isActivated ? [0.35, 0.55, 0.35] : isShieldRevealed ? 0.3 : 0.15,
          scale: isActivated ? [0.98, 1.04, 0.98] : 1.0,
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 m-auto w-[88%] h-[88%] rounded-full bg-gradient-radial from-[#00D9FF]/25 via-[#008CFF]/15 to-transparent blur-3xl pointer-events-none"
      />

      {/* 2. Concentric Energy Shockwave on Shield Reveal (Phase 2) */}
      {phase === 2 && (
        <motion.div
          key="shield-reveal-shockwave"
          initial={{ opacity: 0.9, scale: 0.6 }}
          animate={{ opacity: 0, scale: 1.45 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 m-auto w-[90%] h-[90%] rounded-full border border-[#00D9FF] shadow-[0_0_30px_#00D9FF] pointer-events-none z-30"
        />
      )}

      {/* 3. Master Vector Padlock & Scanning Environment SVG */}
      <svg
        viewBox="0 0 460 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 overflow-visible drop-shadow-[0_0_28px_rgba(0,217,255,0.45)]"
        aria-label="PhishShield AI Master Holographic Padlock"
      >
        <defs>
          {/* Cyan Neon Glow Filter */}
          <filter id="introNeonGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* White Specular Core Filter */}
          <filter id="introSpecularCore" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shackle Metallic Alloy Gradient */}
          <linearGradient id="shackleGrad" x1="182" y1="75" x2="278" y2="165" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F8FAFC" />
            <stop stopColor="#00D9FF" />
            <stop stopColor="#008CFF" />
          </linearGradient>

          {/* Lock Body Deep Navy Gradient (#061426 to #020B16) */}
          <linearGradient id="lockBodyGrad" x1="230" y1="155" x2="230" y2="297" gradientUnits="userSpaceOnUse">
            <stop stopColor="#061426" stopOpacity="0.98" />
            <stop stopColor="#040D1B" stopOpacity="0.99" />
            <stop stopColor="#020B16" stopOpacity="1" />
          </linearGradient>

          {/* Electric Cyan Neon Rim Gradient */}
          <linearGradient id="neonRimGrad" x1="150" y1="75" x2="310" y2="297" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00D9FF" />
            <stop stopColor="#008CFF" />
            <stop stopColor="#00D9FF" />
          </linearGradient>

          {/* Inner Shield Plate Gradient */}
          <linearGradient id="shieldPlateGrad" x1="230" y1="182" x2="230" y2="265" gradientUnits="userSpaceOnUse">
            <stop stopColor="#081E38" stopOpacity="0.96" />
            <stop stopColor="#040E1B" stopOpacity="0.99" />
          </linearGradient>

          {/* Clip Path for Lock Body Matrix Circuitry */}
          <clipPath id="introBodyClip">
            <rect x="150" y="155" width="160" height="142" rx="20" ry="20" />
          </clipPath>
        </defs>

        {/* ---------------------------------------------------- */}
        {/* SUBTLE DIGITAL GLOBE / RADAR GRID BEHIND LOCK (Phase 3+) */}
        {/* ---------------------------------------------------- */}
        <motion.g
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: isActivated ? 0.45 : 0,
            scale: isActivated ? 1 : 0.85,
          }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ originX: '230px', originY: '225px' }}
        >
          {/* Globe Boundary Circle */}
          <circle cx="230" cy="225" r="148" stroke="#00D9FF" strokeWidth="0.8" strokeDasharray="3 4" strokeOpacity="0.25" />
          
          {/* Latitude Parallels */}
          <ellipse cx="230" cy="225" rx="146" ry="105" stroke="#00D9FF" strokeWidth="0.8" strokeOpacity="0.18" />
          <ellipse cx="230" cy="225" rx="138" ry="58" stroke="#008CFF" strokeWidth="0.8" strokeOpacity="0.22" />
          <line x1="84" y1="225" x2="376" y2="225" stroke="#00D9FF" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="6 4" />

          {/* Rotating Longitude Ellipses */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '230px', originY: '225px' }}
          >
            <ellipse cx="230" cy="225" rx="60" ry="146" stroke="#00D9FF" strokeWidth="0.8" strokeOpacity="0.2" />
            <ellipse cx="230" cy="225" rx="108" ry="146" stroke="#008CFF" strokeWidth="0.8" strokeOpacity="0.16" />
          </motion.g>
        </motion.g>

        {/* ---------------------------------------------------- */}
        {/* HOLOGRAPHIC PLATFORM AT BASE (Phase 2+)              */}
        {/* ---------------------------------------------------- */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isShieldRevealed ? 0.9 : 0,
            scale: isShieldRevealed ? 1 : 0.8,
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Base Ambient Glow Cone */}
          <ellipse cx="230" cy="425" rx="175" ry="34" fill="rgba(0, 217, 255, 0.08)" filter="url(#introNeonGlow)" />

          {/* Concentric Base Ellipses */}
          <ellipse
            cx="230"
            cy="425"
            rx="185"
            ry="38"
            stroke="#00D9FF"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="rgba(6, 20, 38, 0.6)"
          />
          <ellipse
            cx="230"
            cy="425"
            rx="145"
            ry="28"
            stroke="#00D9FF"
            strokeWidth="1.2"
            strokeDasharray="8 6"
            strokeOpacity="0.55"
          />
          <ellipse
            cx="230"
            cy="425"
            rx="95"
            ry="18"
            stroke="#00D9FF"
            strokeWidth="1"
            strokeOpacity="0.75"
          />
          <circle cx="230" cy="425" r="4.5" fill="#00D9FF" filter="url(#introSpecularCore)" />
          <circle cx="230" cy="425" r="2" fill="#FFFFFF" />

          {/* Upward Energy Wave traveling through Lock (Phase 3+) */}
          {isActivated && (
            <motion.ellipse
              cx="230"
              cy="425"
              rx="155"
              ry="30"
              stroke="#00D9FF"
              strokeWidth="1.4"
              initial={{ cy: 425, rx: 95, ry: 18, opacity: 0.8 }}
              animate={{ cy: 380, rx: 170, ry: 34, opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </motion.g>

        {/* ---------------------------------------------------- */}
        {/* HOLOGRAPHIC SCANNING RINGS (Phase 2 fade-in, Phase 3+ rotate) */}
        {/* ---------------------------------------------------- */}
        {/* Outer Segmented HUD Radar Ring (Clockwise) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{
            opacity: isShieldRevealed ? 0.65 : 0,
            rotate: isActivated ? 360 : 0,
          }}
          transition={{
            opacity: { duration: 0.7 },
            rotate: { duration: 16, repeat: Infinity, ease: 'linear' },
          }}
          style={{ originX: '230px', originY: '225px' }}
          stroke="#00D9FF"
          strokeWidth="1.4"
        >
          <circle cx="230" cy="225" r="195" strokeWidth="1.2" strokeDasharray="24 14 6 14" strokeOpacity="0.4" />
          <circle cx="230" cy="225" r="180" strokeWidth="0.8" strokeDasharray="4 8" strokeOpacity="0.25" />
          <path d="M 35 225 H 48" strokeWidth="2.5" strokeOpacity="0.8" />
          <path d="M 412 225 H 425" strokeWidth="2.5" strokeOpacity="0.8" />
          <path d="M 230 30 V 43" strokeWidth="2.5" strokeOpacity="0.8" />
          <path d="M 230 407 V 420" strokeWidth="2.5" strokeOpacity="0.8" />
        </motion.g>

        {/* Middle Precision Ring with Diamond Nodes (Counter-Clockwise) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{
            opacity: isShieldRevealed ? 0.5 : 0,
            rotate: isActivated ? -360 : 0,
          }}
          transition={{
            opacity: { duration: 0.7 },
            rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
          }}
          style={{ originX: '230px', originY: '225px' }}
        >
          <circle cx="230" cy="225" r="158" stroke="#00D9FF" strokeWidth="1" strokeDasharray="10 12" strokeOpacity="0.35" />
          <polygon points="230,72 233,76 230,80 227,76" fill="#00D9FF" opacity="0.9" />
          <polygon points="230,370 233,374 230,378 227,374" fill="#00D9FF" opacity="0.9" />
          <polygon points="77,225 81,228 85,225 81,222" fill="#00D9FF" opacity="0.9" />
          <polygon points="375,225 379,228 383,225 379,222" fill="#00D9FF" opacity="0.9" />
        </motion.g>

        {/* Inner Horizon Ring with Moving Arc Highlight (Clockwise) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{
            opacity: isShieldRevealed ? 0.6 : 0,
            rotate: isActivated ? 360 : 0,
          }}
          transition={{
            opacity: { duration: 0.7 },
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
          }}
          style={{ originX: '230px', originY: '225px' }}
        >
          <circle cx="230" cy="225" r="122" stroke="#00D9FF" strokeWidth="0.8" strokeDasharray="4 6" strokeOpacity="0.25" />
          <circle cx="230" cy="225" r="122" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="30 150" strokeOpacity="0.85" strokeLinecap="round" />
        </motion.g>

        {/* ---------------------------------------------------- */}
        {/* MASTER CENTRAL PADLOCK ASSEMBLY                      */}
        {/* ---------------------------------------------------- */}
        <motion.g
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{
            opacity: isFormed ? 1 : 0,
            scale: isBrandPhase ? [1, 1.025, 1] : 1,
          }}
          transition={{
            opacity: { duration: 0.7, ease: 'easeOut' },
            scale: isBrandPhase ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.6 },
          }}
          style={{ originX: '230px', originY: '225px' }}
        >
          {/* PADLOCK SHACKLE (Rounded U-shaped Curved Shackle) */}
          <motion.g
            initial={{ opacity: 0, y: -16 }}
            animate={{
              opacity: isFormed ? 1 : 0,
              y: isFormed ? 0 : -16,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Shackle Solid Body */}
            <path
              d="
                M 182 165
                V 115
                A 48 48 0 0 1 278 115
                V 165
                H 262
                V 115
                A 32 32 0 0 0 198 115
                V 165
                Z
              "
              fill="url(#shackleGrad)"
              stroke="#00D9FF"
              strokeWidth="2.5"
              filter="url(#introNeonGlow)"
            />

            {/* Specular White Highlight Along Arch */}
            <path
              d="M 190 158 V 115 A 40 40 0 0 1 270 115 V 158"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.95"
              filter="url(#introSpecularCore)"
            />
          </motion.g>

          {/* PADLOCK SOLID BODY (Wide Rounded Rectangular Body) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: isFormed ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {/* Outer Rectangular Body */}
            <rect
              x="150"
              y="155"
              width="160"
              height="142"
              rx="20"
              ry="20"
              fill="url(#lockBodyGrad)"
              stroke="url(#neonRimGrad)"
              strokeWidth="3.2"
              filter="url(#introNeonGlow)"
            />

            {/* Inset Inner Rim Contour */}
            <rect
              x="156"
              y="161"
              width="148"
              height="130"
              rx="15"
              ry="15"
              fill="none"
              stroke="#00D9FF"
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />

            {/* Digital Surface Details: Circuit Traces & Micro Nodes */}
            <g clipPath="url(#introBodyClip)" opacity="0.85">
              <path
                d="
                  M 160 175 H 180 V 190 H 190
                  M 160 225 H 182 V 238 H 190
                  M 160 265 H 185
                  M 300 175 H 280 V 190 H 270
                  M 300 225 H 278 V 238 H 270
                  M 300 265 H 275
                "
                stroke="#00D9FF"
                strokeWidth="1.3"
                strokeOpacity="0.65"
              />
              <circle cx="180" cy="190" r="2.2" fill="#00D9FF" />
              <circle cx="182" cy="238" r="2.2" fill="#00D9FF" />
              <circle cx="280" cy="190" r="2.2" fill="#00D9FF" />
              <circle cx="278" cy="238" r="2.2" fill="#00D9FF" />

              {/* Micro Data Matrix Points */}
              <g fill="#00D9FF" opacity="0.7">
                <rect x="166" y="198" width="1.8" height="1.8" />
                <rect x="172" y="210" width="1.8" height="1.8" />
                <rect x="164" y="245" width="1.8" height="1.8" />
                <rect x="170" y="255" width="1.8" height="1.8" />
                <rect x="292" y="198" width="1.8" height="1.8" />
                <rect x="286" y="210" width="1.8" height="1.8" />
                <rect x="294" y="245" width="1.8" height="1.8" />
                <rect x="288" y="255" width="1.8" height="1.8" />
              </g>

              {/* Smooth Cyan Light Sweep Beam across Padlock Body (Phase 2+) */}
              {isShieldRevealed && (
                <motion.rect
                  x="150"
                  y="130"
                  width="160"
                  height="45"
                  fill="url(#neonRimGrad)"
                  opacity="0.25"
                  initial={{ y: 130 }}
                  animate={{ y: [130, 310] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </g>

            {/* Shackle Base Socket Collars */}
            <rect x="176" y="153" width="24" height="4.5" rx="2" fill="#00D9FF" opacity="0.85" />
            <rect x="260" y="153" width="24" height="4.5" rx="2" fill="#00D9FF" opacity="0.85" />

            {/* ---------------------------------------------------- */}
            {/* SHIELD LOGO REVEAL INSIDE PADLOCK BODY (Phase 2+)    */}
            {/* ---------------------------------------------------- */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isShieldRevealed ? 1 : 0,
                scale: isShieldRevealed ? (phase === 2 ? [0.8, 1.1, 1] : 1) : 0.8,
              }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{ originX: '230px', originY: '226px' }}
              filter="url(#introNeonGlow)"
            >
              {/* Outer Shield Contour Centred inside Lock Body */}
              <path
                d="
                  M 230 182
                  Q 248 186 268 190
                  Q 265 224 254 242
                  Q 241 256 230 265
                  Q 219 256 206 242
                  Q 195 224 192 190
                  Q 212 186 230 182
                  Z
                "
                fill="url(#shieldPlateGrad)"
                stroke="#00D9FF"
                strokeWidth="2.8"
              />

              {/* Inner Shield Bevel Line */}
              <path
                d="
                  M 230 188
                  Q 245 191 260 195
                  Q 257 222 248 236
                  Q 238 248 230 256
                  Q 222 248 212 236
                  Q 203 222 200 195
                  Q 215 191 230 188
                  Z
                "
                stroke="#008CFF"
                strokeWidth="1.2"
                strokeOpacity="0.6"
              />

              {/* Stylized Cyber "P" Emblem Centred Inside Shield */}
              <path
                d="
                  M 220 202
                  H 236
                  C 244 202 248 207 248 214
                  C 248 221 244 225 236 225
                  H 228
                  V 238
                  L 220 244
                  V 202
                  Z
                  M 228 209
                  V 218
                  H 235
                  C 238 218 240 216 240 214
                  C 240 211 238 209 235 209
                  H 228
                  Z
                "
                fill="#00D9FF"
                filter="url(#introSpecularCore)"
              />

              {/* Specular White Highlight on P Loop */}
              <path
                d="M 229 204 H 236 C 241 204 244 206 245 210"
                stroke="#FFFFFF"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.95"
              />
            </motion.g>
          </motion.g>
        </motion.g>
      </svg>
    </div>
  )
}
