import React, { useState, useEffect, useRef } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Phone,
  Search,
  AtSign,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  Info,
  Sparkles,
  Users,
  Radio,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import { api, type SocialScanResponse } from '../../services/api'
import { RiskReport } from './RiskReport'
import { LegalModal, type LegalModalType } from '../common/LegalModal'
import { PhishShieldLogo } from '../common/PhishShieldLogo'

interface CountryCode {
  code: string
  dial: string
  name: string
  flag: string
}

const COUNTRY_CODES: CountryCode[] = [
  { code: 'IN', dial: '+91', name: 'India', flag: '🇮🇳' },
  { code: 'US', dial: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', dial: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', dial: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', dial: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: 'AE', dial: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'DE', dial: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', dial: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'SG', dial: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: 'JP', dial: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: 'BR', dial: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: 'ZA', dial: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: 'NG', dial: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'PK', dial: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'BD', dial: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'ID', dial: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'SA', dial: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'MY', dial: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'NL', dial: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NZ', dial: '+64', name: 'New Zealand', flag: '🇳🇿' },
]

interface PlatformConfigDetail {
  id: 'whatsapp' | 'instagram' | 'facebook' | 'x' | 'youtube' | 'snapchat'
  name: string
  analysisWord: string
  accentColor: string
  secondaryColor: string
  borderColor: string
  glowColor: string
  bgGradient: string
  tagline: string
  description: string
  tags: string[]
  hudBadges: string[]
  inputHeading: string
  inputSubtitle: string
  inputPlaceholder: string
  inputLabel: string
  inputType: 'phone' | 'handle'
  buttonText: string
  helperText: string
  insightCards: Array<{
    title: string
    description: string
    iconType: 'shield' | 'search' | 'link' | 'check' | 'alert' | 'user'
  }>
  samples: Array<{
    label: string
    handle: string
    bio?: string
  }>
}

const PLATFORM_CONFIGS: Record<string, PlatformConfigDetail> = {
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    analysisWord: 'Analysis',
    accentColor: '#25D366',
    secondaryColor: '#00D9FF',
    borderColor: 'border-[#25D366]/40',
    glowColor: 'shadow-[0_0_35px_rgba(37,211,102,0.25)]',
    bgGradient: 'from-[#25D366]/20 via-[#04182B] to-[#020B16]',
    tagline: 'Instant Messaging & Direct Contact Verification',
    description:
      'Verify unknown WhatsApp numbers, detect impersonation attempts, and evaluate scam indicators using heuristic intelligence.',
    tags: [
      'Spam & Fraud Detection',
      'Profile Verification',
      'Link & Risk Analysis',
      'Safety Recommendations',
    ],
    hudBadges: [
      'Profile Info',
      'Number Reputation',
      'Possible Scams',
      'Public Data',
      'Risk Indicators',
      'Safety Insights',
    ],
    inputHeading: 'Enter a WhatsApp Number',
    inputSubtitle: 'Enter the complete phone number with country code to start the heuristic safety scan.',
    inputPlaceholder: 'e.g. 98765 43210 or 800 555 0199',
    inputLabel: 'Phone Number',
    inputType: 'phone',
    buttonText: 'Analyse Number',
    helperText:
      'We will analyse this number\'s reputation, format validity, country origin, and known fraud reports using public datasets and heuristic algorithms.',
    insightCards: [
      {
        title: 'Number Reputation',
        description: 'Checks if the number has been reported for spam, fraud, or suspicious activities.',
        iconType: 'alert',
      },
      {
        title: 'Profile Insights',
        description: 'Gathers publicly available information like business status and display details.',
        iconType: 'user',
      },
      {
        title: 'Linked Information',
        description: 'Detects if this number is associated with known scams, phishing campaigns, or leaked records.',
        iconType: 'link',
      },
      {
        title: 'Safety Recommendations',
        description: 'Provides actionable advice on whether to trust, block, or report this contact.',
        iconType: 'shield',
      },
    ],
    samples: [
      {
        label: 'Toll-Free Imposter',
        handle: '+1 800 555 0199',
        bio: 'Bank Fraud Department Alert. Call urgently to prevent card block.',
      },
      {
        label: 'Suspicious Short Number',
        handle: '+123',
        bio: 'Customer service hotline.',
      },
      {
        label: 'Support Desk Imposter',
        handle: '+91 98765 43210',
        bio: 'Official Support Verification Desk.',
      },
    ],
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    analysisWord: 'Analysis',
    accentColor: '#E1306C',
    secondaryColor: '#FD1D1D',
    borderColor: 'border-[#E1306C]/40',
    glowColor: 'shadow-[0_0_35px_rgba(225,48,108,0.25)]',
    bgGradient: 'from-[#E1306C]/20 via-[#04182B] to-[#020B16]',
    tagline: 'Visual Profile & Brand Clone Heuristic Engine',
    description:
      'Audit Instagram handles and profiles for lookalike impersonation, credential harvesting links, and deceptive brand mimics.',
    tags: [
      'Account Authenticity',
      'Homoglyph Deception',
      'Credential Harvesting',
      'Brand Impersonation',
    ],
    hudBadges: [
      'Handle Authenticity',
      'Homoglyph Check',
      'Bio Scam Signals',
      'Follower Heuristics',
      'Phishing Links',
      'Trust Score',
    ],
    inputHeading: 'Enter an Instagram Handle or URL',
    inputSubtitle: 'Enter the Instagram username (with or without @) or full profile URL to evaluate risk.',
    inputPlaceholder: 'e.g. meta_support_official or https://instagram.com/user',
    inputLabel: 'Instagram Username or Profile URL',
    inputType: 'handle',
    buttonText: 'Analyse Profile',
    helperText:
      'We evaluate handle syntax, corporate impersonation suffixes, homoglyph character substitutions, and bio lures using heuristic algorithms.',
    insightCards: [
      {
        title: 'Account Authenticity',
        description: 'Analyzes handle patterns, character substitutions, and lookalike brand impersonation.',
        iconType: 'user',
      },
      {
        title: 'Bio & Content Risk',
        description: 'Scans bio text for urgent financial lures, fake support claims, and suspicious URLs.',
        iconType: 'alert',
      },
      {
        title: 'Engagement Signals',
        description: 'Evaluates account age heuristics, suspicious follower patterns, and bot signatures.',
        iconType: 'link',
      },
      {
        title: 'Safety Recommendations',
        description: 'Actionable advice on whether to block, report, or avoid interacting with the profile.',
        iconType: 'shield',
      },
    ],
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
      {
        label: 'Homoglyph Spoof',
        handle: 'instagrarn_security_team',
        bio: 'Urgent: Your account violates copyright. Verify identity here.',
      },
    ],
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    analysisWord: 'Analysis',
    accentColor: '#1877F2',
    secondaryColor: '#00D9FF',
    borderColor: 'border-[#1877F2]/40',
    glowColor: 'shadow-[0_0_35px_rgba(24,119,242,0.25)]',
    bgGradient: 'from-[#1877F2]/20 via-[#04182B] to-[#020B16]',
    tagline: 'Social Graph & Imposter Page Integrity Scanner',
    description:
      'Inspect Facebook pages and profiles for unauthorized brand cloning, fake copyright infringement notices, and deceptive support scams.',
    tags: [
      'Page Integrity',
      'Copyright Phishing',
      'Support Desk Imposter',
      'Malicious Ads Check',
    ],
    hudBadges: [
      'Page Integrity',
      'Copyright Traps',
      'Clone Detection',
      'Malicious Links',
      'Messenger Scams',
      'Safety Rating',
    ],
    inputHeading: 'Enter a Facebook Profile, Page, or URL',
    inputSubtitle: 'Enter the Facebook page handle or URL to inspect for impersonation patterns and phishing lures.',
    inputPlaceholder: 'e.g. meta_security_center_notice or https://facebook.com/profile',
    inputLabel: 'Facebook Page Handle or Profile URL',
    inputType: 'handle',
    buttonText: 'Analyse Profile',
    helperText:
      'We evaluate page nomenclature, fake legal threats, credential harvesting patterns, and homoglyphs using multi-layer heuristics.',
    insightCards: [
      {
        title: 'Page & Profile Integrity',
        description: 'Verifies official page markers, name change patterns, and brand mimicking.',
        iconType: 'user',
      },
      {
        title: 'Urgent Lure Detection',
        description: 'Detects fake copyright warnings, urgent support notices, and password reset traps.',
        iconType: 'alert',
      },
      {
        title: 'Community Safety Checks',
        description: 'Assesses reports of scam ads, malicious messenger DMs, and phishing links.',
        iconType: 'link',
      },
      {
        title: 'Safety Recommendations',
        description: 'Clear steps to report imposter pages and protect your account from malicious links.',
        iconType: 'shield',
      },
    ],
    samples: [
      {
        label: 'Security Notice Scam',
        handle: 'meta_security_update_center',
        bio: 'Official notice: Copyright violation detected on your page. Verify within 24h or page deleted.',
      },
      {
        label: 'Support Desk Bot',
        handle: 'facebook_official_support_desk',
        bio: 'Customer service agent online 24/7.',
      },
      {
        label: 'Brand Mimic',
        handle: 'paypal_resolution_center_online',
        bio: 'Account temporarily limited. Re-authenticate via messenger.',
      },
    ],
  },
  x: {
    id: 'x',
    name: 'X (Twitter)',
    analysisWord: 'Analysis',
    accentColor: '#00D9FF',
    secondaryColor: '#FFFFFF',
    borderColor: 'border-[#00D9FF]/40',
    glowColor: 'shadow-[0_0_35px_rgba(0,217,255,0.25)]',
    bgGradient: 'from-[#00D9FF]/20 via-[#04182B] to-[#020B16]',
    tagline: 'Real-time Microblog Impersonation & Crypto Lure Scanner',
    description:
      'Detect crypto giveaway lures, homoglyph account clones, automated spam bots, and counterfeit customer support handles on X.',
    tags: [
      'Crypto Doubling Lures',
      'Homoglyph Spoofing',
      'Bot Network Heuristics',
      'Airdrop Scams',
    ],
    hudBadges: [
      'Crypto Lure Radar',
      'Homoglyph Match',
      'Burner Suffixes',
      'Support Bot Check',
      'Airdrop Phishing',
      'Heuristic Rating',
    ],
    inputHeading: 'Enter an X (Twitter) Handle or Profile URL',
    inputSubtitle: 'Enter the @handle or URL to detect fake verification claims, giveaway traps, and bot signatures.',
    inputPlaceholder: 'e.g. @elonmusk_airdrop_giveaway24 or username',
    inputLabel: 'X (Twitter) Handle or Profile URL',
    inputType: 'handle',
    buttonText: 'Analyse Profile',
    helperText:
      'We evaluate handle permutations, crypto doubling claims, automated trailing digit signatures, and deceptive support lures.',
    insightCards: [
      {
        title: 'Impersonation & Homoglyphs',
        description: 'Identifies homoglyph spoofing, fake verification claims, and brand clones.',
        iconType: 'alert',
      },
      {
        title: 'Crypto & Financial Lures',
        description: 'Detects giveaway scams, doubling schemes, and unauthorized support bot replies.',
        iconType: 'link',
      },
      {
        title: 'Bot Network Heuristics',
        description: 'Evaluates handle naming conventions, rapid reply patterns, and spam behaviors.',
        iconType: 'user',
      },
      {
        title: 'Safety Recommendations',
        description: 'Direct guidance on reporting the handle and avoiding wallet drainers.',
        iconType: 'shield',
      },
    ],
    samples: [
      {
        label: 'Crypto Giveaway Lure',
        handle: 'elonmusk_airdrop_giveaway24',
        bio: 'Tesla & SpaceX. Giving away 5,000 ETH to celebrate launch. Send 0.1 ETH to receive 1.0 ETH back instantly.',
      },
      {
        label: 'Exchange Support Imposter',
        handle: 'binance_support_official9942',
        bio: 'Official Binance 24/7 Live Agent. Connect wallet to recover frozen funds.',
      },
      {
        label: 'Homoglyph Clone',
        handle: 'coinba0se_helpdesk',
        bio: 'Official Customer Assistance Desk for Wallet Transfers.',
      },
    ],
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    analysisWord: 'Analysis',
    accentColor: '#FF0000',
    secondaryColor: '#FF4B4B',
    borderColor: 'border-[#FF0000]/40',
    glowColor: 'shadow-[0_0_35px_rgba(255,0,0,0.25)]',
    bgGradient: 'from-[#FF0000]/20 via-[#04182B] to-[#020B16]',
    tagline: 'Video Channel & Livestream Scam Heuristic Inspector',
    description:
      'Audit YouTube channels for hijacked live streams, fake crypto doubling webinars, counterfeit brand channels, and description phishing links.',
    tags: [
      'Hijacked Livestreams',
      'QR Code Scam Streams',
      'Fake Keynotes',
      'Malicious Link Prompts',
    ],
    hudBadges: [
      'Channel Authenticity',
      'Stream Lure Check',
      'Description Links',
      'Fake Verification',
      'QR Hijack Detection',
      'Safety Assessment',
    ],
    inputHeading: 'Enter a YouTube Channel Handle or URL',
    inputSubtitle: 'Enter the channel @handle or YouTube URL to evaluate stream authenticity and description risk.',
    inputPlaceholder: 'e.g. @tesla_livestream_giveaway or https://youtube.com/@channel',
    inputLabel: 'YouTube Channel Handle or Channel URL',
    inputType: 'handle',
    buttonText: 'Analyse Channel',
    helperText:
      'We inspect channel handle naming conventions, malicious redirection URLs, livestream scam patterns, and giveaway heuristics.',
    insightCards: [
      {
        title: 'Channel Authenticity',
        description: 'Assesses hijacked channel signs, altered branding, and fake corporate streaming.',
        iconType: 'user',
      },
      {
        title: 'Description & Link Safety',
        description: 'Scans channel and video descriptions for malicious redirect URLs and QR codes.',
        iconType: 'link',
      },
      {
        title: 'Scam Content Signals',
        description: 'Identifies crypto doubling streams, fake software crack giveaways, and spoofed comments.',
        iconType: 'alert',
      },
      {
        title: 'Safety Recommendations',
        description: 'Guidance on flagging counterfeit channels and safe viewing practices.',
        iconType: 'shield',
      },
    ],
    samples: [
      {
        label: 'Livestream Giveaway Hijack',
        handle: 'tesla_live_crypto_double',
        bio: 'Official Tesla AI Keynote Livestream. QR Code scan to claim double Bitcoin bonus.',
      },
      {
        label: 'Tech Support Imposter',
        handle: 'google_support_official_help',
        bio: 'Official Google Account Recovery Desk. Contact agent immediately.',
      },
      {
        label: 'Software Crack Phish',
        handle: 'crack_photoshop_2026_free',
        bio: 'Free software download link in description. Disable antivirus before running.',
      },
    ],
  },
  snapchat: {
    id: 'snapchat',
    name: 'Snapchat',
    analysisWord: 'Analysis',
    accentColor: '#FFFC00',
    secondaryColor: '#FFD700',
    borderColor: 'border-[#FFFC00]/40',
    glowColor: 'shadow-[0_0_35px_rgba(255,252,0,0.25)]',
    bgGradient: 'from-[#FFFC00]/20 via-[#04182B] to-[#020B16]',
    tagline: 'Ephemeral Identity & Username Permutation Scanner',
    description:
      'Evaluate Snapchat usernames for fake support imposters, quick-add spam bots, streak recovery fraud, and deceptive premium membership lures.',
    tags: [
      'Ephemeral Threat Check',
      'Streak Recovery Scams',
      'Support Impersonation',
      'Quick-Add Bot Patterns',
    ],
    hudBadges: [
      'Username Validity',
      'Support Mimic Check',
      'Streak Scam Radar',
      'Bot Suffix Patterns',
      'External Link Traps',
      'Heuristic Rating',
    ],
    inputHeading: 'Enter a Snapchat Username',
    inputSubtitle: 'Enter the Snapchat username to check for corporate imposter patterns and ephemeral fraud signals.',
    inputPlaceholder: 'e.g. snap_verify_support or username',
    inputLabel: 'Snapchat Username',
    inputType: 'handle',
    buttonText: 'Analyse Profile',
    helperText:
      'We analyse username permutations, fake security verification lures, automated burner patterns, and deceptive recovery claims.',
    insightCards: [
      {
        title: 'Username Legitimacy',
        description: 'Analyzes username permutations targeting customer support or official staff.',
        iconType: 'user',
      },
      {
        title: 'Ephemeral Threat Heuristics',
        description: 'Evaluates quick-add risk signals and external unverified link prompts.',
        iconType: 'alert',
      },
      {
        title: 'Fraud & Impersonation Indicators',
        description: 'Detects fake Snapchat support handles and streak recovery scams.',
        iconType: 'link',
      },
      {
        title: 'Safety Recommendations',
        description: 'Safe interaction advice and steps to block and report abusive accounts.',
        iconType: 'shield',
      },
    ],
    samples: [
      {
        label: 'Snap Support Scam',
        handle: 'snap_security_verify_desk',
        bio: 'Snapchat Account Security. Send snap code to verify account age.',
      },
      {
        label: 'Streak Recovery Bot',
        handle: 'official_snap_rewards24',
        bio: 'Add back to receive free premium streak restore.',
      },
      {
        label: 'Imposter Staff',
        handle: 'snapchat_support_help_desk',
        bio: 'Official customer service representative online.',
      },
    ],
  },
}

// Custom Platform Glyphs
const PlatformEmblem: React.FC<{ platformId: string; className?: string }> = ({
  platformId,
  className = 'w-6 h-6',
}) => {
  switch (platformId) {
    case 'whatsapp':
      return <Phone className={`${className} fill-white text-white`} />
    case 'instagram':
      return (
        <svg className={`${className} fill-none stroke-white stroke-[2]`} viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    case 'facebook':
      return <span className={`${className} font-black text-2xl leading-none text-white flex items-center justify-center`}>f</span>
    case 'x':
      return <span className={`${className} font-black text-xl leading-none text-white flex items-center justify-center`}>✕</span>
    case 'youtube':
      return (
        <svg className={`${className} fill-white`} viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    case 'snapchat':
      return (
        <svg className={`${className} fill-white stroke-black stroke-[1.5]`} viewBox="0 0 24 24">
          <path d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 3 1 4-.5 1-2 1.5-2.5 2 0 0 1 .5 2.5.5.5 1 2 2.5 5 2.5s4.5-1.5 5-2.5c1.5 0 2.5-.5 2.5-.5-.5-.5-2-1-2.5-2 .5-1 1-2.5 1-4 0-3.5-2.5-6-6-6z" />
        </svg>
      )
    default:
      return <Shield className={className} />
  }
}

interface PlatformAnalysisViewProps {
  platformId: 'whatsapp' | 'instagram' | 'facebook' | 'x' | 'youtube' | 'snapchat'
  onBack: () => void
  onNavigateTab?: (tabId: string, scannerTool?: string) => void
  onNavigateHome?: (sectionId?: string) => void
  onNavigateHowItWorks?: () => void
  onNavigateAbout?: () => void
}

export const PlatformAnalysisView: React.FC<PlatformAnalysisViewProps> = ({
  platformId,
  onBack,
  onNavigateTab,
  onNavigateHome,
  onNavigateHowItWorks,
  onNavigateAbout,
}) => {
  const config = PLATFORM_CONFIGS[platformId] || PLATFORM_CONFIGS.whatsapp

  // Form Inputs
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]) // Default +91 India
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [identifierInput, setIdentifierInput] = useState('')
  const [profileBioInput, setProfileBioInput] = useState('')
  const [showOptionalBio, setShowOptionalBio] = useState(false)

  // Scan lifecycle states
  const [scanLoading, setScanLoading] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<SocialScanResponse | null>(null)

  // Footer & Legal
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'invalid' | 'success'>('idle')
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null)

  // Close country dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCountries = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dial.includes(countrySearch) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const handleExecuteScan = async () => {
    let target = identifierInput.trim()
    if (!target) {
      setScanError(
        config.inputType === 'phone'
          ? 'Please enter a valid phone number (e.g. 98765 43210 or +1 800 555 0199).'
          : `Please enter a valid ${config.name} username, handle, or profile URL.`
      )
      return
    }

    // If WhatsApp and no leading '+', prepend selected dial code
    if (config.inputType === 'phone') {
      if (!target.startsWith('+')) {
        // Strip leading zeros if present
        const cleanDigits = target.replace(/^[0\s]+/, '')
        target = `${selectedCountry.dial}${cleanDigits}`
      }
    }

    setScanLoading(true)
    setScanError(null)

    try {
      const response = await api.scanSocial(config.id, target, profileBioInput.trim())
      setScanResult(response)
      // Smooth scroll down to results
      setTimeout(() => {
        const el = document.getElementById('ps-analysis-results-area')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (err: any) {
      setScanError(err.message || `${config.name} analysis failed. Please verify network connectivity.`)
    } finally {
      setScanLoading(false)
    }
  }

  const handleApplySample = (sample: { handle: string; bio?: string }) => {
    if (config.inputType === 'phone') {
      // Check if sample starts with dial code
      const match = COUNTRY_CODES.find((c) => sample.handle.startsWith(c.dial))
      if (match) {
        setSelectedCountry(match)
        setIdentifierInput(sample.handle.slice(match.dial.length).trim())
      } else {
        setIdentifierInput(sample.handle)
      }
    } else {
      setIdentifierInput(sample.handle)
    }

    if (sample.bio) {
      setProfileBioInput(sample.bio)
      setShowOptionalBio(true)
    }
    setScanError(null)
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
    <div className="space-y-12 max-w-[1536px] mx-auto select-none px-2 sm:px-4">
      {/* Keyframe & Reduced Motion Styles */}
      <style>{`
        @keyframes psPulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes psScanBeam {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes psDeviceFloat {
          0%, 100% { transform: perspective(1000px) rotateY(-10deg) rotateX(4deg) translateY(0px); }
          50% { transform: perspective(1000px) rotateY(-6deg) rotateX(2deg) translateY(-8px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ps-device-float, .ps-scan-beam, .ps-pulse-glow {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* ======================================================== */}
      {/* 1. TOP NAVIGATION: BACK BUTTON                           */}
      {/* ======================================================== */}
      <div className="pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#04182B] border border-[#00D9FF]/30 hover:border-[#00D9FF] text-[#00D9FF] hover:text-white transition-all text-xs font-semibold shadow-[0_0_15px_rgba(0,217,255,0.15)] group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Social Media Platforms</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. HERO SECTION: 2-COLUMN COPY & HOLOGRAPHIC SMARTPHONE  */}
      {/* ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Platform Branding, Headline, Description & Tags */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Platform Pill with Icon */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
              style={{
                backgroundColor: config.id === 'instagram' ? 'transparent' : config.accentColor,
                backgroundImage:
                  config.id === 'instagram'
                    ? 'linear-gradient(45deg, #FD1D1D, #E1306C, #405DE6)'
                    : undefined,
              }}
            >
              <PlatformEmblem platformId={config.id} className="w-6 h-6" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF] text-[10px] font-mono tracking-wider uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
                <span>{config.tagline}</span>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">HEURISTIC DEFENSE RADAR</p>
            </div>
          </div>

          {/* Heading matching the reference screenshot */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F8FAFC] tracking-tight leading-[1.15]">
            {config.name}{' '}
            <span
              style={{ color: config.accentColor }}
              className="drop-shadow-[0_0_20px_rgba(0,217,255,0.35)]"
            >
              {config.analysisWord}
            </span>
          </h1>

          {/* Short Description */}
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-xl">
            {config.description}
          </p>

          {/* 4 Feature / Risk Badges */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            {config.tags.map((tag, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#04182B]/80 border border-[#00D9FF]/20 text-[#CBD5E1] text-xs font-medium backdrop-blur-sm shadow-sm"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: config.accentColor }}
                />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 3D Holographic Device Mockup Flanked by 6 Floating HUD Badges */}
        <div className="lg:col-span-5 flex items-center justify-center py-6 relative select-none overflow-visible">
          <div className="relative w-[340px] sm:w-[400px] lg:w-[440px] h-[430px] flex items-center justify-center">
            {/* Ambient Platform Glow Behind Device */}
            <div
              className="ps-pulse-glow absolute w-72 h-72 rounded-full blur-3xl pointer-events-none"
              style={{
                backgroundColor: config.accentColor,
                opacity: 0.25,
                animation: 'psPulseGlow 6s ease-in-out infinite',
              }}
            />

            {/* Concentric 3D Perspective Cyber Pedestal at Base */}
            <div
              className="absolute bottom-2 w-72 sm:w-80 h-28 pointer-events-none"
              style={{ transform: 'perspective(600px) rotateX(68deg)' }}
            >
              <div
                className="absolute inset-0 rounded-full border-2 shadow-[0_0_24px_rgba(0,217,255,0.6)] animate-pulse"
                style={{ borderColor: config.accentColor }}
              />
              <div className="absolute inset-3 rounded-full border border-[#00D9FF]/40" />
              <div className="absolute inset-6 rounded-full border border-dashed border-[#00D9FF]/30 animate-[spin_40s_linear_infinite]" />
              <div
                className="absolute inset-10 rounded-full blur-sm"
                style={{ backgroundColor: `${config.accentColor}30` }}
              />
            </div>

            {/* Tilted 3D Holographic Smartphone Chassis */}
            <div
              className="ps-device-float relative z-10 w-44 sm:w-48 h-80 sm:h-88 rounded-[32px] p-2.5 bg-gradient-to-b from-[#0B253D] via-[#04182B] to-[#020B16] border-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              style={{
                borderColor: config.accentColor,
                animation: 'psDeviceFloat 6s ease-in-out infinite',
              }}
            >
              {/* Inner Screen Bezel */}
              <div className="relative w-full h-full rounded-[24px] bg-[#020B16] border border-[#00D9FF]/30 overflow-hidden flex flex-col items-center justify-between p-3">
                {/* Top Phone Speaker & Camera Notch */}
                <div className="w-20 h-4 rounded-full bg-[#061426] border border-[#00D9FF]/20 flex items-center justify-center gap-1.5 shrink-0 z-20">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
                  <div className="w-6 h-1 rounded-full bg-[#94A3B8]/40" />
                </div>

                {/* Center Holographic Stage: Concentric Rings + Shield + Platform Emblem */}
                <div className="relative my-auto w-32 h-32 flex items-center justify-center">
                  {/* Concentric Cyber Rings */}
                  <div
                    className="absolute inset-0 rounded-full border border-dashed animate-[spin_25s_linear_infinite]"
                    style={{ borderColor: `${config.accentColor}50` }}
                  />
                  <div className="absolute inset-3 rounded-full border border-[#00D9FF]/40" />
                  <div
                    className="absolute inset-6 rounded-full blur-md"
                    style={{ backgroundColor: `${config.accentColor}35` }}
                  />

                  {/* Shield SVG in Background */}
                  <svg className="absolute w-28 h-28 text-[#00D9FF]/40" viewBox="0 0 100 120" fill="none">
                    <path
                      d="M50 8 L88 24 C88 64 68 96 50 112 C32 96 12 64 12 24 Z"
                      stroke="#00D9FF"
                      strokeWidth="2"
                      fill="#00D9FF"
                      fillOpacity="0.08"
                    />
                  </svg>

                  {/* Platform Emblem in Foreground */}
                  <div
                    className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: config.id === 'instagram' ? 'transparent' : config.accentColor,
                      backgroundImage:
                        config.id === 'instagram'
                          ? 'linear-gradient(45deg, #FD1D1D, #E1306C, #405DE6)'
                          : undefined,
                    }}
                  >
                    <PlatformEmblem platformId={config.id} className="w-7 h-7" />
                  </div>

                  {/* Holographic Scan Beam */}
                  <div
                    className="ps-scan-beam absolute inset-x-0 h-1 blur-[1px] pointer-events-none"
                    style={{
                      backgroundColor: config.accentColor,
                      animation: 'psScanBeam 3s linear infinite',
                    }}
                  />
                </div>

                {/* Bottom Status Bar on Phone Display */}
                <div className="w-full text-center space-y-0.5 shrink-0 z-20 pb-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#04182B] border border-[#00D9FF]/30 text-[9px] font-mono text-[#00D9FF]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
                    <span>DEFENSE ACTIVE</span>
                  </div>
                  <p className="text-[8px] font-mono text-[#94A3B8] tracking-widest uppercase">
                    PHISHSHIELD AI
                  </p>
                </div>
              </div>
            </div>

            {/* 6 Floating Holographic HUD Badges Surrounding the Smartphone */}
            {/* Left 3 Badges */}
            <div className="absolute left-0 top-[12%] z-20 px-2.5 py-1.5 rounded-xl bg-[#04182B]/90 border border-[#00D9FF]/30 backdrop-blur-md shadow-lg text-[10px] font-mono text-[#F8FAFC] flex items-center gap-1.5 pointer-events-none hover:scale-105 transition-transform">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.accentColor }} />
              <span>{config.hudBadges[0]}</span>
            </div>

            <div className="absolute left-[-12px] sm:left-[-16px] top-[43%] z-20 px-2.5 py-1.5 rounded-xl bg-[#04182B]/90 border border-[#00D9FF]/30 backdrop-blur-md shadow-lg text-[10px] font-mono text-[#F8FAFC] flex items-center gap-1.5 pointer-events-none hover:scale-105 transition-transform">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
              <span>{config.hudBadges[1]}</span>
            </div>

            <div className="absolute left-0 top-[74%] z-20 px-2.5 py-1.5 rounded-xl bg-[#04182B]/90 border border-[#00D9FF]/30 backdrop-blur-md shadow-lg text-[10px] font-mono text-[#F8FAFC] flex items-center gap-1.5 pointer-events-none hover:scale-105 transition-transform">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span>{config.hudBadges[2]}</span>
            </div>

            {/* Right 3 Badges */}
            <div className="absolute right-0 top-[12%] z-20 px-2.5 py-1.5 rounded-xl bg-[#04182B]/90 border border-[#00D9FF]/30 backdrop-blur-md shadow-lg text-[10px] font-mono text-[#F8FAFC] flex items-center gap-1.5 pointer-events-none hover:scale-105 transition-transform">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
              <span>{config.hudBadges[3]}</span>
            </div>

            <div className="absolute right-[-12px] sm:right-[-16px] top-[43%] z-20 px-2.5 py-1.5 rounded-xl bg-[#04182B]/90 border border-[#00D9FF]/30 backdrop-blur-md shadow-lg text-[10px] font-mono text-[#F8FAFC] flex items-center gap-1.5 pointer-events-none hover:scale-105 transition-transform">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span>{config.hudBadges[4]}</span>
            </div>

            <div className="absolute right-0 top-[74%] z-20 px-2.5 py-1.5 rounded-xl bg-[#04182B]/90 border border-[#00D9FF]/30 backdrop-blur-md shadow-lg text-[10px] font-mono text-[#F8FAFC] flex items-center gap-1.5 pointer-events-none hover:scale-105 transition-transform">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.accentColor }} />
              <span>{config.hudBadges[5]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. ANALYSIS INPUT PANEL: MATCHING THE BLUEPRINT           */}
      {/* ======================================================== */}
      <section
        className={`rounded-3xl bg-[#04182B] border ${config.borderColor} p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.6)] space-y-6 relative overflow-visible`}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -top-20 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: `${config.accentColor}15` }}
        />

        {/* Panel Header */}
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md"
              style={{
                backgroundColor: config.id === 'instagram' ? 'transparent' : config.accentColor,
                backgroundImage:
                  config.id === 'instagram'
                    ? 'linear-gradient(45deg, #FD1D1D, #E1306C, #405DE6)'
                    : undefined,
              }}
            >
              <PlatformEmblem platformId={config.id} className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
              {config.inputHeading}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] ml-11">
            {config.inputSubtitle}
          </p>
        </div>

        {/* Input Form Row */}
        <div className="space-y-4 relative z-10">
          {config.inputType === 'phone' ? (
            /* WhatsApp: Country Code Selector Dropdown + Phone Input + Button */
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              {/* Country Code Selector */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="w-full md:w-44 h-12 px-3.5 rounded-xl bg-[#061426] border border-[#00D9FF]/30 hover:border-[#00D9FF] flex items-center justify-between gap-2 text-sm text-[#F8FAFC] font-mono transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-base">{selectedCountry.flag}</span>
                    <span className="font-bold text-[#00D9FF]">{selectedCountry.dial}</span>
                    <span className="text-xs text-[#94A3B8] truncate">{selectedCountry.name}</span>
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
                </button>

                {/* Country Code Popover */}
                {showCountryDropdown && (
                  <div className="absolute top-14 left-0 w-72 max-h-64 overflow-y-auto bg-[#04182B] border border-[#00D9FF]/40 rounded-2xl p-2 shadow-[0_10px_35px_rgba(0,0,0,0.8)] z-50 space-y-1">
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Search country or code..."
                      className="w-full px-3 py-1.5 text-xs bg-[#061426] border border-[#00D9FF]/30 rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] font-sans mb-1"
                    />
                    <div className="space-y-0.5">
                      {filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c)
                            setShowCountryDropdown(false)
                            setCountrySearch('')
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-colors cursor-pointer ${
                            selectedCountry.code === c.code
                              ? 'bg-[#00D9FF]/20 text-[#00D9FF] font-bold'
                              : 'text-[#CBD5E1] hover:bg-[#061426]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{c.flag}</span>
                            <span>{c.name}</span>
                          </span>
                          <span className="text-[#00D9FF]">{c.dial}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Digits Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={identifierInput}
                  onChange={(e) => {
                    setIdentifierInput(e.target.value)
                    if (scanError) setScanError(null)
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleExecuteScan()}
                  placeholder={config.inputPlaceholder}
                  className="w-full h-12 bg-[#061426] border border-[#00D9FF]/30 rounded-xl px-4 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] font-mono shadow-inner"
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleExecuteScan}
                disabled={scanLoading || !identifierInput.trim()}
                className="h-12 px-7 rounded-xl font-bold text-sm text-[#020B16] shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer hover:brightness-110 active:scale-[0.98]"
                style={{
                  backgroundColor: '#00D9FF',
                  boxShadow: '0 0 20px rgba(0,217,255,0.4)',
                }}
              >
                {scanLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#020B16]" />
                    <span>Analysing...</span>
                  </>
                ) : (
                  <>
                    <span>{config.buttonText}</span>
                    <ArrowRight className="w-4 h-4 text-[#020B16]" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Other Platforms: Handle / Username Input + Action Button + Optional Bio Expand */
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]">
                    <AtSign className="w-4 h-4 text-[#00D9FF]" />
                  </div>
                  <input
                    type="text"
                    value={identifierInput}
                    onChange={(e) => {
                      setIdentifierInput(e.target.value)
                      if (scanError) setScanError(null)
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleExecuteScan()}
                    placeholder={config.inputPlaceholder}
                    className="w-full h-12 bg-[#061426] border border-[#00D9FF]/30 rounded-xl pl-10 pr-4 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] font-mono shadow-inner"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleExecuteScan}
                  disabled={scanLoading || !identifierInput.trim()}
                  className="h-12 px-7 rounded-xl font-bold text-sm text-[#020B16] shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer hover:brightness-110 active:scale-[0.98]"
                  style={{
                    backgroundColor: '#00D9FF',
                    boxShadow: '0 0 20px rgba(0,217,255,0.4)',
                  }}
                >
                  {scanLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#020B16]" />
                      <span>Analysing...</span>
                    </>
                  ) : (
                    <>
                      <span>{config.buttonText}</span>
                      <ArrowRight className="w-4 h-4 text-[#020B16]" />
                    </>
                  )}
                </button>
              </div>

              {/* Optional Profile Bio / Direct Message Text Area Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowOptionalBio(!showOptionalBio)}
                  className="text-xs text-[#00D9FF] hover:underline inline-flex items-center gap-1 font-mono cursor-pointer"
                >
                  <span>{showOptionalBio ? '− Hide' : '+ Add'} Profile Bio / Message / Description (Optional)</span>
                </button>

                {showOptionalBio && (
                  <div className="pt-2 animate-fadeIn">
                    <textarea
                      rows={3}
                      value={profileBioInput}
                      onChange={(e) => setProfileBioInput(e.target.value)}
                      placeholder="Paste bio description, crypto claims, or DM outreach to test for urgent financial lures..."
                      className="w-full bg-[#061426] border border-[#00D9FF]/30 rounded-xl p-3 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] font-mono resize-none shadow-inner"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Validation Error Banner */}
          {scanError && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{scanError}</span>
            </div>
          )}

          {/* Helper Text below Input */}
          <div className="flex items-start gap-2 text-xs text-[#94A3B8] leading-relaxed pt-1">
            <Info className="w-4 h-4 text-[#00D9FF] shrink-0 mt-0.5" />
            <span>{config.helperText}</span>
          </div>

          {/* Pre-filled Test Samples Pill Buttons */}
          <div className="pt-2 border-t border-[#00D9FF]/10 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase text-[#94A3B8]">
                One-Click Test Samples:
              </span>
              {config.samples.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplySample(s)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#061B30] border border-[#00D9FF]/20 hover:border-[#00D9FF]/60 text-[#CBD5E1] hover:text-[#00D9FF] transition-all font-mono cursor-pointer"
                >
                  {s.label}: <span className="text-[#00D9FF] font-semibold">{s.handle}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FOUR INSIGHT CARDS: HORIZONTAL ROW                     */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {config.insightCards.map((card, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#04182B] border border-[#00D9FF]/20 hover:border-[#00D9FF]/50 transition-all duration-300 shadow-md space-y-3 group hover:-translate-y-0.5"
            >
              {/* Card Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{
                  backgroundColor: `${config.accentColor}20`,
                  border: `1px solid ${config.accentColor}50`,
                  color: config.accentColor,
                }}
              >
                {card.iconType === 'alert' && <AlertTriangle className="w-4 h-4" />}
                {card.iconType === 'user' && <Users className="w-4 h-4" />}
                {card.iconType === 'link' && <Radio className="w-4 h-4" />}
                {card.iconType === 'shield' && <Shield className="w-4 h-4" />}
                {card.iconType === 'check' && <CheckCircle2 className="w-4 h-4" />}
                {card.iconType === 'search' && <Search className="w-4 h-4" />}
              </div>

              {/* Card Title & Description */}
              <div>
                <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-white">
                  {card.title}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. ANALYSIS RESULTS AREA                                  */}
      {/* ======================================================== */}
      <section id="ps-analysis-results-area" className="scroll-mt-6">
        {scanLoading ? (
          /* Loading State */
          <div className="rounded-3xl bg-[#04182B] border border-[#00D9FF]/40 p-12 text-center space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed animate-spin"
                style={{ borderColor: config.accentColor }}
              />
              <Loader2 className="w-8 h-8 text-[#00D9FF] animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                Evaluating {config.name} Target...
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono">
                Running heuristic lookalike analysis & fraud pattern indicators...
              </p>
            </div>
          </div>
        ) : scanResult ? (
          /* Results State */
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <h3 className="text-lg font-bold text-[#F8FAFC]">
                  {config.name} Analysis Completed
                </h3>
              </div>
              <button
                onClick={() => {
                  setScanResult(null)
                  setIdentifierInput('')
                  setProfileBioInput('')
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#061426] border border-[#00D9FF]/30 hover:border-[#00D9FF] text-xs font-mono text-[#00D9FF] hover:text-white transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Scan Another Target</span>
              </button>
            </div>

            <RiskReport
              title={`${config.name} Profile Assessment`}
              target={
                config.inputType === 'phone'
                  ? scanResult.identifier
                  : `@${scanResult.identifier} (${config.name.toUpperCase()})`
              }
              riskScore={scanResult.risk_score}
              riskCategory={scanResult.risk_category}
              findings={scanResult.findings}
              triggeredFindings={scanResult.triggered_findings}
              reasons={scanResult.reasons}
              recommendedActions={scanResult.recommended_actions}
              scannedAt={scanResult.scanned_at}
              analysisMethod={scanResult.analysis_method}
              limitations={scanResult.limitations}
              scanId={scanResult.scan_id}
              scannerType="social"
              metadata={{
                Platform: config.name,
                Assessment_Type: scanResult.account_type_assessed,
                Impersonation_Signals:
                  scanResult.impersonation_indicators.join(', ') || 'None Detected',
              }}
              onScanAnother={() => {
                setScanResult(null)
                setIdentifierInput('')
                setProfileBioInput('')
              }}
            />
          </div>
        ) : (
          /* Empty State (Before Scan) Matching the Reference Blueprint */
          <div className="rounded-3xl bg-[#04182B] border border-dashed border-[#00D9FF]/25 p-12 sm:p-16 text-center space-y-4 shadow-sm relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00D9FF]/[0.02] to-transparent pointer-events-none"
            />

            {/* Stylized Device Outline with Magnifier */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center shadow-inner"
                style={{
                  borderColor: `${config.accentColor}50`,
                  backgroundColor: `${config.accentColor}10`,
                }}
              >
                <PlatformEmblem platformId={config.id} className="w-8 h-8 opacity-75" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#00D9FF] flex items-center justify-center text-[#020B16] shadow-md">
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                Ready to Analyse {config.name} {config.inputType === 'phone' ? 'Number' : 'Profile'}
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Enter a {config.name.toLowerCase()} {config.inputType === 'phone' ? 'number' : 'handle'} above and click{' '}
                <span className="text-[#00D9FF] font-semibold">{config.buttonText}</span> to inspect risk indicators, lookalike patterns, and heuristic threat scores.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#061426] border border-[#00D9FF]/20 text-[10px] font-mono text-[#00D9FF]">
              <Sparkles className="w-3 h-3" />
              <span>Real-time Heuristic Threat Engine Ready</span>
            </div>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 6. FOOTER MATCHING THE REFERENCE BLUEPRINT              */}
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
                    onClick={onBack}
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
                Get the latest threat alerts & security intelligence.
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
                    className="w-full bg-[#04182B] border border-[#00D9FF]/30 rounded-xl pl-3 pr-10 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] transition-all font-sans"
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
                    <span>Thank you for subscribing!</span>
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
