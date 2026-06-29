"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, TrendingUp, DollarSign, Activity, Percent, 
  MapPin, Clock, ArrowDownLeft, ArrowUpRight, ShieldAlert 
} from "lucide-react";

export default function AnalyticsDashboardPage() {
  const [period, setPeriod] = useState<"24h" | "7d" | "30d" | "365d">("30d");
  const [metrics, setMetrics] = useState({
    totalVolume: 84291850,
    averageTxn: 14500,
    successRate: 99.86,
    activeNodes: 12,
  });

  // Handle fake updates on period change to make UI feel interactive
  useEffect(() => {
    let multiplier = 1;
    if (period === "24h") multiplier = 0.05;
    if (period === "7d") multiplier = 0.25;
    if (period === "30d") multiplier = 1;
    if (period === "365d") multiplier = 12;

    setMetrics({
      totalVolume: Math.floor(84291850 * multiplier),
      averageTxn: Math.floor(14500 + (Math.random() - 0.5) * 2000),
      successRate: parseFloat((99.7 + Math.random() * 0.25).toFixed(2)),
      activeNodes: 12,
    });
  }, [period]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-200">
      
      {/* Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)] flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-400" /> Transaction Analytics
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Aggregating real-time financial ledger data across regional hubs.</p>
        </div>
        <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800 w-fit">
          {(["24h", "7d", "30d", "365d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                period === p
                  ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                  : "text-slate-500 hover:text-slate-350"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total volume */}
        <div className="border border-slate-800/80 bg-slate-900/60 p-5 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
          <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-1.5">Settlement Volume</p>
          <p className="text-2xl font-black text-slate-100 font-mono">₹{metrics.totalVolume.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold font-mono mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs prev period
          </div>
        </div>

        {/* Average transaction size */}
        <div className="border border-slate-800/80 bg-slate-900/60 p-5 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
          <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-1.5">Avg Ticket Size</p>
          <p className="text-2xl font-black text-slate-100 font-mono">₹{metrics.averageTxn.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold font-mono mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +4.8% vs prev period
          </div>
        </div>

        {/* Settlement success rate */}
        <div className="border border-slate-800/80 bg-slate-900/60 p-5 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
          <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-1.5">Success Rate</p>
          <p className="text-2xl font-black text-emerald-400 font-mono">{metrics.successRate}%</p>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold font-mono mt-2">
            <Percent className="w-3.5 h-3.5 text-emerald-400" /> Optimal HSM Operations
          </div>
        </div>

        {/* Active nodes */}
        <div className="border border-slate-800/80 bg-slate-900/60 p-5 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl" />
          <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-1.5">Active HSM Units</p>
          <p className="text-2xl font-black text-indigo-400 font-mono">{metrics.activeNodes}/12</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold font-mono mt-2">
            <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Nodes in Sync
          </div>
        </div>
      </div>

      {/* Visual charts block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Settlement Trend Chart */}
        <div className="lg:col-span-8 border border-slate-800 bg-slate-950/60 p-6 rounded-3xl backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider">Settlement Trend Matrix</h3>
            <span className="text-[10px] font-mono text-slate-500">Historical performance chart</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-2.5 pt-6 font-mono text-[9px] text-slate-500">
            {/* Custom SVG line representing a financial trend graph */}
            <div className="relative w-full h-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 220" fill="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(99,102,241,0.3)" />
                    <stop offset="100%" stopColor="rgba(99,102,241,0)" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.03)" strokeDasharray="3" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,0.03)" strokeDasharray="3" />
                <line x1="0" y1="160" x2="600" y2="160" stroke="rgba(255,255,255,0.03)" strokeDasharray="3" />
                
                {/* Area path */}
                <path d="M 0 190 Q 75 140 150 110 T 300 80 T 450 120 T 600 50 L 600 220 L 0 220 Z" fill="url(#chartGrad)" />
                {/* Line path */}
                <path d="M 0 190 Q 75 140 150 110 T 300 80 T 450 120 T 600 50" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
                
                {/* Data points */}
                <circle cx="150" cy="110" r="4" fill="#6366f1" stroke="#000" strokeWidth="1.5" />
                <circle cx="300" cy="80" r="4" fill="#6366f1" stroke="#000" strokeWidth="1.5" />
                <circle cx="450" cy="120" r="4" fill="#6366f1" stroke="#000" strokeWidth="1.5" />
                <circle cx="600" cy="50" r="4" fill="#a78bfa" stroke="#000" strokeWidth="1.5" />
              </svg>
              {/* Bottom dates labels */}
              <div className="flex justify-between mt-3 font-mono text-[9px] text-slate-500">
                <span>01 {period === "24h" ? "Hour" : "Day"}</span>
                <span>10 {period === "24h" ? "Hour" : "Day"}</span>
                <span>20 {period === "24h" ? "Hour" : "Day"}</span>
                <span>30 {period === "24h" ? "Hour" : "Day"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Credit / Debit Split (lg:col-span-4) */}
        <div className="lg:col-span-4 border border-slate-800 bg-slate-950/60 p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider border-b border-slate-900 pb-3">Volume Distribution</h3>
            
            <div className="relative flex justify-center py-6">
              {/* SVG donut chart */}
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r="50" fill="transparent" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="12" />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="50" 
                  fill="transparent" 
                  stroke="#10b981" 
                  strokeWidth="12" 
                  strokeDasharray="314" 
                  strokeDashoffset="110" 
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-mono">
                <span className="block text-slate-400 text-[10px]">CREDITS</span>
                <span className="text-lg font-black text-emerald-400">65%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 font-mono text-[10px] text-slate-400">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Inward Credits</span>
              <span className="text-slate-200 font-bold">65%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Outward Debits</span>
              <span className="text-slate-200 font-bold">35%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Density Ticker */}
      <div className="border border-slate-800 bg-slate-950/40 p-6 rounded-3xl backdrop-blur-md">
        <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider mb-4">Regional Hub Density</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {[
            { name: "Mumbai Hub", code: "MUM-01", status: "Nominal", density: 85, color: "text-cyan-400" },
            { name: "Delhi Hub", code: "DEL-02", status: "Nominal", density: 72, color: "text-indigo-400" },
            { name: "Bhopal Hub", code: "BHP-03", status: "Nominal", density: 64, color: "text-teal-400" },
            { name: "Bangalore Hub", code: "BLR-04", status: "Nominal", density: 91, color: "text-violet-400" },
          ].map((h) => (
            <div key={h.code} className="border border-slate-850 bg-slate-900/40 p-4 rounded-xl space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">{h.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded bg-slate-950 font-bold ${h.color}`}>{h.status}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>LOAD FACTOR:</span>
                  <span>{h.density}%</span>
                </div>
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r from-blue-500 to-indigo-500`} style={{ width: `${h.density}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
