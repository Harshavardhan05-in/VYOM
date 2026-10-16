import React, { useEffect } from 'react'
import {
  ShieldCheck,
  Zap,
  Users,
  Brain,
  Lock,
  Eye,
  Rocket,
} from 'lucide-react'
import { AboutNavbar } from './AboutNavbar'
import { AboutCyberHologram } from './AboutCyberHologram'

interface AboutUsPageProps {
  onNavigateHome: () => void
  onOpenDashboard: (tab?: string) => void
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onNavigateHome,
  onOpenDashboard,
}) => {
  // Ensure top scroll position when page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const handleSearch = (_query: string) => {
    onOpenDashboard('scanner')
  }

  return (
    <div className="min-h-screen bg-[#020B16] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#00D9FF]/25 selection:text-[#00D9FF]">
      {/* 1. Navbar — Matching Reference Screenshot */}
      <AboutNavbar
        onNavigateHome={onNavigateHome}
        onOpenDashboard={() => onOpenDashboard('overview')}
        onSearch={handleSearch}
      />

      {/* 2. Main Content Container */}
      <main className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-14 py-6 sm:py-8 lg:py-10 space-y-7 sm:space-y-9 flex-1">
        {/* ======================================================== */}
        {/* TOP SECTION: Three-Column Composition                   */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column — Introduction */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            {/* Outlined Badge */}
            <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-[rgba(0,217,255,0.35)] bg-[rgba(0,217,255,0.08)] text-[#00D9FF] text-[11px] font-mono font-semibold tracking-wider uppercase shadow-[0_0_12px_rgba(0,217,255,0.15)]">
              ABOUT PHISHIELD AI
            </div>

            {/* Large Two-Line Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#F8FAFC] leading-[1.18] tracking-tight">
              Our Mission is a <span className="text-[#00D9FF] drop-shadow-[0_0_16px_rgba(0,217,255,0.35)]">Safer</span>
              <br />
              <span className="text-[#00D9FF] drop-shadow-[0_0_16px_rgba(0,217,255,0.35)]">Digital World</span> for Everyone
            </h1>

            {/* Paragraph Description */}
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed max-w-xl">
              PhishShield AI is an intelligent cybersecurity platform designed to detect, analyze, and prevent digital threats such as phishing websites, malicious files, suspicious links, fake QR codes, fraudulent phone numbers, and deceptive messages using advanced AI and threat intelligence.
            </p>

            {/* Three Horizontally Aligned Feature Indicators */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 sm:pt-2">
              {/* Indicator 1 */}
              <div className="flex items-center gap-2.5 pr-4 sm:pr-6 border-r border-[rgba(0,217,255,0.30)]">
                <div className="w-8 h-8 rounded-lg bg-[#04182B] border border-[rgba(0,217,255,0.35)] flex items-center justify-center text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.2)]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs leading-tight">
                  <span className="font-bold text-[#F8FAFC] block">AI-Powered</span>
                  <span className="text-[#CBD5E1] text-[11px]">Detection</span>
                </div>
              </div>

              {/* Indicator 2 */}
              <div className="flex items-center gap-2.5 pr-4 sm:pr-6 border-r border-[rgba(0,217,255,0.30)]">
                <div className="w-8 h-8 rounded-lg bg-[#04182B] border border-[rgba(0,217,255,0.35)] flex items-center justify-center text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.2)]">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-xs leading-tight">
                  <span className="font-bold text-[#F8FAFC] block">Real-Time</span>
                  <span className="text-[#CBD5E1] text-[11px]">Threat Analysis</span>
                </div>
              </div>

              {/* Indicator 3 */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#04182B] border border-[rgba(0,217,255,0.35)] flex items-center justify-center text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.2)]">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-xs leading-tight">
                  <span className="font-bold text-[#F8FAFC] block">Built for</span>
                  <span className="text-[#CBD5E1] text-[11px]">Everyone</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column — Main Cybersecurity Hologram Illustration */}
          <div className="lg:col-span-4 flex items-center justify-center relative my-2 lg:my-0">
            <AboutCyberHologram />
          </div>

          {/* Right Column — Why We Built PhishShield AI Card */}
          <div className="lg:col-span-3 flex justify-end">
            <div className="w-full bg-[#04182B] border border-[rgba(0,217,255,0.30)] rounded-2xl p-6 sm:p-7 shadow-[0_0_24px_rgba(0,217,255,0.08)] space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] leading-snug">
                Why We Built
                <span className="text-[#00D9FF] block">PhishShield AI</span>
              </h2>
              {/* Short horizontal cyan accent line */}
              <div className="w-12 h-0.5 bg-[#00D9FF] rounded-full shadow-[0_0_8px_#00D9FF]" />
              <p className="text-xs sm:text-[13px] text-[#CBD5E1] leading-relaxed pt-1">
                In today's digital world, cyber threats are becoming smarter and more convincing. We built PhishShield AI to give individuals, students, and organizations an easy and powerful way to identify and avoid online threats before it's too late.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* MIDDLE SECTION: Four Feature Cards (1 Horizontal Row)   */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: All-in-One Protection */}
          <div className="bg-[#04182B] border border-[rgba(0,217,255,0.30)] rounded-2xl p-6 text-center flex flex-col items-center shadow-[0_0_20px_rgba(0,217,255,0.06)] hover:border-[#00D9FF]/60 hover:shadow-[0_0_28px_rgba(0,217,255,0.18)] transition-all group">
            <div className="w-14 h-14 rounded-full border-2 border-[#00D9FF] bg-[rgba(0,217,255,0.10)] flex items-center justify-center text-[#00D9FF] shadow-[0_0_16px_rgba(0,217,255,0.35)] mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC] mb-2">All-in-One Protection</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Multiple scanners in one platform for URLs, files, QR codes, phone numbers, emails, and messages.
            </p>
          </div>

          {/* Card 2: User-Centric Design */}
          <div className="bg-[#04182B] border border-[rgba(0,217,255,0.30)] rounded-2xl p-6 text-center flex flex-col items-center shadow-[0_0_20px_rgba(0,217,255,0.06)] hover:border-[#00D9FF]/60 hover:shadow-[0_0_28px_rgba(0,217,255,0.18)] transition-all group">
            <div className="w-14 h-14 rounded-full border-2 border-[#00D9FF] bg-[rgba(0,217,255,0.10)] flex items-center justify-center text-[#00D9FF] shadow-[0_0_16px_rgba(0,217,255,0.35)] mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC] mb-2">User-Centric Design</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Simple, fast, and easy to use for everyone — from students to professionals.
            </p>
          </div>

          {/* Card 3: AI + Threat Intelligence */}
          <div className="bg-[#04182B] border border-[rgba(0,217,255,0.30)] rounded-2xl p-6 text-center flex flex-col items-center shadow-[0_0_20px_rgba(0,217,255,0.06)] hover:border-[#00D9FF]/60 hover:shadow-[0_0_28px_rgba(0,217,255,0.18)] transition-all group">
            <div className="w-14 h-14 rounded-full border-2 border-[#00D9FF] bg-[rgba(0,217,255,0.10)] flex items-center justify-center text-[#00D9FF] shadow-[0_0_16px_rgba(0,217,255,0.35)] mb-4 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC] mb-2">AI + Threat Intelligence</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Advanced AI models and real-time threat intelligence to detect and analyze modern cyber threats.
            </p>
          </div>

          {/* Card 4: Privacy First */}
          <div className="bg-[#04182B] border border-[rgba(0,217,255,0.30)] rounded-2xl p-6 text-center flex flex-col items-center shadow-[0_0_20px_rgba(0,217,255,0.06)] hover:border-[#00D9FF]/60 hover:shadow-[0_0_28px_rgba(0,217,255,0.18)] transition-all group">
            <div className="w-14 h-14 rounded-full border-2 border-[#00D9FF] bg-[rgba(0,217,255,0.10)] flex items-center justify-center text-[#00D9FF] shadow-[0_0_16px_rgba(0,217,255,0.35)] mb-4 group-hover:scale-105 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC] mb-2">Privacy First</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Your data stays safe and secure. We prioritize your privacy and never share your information without consent.
            </p>
          </div>
        </section>

        {/* ======================================================== */}
        {/* BOTTOM SECTION: Our Vision and Our Mission Cards        */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-4">
          {/* Left Card: Our Vision */}
          <div className="bg-[#04182B] border border-[rgba(0,217,255,0.30)] rounded-2xl overflow-hidden grid grid-cols-12 shadow-[0_0_22px_rgba(0,217,255,0.08)]">
            <div className="col-span-12 sm:col-span-7 p-6 sm:p-7 flex flex-col justify-center space-y-2">
              <div className="w-11 h-11 rounded-full border-2 border-[#00D9FF] bg-[rgba(0,217,255,0.10)] flex items-center justify-center text-[#00D9FF] shadow-[0_0_14px_rgba(0,217,255,0.35)]">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC]">Our Vision</h3>
              <div className="w-12 h-0.5 bg-[#00D9FF] rounded-full shadow-[0_0_8px_#00D9FF]" />
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed pt-1">
                To create a safer and more trustworthy digital world where everyone can explore, learn, work, and connect online without fear of cyber threats.
              </p>
            </div>
            <div className="col-span-12 sm:col-span-5 h-48 sm:h-auto relative overflow-hidden flex items-center justify-center bg-[#04182B]">
              <img
                src="/assets/about/vision-mountain-clean.png"
                alt="Our Vision Mountain Path"
                className="w-full h-full object-cover object-center select-none pointer-events-none"
              />
            </div>
          </div>

          {/* Right Card: Our Mission */}
          <div className="bg-[#04182B] border border-[rgba(0,217,255,0.30)] rounded-2xl overflow-hidden grid grid-cols-12 shadow-[0_0_22px_rgba(0,217,255,0.08)]">
            <div className="col-span-12 sm:col-span-7 p-6 sm:p-7 flex flex-col justify-center space-y-2">
              <div className="w-11 h-11 rounded-full border-2 border-[#00D9FF] bg-[rgba(0,217,255,0.10)] flex items-center justify-center text-[#00D9FF] shadow-[0_0_14px_rgba(0,217,255,0.35)]">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC]">Our Mission</h3>
              <div className="w-12 h-0.5 bg-[#00D9FF] rounded-full shadow-[0_0_8px_#00D9FF]" />
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed pt-1">
                To empower individuals and organizations with intelligent and easy-to-use cybersecurity tools that detect, prevent, and raise awareness about online threats, making digital safety accessible to everyone.
              </p>
            </div>
            <div className="col-span-12 sm:col-span-5 h-48 sm:h-auto relative overflow-hidden flex items-center justify-center bg-[#04182B]">
              <img
                src="/assets/about/mission-summit-clean.png"
                alt="Our Mission Summit"
                className="w-full h-full object-cover object-center select-none pointer-events-none"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
