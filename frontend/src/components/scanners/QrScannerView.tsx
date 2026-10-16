import React, { useState, useRef } from 'react'
import {
  QrCode,
  UploadCloud,
  Loader2,
  AlertCircle,
  Shield,
  Eye,
  RotateCcw,
} from 'lucide-react'
import { api, type QRScanResponse } from '../../services/api'
import { RiskReport } from './RiskReport'

export const QrScannerView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<QRScanResponse | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (!selected.type.startsWith('image/')) {
        setError('Please select a valid image file (PNG, JPG, WEBP).')
        return
      }
      if (selected.size > 20 * 1024 * 1024) {
        setError('QR image exceeds the 20 MB safety threshold limit. Please select a smaller file.')
        return
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setFile(selected)
      setPreviewUrl(URL.createObjectURL(selected))
      setError(null)
      setResult(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0]
      if (!dropped.type.startsWith('image/')) {
        setError('Please drop a valid image file.')
        return
      }
      if (dropped.size > 20 * 1024 * 1024) {
        setError('QR image exceeds the 20 MB safety threshold limit. Please drop a smaller file.')
        return
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setFile(dropped)
      setPreviewUrl(URL.createObjectURL(dropped))
      setError(null)
      setResult(null)
    }
  }

  const handleScan = async () => {
    if (!file) {
      setError('Please select or drop a QR code image to decode.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api.scanQr(file)
      setResult(response)
    } catch (err: any) {
      setError(err.message || 'QR code decoding failed. Ensure the image has clear contrast.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <RiskReport
        title="QR Code Threat Assessment"
        target={result.decoded_text}
        scannerType="qr"
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
          Decoded_Type: result.is_url ? 'URL Destination' : 'Plain Text / Data',
          Target_Link: result.url_target || 'N/A',
        }}
        onScanAnother={() => {
          setResult(null)
          setFile(null)
          if (previewUrl) URL.revokeObjectURL(previewUrl)
          setPreviewUrl(null)
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
            <QrCode className="h-5 w-5 text-[#00D9FF]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#F8FAFC]">
              QR Code Matrix Decoding & Destination Inspection
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#CBD5E1]">
            Unpack QR code imagery safely before physical or mobile scanning. Inspect embedded destinations for deceptive redirection, homoglyphs, and quishing attacks.
          </p>
        </div>

        {/* Dropzone with optional image preview */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
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
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            {previewUrl ? (
              <div className="space-y-3">
                <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden border border-[#00D9FF]/40 bg-[#020B16] flex items-center justify-center p-2 shadow-[0_0_16px_rgba(0,217,255,0.2)]">
                  <img
                    src={previewUrl}
                    alt="QR Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#F8FAFC] font-mono">{file?.name}</p>
                  <span className="text-[11px] text-[#00D9FF]">Click or drop to replace image</span>
                </div>
              </div>
            ) : (
              <>
                <div className="h-14 w-14 rounded-2xl bg-[#111C30] border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shadow-[0_0_16px_rgba(0,217,255,0.25)]">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#F8FAFC]">
                    Upload or drag & drop a QR code image
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    Supports PNG, JPG, JPEG, and WEBP formats.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {file && (
              <button
                type="button"
                onClick={handleScan}
                disabled={loading}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EF4444]/20 hover:bg-[#EF4444]/30 border border-[#EF4444]/40 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Retry Decode</span>
              </button>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <Shield className="h-3.5 w-3.5 text-[#00D9FF]" />
            <span>Decoded server-side with OpenCV matrix analysis.</span>
          </div>

          <button
            onClick={handleScan}
            disabled={loading || !file}
            className="px-6 py-2.5 rounded-lg bg-[#00D9FF] text-[#020B16] hover:bg-[#38BDF8] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-xs transition-all shadow-[0_0_12px_rgba(0,217,255,0.3)] flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Decoding Matrix...</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Decode & Inspect QR</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
