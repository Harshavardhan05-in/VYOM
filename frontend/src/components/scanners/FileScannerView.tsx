import React, { useState, useRef } from 'react'
import {
  UploadCloud,
  FileCheck2,
  FileCode,
  AlertCircle,
  Loader2,
  Shield,
  FileText,
  AlertTriangle,
} from 'lucide-react'
import { api, type FileScanResponse } from '../../services/api'
import { RiskReport } from './RiskReport'

export const FileScannerView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<FileScanResponse | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (selected.size > 20 * 1024 * 1024) {
        setError('File size exceeds the 20MB safety limit.')
        return
      }
      setFile(selected)
      setError(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0]
      if (dropped.size > 20 * 1024 * 1024) {
        setError('File size exceeds the 20MB safety limit.')
        return
      }
      setFile(dropped)
      setError(null)
    }
  }

  const handleScan = async () => {
    if (!file) {
      setError('Please select or drop a file to inspect.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api.scanFile(file)
      setResult(response)
    } catch (err: any) {
      setError(err.message || 'File inspection failed. Ensure the backend engine is running.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <RiskReport
        title="File Threat Assessment"
        target={result.filename}
        scannerType="file"
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
          File_Size: result.file_size_formatted,
          SHA256_Hash: result.sha256_hash.slice(0, 16) + '...',
          Detected_MIME: result.detected_mime,
          Signature: result.file_signature,
        }}
        onScanAnother={() => {
          setResult(null)
          setFile(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Console */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 shadow-[0_8px_30px_rgba(2,11,22,0.8)] space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-[#00D9FF]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#F8FAFC]">
              Safe Static File & Payload Inspection
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#CBD5E1]">
            Inspect binaries, documents, scripts, and archives using header magic byte verification, RTLO character spoofing detection, double extension analysis, and SHA-256 fingerprinting without executing malicious code.
          </p>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-[#00D9FF] bg-[#00D9FF]/10 scale-[1.01]'
              : file
              ? 'border-[#00D9FF]/50 bg-[#061B30]'
              : 'border-[#00D9FF]/30 bg-[#061426] hover:border-[#00D9FF]/60 hover:bg-[#061B30]/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-[#111C30] border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shadow-[0_0_16px_rgba(0,217,255,0.25)]">
              {file ? <FileText className="h-7 w-7" /> : <UploadCloud className="h-7 w-7" />}
            </div>

            {file ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#F8FAFC] font-mono break-all">
                  {file.name}
                </p>
                <p className="text-xs text-[#94A3B8] font-mono">
                  {(file.size / 1024).toFixed(1)} KB • {file.type || 'Binary / Unspecified'}
                </p>
                <span className="inline-block text-[11px] text-[#00D9FF] pt-1">
                  Click or drop another file to replace
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#F8FAFC]">
                  Choose a file or drag and drop it here
                </p>
                <p className="text-xs text-[#94A3B8]">
                  Supports executables (.exe, .dll), scripts (.bat, .ps1, .vbs), documents (.pdf, .docx), and archives (.zip) up to 20MB.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <Shield className="h-3.5 w-3.5 text-[#00D9FF]" />
            <span>Zero-execution sandbox isolation: files are analyzed statically only.</span>
          </div>

          <button
            onClick={handleScan}
            disabled={loading || !file}
            className="px-6 py-2.5 rounded-lg bg-[#00D9FF] text-[#020B16] hover:bg-[#38BDF8] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-xs transition-all shadow-[0_0_12px_rgba(0,217,255,0.3)] flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Scanning File...</span>
              </>
            ) : (
              <>
                <FileCode className="h-3.5 w-3.5" />
                <span>Begin Static Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Safety Notice Card */}
      <div className="p-4 rounded-xl bg-[#061426] border border-[#00D9FF]/20 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-[#F59E0B] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-[#F8FAFC]">
            Safe Static Inspection Notice
          </span>
          <p className="text-[#94A3B8] leading-relaxed">
            PhishShield static analysis evaluates file headers, entropy, known signature bytes, and deceptive naming techniques (such as Right-to-Left Override spoofing `invoice\u202Efdp.exe`). We do not detonate live binaries or run kernel ring-0 emulation.
          </p>
        </div>
      </div>
    </div>
  )
}
