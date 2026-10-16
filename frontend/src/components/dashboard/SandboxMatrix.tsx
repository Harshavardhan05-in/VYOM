import React, { useState } from 'react'
import {
  Terminal,
  Play,
  Pause,
  Cpu,
  HardDrive,
  Activity,
  Radio,
} from 'lucide-react'
import { Badge } from '../common/Badge'

export const SandboxMatrix: React.FC = () => {
  const [isRunning, setIsRunning] = useState(true)

  const sandboxTelemetry = [
    { time: '14:22:01.042', event: 'SYS_CALL_HOOK', detail: 'NtCreateFile intercepted -> \\Device\\HarddiskVolume3\\Windows\\System32\\calc.exe' },
    { time: '14:22:01.218', event: 'REG_WRITE_ATTEMPT', detail: 'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run -> Blocked by Guard' },
    { time: '14:22:01.402', event: 'DNS_RESOLVE_QUERY', detail: 'Querying C2 host: c2-beacon-relay-pool.xyz (ASN 48322)' },
    { time: '14:22:01.670', event: 'PACKET_INSPECTION', detail: 'TLS handshake with known dynamic DNS provider blocked' },
    { time: '14:22:02.109', event: 'HEURISTIC_RATING', detail: 'Process behavioral divergence: 88.4% anomaly threshold exceeded' },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#04182B] border border-[#00D9FF]/25 shadow-[0_8px_30px_rgba(2,11,22,0.8)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#061B30] border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shadow-[0_0_14px_rgba(0,217,255,0.25)]">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#F8FAFC]">
                  Sandbox Detonation Matrix
                </h1>
                <Badge variant="warning" size="sm" dot>
                  Isolated Hypervisor
                </Badge>
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Real-time kernel hook emulation, syscall interception, and virtual memory tracing for hostile payloads.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-3 py-1.5 rounded-lg bg-[#061426] border border-[#00D9FF]/30 text-xs font-mono text-[#00D9FF] hover:bg-[#061B30] transition-colors flex items-center gap-1.5"
            >
              {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isRunning ? 'Pause Telemetry' : 'Resume Telemetry'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hypervisor Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#04182B] border border-[#00D9FF]/20 flex items-center gap-3">
          <Cpu className="h-8 w-8 text-[#00D9FF] p-1.5 rounded-lg bg-[#061B30] border border-[#00D9FF]/30 shrink-0" />
          <div>
            <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Virtual CPU Allocation</span>
            <p className="text-sm font-bold text-[#F8FAFC] font-mono">4 vCPUs • QEMU KVM</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#04182B] border border-[#00D9FF]/20 flex items-center gap-3">
          <HardDrive className="h-8 w-8 text-[#00D9FF] p-1.5 rounded-lg bg-[#061B30] border border-[#00D9FF]/30 shrink-0" />
          <div>
            <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Overlay RAM Disk</span>
            <p className="text-sm font-bold text-[#F8FAFC] font-mono">Volatile Shadow Image</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#04182B] border border-[#00D9FF]/20 flex items-center gap-3">
          <Activity className="h-8 w-8 text-[#00D9FF] p-1.5 rounded-lg bg-[#061B30] border border-[#00D9FF]/30 shrink-0" />
          <div>
            <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Network Honeynet Bridge</span>
            <p className="text-sm font-bold text-[#10B981] font-mono">DNS Sinkhole Active</p>
          </div>
        </div>
      </div>

      {/* Live Terminal Log Stream */}
      <div className="rounded-2xl bg-[#020B16] border border-[#00D9FF]/30 p-4 sm:p-5 font-mono text-xs space-y-3 shadow-[0_0_30px_rgba(0,217,255,0.1)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#00D9FF]/20 text-[11px] text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-[#00D9FF] animate-pulse" />
            <span className="text-[#F8FAFC] font-bold">Live Syscall Trace Buffer</span>
          </div>
          <span>Buffer: Ring-0 Intercept Mode</span>
        </div>

        <div className="space-y-2 text-[#CBD5E1]">
          {sandboxTelemetry.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <span className="text-[#64748B] text-[10px] shrink-0">[{item.time}]</span>
              <span className="text-[#00D9FF] font-semibold text-[11px] shrink-0">[{item.event}]</span>
              <span className="text-[#F8FAFC] break-all">{item.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
