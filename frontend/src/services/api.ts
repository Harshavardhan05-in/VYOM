/**
 * PhishShield AI — Frontend API Client
 * Connects to the local FastAPI backend (port 8000) or configured VITE_API_BASE_URL.
 */

const DEFAULT_BACKEND_URL = 'http://127.0.0.1:8000'

export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL
  if (typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '')
  }
  return DEFAULT_BACKEND_URL
}

export interface SecurityFinding {
  rule_id: string
  title: string
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical'
  triggered: boolean
  evidence?: string | null
  explanation: string
  recommendation?: string | null
  score_contribution: number
}

export interface MLResult {
  available: boolean
  model_version?: string | null
  prediction?: 'phishing' | 'legitimate' | null
  confidence?: number | null
  note?: string | null
}

export interface ScanResponse {
  url: string
  normalized_url: string
  risk_score: number
  risk_category: 'safe' | 'suspicious' | 'high_risk'
  ml_result: MLResult
  findings: SecurityFinding[]
  triggered_findings: SecurityFinding[]
  reasons: string[]
  recommended_actions: string[]
  scan_id: string
  scanned_at: string
  analysis_method: string
  limitations: string[]
}

export interface FileScanResponse {
  scan_id: string
  filename: string
  file_size_bytes: number
  file_size_formatted: string
  sha256_hash: string
  detected_mime: string
  file_signature: string
  risk_score: number
  risk_category: 'safe' | 'suspicious' | 'high_risk'
  findings: SecurityFinding[]
  triggered_findings: SecurityFinding[]
  reasons: string[]
  recommended_actions: string[]
  scanned_at: string
  analysis_method: string
  limitations: string[]
}

export interface QRScanResponse {
  scan_id: string
  filename?: string
  decoded_text: string
  is_url: boolean
  url_target?: string | null
  risk_score: number
  risk_category: 'safe' | 'suspicious' | 'high_risk'
  findings: SecurityFinding[]
  triggered_findings: SecurityFinding[]
  reasons: string[]
  recommended_actions: string[]
  scanned_at: string
  analysis_method: string
  limitations: string[]
}

export interface PhoneScanResponse {
  scan_id: string
  raw_input: string
  normalized_number: string
  is_valid_format: boolean
  detected_country?: string | null
  country_calling_code?: string | null
  line_type?: string | null
  reputation_status: string
  risk_score: number
  risk_category: 'safe' | 'suspicious' | 'high_risk'
  findings: SecurityFinding[]
  triggered_findings: SecurityFinding[]
  reasons: string[]
  recommended_actions: string[]
  scanned_at: string
  analysis_method: string
  limitations: string[]
}

export interface EmailScanResponse {
  scan_id: string
  subject: string
  sender: string
  body_preview: string
  extracted_urls: Array<{
    url: string
    risk_score: number
    risk_category: string
    triggered_rules: string[]
  }>
  detected_vectors: string[]
  risk_score: number
  risk_category: 'safe' | 'suspicious' | 'high_risk'
  findings: SecurityFinding[]
  triggered_findings: SecurityFinding[]
  reasons: string[]
  recommended_actions: string[]
  scanned_at: string
  analysis_method: string
  limitations: string[]
}

export interface SocialScanResponse {
  scan_id: string
  platform: string
  identifier: string
  account_type_assessed: string
  risk_score: number
  risk_category: 'safe' | 'suspicious' | 'high_risk'
  findings: SecurityFinding[]
  triggered_findings: SecurityFinding[]
  impersonation_indicators: string[]
  reasons: string[]
  recommended_actions: string[]
  scanned_at: string
  analysis_method: string
  limitations: string[]
}

export interface HistoryItem {
  id: string
  scan_id: string
  scanner_type: string
  input_target: string
  risk_score: number
  risk_category: string
  findings_count: number
  summary?: string | null
  status: string
  scanned_at: string
}

export interface HistoryListResponse {
  total_count: number
  items: HistoryItem[]
}

export interface DashboardStatsResponse {
  total_scans: number
  threats_detected: number
  high_risk_count: number
  suspicious_count: number
  safe_count: number
  average_risk_score: number
  scanners_breakdown: Record<string, number>
  recent_activity: HistoryItem[]
  system_status: {
    engine_online: boolean
    ml_model_loaded: boolean
    database_online: boolean
    database_engine: string
  }
}

export interface UrlReportRequest {
  url: string
  scan_id?: string
  risk_score?: number
  risk_category?: string
  user_explanation?: string
  evidence?: string[]
}

export interface UrlReportResponse {
  report_id: string
  url: string
  status: string
  message: string
  forwarded_to_external: boolean
  external_department_name?: string | null
  reported_at: string
  is_duplicate?: boolean
}

export interface ReportItem {
  id: string
  report_id: string
  url: string
  normalized_url: string
  scan_id?: string
  risk_score?: number
  risk_category?: string
  user_explanation?: string
  status: string
  forward_status: string
  external_department?: string | null
  reported_at: string
}

export interface ReportListResponse {
  total: number
  reports: ReportItem[]
}


/**
 * Universal fetch wrapper with timeout and normalized error reporting
 */
async function request<T>(endpoint: string, options: RequestInit = {}, timeoutMs = 30000): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    })

    clearTimeout(timer)

    if (!res.ok) {
      let errorMsg = `Server responded with ${res.status}: ${res.statusText}`
      try {
        const errorData = await res.json()
        if (errorData.detail) {
          errorMsg = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail)
        }
      } catch {
        // Fallback
      }
      throw new Error(errorMsg)
    }

    return await res.json()
  } catch (err: any) {
    clearTimeout(timer)
    if (err.name === 'AbortError') {
      throw new Error('Analysis request timed out after 30 seconds. Please try again.')
    }
    throw new Error(err.message || 'Unable to communicate with PhishShield security engine.')
  }
}

// ── API Methods ───────────────────────────────────────────────────────────────

export const api = {
  // 1. URL Scanner
  scanUrl: (url: string): Promise<ScanResponse> =>
    request<ScanResponse>('/api/v1/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url.trim() }),
    }),

  // 2. File Scanner
  scanFile: (file: File): Promise<FileScanResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    return request<FileScanResponse>('/api/v1/scan/file', {
      method: 'POST',
      body: formData,
    })
  },

  // 3. QR Code Scanner
  scanQr: (file: File): Promise<QRScanResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    return request<QRScanResponse>('/api/v1/scan/qr', {
      method: 'POST',
      body: formData,
    })
  },

  // 4. Phone Checker
  scanPhone: (phoneNumber: string, countryCode?: string): Promise<PhoneScanResponse> =>
    request<PhoneScanResponse>('/api/v1/scan/phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber.trim(), country_code: countryCode }),
    }),

  // 5. Email & Message Scanner
  scanEmail: (body: string, subject?: string, sender?: string, rawHeaders?: string): Promise<EmailScanResponse> =>
    request<EmailScanResponse>('/api/v1/scan/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: body.trim(),
        subject: subject?.trim(),
        sender: sender?.trim(),
        raw_headers: rawHeaders?.trim(),
      }),
    }),

  // 6. SocialShield AI
  scanSocial: (platform: string, identifier: string, profileDetails?: string): Promise<SocialScanResponse> =>
    request<SocialScanResponse>('/api/v1/scan/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: platform.trim(),
        identifier: identifier.trim(),
        profile_details: profileDetails?.trim(),
      }),
    }),

  // 7. History
  getHistory: (scannerType?: string, riskCategory?: string, limit = 50, offset = 0): Promise<HistoryListResponse> => {
    const params = new URLSearchParams()
    if (scannerType && scannerType !== 'all') params.append('scanner_type', scannerType)
    if (riskCategory && riskCategory !== 'all') params.append('risk_category', riskCategory)
    params.append('limit', String(limit))
    params.append('offset', String(offset))
    return request<HistoryListResponse>(`/api/v1/history?${params.toString()}`)
  },

  getHistoryDetail: (scanId: string): Promise<any> =>
    request<any>(`/api/v1/history/${scanId}`),

  deleteHistoryItem: (scanId: string): Promise<{ status: string; scan_id: string }> =>
    request<{ status: string; scan_id: string }>(`/api/v1/history/${scanId}`, {
      method: 'DELETE',
    }),

  // 8. Real Dashboard Telemetry
  getDashboardStats: (): Promise<DashboardStatsResponse> =>
    request<DashboardStatsResponse>('/api/v1/dashboard/stats'),

  // 9. System Health & Model Status
  getHealth: (): Promise<{ status: string; version: string; ml_model_available: boolean; rule_engine_available: boolean }> =>
    request('/api/v1/health'),

  getModelStatus: (): Promise<any> =>
    request('/api/v1/model-status'),

  // 10. Threat Reporting
  reportUrl: (data: UrlReportRequest): Promise<UrlReportResponse> =>
    request<UrlReportResponse>('/api/v1/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  getReports: (limit = 50, offset = 0): Promise<ReportListResponse> =>
    request<ReportListResponse>(`/api/v1/reports?limit=${limit}&offset=${offset}`),
}

