import React, { useState } from 'react'
import {
  Search,
  Globe,
  Loader2,
  AlertCircle,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import { api, type ScanResponse } from '../../services/api'
import { RiskReport } from './RiskReport'

export const UrlScannerView: React.FC = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResponse | null>(null)

  const exampleUrls = [
    { label: 'Google (Safe)', url: 'https://google.com' },
    { label: 'PayPal Lure (Phishing)', url: 'http://paypal-security-update-center.xyz/login' },
    { label: 'IP Address Host', url: 'http://192.168.1.100/admin/verify' },
    { label: 'URL Shortener', url: 'https://bit.ly/secure-verify-account' },
  ]

  const handleScan = async (targetUrl?: string) => {
    const inputUrl = (targetUrl || url).trim()
    if (!inputUrl) {
      setError('Please enter a target URL to analyse.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api.scanUrl(inputUrl)
      setResult(response)
    } catch (err: any) {
      setError(err.message || 'Failed to analyze URL. Ensure the backend engine is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleScan()
    }
  }

  if (result) {
    return (
      <RiskReport
        title="URL Threat Assessment"
        target={result.url}
        scannerType="url"
        riskScore={result.risk_score}
        riskCategory={result.risk_category}
        findings={result.findings}
        triggeredFindings={result.triggered_findings}
        reasons={result.reasons}
        recommendedActions={result.recommended_actions}
        scannedAt={result.scanned_at}
        analysisMethod={result.analysis_method}
        limitations={result.limitations}
        scanId={result.scan_id}
        metadata={{
          Normalized_URL: result.normalized_url,
          ML_Prediction: result.ml_result.prediction || 'N/A',
          ML_Confidence: result.ml_result.confidence ? `${(result.ml_result.confidence * 100).toFixed(1)}%` : 'N/A',
          Model_Version: result.ml_result.model_version || 'Rule Engine v1.0',
        }}
        onScanAnother={() => {
          setResult(null)
          setUrl('')
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Input Console */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 shadow-[0_8px_30px_rgba(2,11,22,0.8)] space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#00D9FF]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#F8FAFC]">
              Deep URL & Domain Threat Inspection
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#CBD5E1]">
            Analyse URLs for homograph domain spoofing, suspicious TLDs, credential harvesting paths, zero-font evasion, and heuristic risk scoring.
          </p>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (error) setError(null)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter target URL (e.g., https://example-security-login.xyz)"
              disabled={loading}
              className="w-full bg-[#061426] border border-[#00D9FF]/30 rounded-xl pl-4 pr-32 py-3.5 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/30 transition-all font-mono"
            />
            <button
              onClick={() => handleScan()}
              disabled={loading || !url.trim()}
              className="absolute right-2 px-5 py-2.5 rounded-lg bg-[#00D9FF] text-[#020B16] hover:bg-[#38BDF8] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-xs transition-all shadow-[0_0_12px_rgba(0,217,255,0.3)] flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="h-3.5 w-3.5" />
                  <span>Inspect URL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {url.trim() && (
              <button
                type="button"
                onClick={() => handleScan()}
                disabled={loading}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EF4444]/20 hover:bg-[#EF4444]/30 border border-[#EF4444]/40 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Retry Scan</span>
              </button>
            )}
          </div>
        )}

        {/* Example Quick Pills */}
        <div className="pt-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-2">
            Try Example Targets:
          </span>
          <div className="flex flex-wrap gap-2">
            {exampleUrls.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUrl(item.url)
                  handleScan(item.url)
                }}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#061B30] border border-[#00D9FF]/20 text-[#CBD5E1] hover:text-[#00D9FF] hover:border-[#00D9FF]/50 transition-all font-mono"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: 'Homoglyph & Punycode Engine',
            desc: 'Detects Cyrillic and unicode character lookalikes masquerading as reputable financial brands.',
          },
          {
            title: 'Credential Harvester Pathing',
            desc: 'Identifies suspicious query tokens, token theft lures, and deceptive login endpoints.',
          },
          {
            title: 'Dual Heuristic + ML Scoring',
            desc: 'Combines deterministic threat signature scoring with a trained scikit-learn classifier.',
          },
        ].map((feat, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-[#04182B]/60 border border-[#00D9FF]/15 space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#00D9FF]" />
              <h4 className="text-xs font-bold text-[#F8FAFC]">{feat.title}</h4>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
