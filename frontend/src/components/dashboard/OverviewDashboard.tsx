import React from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  AlertTriangle,
  Zap,
  Globe,
  Radio,
  FileCheck2,
  ExternalLink,
  Lock,
  Search,
} from 'lucide-react'
import { StatCard } from '../common/StatCard'
import { Card } from '../common/Card'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import type { ThreatPreview } from '../../types'

export const OverviewDashboard: React.FC = () => {
  // Sample threat vector feed demonstrating UI layout and status indicators
  const mockThreats: ThreatPreview[] = [
    {
      id: 'THREAT-9821',
      sender: 'security-update@micros0ft-verify.com',
      subject: 'Critical Office 365 Password Expiration Alert',
      timestamp: '2 mins ago',
      severity: 'critical',
      confidence: 99.4,
      detectionVector: 'Homograph Domain + Credential Harvester',
      status: 'quarantined',
    },
    {
      id: 'THREAT-9820',
      sender: 'billing@paypaI-receipts.net',
      subject: 'Invoice #84920 Payment Confirmation Required',
      timestamp: '14 mins ago',
      severity: 'high',
      confidence: 94.2,
      detectionVector: 'Zero-Font Deception + Spoofed DKIM',
      status: 'quarantined',
    },
    {
      id: 'THREAT-9819',
      sender: 'hr-portal@globalpartners.org',
      subject: 'Q3 Executive Performance Review Summary.pdf',
      timestamp: '42 mins ago',
      severity: 'medium',
      confidence: 81.7,
      detectionVector: 'Hidden Macro + External Callout',
      status: 'flagged',
    },
    {
      id: 'THREAT-9818',
      sender: 'noreply@github-enterprise.co',
      subject: 'Urgent: Two-Factor Authentication Reset Notice',
      timestamp: '1 hour ago',
      severity: 'critical',
      confidence: 98.9,
      detectionVector: 'Brand Impersonation & Malicious Link',
      status: 'quarantined',
    },
  ]

  const severityBadgeMap = {
    critical: 'danger',
    high: 'danger',
    medium: 'warning',
    low: 'neutral',
    safe: 'success',
  } as const

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Welcome / Defense Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-cyber-card border border-cyber-border relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-full bg-grid-pattern bg-grid-sm opacity-25 pointer-events-none" />
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-cyber-textPrimary">
              Autonomous Threat Interception Center
            </h1>
            <Badge variant="cyan" size="sm">
              v1.0.0 Alpha
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-cyber-textSecondary max-w-2xl">
            Real-time phishing triage, domain brand spoofing defense, and heuristic behavioral analysis foundation.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <Button variant="secondary" size="sm" icon={<ExternalLink className="h-3.5 w-3.5" />}>
            Export Logs
          </Button>
          <Button variant="primary" size="sm" icon={<Search className="h-3.5 w-3.5" />}>
            Quick Threat Audit
          </Button>
        </div>
      </motion.div>

      {/* Key Security Telemetry Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Monitored Inboxes"
          value="24,892"
          change="+12.4%"
          trend="up"
          helperText="vs last week"
          icon={<Globe className="h-5 w-5" />}
          variant="cyan"
        />
        <StatCard
          title="Phishing Quarantined"
          value="1,418"
          change="100% neutralized"
          trend="neutral"
          icon={<ShieldCheck className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="Zero-Day Suspicious"
          value="27"
          change="3 pending audit"
          trend="neutral"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="warning"
        />
        <StatCard
          title="Inference Latency"
          value="18ms"
          change="Real-time stream"
          trend="down"
          icon={<Zap className="h-5 w-5" />}
          variant="cyan"
        />
      </motion.div>

      {/* Main Grid: Incident Table & Defense Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Interception Stream */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2 space-y-4"
        >
          <Card className="p-5">
            <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
              <div className="flex items-center gap-2.5">
                <Radio className="h-4 w-4 text-cyber-cyan animate-pulse" />
                <h2 className="text-sm font-semibold tracking-wide text-cyber-textPrimary">
                  Real-time Interception Feed
                </h2>
              </div>
              <Badge variant="cyan" size="sm">
                4 New Alerts
              </Badge>
            </div>

            <div className="divide-y divide-cyber-border/60">
              {mockThreats.map((threat) => (
                <div
                  key={threat.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-cyber-panel/40 px-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-cyber-textPrimary truncate max-w-xs">
                        {threat.subject}
                      </span>
                      <Badge
                        variant={severityBadgeMap[threat.severity]}
                        size="sm"
                        dot={threat.severity === 'critical'}
                      >
                        {threat.severity}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-cyber-textSecondary font-mono">
                      <span className="text-cyber-textMuted">From:</span>
                      <span className="text-cyber-cyan truncate max-w-xs">{threat.sender}</span>
                      <span className="text-cyber-border">•</span>
                      <span className="text-cyber-textMuted">{threat.detectionVector}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono font-medium text-cyber-cyan">
                        {threat.confidence}% conf.
                      </div>
                      <span className="text-[10px] text-cyber-textMuted font-mono">
                        {threat.timestamp}
                      </span>
                    </div>

                    <Button variant="secondary" size="sm">
                      Inspect
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-cyber-border flex items-center justify-between text-xs text-cyber-textSecondary">
              <span className="font-mono text-cyber-textMuted">Showing recent telemetry stream</span>
              <button className="text-cyber-cyan hover:underline font-medium">
                View All Quarantined (14) →
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Right Column (1 Col): System Architecture & Engines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-4"
        >
          {/* Engine Status Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-cyber-cyan" />
                <h3 className="text-sm font-semibold text-cyber-textPrimary">
                  Defense Matrix Readiness
                </h3>
              </div>
              <Badge variant="cyan" size="sm" dot>
                Active
              </Badge>
            </div>

            <div className="space-y-3">
              {[
                { name: 'URL & Domain Heuristics', state: 'Ready', health: '100%' },
                { name: 'DKIM / SPF / DMARC Verifier', state: 'Standby', health: '99%' },
                { name: 'Zero-Font & NLP Parser', state: 'Initialized', health: '100%' },
                { name: 'Deep Sandbox Behavioral Hook', state: 'Awaiting Milestone', health: 'Pending' },
              ].map((engine, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-cyber-panel/50 border border-cyber-border/70 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCheck2 className="h-3.5 w-3.5 text-cyber-cyan shrink-0" />
                    <span className="font-medium text-cyber-textPrimary truncate">
                      {engine.name}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-cyber-textMuted shrink-0 ml-2">
                    {engine.state}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Security Tip Card */}
          <Card className="p-5 border-cyber-cyan/20 bg-gradient-to-br from-cyber-card to-cyber-panel">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-cyan font-mono mb-1.5">
              Frontend Foundation Milestone
            </h4>
            <p className="text-xs text-cyber-textSecondary leading-relaxed">
              Premium UI tokens, dark slate-blue panels, and typography hierarchy are active. Ready for upcoming integration milestones.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
