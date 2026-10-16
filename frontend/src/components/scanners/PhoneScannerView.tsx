import React, { useState } from 'react'
import {
  PhoneCall,
  Search,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import { api, type PhoneScanResponse } from '../../services/api'
import { RiskReport } from './RiskReport'

export const PhoneScannerView: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('US')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PhoneScanResponse | null>(null)

  const sampleNumbers = [
    { label: 'Standard US Line', number: '+1 202-555-0143', country: 'US' },
    { label: 'Toll-Free Support Line', number: '+1 800-555-0199', country: 'US' },
    { label: 'High-Tariff Wangiri Prefix', number: '+881 6 310 1234', country: 'XX' },
    { label: 'UK Mobile Number', number: '+44 7911 123456', country: 'GB' },
    { label: 'India Mobile Number', number: '+91 98765 43210', country: 'IN' },
  ]

  const handleScan = async (overrideNumber?: string, overrideCountry?: string) => {
    const num = (overrideNumber || phoneNumber).trim()
    if (!num) {
      setError('Please enter a phone number to check.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api.scanPhone(num, overrideCountry || countryCode)
      setResult(response)
    } catch (err: any) {
      setError(err.message || 'Phone assessment failed. Please verify format.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <RiskReport
        title="Phone Number Reputation Assessment"
        target={result.normalized_number}
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
          Format_Valid: result.is_valid_format ? 'ITU-T E.164 Compliant' : 'Invalid / Malformed',
          Detected_Country: result.detected_country || 'Global / Unknown',
          Calling_Code: result.country_calling_code || 'N/A',
          Line_Type: result.line_type || 'Unspecified',
        }}
        onScanAnother={() => {
          setResult(null)
          setPhoneNumber('')
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
            <PhoneCall className="h-5 w-5 text-[#00D9FF]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#F8FAFC]">
              Phone Number Reputation & Spam Risk Evaluation
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#CBD5E1]">
            Inspect telephone numbers for ITU-T E.164 format compliance, satellite/premium-rate Wangiri callback fraud prefixes, VOIP spoof indicators, and telemarketing spam heuristics.
          </p>
        </div>

        {/* Input Bar with Country Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-1.5">
              Country Region
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full bg-[#061426] border border-[#00D9FF]/30 rounded-xl px-3 py-3.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF] font-mono cursor-pointer"
            >
              <option value="US">United States (+1)</option>
              <option value="GB">United Kingdom (+44)</option>
              <option value="IN">India (+91)</option>
              <option value="CA">Canada (+1)</option>
              <option value="AU">Australia (+61)</option>
              <option value="DE">Germany (+49)</option>
              <option value="FR">France (+33)</option>
              <option value="XX">International / Satellite</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-1.5">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value)
                  if (error) setError(null)
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                placeholder="e.g. +1 800-555-0199 or +44 7911 123456"
                disabled={loading}
                className="w-full bg-[#061426] border border-[#00D9FF]/30 rounded-xl pl-4 pr-32 py-3.5 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/30 transition-all font-mono"
              />
              <button
                onClick={() => handleScan()}
                disabled={loading || !phoneNumber.trim()}
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
                    <span>Evaluate Number</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Sample Number Pills */}
        <div className="pt-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-2">
            Try Example Numbers:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleNumbers.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPhoneNumber(item.number)
                  setCountryCode(item.country)
                  handleScan(item.number, item.country)
                }}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#061B30] border border-[#00D9FF]/20 text-[#CBD5E1] hover:text-[#00D9FF] hover:border-[#00D9FF]/50 transition-all font-mono"
              >
                {item.label} ({item.number})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimers & Methodology */}
      <div className="p-4 rounded-xl bg-[#061426] border border-[#00D9FF]/20 flex items-start gap-3 text-xs text-[#94A3B8]">
        <HelpCircle className="h-4 w-4 text-[#00D9FF] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Number reputation scoring is computed via algorithmic ITU-T prefix validation, high-cost international premium rate detection, and known Wangiri one-ring fraud heuristics. Caller-ID spoofing may occur upstream at telecommunications provider levels.
        </p>
      </div>
    </div>
  )
}
