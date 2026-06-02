'use client';
import { ShieldAlert, Server, Activity, Database, Users } from 'lucide-react';

export default function AdminPanopticon() {
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center animate-pulse">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">Admin Panopticon</h2>
          <p className="text-xs text-[#9ca3af]">System God-Mode Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 rounded-xl border-l-2 border-l-[#00e5ff]">
          <div className="flex items-center gap-2 mb-2 text-[#9ca3af]">
            <Server className="w-4 h-4 text-[#00e5ff]" />
            <span className="text-xs uppercase tracking-wider">System Latency</span>
          </div>
          <div className="text-2xl font-bold text-white">12<span className="text-sm text-[#00e5ff]">ms</span></div>
        </div>
        
        <div className="glass-card p-4 rounded-xl border-l-2 border-l-red-500">
          <div className="flex items-center gap-2 mb-2 text-[#9ca3af]">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span className="text-xs uppercase tracking-wider">Fraud Events Blocked</span>
          </div>
          <div className="text-2xl font-bold text-white">1,024<span className="text-sm text-red-500"> (Today)</span></div>
        </div>

        <div className="glass-card p-4 rounded-xl border-l-2 border-l-[#b900ff]">
          <div className="flex items-center gap-2 mb-2 text-[#9ca3af]">
            <Database className="w-4 h-4 text-[#b900ff]" />
            <span className="text-xs uppercase tracking-wider">Active DB Nodes</span>
          </div>
          <div className="text-2xl font-bold text-white">3<span className="text-sm text-[#b900ff]">/3 Healthy</span></div>
        </div>
      </div>

      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">ML Threat Detection Stream</h3>
      <div className="flex-1 glass-card rounded-xl p-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scanline shadow-[0_0_10px_#ef4444]" />
        
        <div className="space-y-3 font-mono text-[10px]">
          <div className="flex justify-between items-center text-[#9ca3af] border-b border-white/5 pb-2">
            <span>TIMESTAMP</span>
            <span>IP ORIGIN</span>
            <span>THREAT VECTOR</span>
            <span>ACTION</span>
          </div>
          <div className="flex justify-between items-center text-white">
            <span className="text-[#00e5ff]">13:42:05.112Z</span>
            <span>192.168.1.45</span>
            <span>SIM Swap Attempt (Prob: 98%)</span>
            <span className="text-red-500 bg-red-500/20 px-2 py-1 rounded">BLOCKED</span>
          </div>
          <div className="flex justify-between items-center text-white">
            <span className="text-[#00e5ff]">13:41:12.890Z</span>
            <span>45.22.19.102</span>
            <span>Anomalous Geo-velocity</span>
            <span className="text-[#b900ff] bg-[#b900ff]/20 px-2 py-1 rounded">CHALLENGED</span>
          </div>
          <div className="flex justify-between items-center text-white opacity-50">
            <span className="text-[#00e5ff]">13:38:01.004Z</span>
            <span>10.0.0.8</span>
            <span>Failed Passkey Auth x3</span>
            <span className="text-yellow-500 bg-yellow-500/20 px-2 py-1 rounded">LOGGED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
