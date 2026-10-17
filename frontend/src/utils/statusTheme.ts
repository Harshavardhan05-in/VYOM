/**
 * PhishShield AI — Global Status & Theme System
 * Centralized mapping for security assessment states across all scanners and views.
 *
 * Safe / Clean / Low Risk: Prominent Green (#22C55E, #4ADE80, #052E1A)
 * Suspicious / Medium Risk: Amber / Orange (#F59E0B)
 * High Risk / Malicious: Red Threat (#EF4444, #F87171, #450A0A)
 * Neutral / Scanning: Cyan (#00D9FF)
 */

export interface StatusThemeConfig {
  primary: string
  highlight: string
  surface: string
  border: string
  borderTw: string
  glowTw: string
  badgeVariant: 'success' | 'warning' | 'danger' | 'cyan' | 'neutral'
  badgeBg: string
  badgeText: string
  badgeBorder: string
  label: string
  summaryText: string
}

export const SAFE_THEME: StatusThemeConfig = {
  primary: '#22C55E',
  highlight: '#4ADE80',
  surface: '#052E1A',
  border: 'rgba(34, 197, 94, 0.45)',
  borderTw: 'border-2 border-[#22C55E]/45',
  glowTw: 'shadow-[0_0_30px_rgba(34,197,94,0.20)]',
  badgeVariant: 'success',
  badgeBg: 'bg-[#22C55E]/20',
  badgeText: 'text-[#4ADE80]',
  badgeBorder: 'border-[#22C55E]/50',
  label: 'SAFE',
  summaryText: 'No significant threats detected. The scanned item passed the available security checks.',
}

export const SUSPICIOUS_THEME: StatusThemeConfig = {
  primary: '#F59E0B',
  highlight: '#FBBF24',
  surface: '#451A03',
  border: 'rgba(245, 158, 11, 0.45)',
  borderTw: 'border-2 border-amber-500/45',
  glowTw: 'shadow-[0_0_30px_rgba(245,158,11,0.20)]',
  badgeVariant: 'warning',
  badgeBg: 'bg-amber-500/20',
  badgeText: 'text-amber-300',
  badgeBorder: 'border-amber-500/50',
  label: 'SUSPICIOUS',
  summaryText: 'Multiple heuristic anomalies detected. Exercise elevated caution before interacting.',
}

export const HIGH_RISK_THEME: StatusThemeConfig = {
  primary: '#EF4444',
  highlight: '#F87171',
  surface: '#450A0A',
  border: 'rgba(239, 68, 68, 0.50)',
  borderTw: 'border-2 border-red-500/50',
  glowTw: 'shadow-[0_0_30px_rgba(239,68,68,0.25)]',
  badgeVariant: 'danger',
  badgeBg: 'bg-red-500/20',
  badgeText: 'text-red-300',
  badgeBorder: 'border-red-500/50',
  label: 'HIGH RISK',
  summaryText: 'Critical threat indicators identified. Do not trust or submit sensitive credentials.',
}

export const NEUTRAL_THEME: StatusThemeConfig = {
  primary: '#00D9FF',
  highlight: '#38BDF8',
  surface: '#061B30',
  border: 'rgba(0, 217, 255, 0.35)',
  borderTw: 'border border-[#00D9FF]/35',
  glowTw: 'shadow-[0_0_24px_rgba(0,217,255,0.18)]',
  badgeVariant: 'cyan',
  badgeBg: 'bg-[#00D9FF]/20',
  badgeText: 'text-[#00D9FF]',
  badgeBorder: 'border-[#00D9FF]/40',
  label: 'ANALYZING',
  summaryText: 'Security evaluation in progress...',
}

export const UNKNOWN_THEME: StatusThemeConfig = {
  primary: '#64748B',
  highlight: '#94A3B8',
  surface: '#0B1120',
  border: 'rgba(100, 116, 139, 0.35)',
  borderTw: 'border border-[#64748B]/35',
  glowTw: 'shadow-none',
  badgeVariant: 'neutral',
  badgeBg: 'bg-[#64748B]/20',
  badgeText: 'text-[#94A3B8]',
  badgeBorder: 'border-[#64748B]/40',
  label: 'INCONCLUSIVE',
  summaryText: 'Scan was inconclusive or unavailable. Exercise standard digital caution.',
}

/**
 * Derives the standardized status theme from backend risk category or assessment string.
 * Never defaults error or unknown states to safe.
 */
export function getStatusTheme(
  category?: string | null,
  status?: string | null
): StatusThemeConfig {
  if (status === 'error' || status === 'inconclusive' || status === 'unavailable') {
    return UNKNOWN_THEME
  }

  const cat = (category || '').toLowerCase().trim()
  if (cat === 'safe' || cat === 'clean' || cat === 'low_risk' || cat === 'low') {
    return SAFE_THEME
  }
  if (cat === 'suspicious' || cat === 'medium' || cat === 'medium_risk' || cat === 'warning') {
    return SUSPICIOUS_THEME
  }
  if (
    cat === 'high_risk' ||
    cat === 'high' ||
    cat === 'malicious' ||
    cat === 'critical' ||
    cat === 'danger'
  ) {
    return HIGH_RISK_THEME
  }

  if (status === 'loading' || status === 'scanning') {
    return NEUTRAL_THEME
  }

  return UNKNOWN_THEME
}

/**
 * Returns scanner-specific honest safe description copy based on scanner vector.
 */
export function getSafeContextDescription(scannerType?: string): string {
  switch (scannerType) {
    case 'url':
      return 'No significant threats detected. The scanned URL passed heuristic, domain reputation, and syntax integrity checks with zero active malicious signatures.'
    case 'file':
      return 'No significant threats detected. The scanned file passed static header verification, MIME validation, RTLO detection, and double-extension analysis with zero malicious signatures.'
    case 'qr':
      return 'No significant threats detected. The decoded destination passed available security checks with zero phishing or redirect lures.'
    case 'phone':
      return 'No significant threats detected. Number format complies with ITU-T standards with zero Wangiri satellite prefixes or active abuse reports.'
    case 'email':
      return 'No significant threats detected. The scanned message body exhibits no urgent coercion, credential harvesting, or deceptive links.'
    case 'social':
      return 'No significant threats detected. Profile identifier exhibits no homoglyphic brand impersonation, deceptive corporate keywords, or bot suffix patterns.'
    default:
      return 'No significant threats detected. The scanned item passed the available security checks.'
  }
}
