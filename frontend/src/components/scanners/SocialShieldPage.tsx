import React, { useState } from 'react'
import {
  Shield,
  Users,
  Lock,
  ArrowRight,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  Phone,
} from 'lucide-react'
import { LegalModal, type LegalModalType } from '../common/LegalModal'
import { PhishShieldLogo } from '../common/PhishShieldLogo'
import { PlatformAnalysisView } from './PlatformAnalysisView'

interface SocialShieldPageProps {
  onNavigateTab?: (tabId: string, scannerTool?: string) => void
  onNavigateHome?: (sectionId?: string) => void
  onNavigateHowItWorks?: () => void
  onNavigateAbout?: () => void
}

interface PlatformConfig {
  id: string
  name: string
  description: string
  accentColor: string
  borderColor: string
  hoverBorder: string
  glowColor: string
  btnBg: string
  btnBorder: string
  btnText: string
  inputPlaceholder: string
  inputLabel: string
  inputType: 'handle' | 'phone' | 'url'
  samples: Array<{ handle: string; bio: string; label: string }>
}

export const SocialShieldPage: React.FC<SocialShieldPageProps> = ({
  onNavigateTab,
  onNavigateHome,
  onNavigateHowItWorks,
  onNavigateAbout,
}) => {
  // Dedicated full-page platform selection state
  const [activePlatformId, setActivePlatformId] = useState<
    'whatsapp' | 'instagram' | 'facebook' | 'x' | 'youtube' | 'snapchat' | null
  >(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const p = params.get('platform')?.toLowerCase()
        if (p && ['whatsapp', 'instagram', 'facebook', 'x', 'youtube', 'snapchat'].includes(p)) {
          return p as any
        }
      }
    } catch {
      // Ignore
    }
    return null
  })

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'invalid' | 'success'>('idle')

  // Legal modal state
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null)

  const platforms: PlatformConfig[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Analyse Instagram profiles for authenticity and risk signals.',
      accentColor: '#E1306C',
      borderColor: 'border-[#E1306C]/35',
      hoverBorder: 'hover:border-[#E1306C]',
      glowColor: 'hover:shadow-[0_0_24px_rgba(225,48,108,0.30)]',
      btnBg: 'bg-[#E1306C]/15',
      btnBorder: 'border-[#E1306C]/40',
      btnText: 'text-[#E1306C]',
      inputLabel: 'Instagram Username or Profile URL',
      inputPlaceholder: 'e.g. meta_support_official or https://instagram.com/user',
      inputType: 'handle',
      samples: [
        {
          label: 'Brand Impersonator',
          handle: 'meta_support_verify_official',
          bio: 'Official Meta Support Desk. DM us to verify your blue badge. Send your email to recover account.',
        },
        {
          label: 'Bot Lookalike',
          handle: 'natgeo_photography_official_bot182',
          bio: 'Wildlife photography curated daily. Daily featured creators.',
        },
      ],
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Check unknown numbers and profile information.',
      accentColor: '#25D366',
      borderColor: 'border-[#25D366]/35',
      hoverBorder: 'hover:border-[#25D366]',
      glowColor: 'hover:shadow-[0_0_24px_rgba(37,211,102,0.30)]',
      btnBg: 'bg-[#25D366]/15',
      btnBorder: 'border-[#25D366]/40',
      btnText: 'text-[#25D366]',
      inputLabel: 'WhatsApp Contact Number (E.164 Format)',
      inputPlaceholder: 'e.g. +1 800 555 0199 or +44 7911 123456',
      inputType: 'phone',
      samples: [
        {
          label: 'Toll-Free Imposter',
          handle: '+1 800 555 0199',
          bio: 'Bank Fraud Department Alert. Call urgently to prevent card block.',
        },
        {
          label: 'Incomplete Short Number',
          handle: '+123',
          bio: 'Customer service hotline.',
        },
      ],
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Analyse Facebook profiles for suspicious activity.',
      accentColor: '#1877F2',
      borderColor: 'border-[#1877F2]/35',
      hoverBorder: 'hover:border-[#1877F2]',
      glowColor: 'hover:shadow-[0_0_24px_rgba(24,119,242,0.30)]',
      btnBg: 'bg-[#1877F2]/15',
      btnBorder: 'border-[#1877F2]/40',
      btnText: 'text-[#1877F2]',
      inputLabel: 'Facebook Page Handle or Profile URL',
      inputPlaceholder: 'e.g. meta_security_center_notice or https://facebook.com/profile',
      inputType: 'handle',
      samples: [
        {
          label: 'Security Notice Scam',
          handle: 'meta_security_update_center',
          bio: 'Official notice: Copyright violation detected on your page. Verify within 24h or page deleted.',
        },
        {
          label: 'Support Desk Bot',
          handle: 'facebook_official_support_desk',
          bio: 'Customer service agent online.',
        },
      ],
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      description: 'Analyse X profiles for spam, impersonation, and risks.',
      accentColor: '#FFFFFF',
      borderColor: 'border-white/25',
      hoverBorder: 'hover:border-[#00D9FF]',
      glowColor: 'hover:shadow-[0_0_24px_rgba(0,217,255,0.30)]',
      btnBg: 'bg-white/10',
      btnBorder: 'border-white/30',
      btnText: 'text-white',
      inputLabel: 'X (Twitter) Handle or Profile URL',
      inputPlaceholder: 'e.g. @elonmusk_airdrop_giveaway24 or username',
      inputType: 'handle',
      samples: [
        {
          label: 'Crypto Doubling Lure',
          handle: 'elonmusk_airdrop_giveaway24',
          bio: 'Tesla & SpaceX. Giving away 5,000 ETH to celebrate launch. Send 0.1 ETH to receive 1.0 ETH back instantly.',
        },
        {
          label: 'Exchange Support Imposter',
          handle: 'binance_support_official9942',
          bio: 'Official Binance 24/7 Live Agent. Connect wallet to recover frozen funds.',
        },
      ],
    },
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Check channel authenticity and detect suspicious content.',
      accentColor: '#FF0000',
      borderColor: 'border-[#FF0000]/35',
      hoverBorder: 'hover:border-[#FF0000]',
      glowColor: 'hover:shadow-[0_0_24px_rgba(255,0,0,0.30)]',
      btnBg: 'bg-[#FF0000]/15',
      btnBorder: 'border-[#FF0000]/40',
      btnText: 'text-[#FF0000]',
      inputLabel: 'YouTube Channel Handle or Channel URL',
      inputPlaceholder: 'e.g. @tesla_livestream_giveaway or https://youtube.com/@channel',
      inputType: 'handle',
      samples: [
        {
          label: 'Livestream Giveaway Hijack',
          handle: 'tesla_live_crypto_double',
          bio: 'Official Tesla AI Keynote Livestream. QR Code scan to claim double Bitcoin bonus.',
        },
        {
          label: 'Tech Support Imposter',
          handle: 'google_support_official_help',
          bio: 'Official Google Account Recovery Desk.',
        },
      ],
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      description: 'Analyse Snapchat profiles for safety and risk indicators.',
      accentColor: '#FFFC00',
      borderColor: 'border-[#FFFC00]/35',
      hoverBorder: 'hover:border-[#FFFC00]',
      glowColor: 'hover:shadow-[0_0_24px_rgba(255,252,0,0.30)]',
      btnBg: 'bg-[#FFFC00]/15',
      btnBorder: 'border-[#FFFC00]/40',
      btnText: 'text-[#FFFC00]',
      inputLabel: 'Snapchat Username',
      inputPlaceholder: 'e.g. snap_verify_support or username',
      inputType: 'handle',
      samples: [
        {
          label: 'Snap Support Scam',
          handle: 'snap_security_verify_desk',
          bio: 'Snapchat Account Security. Send snap code to verify account age.',
        },
        {
          label: 'Rewards Bot',
          handle: 'official_snap_rewards24',
          bio: 'Add back to receive free premium streak restore.',
        },
      ],
    },
  ]

  const handleSelectPlatform = (id: string) => {
    const valid = ['whatsapp', 'instagram', 'facebook', 'x', 'youtube', 'snapchat']
    if (valid.includes(id.toLowerCase())) {
      setActivePlatformId(id.toLowerCase() as any)
      try {
        const url = new URL(window.location.href)
        url.searchParams.set('platform', id.toLowerCase())
        window.history.pushState({ platform: id.toLowerCase() }, '', url.toString())
      } catch {
        // Ignore
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBackToPlatforms = () => {
    setActivePlatformId(null)
    try {
      const url = new URL(window.location.href)
      url.searchParams.delete('platform')
      window.history.pushState({}, '', url.toString())
    } catch {
      // Ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // If a dedicated platform is selected, render its dedicated full-page analysis interface
  if (activePlatformId) {
    return (
      <PlatformAnalysisView
        platformId={activePlatformId}
        onBack={handleBackToPlatforms}
        onNavigateTab={onNavigateTab}
        onNavigateHome={onNavigateHome}
        onNavigateHowItWorks={onNavigateHowItWorks}
        onNavigateAbout={onNavigateAbout}
      />
    )
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes('@') || !newsletterEmail.includes('.')) {
      setNewsletterStatus('invalid')
      return
    }
    setNewsletterStatus('success')
  }

  return (
    <div className="space-y-12 max-w-[1536px] mx-auto select-none">
      {/* ======================================================== */}
      {/* 1. HERO SECTION: 2-COLUMN COPY & HOLOGRAPHIC ILLUSTRATION*/}
      {/* ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2">
        {/* Left Column: Heading, Outlined Pill & Features */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00D9FF]/40 bg-[#00D9FF]/10 text-[#00D9FF] text-[11px] font-mono tracking-wider uppercase font-semibold shadow-[0_0_12px_rgba(0,217,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-ping" />
            <span>SOCIALSHIELD AI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F8FAFC] tracking-tight leading-[1.15]">
            Analyse Social Media <br />
            <span className="text-[#00D9FF] drop-shadow-[0_0_20px_rgba(0,217,255,0.5)]">
              Profiles with AI.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-xl">
            Check the authenticity of social media accounts, detect suspicious activity, and understand potential risks before you connect, follow, or interact.
          </p>

          {/* Three Compact Feature Blocks with Cyan Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Feature 1 */}
            <div className="flex items-start gap-3 p-2 rounded-xl bg-[#04182B]/60 border border-[#00D9FF]/10">
              <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/15 border border-[#00D9FF]/35 flex items-center justify-center text-[#00D9FF] shrink-0 shadow-[0_0_10px_rgba(0,217,255,0.25)]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#F8FAFC]">Detect Fake Accounts</h4>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">
                  Identify suspicious profiles and impersonation attempts.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3 p-2 rounded-xl bg-[#04182B]/60 border border-[#00D9FF]/10">
              <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/15 border border-[#00D9FF]/35 flex items-center justify-center text-[#00D9FF] shrink-0 shadow-[0_0_10px_rgba(0,217,255,0.25)]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#F8FAFC]">Analyse Profile Details</h4>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">
                  We examine public information, behaviour patterns, and links.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3 p-2 rounded-xl bg-[#04182B]/60 border border-[#00D9FF]/10">
              <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/15 border border-[#00D9FF]/35 flex items-center justify-center text-[#00D9FF] shrink-0 shadow-[0_0_10px_rgba(0,217,255,0.25)]">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#F8FAFC]">Stay Safer Online</h4>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">
                  Get clear insights before you trust or interact.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Holographic Cyber Shield with 3D Social Icons Orbit */}
        <div className="lg:col-span-5 flex items-center justify-center py-4 relative select-none overflow-visible">
          {/* Keyframe Animations & Reduced Motion accessibility */}
          <style>{`
            @keyframes psFloatA {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-5px); }
            }
            @keyframes psFloatB {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(5px); }
            }
            @keyframes psFloatC {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-4px) translateX(2px); }
            }
            @keyframes psOrbitPulse {
              0%, 100% { opacity: 0.35; transform: rotate(-24deg) scaleY(0.52); }
              50% { opacity: 0.65; transform: rotate(-24deg) scaleY(0.55); }
            }
            @media (prefers-reduced-motion: reduce) {
              .ps-hero-float, .ps-hero-orbit {
                animation: none !important;
                transform: none !important;
              }
            }
          `}</style>

          <div className="relative w-[340px] h-[370px] sm:w-[420px] sm:h-[430px] lg:w-[460px] lg:h-[440px] flex items-center justify-center scale-95 sm:scale-100">
            {/* Background Ambient Cyber Glow */}
            <div className="absolute w-72 h-72 rounded-full bg-[#00D9FF]/12 blur-3xl pointer-events-none" />

            {/* Concentric 3D Perspective Cyber Pedestal at bottom */}
            <div
              className="absolute bottom-2 sm:bottom-4 w-72 sm:w-80 h-28 pointer-events-none"
              style={{ transform: 'perspective(600px) rotateX(68deg)' }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-[#00D9FF]/50 shadow-[0_0_24px_rgba(0,217,255,0.6)] animate-pulse" />
              <div className="absolute inset-2.5 rounded-full border border-[#008CFF]/60" />
              <div className="absolute inset-5 rounded-full border border-dashed border-[#00D9FF]/40 animate-[spin_35s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border border-[#00D9FF]/70 shadow-[0_0_16px_rgba(0,217,255,0.9)]" />
              <div className="absolute inset-12 rounded-full bg-[#00D9FF]/25 blur-md" />
            </div>

            {/* 3D Perspective Holographic Elliptical Orbit Rings */}
            <div
              className="ps-hero-orbit absolute w-[300px] sm:w-[360px] h-[180px] sm:h-[210px] rounded-[50%] border border-[#00D9FF]/30 pointer-events-none shadow-[0_0_20px_rgba(0,217,255,0.2)]"
              style={{
                transform: 'rotate(-24deg) scaleY(0.52)',
                animation: 'psOrbitPulse 6s ease-in-out infinite',
              }}
            />
            <div
              className="ps-hero-orbit absolute w-[280px] sm:w-[330px] h-[160px] sm:h-[190px] rounded-[50%] border border-dashed border-[#008CFF]/25 pointer-events-none"
              style={{ transform: 'rotate(24deg) scaleY(0.50)' }}
            />

            {/* Central Holographic Shield with Profile Silhouette */}
            <div className="relative z-10 w-44 h-52 sm:w-48 sm:h-56 flex items-center justify-center -translate-y-2 pointer-events-none">
              {/* Shield Outer Glow SVG */}
              <svg className="w-full h-full text-[#00D9FF]" viewBox="0 0 100 120" fill="none">
                <defs>
                  <linearGradient id="shieldHoloGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#008CFF" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#020B16" stopOpacity="0.85" />
                  </linearGradient>
                  <linearGradient id="shieldStrokeGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00D9FF" />
                    <stop offset="50%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#008CFF" />
                  </linearGradient>
                </defs>

                {/* Outer Shield Outline */}
                <path
                  d="M50 8 L88 24 C88 64 68 96 50 112 C32 96 12 64 12 24 Z"
                  fill="url(#shieldHoloGrad)"
                  stroke="url(#shieldStrokeGrad)"
                  strokeWidth="2.5"
                  className="drop-shadow-[0_0_18px_rgba(0,217,255,0.75)]"
                />

                {/* Inner Shield Accent */}
                <path
                  d="M50 18 L80 32 C80 66 64 92 50 104 C36 92 20 66 20 32 Z"
                  stroke="#00D9FF"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  className="opacity-75 animate-[pulse_3s_ease-in-out_infinite]"
                />

                {/* Glowing User Profile Silhouette inside Shield */}
                <circle cx="50" cy="46" r="12" fill="#00D9FF" className="drop-shadow-[0_0_10px_rgba(0,217,255,0.95)]" />
                <path
                  d="M30 84 C30 68 40 64 50 64 C60 64 70 68 70 84 Z"
                  fill="#00D9FF"
                  className="drop-shadow-[0_0_10px_rgba(0,217,255,0.95)]"
                />
              </svg>
            </div>

            {/* Orbiting Platform Icons Symmetrically Framed Around the Shield */}
            {/* 1. Instagram: Top-Left */}
            <div
              onClick={() => handleSelectPlatform('instagram')}
              className="ps-hero-float absolute top-[14%] left-[10%] sm:left-[12%] z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#405DE6] p-0.5 shadow-[0_0_16px_rgba(225,48,108,0.5)] hover:scale-110 transition-transform cursor-pointer"
              style={{ animation: 'psFloatA 4.2s ease-in-out infinite' }}
              title="Instagram Profile Analysis"
            >
              <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#405DE6] flex items-center justify-center text-white">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-none stroke-white stroke-[2]" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
            </div>

            {/* 2. WhatsApp: Mid-Left */}
            <div
              onClick={() => handleSelectPlatform('whatsapp')}
              className="ps-hero-float absolute top-[41%] left-[2%] sm:left-[3%] z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#25D366] p-0.5 shadow-[0_0_16px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform cursor-pointer"
              style={{ animation: 'psFloatB 4.6s ease-in-out infinite 0.4s' }}
              title="WhatsApp Phone Link Check"
            >
              <div className="w-full h-full rounded-[14px] bg-[#25D366] flex items-center justify-center text-white">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
              </div>
            </div>

            {/* 3. YouTube: Lower-Left */}
            <div
              onClick={() => handleSelectPlatform('youtube')}
              className="ps-hero-float absolute top-[68%] left-[10%] sm:left-[12%] z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FF0000] p-0.5 shadow-[0_0_16px_rgba(255,0,0,0.5)] hover:scale-110 transition-transform cursor-pointer"
              style={{ animation: 'psFloatC 4.0s ease-in-out infinite 0.8s' }}
              title="YouTube Channel Authenticity"
            >
              <div className="w-full h-full rounded-[14px] bg-[#FF0000] flex items-center justify-center text-white">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
            </div>

            {/* 4. Facebook: Top-Right */}
            <div
              onClick={() => handleSelectPlatform('facebook')}
              className="ps-hero-float absolute top-[14%] right-[10%] sm:right-[12%] z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#1877F2] p-0.5 shadow-[0_0_16px_rgba(24,119,242,0.5)] hover:scale-110 transition-transform cursor-pointer"
              style={{ animation: 'psFloatB 4.4s ease-in-out infinite 0.2s' }}
              title="Facebook Page Verification"
            >
              <div className="w-full h-full rounded-[14px] bg-[#1877F2] flex items-center justify-center text-white font-black text-xl">
                f
              </div>
            </div>

            {/* 5. X (Twitter): Mid-Right */}
            <div
              onClick={() => handleSelectPlatform('x')}
              className="ps-hero-float absolute top-[41%] right-[2%] sm:right-[3%] z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-black border border-white/30 p-0.5 shadow-[0_0_16px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform cursor-pointer"
              style={{ animation: 'psFloatA 4.8s ease-in-out infinite 0.6s' }}
              title="X (Twitter) Profile & Handle Lure Scan"
            >
              <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center text-white font-black text-lg">
                ✕
              </div>
            </div>

            {/* 6. Snapchat: Lower-Right */}
            <div
              onClick={() => handleSelectPlatform('snapchat')}
              className="ps-hero-float absolute top-[68%] right-[10%] sm:right-[12%] z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FFFC00] p-0.5 shadow-[0_0_16px_rgba(255,252,0,0.5)] hover:scale-110 transition-transform cursor-pointer"
              style={{ animation: 'psFloatC 3.8s ease-in-out infinite 1.0s' }}
              title="Snapchat Account Risk Check"
            >
              <div className="w-full h-full rounded-[14px] bg-[#FFFC00] flex items-center justify-center text-black">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-white stroke-black stroke-[1.5]" viewBox="0 0 24 24">
                  <path d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 3 1 4-.5 1-2 1.5-2.5 2 0 0 1 .5 2.5.5.5 1 2 2.5 5 2.5s4.5-1.5 5-2.5c1.5 0 2.5-.5 2.5-.5-.5-.5-2-1-2.5-2 .5-1 1-2.5 1-4 0-3.5-2.5-6-6-6z" />
                </svg>
              </div>
            </div>

            {/* Floating Translucent HUD Data Cards (Positioned with Guaranteed Non-Overlapping Clearance) */}
            <div
              className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10 px-2.5 py-1.5 rounded-lg bg-[#04182B]/90 border border-[#00D9FF]/30 backdrop-blur-sm text-[8px] sm:text-[9px] font-mono text-[#00D9FF] space-y-0.5 shadow-[0_4px_16px_rgba(0,0,0,0.4)] pointer-events-none"
              title="Real-time Heuristic Engine"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
                <span className="font-bold tracking-wide">HEURISTIC AI</span>
              </div>
              <div className="text-[#94A3B8]">CONFIDENCE: 98.4%</div>
            </div>

            <div
              className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 z-10 px-2.5 py-1.5 rounded-lg bg-[#04182B]/90 border border-[#00D9FF]/30 backdrop-blur-sm text-[8px] sm:text-[9px] font-mono text-[#00D9FF] space-y-0.5 shadow-[0_4px_16px_rgba(0,0,0,0.4)] pointer-events-none"
              title="Multi-Platform Engine"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse shadow-[0_0_6px_#00D9FF]" />
                <span className="font-bold tracking-wide">6 PLATFORMS</span>
              </div>
              <div className="text-[#94A3B8]">HOMOGLYPH CHECK</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PLATFORM SELECTION PANEL: 3x2 GRID                    */}
      {/* ======================================================== */}
      <section className="rounded-3xl bg-[#04182B] border border-[#00D9FF]/25 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-6 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00D9FF]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Panel Header */}
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#00D9FF]/15 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF]">
              <LayoutGrid className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
              Select a Social Media Platform
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] ml-8">
            Choose a platform to analyse a profile and get AI-powered insights.
          </p>
        </div>

        {/* 6 Platform Cards in 3-Column x 2-Row Desktop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 relative z-10">
          {platforms.map((p) => {
            return (
              <button
                key={p.id}
                data-platform={p.id}
                onClick={() => handleSelectPlatform(p.id)}
                className={`platform-card p-4 sm:p-5 rounded-2xl bg-[#061426] border ${p.borderColor} ${p.hoverBorder} ${p.glowColor} transition-all duration-300 text-left flex items-center justify-between gap-4 group cursor-pointer hover:-translate-y-1`}
              >
                {/* Left: Custom Platform Icon */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {p.id === 'instagram' && (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#405DE6] flex items-center justify-center text-white shrink-0 shadow-md">
                      <svg className="w-6 h-6 fill-none stroke-white stroke-[2]" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </div>
                  )}

                  {p.id === 'whatsapp' && (
                    <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-md">
                      <Phone className="w-6 h-6 fill-white" />
                    </div>
                  )}

                  {p.id === 'facebook' && (
                    <div className="w-12 h-12 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-md">
                      f
                    </div>
                  )}

                  {p.id === 'x' && (
                    <div className="w-12 h-12 rounded-2xl bg-black border border-white/20 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-md">
                      ✕
                    </div>
                  )}

                  {p.id === 'youtube' && (
                    <div className="w-12 h-12 rounded-2xl bg-[#FF0000] flex items-center justify-center text-white shrink-0 shadow-md">
                      <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                  )}

                  {p.id === 'snapchat' && (
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFC00] flex items-center justify-center text-black shrink-0 shadow-md">
                      <svg className="w-6 h-6 fill-white stroke-black stroke-[1.5]" viewBox="0 0 24 24">
                        <path d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 3 1 4-.5 1-2 1.5-2.5 2 0 0 1 .5 2.5.5.5 1 2 2.5 5 2.5s4.5-1.5 5-2.5c1.5 0 2.5-.5 2.5-.5-.5-.5-2-1-2.5-2 .5-1 1-2.5 1-4 0-3.5-2.5-6-6-6z" />
                      </svg>
                    </div>
                  )}

                  {/* Middle: Name & Description */}
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-white truncate">
                      {p.name}
                    </h3>
                    <p className="text-xs text-[#94A3B8] group-hover:text-[#CBD5E1] mt-0.5 leading-snug line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                </div>

                {/* Right: Circular Arrow Button */}
                <div
                  className={`w-9 h-9 rounded-full ${p.btnBg} border ${p.btnBorder} ${p.btnText} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-1 shadow-sm`}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FOOTER MATCHING THE REFERENCE BLUEPRINT              */}
      {/* ======================================================== */}
      <footer className="w-full bg-[#03101F] border-t border-[#00D9FF]/20 text-[#CBD5E1] pt-12 pb-8 rounded-3xl select-none">
        <div className="px-6 sm:px-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-[#00D9FF]/15">
            {/* Brand Column (Cols 1-4) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <PhishShieldLogo className="w-8 h-9" />
                <div>
                  <span className="font-extrabold text-lg text-[#F8FAFC] tracking-tight">
                    PhishShield <span className="text-[#00D9FF]">AI</span>
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-[#94A3B8] font-normal leading-tight tracking-normal mt-0.5">
                    Intelligent Digital Threat Protection
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-sm">
                A unified AI-powered platform to detect, analyse, and help protect against digital threats across URLs, files, QR codes, messages, phone numbers, and social profiles.
              </p>

              {/* Social Media Icons */}
              <div className="flex items-center gap-3 pt-1 text-[#94A3B8]">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#04182B] border border-[#00D9FF]/20 flex items-center justify-center hover:text-[#00D9FF] hover:border-[#00D9FF] transition-all"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#04182B] border border-[#00D9FF]/20 flex items-center justify-center hover:text-[#00D9FF] hover:border-[#00D9FF] transition-all"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.76v8.37H6.46v-8.37M7.84 6.2a1.62 1.62 0 1 0 1.62 1.62A1.62 1.62 0 0 0 7.84 6.2z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#04182B] border border-[#00D9FF]/20 flex items-center justify-center hover:text-[#00D9FF] hover:border-[#00D9FF] transition-all"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#04182B] border border-[#00D9FF]/20 flex items-center justify-center hover:text-[#00D9FF] hover:border-[#00D9FF] transition-all"
                  aria-label="X"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#04182B] border border-[#00D9FF]/20 flex items-center justify-center hover:text-[#00D9FF] hover:border-[#00D9FF] transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links Column (Cols 5-6) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#94A3B8]">
                <li>
                  <button
                    onClick={() => onNavigateHome && onNavigateHome('home')}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateHome && onNavigateHome('protection')}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    Protection
                  </button>
                </li>
                <li>
                  <button
                    onClick={onNavigateHowItWorks}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={onNavigateAbout}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('overview')}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    Dashboard
                  </button>
                </li>
              </ul>
            </div>

            {/* Our Tools Column (Cols 7-8) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono">
                Our Tools
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#94A3B8]">
                <li>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('scanner', 'url')}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    URL Scanner
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('scanner', 'file')}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    File Scanner
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('scanner', 'qr')}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    QR Scanner
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('scanner', 'phone')}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    Phone Checker
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('scanner', 'email')}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    Email & Message
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('social')}
                    className="text-[#00D9FF] font-semibold cursor-pointer text-left"
                  >
                    SocialShield AI
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources Column (Cols 9-10) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono">
                Resources
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#94A3B8]">
                <li>
                  <button
                    onClick={() => setActiveLegalModal('security-tips')}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    Security Tips
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveLegalModal('privacy')}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveLegalModal('terms')}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveLegalModal('documentation')}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveLegalModal('support')}
                    className="hover:text-[#00D9FF] transition-colors cursor-pointer text-left"
                  >
                    Help & Support
                  </button>
                </li>
              </ul>
            </div>

            {/* Stay Updated Column (Cols 11-12) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono">
                Stay Updated
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Get the latest security tips, updates, and features.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-1">
                <div className="relative">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value)
                      if (newsletterStatus !== 'idle') setNewsletterStatus('idle')
                    }}
                    placeholder="Enter your email"
                    className="w-full bg-[#04182B] border border-[#00D9FF]/30 rounded-xl pl-3 pr-10 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.25)] transition-all font-sans"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#00D9FF] text-[#020B16] hover:bg-[#38BDF8] transition-all cursor-pointer shadow-sm"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {newsletterStatus === 'invalid' && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#EF4444] font-medium pt-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>Please enter a valid email address.</span>
                  </div>
                )}

                {newsletterStatus === 'success' && (
                  <div className="flex items-start gap-1.5 text-[11px] text-[#00D9FF] font-medium pt-1 bg-[#04182B] p-2 rounded-lg border border-[#00D9FF]/30">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>Thank you for subscribing! Threat advisories will be sent to your inbox.</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
            <p>© 2026 PhishShield AI. All rights reserved.</p>

            <div className="flex items-center gap-2 text-[#00D9FF] font-medium tracking-wide">
              <Shield className="h-4 w-4" />
              <span>Stay Safe Online. Think Before You Click.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal & Resource Modal */}
      <LegalModal
        type={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />
    </div>
  )
}
