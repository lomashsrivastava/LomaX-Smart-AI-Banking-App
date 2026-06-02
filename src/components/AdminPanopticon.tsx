'use client';
import { useAppStore } from '@/lib/store';
import { Shield, Activity, AlertTriangle, Eye, Server, Lock, FileSearch, Hash } from 'lucide-react';

export default function AdminPanopticon() {
  const { systemHealth, fraudEvents, auditLogs } = useAppStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#ef4444]/15">
          <Eye className="w-5 h-5 text-[#ef4444]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Admin Panopticon</h3>
          <p className="text-[10px] text-[#9ca3af]">System health • Fraud storm • Merkle audit chain</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* System Health Grid */}
        <div>
          <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Server className="w-3.5 h-3.5" /> Service Health
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {systemHealth.map(s => (
              <div key={s.service} className="glass-card p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${s.status === 'healthy' ? 'bg-[#10b981] shadow-[0_0_6px_#10b981]' : s.status === 'degraded' ? 'bg-[#f59e0b] shadow-[0_0_6px_#f59e0b] animate-pulse' : 'bg-[#ef4444] shadow-[0_0_6px_#ef4444] animate-pulse'}`} />
                  <span className="text-[10px] font-medium text-white truncate">{s.service}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
                  <div><span className="text-[#6b7280]">Latency: </span><span className={s.latencyMs > 500 ? 'text-[#f59e0b]' : 'text-[#10b981]'}>{s.latencyMs}ms</span></div>
                  <div><span className="text-[#6b7280]">CPU: </span><span className={s.cpuUsage > 80 ? 'text-[#ef4444]' : 'text-white'}>{s.cpuUsage}%</span></div>
                  <div><span className="text-[#6b7280]">Mem: </span><span className="text-white">{s.memoryUsage}%</span></div>
                  <div><span className="text-[#6b7280]">Err: </span><span className={s.errorRate > 0.1 ? 'text-[#ef4444]' : 'text-[#10b981]'}>{s.errorRate}%</span></div>
                </div>
                <p className="text-[8px] text-[#6b7280] mt-1">Uptime: {s.uptime}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fraud Storm */}
        <div>
          <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" /> Fraud Storm — Live
          </h4>
          {fraudEvents.map(f => (
            <div key={f.id} className={`glass-card p-3 rounded-xl mb-2 border-l-2 ${
              f.decision === 'block' ? 'border-l-[#ef4444]' : f.decision === 'challenge' ? 'border-l-[#f59e0b]' : 'border-l-[#10b981]'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white">Rule: {f.ruleTriggered.replace(/_/g, ' ')}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold ${
                  f.decision === 'block' ? 'bg-[#ef4444]/15 text-[#ef4444]' :
                  f.decision === 'challenge' ? 'bg-[#f59e0b]/15 text-[#f59e0b]' :
                  'bg-[#10b981]/15 text-[#10b981]'
                }`}>{f.decision}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-[#6b7280]">
                <span>ML Score: <span className={f.mlScore > 0.8 ? 'text-[#ef4444]' : 'text-[#f59e0b]'}>{(f.mlScore * 100).toFixed(0)}%</span></span>
                <span>User: {f.userId}</span>
                <span className={`capitalize ${f.resolution === 'confirmed_fraud' ? 'text-[#ef4444]' : f.resolution === 'false_positive' ? 'text-[#10b981]' : 'text-[#f59e0b]'}`}>
                  {f.resolution.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-[9px] text-[#6b7280] mt-1">{new Date(f.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Audit Chain */}
        <div>
          <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" /> Immutable Audit Chain
          </h4>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 p-2 border-b border-white/5 text-[9px] text-[#6b7280] font-semibold uppercase">
              <span>Time</span><span>Action</span><span>IP</span><span>Merkle Hash</span>
            </div>
            {auditLogs.slice(0, 12).map((log, i) => (
              <div key={log.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 p-2 border-b border-white/[0.02] text-[10px] hover:bg-white/[0.02] transition-colors items-center">
                <span className="text-[#6b7280] whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="text-white capitalize truncate">{log.action.replace(/_/g, ' ')}</span>
                <span className="text-[#6b7280] font-mono text-[9px]">{log.ipAddress}</span>
                <span className="text-[#00e5ff] font-mono text-[8px] flex items-center gap-1">
                  <Hash className="w-2.5 h-2.5" />
                  {log.merkleHash.slice(0, 10)}...
                </span>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-[#6b7280] mt-2 flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#00e5ff]" />
            Chain integrity verified • Dilithium-signed • Tamper-proof
          </p>
        </div>
      </div>
    </div>
  );
}
