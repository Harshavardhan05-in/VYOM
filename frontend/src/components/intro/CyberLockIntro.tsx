import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SkipForward } from 'lucide-react'
import { CyberShieldLock } from './CyberShieldLock'

interface CyberLockIntroProps {
  onComplete: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  size: number
  color: string
  duration: number
  delay: number
}

export const CyberLockIntro: React.FC<CyberLockIntroProps> = ({ onComplete }) => {
  // Coordinated 4-Phase Timeline (Strict 4.0s Target):
  // Phase 1 (0.0s - 1.0s): Digital particles gather toward center to form the padlock
  // Phase 2 (1.0s - 2.0s): Shield logo & "P" emblem revealed inside lock body with cyan light sweep
  // Phase 3 (2.0s - 3.0s): Lock activation, scanning rings counter-rotate, subtle digital globe grid
  // Phase 4 (3.0s - 4.0s): Brand name "PhishShield AI" and tagline appear beneath lock
  // 4.0s Mark: Smooth crossfade transition into the existing homepage
  const [isReducedMotion] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      }
    } catch {
      // Ignore
    }
    return false
  })
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(() => (isReducedMotion ? 4 : 1))
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const isFinishedRef = useRef(false)

  // Phase 1: Targeted Converging Particles (0.0s - 1.0s)
  // Dual-color particles (#00D9FF cyan & #008CFF electric blue) converging to assemble the padlock
  const convergingParticles = useMemo<Particle[]>(() => {
    const list: Particle[] = []
    const count = 30
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI
      const distance = 36 + (i % 4) * 8
      const startX = 50 + Math.cos(angle) * distance
      const startY = 44 + Math.sin(angle) * distance

      // Targets mapped around the shackle arch (top) and lock body perimeter
      let targetX = 50
      let targetY = 44
      if (i % 3 === 0) {
        // Shackle arch targets
        targetX = 46 + ((i % 5) - 2) * 2.5
        targetY = 32 + Math.abs((i % 5) - 2) * 1.5
      } else if (i % 3 === 1) {
        // Left & right lock body corners
        targetX = i % 2 === 0 ? 42 : 58
        targetY = 42 + ((i % 4) * 2.5)
      } else {
        // Base of lock body
        targetX = 45 + (i % 6) * 2
        targetY = 52
      }

      list.push({
        id: i,
        x: startX,
        y: startY,
        targetX,
        targetY,
        size: i % 3 === 0 ? 3 : i % 2 === 0 ? 2.4 : 1.8,
        color: i % 2 === 0 ? '#00D9FF' : '#008CFF',
        duration: 0.75 + (i % 4) * 0.05,
        delay: (i % 6) * 0.03,
      })
    }
    return list
  }, [])

  // Floating ambient atmospheric particles during Phases 2-4
  const ambientParticles = useMemo(
    () => [
      { id: 201, x: 16, y: 22, size: 2, duration: 3.8, delay: 0, color: '#00D9FF' },
      { id: 202, x: 84, y: 20, size: 2.2, duration: 4.2, delay: 0.2, color: '#008CFF' },
      { id: 203, x: 12, y: 62, size: 1.5, duration: 3.9, delay: 0.5, color: '#00D9FF' },
      { id: 204, x: 88, y: 68, size: 2, duration: 4.1, delay: 0.1, color: '#008CFF' },
      { id: 205, x: 24, y: 78, size: 1.8, duration: 3.5, delay: 0.4, color: '#00D9FF' },
      { id: 206, x: 76, y: 80, size: 2, duration: 4.0, delay: 0.7, color: '#008CFF' },
      { id: 207, x: 50, y: 10, size: 2.2, duration: 4.5, delay: 0.3, color: '#00D9FF' },
      { id: 208, x: 18, y: 44, size: 1.6, duration: 3.7, delay: 0.6, color: '#008CFF' },
      { id: 209, x: 82, y: 46, size: 2, duration: 4.3, delay: 0.2, color: '#00D9FF' },
    ],
    []
  )

  const handleFinish = useCallback(() => {
    if (isFinishedRef.current) return
    isFinishedRef.current = true
    setIsExiting(true)

    // Save session completion
    try {
      sessionStorage.setItem('phishshield_intro_seen', 'true')
    } catch {
      // Ignore storage restrictions
    }

    setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 400)
  }, [onComplete])

  useEffect(() => {
    // 1. Accessibility: prefers-reduced-motion triggers fast transition
    if (isReducedMotion) {
      const tReduced = setTimeout(() => {
        handleFinish()
      }, 700)
      return () => clearTimeout(tReduced)
    }

    // 2. Keyboard listener: Escape key skips intro immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    // 3. Exact 4-Second Timeline Transitions:
    // Phase 2: Shield logo reveal inside lock body (at 1.0s)
    const tPhase2 = setTimeout(() => {
      setPhase(2)
    }, 1000)

    // Phase 3: Lock activation, scanning rings counter-rotation (at 2.0s)
    const tPhase3 = setTimeout(() => {
      setPhase(3)
    }, 2000)

    // Phase 4: Brand name and tagline reveal beneath lock (at 3.0s)
    const tPhase4 = setTimeout(() => {
      setPhase(4)
    }, 3000)

    // Exact 4.0-second boundary: Transition into the existing homepage
    const tComplete = setTimeout(() => {
      handleFinish()
    }, 4000)

    // Watchdog failsafe at 4.3s
    const tFailsafe = setTimeout(() => {
      handleFinish()
    }, 4300)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(tPhase2)
      clearTimeout(tPhase3)
      clearTimeout(tPhase4)
      clearTimeout(tComplete)
      clearTimeout(tFailsafe)
    }
  }, [handleFinish, isReducedMotion])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: isExiting ? 0 : 1,
            scale: isExiting ? 1.02 : 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 bg-[#020B16] flex flex-col items-center justify-center overflow-hidden select-none"
          role="region"
          aria-label="PhishShield AI Cinematic Intro Animation"
        >
          {/* Deep Navy Atmosphere with Cyan Radial Glow (#020B16 & #061426) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 46%, rgba(0, 217, 255, 0.18) 0%, rgba(6, 20, 38, 0.65) 45%, #020B16 75%)',
            }}
          />

          {/* Subtle Cyber Grid Texture */}
          <div className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-15 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_80%)]" />

          {/* PHASE 1: Converging Digital Particles Assembling the Padlock (0.0s - 1.0s) */}
          {phase === 1 && !isReducedMotion && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {convergingParticles.map((p) => (
                <motion.div
                  key={`conv-${p.id}`}
                  initial={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    opacity: 0,
                    scale: 0.4,
                  }}
                  animate={{
                    left: `${p.targetX}%`,
                    top: `${p.targetY}%`,
                    opacity: [0, 0.95, 0],
                    scale: [0.4, 1.3, 0.2],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: 'easeIn',
                  }}
                  style={{
                    position: 'absolute',
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    boxShadow: `0 0 10px ${p.color}`,
                  }}
                  className="rounded-full"
                />
              ))}

              {/* Central Light Ignition Pulse at Meeting Point */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 0.9], opacity: [0, 1, 0.85] }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFFFFF] shadow-[0_0_26px_#00D9FF]"
              />
            </div>
          )}

          {/* Ambient Particles during Phases 2 - 4 */}
          {phase >= 2 && !isReducedMotion && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {ambientParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{
                    opacity: [0.15, 0.65, 0.15],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    position: 'absolute',
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    boxShadow: `0 0 8px ${particle.color}`,
                  }}
                  className="rounded-full"
                />
              ))}
            </div>
          )}

          {/* Accessible Skip Intro Button (Top Right) */}
          <div className="absolute top-6 right-6 z-30">
            <button
              onClick={handleFinish}
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#061426]/80 border border-[#00D9FF]/35 hover:border-[#00D9FF] text-xs text-[#CBD5E1] hover:text-[#00D9FF] transition-all backdrop-blur-md shadow-[0_0_12px_rgba(0,217,255,0.15)] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              aria-label="Skip Introduction"
            >
              <span className="font-medium">Skip Intro</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#020B16] border border-[#00D9FF]/25 text-[#94A3B8] group-hover:text-[#00D9FF]">
                ESC
              </kbd>
              <SkipForward className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Main Visual Composition: Master Padlock & Inner Shield */}
          <div className="relative flex flex-col items-center justify-center w-full max-h-screen px-4 py-2 z-10">
            {/* Padlock Illustration Container */}
            <div className="relative flex items-center justify-center w-[88vw] max-w-[390px] sm:w-[72vw] sm:max-w-[500px] md:w-[60vw] md:max-w-[560px] lg:w-[58vw] lg:max-w-[620px] h-[50vh] sm:h-[58vh] max-h-[600px] aspect-[460/480]">
              <CyberShieldLock phase={phase} className="w-full h-full" />
            </div>

            {/* Typography Section: Brand Name and Tagline Revealed in Phase 4 (3.0s - 4.0s) */}
            <div className="h-20 sm:h-24 flex flex-col items-center justify-center text-center mt-2 sm:mt-4 relative z-20">
              {phase >= 4 && (
                <motion.div
                  initial={isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-1.5 sm:space-y-2"
                >
                  {/* Brand Name: PhishShield in White (#F8FAFC), AI in Bright Cyan (#00D9FF) */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8FAFC] drop-shadow-[0_2px_16px_rgba(0,217,255,0.4)]">
                    PhishShield{' '}
                    <span className="text-[#00D9FF] font-mono tracking-[0.14em] uppercase font-bold text-2xl sm:text-3xl lg:text-4xl drop-shadow-[0_0_14px_#00D9FF]">
                      AI
                    </span>
                  </h1>

                  {/* Required Tagline: Intelligent Digital Threat Protection */}
                  <motion.p
                    initial={isReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.45, delay: isReducedMotion ? 0 : 0.12 }}
                    className="text-[10px] sm:text-xs lg:text-sm font-mono tracking-[0.26em] uppercase text-[#00D9FF] font-semibold drop-shadow-[0_0_10px_rgba(0,217,255,0.35)]"
                  >
                    Intelligent Digital Threat Protection
                  </motion.p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Named alias export as requested by project specifications
export const PhishShieldIntro = CyberLockIntro
