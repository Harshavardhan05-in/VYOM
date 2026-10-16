export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical' | 'safe'

export type NavItem = {
  id: string
  label: string
  icon: string
  badge?: string | number
  active?: boolean
}

export type SystemStatus = {
  engineOnline: boolean
  lastScanTime: string
  scannedCount: number
  threatsNeutralized: number
  defenseScore: number
}

export type ThreatPreview = {
  id: string
  sender: string
  subject: string
  timestamp: string
  severity: ThreatSeverity
  confidence: number
  detectionVector: string
  status: 'quarantined' | 'flagged' | 'analyzing' | 'resolved'
}
