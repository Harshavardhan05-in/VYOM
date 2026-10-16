import React, { useState } from 'react'
import {
  Sliders,
  CheckCircle2,
  Save,
} from 'lucide-react'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

export const SystemSettings: React.FC = () => {
  const [sensitivity, setSensitivity] = useState(70)
  const [flags, setFlags] = useState({
    homoglyphStrict: true,
    blockHighRiskTld: true,
    deepPeValidation: true,
    wangiriDetection: true,
    localTelemetryOnly: true,
    autoQuarantine: false,
  })
  const [saved, setSaved] = useState(false)

  const handleToggle = (key: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 shadow-[0_8px_30px_rgba(2,11,22,0.8)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#061B30] border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shadow-[0_0_14px_rgba(0,217,255,0.25)]">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#F8FAFC]">
                  Defense Thresholds & System Matrix
                </h1>
                <Badge variant="cyan" size="sm">
                  Config v1.0
                </Badge>
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Fine-tune heuristic sensitivity scores, zero-trust filters, and automated quarantine triggers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              icon={saved ? <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" /> : <Save className="h-3.5 w-3.5" />}
            >
              {saved ? 'Preferences Saved' : 'Apply Settings'}
            </Button>
          </div>
        </div>
      </div>

      {/* Threshold Slider */}
      <div className="p-6 rounded-2xl bg-[#04182B] border border-[#00D9FF]/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              High-Risk Quarantine Threshold
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Targets scoring at or above this threshold will be flagged as High Risk and recommended for quarantine.
            </p>
          </div>
          <span className="text-lg font-mono font-bold text-[#00D9FF]">
            {sensitivity} / 100
          </span>
        </div>

        <input
          type="range"
          min="40"
          max="90"
          step="5"
          value={sensitivity}
          onChange={(e) => setSensitivity(Number(e.target.value))}
          className="w-full accent-[#00D9FF] bg-[#061426] h-2 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[11px] font-mono text-[#64748B]">
          <span>40 (High Sensitivity / Paranoid)</span>
          <span>70 (Balanced Default)</span>
          <span>90 (Lenient / Low False Positives)</span>
        </div>
      </div>

      {/* Security Rule Engines Matrix */}
      <div className="p-6 rounded-2xl bg-[#04182B] border border-[#00D9FF]/20 space-y-4">
        <h3 className="text-sm font-bold text-[#F8FAFC]">
          Autonomous Security Rules Matrix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              key: 'homoglyphStrict' as const,
              title: 'Strict Homoglyph & Punycode Deception Guard',
              desc: 'Flags Cyrillic lookalikes mimicking brand entities (e.g. google, paypal, microsoft).',
            },
            {
              key: 'blockHighRiskTld' as const,
              title: 'Elevated Scrutiny on High-Abuse TLDs',
              desc: 'Applies penalty score to free / heavily abused TLDs (.xyz, .top, .buzz, .rest).',
            },
            {
              key: 'deepPeValidation' as const,
              title: 'Deep Static PE Header & Magic Byte Verification',
              desc: 'Detects disguised extensions and MZ header mismatches without running code.',
            },
            {
              key: 'wangiriDetection' as const,
              title: 'ITU-T E.164 Wangiri Callback Shield',
              desc: 'Scores international satellite prefixes and one-ring toll fraud patterns.',
            },
            {
              key: 'localTelemetryOnly' as const,
              title: 'Strict Local Telemetry (Zero Cloud Export)',
              desc: 'Enforces complete zero-leakage; all logs persist exclusively in local SQLite database.',
            },
            {
              key: 'autoQuarantine' as const,
              title: 'Auto-Move High-Risk Artifacts to Quarantine Vault',
              desc: 'Automatically isolates discovered high-risk files into the secure vault.',
            },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => handleToggle(item.key)}
              className="p-4 rounded-xl bg-[#061426] border border-[#00D9FF]/15 flex items-start justify-between gap-3 cursor-pointer hover:border-[#00D9FF]/40 transition-all select-none"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#F8FAFC]">{item.title}</span>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">{item.desc}</p>
              </div>

              <div
                className={`w-10 h-6 flex items-center rounded-full p-1 duration-200 cursor-pointer shrink-0 ${
                  flags[item.key] ? 'bg-[#00D9FF]' : 'bg-[#111C30]'
                }`}
              >
                <div
                  className={`bg-[#020B16] w-4 h-4 rounded-full shadow-md transform duration-200 ${
                    flags[item.key] ? 'translate-x-4' : ''
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
