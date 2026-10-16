import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { SkipForward } from 'lucide-react'
import { DigitalAwakeningCanvas } from './DigitalAwakeningCanvas'

interface DigitalAwakeningIntroProps {
  onComplete: () => void
}

const TOTAL_ANIMATION_MS = 3550
const EXIT_TRANSITION_MS = 450

export const DigitalAwakeningIntro: React.FC<
  DigitalAwakeningIntroProps
> = ({ onComplete }) => {

  // Accessibility: respect reduced-motion preference.
  const [isReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false

    return window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  })

  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  const [webglSupported] = useState<boolean>(() => {
    try {
      const canvas = document.createElement('canvas')

      return Boolean(
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      )
    } catch {
      return false
    }
  })

  const finishedRef = useRef(false)
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const exitTimerRef = useRef<number | null>(null)

  // --------------------------------------------------
  // FINISH INTRO AND REVEAL EXISTING HOMEPAGE
  // --------------------------------------------------

  const handleFinish = useCallback(() => {
    if (finishedRef.current) return

    finishedRef.current = true
    setIsExiting(true)

    try {
      sessionStorage.setItem(
        'phishshield_intro_seen',
        'true'
      )
    } catch {
      // Continue even when sessionStorage is unavailable.
    }

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    exitTimerRef.current = window.setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, EXIT_TRANSITION_MS)
  }, [onComplete])

  // --------------------------------------------------
  // FOUR-SECOND INTRO TIMELINE
  // --------------------------------------------------

  useEffect(() => {
    if (isReducedMotion) {
      const timer = window.setTimeout(() => {
        handleFinish()
      }, 700)

      return () => window.clearTimeout(timer)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleFinish()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    const updateTimeline = (timestamp: number) => {
      if (finishedRef.current) return

      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current

      const nextProgress = Math.min(
        elapsed / TOTAL_ANIMATION_MS,
        1
      )

      setProgress(nextProgress)

      if (nextProgress < 1) {
        animationFrameRef.current =
          requestAnimationFrame(updateTimeline)
      } else {
        handleFinish()
      }
    }

    animationFrameRef.current =
      requestAnimationFrame(updateTimeline)

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current)
      }
    }
  }, [handleFinish, isReducedMotion])

  // Timeline expressed in seconds.
  const currentTime = progress * 4

  // Show lock and shield after the initial particle phase.
  const showLock = currentTime >= 0.65

  // Reveal brand during the final second.
  const showBrand = currentTime >= 2.8

  // --------------------------------------------------
  // INTRO UI
  // --------------------------------------------------

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: isExiting ? 0 : 1,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: EXIT_TRANSITION_MS / 1000,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            overflow-hidden select-none
            bg-[#020914] text-white
          "
          role="dialog"
          aria-label="PhishShield AI introduction"
          aria-modal="true"
        >

          {/* =========================================
              BACKGROUND ATMOSPHERE
          ========================================= */}

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  ellipse at 50% 46%,
                  rgba(0, 153, 255, 0.20) 0%,
                  rgba(0, 70, 140, 0.10) 36%,
                  #020914 75%
                )
              `,
            }}
          />

          {/* Digital grid */}

          <div
            className="
              absolute inset-0 pointer-events-none
              opacity-20
            "
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(0, 217, 255, 0.12) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(0, 217, 255, 0.12) 1px,
                  transparent 1px
                )
              `,
              backgroundSize: '42px 42px',
              maskImage:
                'radial-gradient(ellipse at center, black 10%, transparent 75%)',
            }}
          />

          {/* =========================================
              EXISTING DIGITAL CANVAS
          ========================================= */}

          {webglSupported && (
            <div className="absolute inset-0 pointer-events-none">
              <DigitalAwakeningCanvas
                progress={progress}
                isReducedMotion={isReducedMotion}
              />
            </div>
          )}

          {/* =========================================
              SKIP INTRO
          ========================================= */}

          <button
            type="button"
            onClick={handleFinish}
            className="
              absolute top-5 right-5 sm:top-7 sm:right-7
              z-50
              flex items-center gap-2
              rounded-xl
              border border-cyan-400/30
              bg-[#061426]/80
              px-3.5 py-2
              text-xs font-medium
              text-slate-300
              backdrop-blur-md
              transition-all duration-200
              hover:border-cyan-300
              hover:text-cyan-300
              focus:outline-none
              focus:ring-2 focus:ring-cyan-400
            "
            aria-label="Skip introduction"
          >
            <span>Skip Intro</span>

            <SkipForward className="h-3.5 w-3.5" />
          </button>

          {/* =========================================
              MAIN LOCK SCENE
          ========================================= */}

          <div
            className="
              relative z-10
              flex flex-col items-center justify-center
              w-full h-full
              px-5
              pointer-events-none
            "
          >

            <div
              className="
                relative
                flex items-center justify-center
                w-[min(76vw,390px)]
                h-[min(66vh,410px)]
              "
            >

              {/* Ambient cyan glow */}

              <motion.div
                className="
                  absolute
                  w-[72%] aspect-square
                  rounded-full
                  bg-cyan-400/10
                  blur-[55px]
                "
                animate={
                  isReducedMotion
                    ? {}
                    : {
                      scale: [0.9, 1.12, 0.9],
                      opacity: [0.35, 0.8, 0.35],
                    }
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Digital globe outline */}

              <motion.div
                className="
                  absolute
                  w-[90%] aspect-square
                  rounded-full
                  border border-cyan-400/20
                "
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: showLock ? 0.75 : 0.1,
                  scale: showLock ? 1 : 0.8,
                }}
                transition={{ duration: 0.6 }}
              >
                <div
                  className="
                    absolute inset-[10%]
                    rounded-full
                    border border-blue-400/30
                  "
                />

                <div
                  className="
                    absolute inset-[20%]
                    rounded-full
                    border border-cyan-400/20
                  "
                  style={{
                    transform: 'scaleX(0.45)',
                  }}
                />

                <div
                  className="
                    absolute inset-[20%]
                    rounded-full
                    border border-cyan-400/20
                  "
                  style={{
                    transform: 'scaleY(0.45)',
                  }}
                />
              </motion.div>

              {/* =====================================
                  ROTATING HOLOGRAPHIC RINGS
              ===================================== */}

              <motion.div
                className="
                  absolute
                  w-[116%] h-[30%]
                  rounded-[50%]
                  border-2 border-cyan-400/70
                "
                style={{
                  transform: 'rotateX(65deg)',
                  boxShadow:
                    '0 0 12px rgba(0,217,255,0.45), inset 0 0 12px rgba(0,217,255,0.2)',
                }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: showLock ? 0.85 : 0,
                  scale: showLock ? 1 : 0.7,
                  rotateZ: isReducedMotion ? 0 : 360,
                }}
                transition={{
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.7 },
                  rotateZ: {
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                }}
              />

              <motion.div
                className="
                  absolute
                  w-[130%] h-[25%]
                  rounded-[50%]
                  border border-blue-400/50
                "
                style={{
                  transform: 'rotateX(65deg)',
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: showLock ? 0.65 : 0,
                  rotateZ: isReducedMotion ? 0 : -360,
                }}
                transition={{
                  opacity: { duration: 0.4 },
                  rotateZ: {
                    duration: 11,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                }}
              />

              {/* =====================================
                  PADLOCK SVG
              ===================================== */}

              <motion.svg
                viewBox="0 0 320 390"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="
                  absolute z-10
                  w-[78%] h-[94%]
                  overflow-visible
                "
                initial={{
                  opacity: 0,
                  scale: 0.72,
                  y: 22,
                }}
                animate={{
                  opacity: showLock ? 1 : 0,
                  scale: showLock ? 1 : 0.72,
                  y: showLock ? 0 : 22,
                  rotateY:
                    isReducedMotion ? 0 : [0, 4, 0, -4, 0],
                }}
                transition={{
                  opacity: { duration: 0.45 },
                  scale: {
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  },
                  y: { duration: 0.7 },
                  rotateY: {
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                aria-hidden="true"
              >

                <defs>
                  <linearGradient
                    id="introLockGradient"
                    x1="65"
                    y1="50"
                    x2="255"
                    y2="340"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#75F8FF" />
                    <stop offset="0.5" stopColor="#00D9FF" />
                    <stop offset="1" stopColor="#0875FF" />
                  </linearGradient>

                  <linearGradient
                    id="introLockBodyGradient"
                    x1="80"
                    y1="160"
                    x2="250"
                    y2="340"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#103D69" />
                    <stop offset="1" stopColor="#04152D" />
                  </linearGradient>

                  <filter
                    id="introLockGlow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur
                      stdDeviation="5"
                      result="blur"
                    />

                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Lock shackle */}

                <path
                  d="
                    M95 177
                    V111
                    C95 35 225 35 225 111
                    V177
                  "
                  stroke="url(#introLockGradient)"
                  strokeWidth="17"
                  strokeLinecap="round"
                  filter="url(#introLockGlow)"
                  strokeDasharray="420"
                  strokeDashoffset="420"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="420"
                    to="0"
                    dur="0.8s"
                    begin="0.2s"
                    fill="freeze"
                  />
                </path>

                {/* Lock body */}

                <rect
                  x="60"
                  y="155"
                  width="200"
                  height="180"
                  rx="27"
                  fill="url(#introLockBodyGradient)"
                  stroke="url(#introLockGradient)"
                  strokeWidth="8"
                  filter="url(#introLockGlow)"
                />

                {/* Inner lock body highlight */}

                <rect
                  x="71"
                  y="166"
                  width="178"
                  height="158"
                  rx="19"
                  stroke="#36EFFF"
                  strokeOpacity="0.25"
                  strokeWidth="2"
                />

                {/* Keyhole */}

                <circle
                  cx="160"
                  cy="228"
                  r="10"
                  fill="#00D9FF"
                />

                <path
                  d="M155 235 H165 L171 259 H149 Z"
                  fill="#00D9FF"
                />

              </motion.svg>

              {/* =====================================
                  PHISHSHIELD SHIELD LOGO
                  INSIDE THE LOCK
              ===================================== */}

              <AnimatePresence>
                {showLock && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.55,
                      filter: 'blur(8px)',
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      filter: 'blur(0px)',
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="
                      absolute z-20
                      flex items-center justify-center
                      w-[25%] aspect-square
                      top-[43%]
                    "
                    style={{
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <svg
                      viewBox="0 0 120 120"
                      fill="none"
                      className="
                        w-full h-full
                        drop-shadow-[0_0_14px_rgba(0,217,255,0.8)]
                      "
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label="PhishShield AI shield logo"
                    >
                      <path
                        d="
                          M60 9
                          L99 23
                          L94 65
                          C88 87 74 101 60 109
                          C46 101 32 87 26 65
                          L21 23 Z
                        "
                        fill="#061A32"
                        stroke="#00D9FF"
                        strokeWidth="4"
                      />

                      <path
                        d="
                          M46 38
                          H66
                          C78 38 84 45 84 55
                          C84 65 77 71 66 71
                          H55
                          V85
                        "
                        stroke="#39F1FF"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M55 71 V91"
                        stroke="#39F1FF"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* =====================================
                  HOLOGRAPHIC PLATFORM
              ===================================== */}

              <motion.div
                className="
                  absolute
                  w-[116%] h-[11%]
                  bottom-[1%]
                  rounded-[50%]
                  border-2 border-cyan-400/80
                "
                style={{
                  transform: 'perspective(180px) rotateX(55deg)',
                  boxShadow:
                    '0 0 15px rgba(0,217,255,0.7), inset 0 0 15px rgba(0,217,255,0.2)',
                }}
                initial={{ opacity: 0, scale: 0.65 }}
                animate={{
                  opacity: showLock ? 1 : 0,
                  scale: showLock ? 1 : 0.65,
                }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute inset-[20%] rounded-[50%] border border-cyan-300/60" />
              </motion.div>

            </div>

            {/* =========================================
                BRAND NAME AND TAGLINE
            ========================================= */}

            <div
              className="
                relative z-30
                mt-[-8px]
                min-h-[100px]
                flex flex-col items-center justify-start
                text-center
              "
            >
              <AnimatePresence>
                {showBrand && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 18,
                      filter: 'blur(6px)',
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <h1
                      className="
                        text-3xl sm:text-5xl
                        font-extrabold
                        tracking-tight
                        text-white
                        drop-shadow-[0_0_18px_rgba(0,217,255,0.35)]
                      "
                    >
                      PhishShield{' '}
                      <span className="text-cyan-400">
                        AI
                      </span>
                    </h1>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.12 }}
                      className="
                        mt-2
                        text-[10px] sm:text-sm
                        font-medium
                        tracking-[0.16em] sm:tracking-[0.25em]
                        uppercase
                        text-cyan-200
                      "
                    >
                      Intelligent Digital Threat Protection
                    </motion.p>

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: 150 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.15,
                      }}
                      className="
                        h-[2px]
                        mx-auto mt-4
                        bg-gradient-to-r
                        from-transparent
                        via-cyan-400
                        to-transparent
                        shadow-[0_0_12px_rgba(0,217,255,0.7)]
                      "
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* =========================================
              FOOTER STATUS
          ========================================= */}

          <div
            className="
              absolute bottom-5
              flex items-center gap-2
              text-[9px]
              tracking-[0.2em]
              text-cyan-300/60
            "
          >
            <span
              className="
                w-1.5 h-1.5
                rounded-full
                bg-cyan-400
                shadow-[0_0_8px_#00D9FF]
              "
            />

            SECURE INITIALIZATION
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Preserve existing imports and backward compatibility.
export const CyberLockIntro = DigitalAwakeningIntro

export default DigitalAwakeningIntro