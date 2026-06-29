"use client";

import { useState, useEffect } from "react";
import { 
  Building2, Users, CreditCard, Wallet, ArrowRightLeft, 
  TrendingUp, TrendingDown, Clock, Activity, Shield, Zap, 
  Globe, Cpu, Layers, Settings2, Lock, CheckCircle2, 
  ShieldAlert, HardDrive, Server, Radio
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface DashboardStats {
  totalBranches: number;
  totalAccounts: number;
  totalCustomers: number;
  totalBalance: number;
  recentTransactions: any[];
  monthlyTxVolume: number;
  monthlyTxCount: number;
}

interface NodeDetail {
  name: string;
  branches: number;
  latency: number;
  status: "Normal" | "High Load" | "Idle";
  color: string;
  ip: string;
}

const networkNodes: Record<string, NodeDetail> = {
  Bhopal: { name: "Bhopal (Central Branch)", branches: 114, latency: 18, status: "Normal", color: "#22d3ee", ip: "10.0.1.1" },
  Mumbai: { name: "Mumbai (West Branch)", branches: 186, latency: 22, status: "High Load", color: "#a78bfa", ip: "10.0.2.1" },
  Delhi: { name: "New Delhi (North Branch)", branches: 142, latency: 26, status: "Normal", color: "#34d399", ip: "10.0.3.1" },
  Bengaluru: { name: "Bengaluru (South Branch)", branches: 98, latency: 14, status: "Normal", color: "#fbbf24", ip: "10.0.4.1" },
  Kolkata: { name: "Kolkata (East Branch)", branches: 50, latency: 32, status: "Idle", color: "#f87171", ip: "10.0.5.1" }
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Advanced States
  const [activeMetric, setActiveMetric] = useState<"tx" | "liquidity" | "latency">("tx");
  const [hoveredChartPoint, setHoveredChartPoint] = useState<{ x: number; y: number; val: string } | null>(null);
  const [selectedNode, setSelectedNode] = useState<string>("Bhopal");
  const [uptime, setUptime] = useState(1284719);
  
  // Security Controls
  const [quantumCrypto, setQuantumCrypto] = useState(true);
  const [ledgerAudit, setLedgerAudit] = useState(true);
  const [threatScan, setThreatScan] = useState(true);

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard/stats");
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // System Uptime counter
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center text-slate-400 animate-pulse flex flex-col items-center">
          <Activity className="w-16 h-16 text-cyan-400 mb-6 animate-spin" />
          <p className="text-lg font-bold tracking-widest font-mono text-cyan-300">LOADING BANK PORTAL CORE...</p>
        </div>
      </div>
    );
  }

  // Format uptime string
  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  // Compute System Defense Index
  const defenseIndex = 65 + (quantumCrypto ? 15 : 0) + (ledgerAudit ? 10 : 0) + (threatScan ? 10 : 0);

  // SVG Chart Data paths
  const chartPaths = {
    tx: {
      path: "M 30,170 C 100,160 150,80 250,110 C 350,140 450,40 550,50 C 650,60 750,120 850,20",
      points: [
        { cx: 30, cy: 170, val: "₹1.2M", label: "06:00" },
        { cx: 250, cy: 110, val: "₹2.8M", label: "12:00" },
        { cx: 550, cy: 50, val: "₹4.5M", label: "18:00" },
        { cx: 850, cy: 20, val: "₹5.9M", label: "00:00" }
      ],
      title: "Transaction Activity (Last 24 Hours)",
      stroke: "#22d3ee"
    },
    liquidity: {
      path: "M 30,120 C 150,130 250,150 400,100 C 550,50 650,90 750,70 C 800,60 850,40 850,40",
      points: [
        { cx: 30, cy: 120, val: "₹428M", label: "Week 1" },
        { cx: 400, cy: 100, val: "₹442M", label: "Week 2" },
        { cx: 750, cy: 70, val: "₹475M", label: "Week 3" },
        { cx: 850, cy: 40, val: "₹492M", label: "Week 4" }
      ],
      title: "Consolidated Liquidity Reserves",
      stroke: "#34d399"
    },
    latency: {
      path: "M 30,50 C 150,55 300,140 450,30 C 600,180 750,45 850,48",
      points: [
        { cx: 30, cy: 50, val: "14ms", label: "06:00" },
        { cx: 450, cy: 30, val: "12ms", label: "12:00" },
        { cx: 600, cy: 180, val: "48ms (Spike)", label: "18:00" },
        { cx: 850, cy: 48, val: "16ms", label: "00:00" }
      ],
      title: "Core Database Latency & Sync Times",
      stroke: "#a78bfa"
    }
  };

  // SVG Circular progress radius computation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (defenseIndex / 100) * circumference;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0.1; }
          50% { opacity: 0.2; }
          100% { transform: translateY(100%); opacity: 0.1; }
        }
        @keyframes flow-line {
          0% { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 0; }
        }
        .cyber-grid {
          background-image: 
            linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95)), 
            linear-gradient(to right, rgba(6, 182, 212, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
          background-size: 100% 100%, 30px 30px, 30px 30px;
        }
      `}} />

      {/* Header and Control Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-950/70 border border-slate-900 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              LomaX Bank Administration
            </h1>
            <span className="flex items-center gap-1 bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> ALL SYSTEMS ACTIVE
            </span>
          </div>
          <p className="text-slate-400 text-sm">Central dashboard for managing regional branches, customer directories, and transactional databases.</p>
        </div>

        {/* Live Uptime */}
        <div className="flex flex-wrap gap-4 font-mono">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 min-w-[140px] shadow-inner">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">SERVER UPTIME</span>
            <span className="text-slate-200 text-sm font-semibold whitespace-nowrap">{formatUptime(uptime)}</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 min-w-[140px] shadow-inner">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">SECURITY STATUS</span>
            <span className="text-cyan-400 text-sm font-bold block">{defenseIndex}% Secure</span>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Branches */}
        <div className="border border-cyan-500/20 bg-slate-950/40 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all duration-300">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Branch Directory</p>
              <h3 className="text-3xl font-extrabold text-cyan-400 mt-1 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">{stats.totalBranches}</h3>
            </div>
            <div className="p-3 bg-cyan-950/60 rounded-2xl border border-cyan-500/30 text-cyan-400 shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-xs text-emerald-400 relative z-10">
            <span className="bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded-lg text-emerald-300 font-semibold font-mono">India Active Division</span>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="border border-indigo-500/20 bg-slate-950/40 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Accounts</p>
              <h3 className="text-3xl font-extrabold text-indigo-400 mt-1 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]">{stats.totalAccounts}</h3>
            </div>
            <div className="p-3 bg-indigo-950/60 rounded-2xl border border-indigo-500/30 text-indigo-400 shadow-md">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <div className="text-xs text-slate-400 relative z-10 flex items-center gap-1 font-mono">
            Across <strong className="text-indigo-300">{stats.totalCustomers}</strong> registered users
          </div>
        </div>

        {/* Total Deposits */}
        <div className="border border-emerald-500/20 bg-slate-950/40 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(52,211,153,0.15)] transition-all duration-300">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Reserves</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                ₹{stats.totalBalance.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="p-3 bg-emerald-950/60 rounded-2xl border border-emerald-500/30 text-emerald-400 shadow-md">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-xs text-emerald-400 relative z-10 font-semibold font-mono gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Core Banking Liquidity
          </div>
        </div>

        {/* 30-Day TX Volume */}
        <div className="border border-purple-500/20 bg-slate-950/40 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">30-Day Ledger Volume</p>
              <h3 className="text-3xl font-extrabold text-purple-400 mt-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                ₹{(stats.monthlyTxVolume || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="p-3 bg-purple-950/60 rounded-2xl border border-purple-500/30 text-purple-400 shadow-md">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
          </div>
          <div className="text-xs text-purple-300 relative z-10 flex items-center gap-1 font-mono">
            <Zap className="w-3 h-3 text-purple-400" /> {stats.monthlyTxCount} operations processed
          </div>
        </div>
      </div>

      {/* Interactive Charts and Network Topology Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dynamic Metric Chart Card (2/3 width) */}
        <Card className="lg:col-span-2 border border-slate-900 bg-slate-950/50 rounded-3xl backdrop-blur-md overflow-hidden relative p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-900 pb-4 mb-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" /> {chartPaths[activeMetric].title}
              </h2>
              <p className="text-xs text-slate-400">Interactive live metrics tracker. Hover points to read value.</p>
            </div>
            
            {/* Metric Selector Buttons */}
            <div className="flex bg-slate-900/60 border border-slate-800 p-1 rounded-xl w-fit">
              <button 
                onClick={() => setActiveMetric("tx")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMetric === "tx" 
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                TX Activity
              </button>
              <button 
                onClick={() => setActiveMetric("liquidity")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMetric === "liquidity" 
                    ? "bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(52,211,153,0.3)]" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Liquidity
              </button>
              <button 
                onClick={() => setActiveMetric("latency")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMetric === "latency" 
                    ? "bg-violet-500 text-slate-950 shadow-[0_0_10px_rgba(167,139,250,0.3)]" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                DB Latency
              </button>
            </div>
          </div>

          {/* SVG Animated Chart */}
          <div className="relative w-full h-[220px] bg-slate-950/70 border border-slate-900/80 rounded-2xl p-4 overflow-visible cyber-grid">
            <svg className="w-full h-full" viewBox="0 0 900 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartPaths[activeMetric].stroke} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={chartPaths[activeMetric].stroke} stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Background gradient fill */}
              <path 
                d={`${chartPaths[activeMetric].path} L 850,200 L 30,200 Z`} 
                fill="url(#chartGlow)"
                className="transition-all duration-700 ease-in-out"
              />

              {/* Grid Lines */}
              <line x1="30" y1="20" x2="850" y2="20" stroke="#1e293b" strokeDasharray="4" />
              <line x1="30" y1="80" x2="850" y2="80" stroke="#1e293b" strokeDasharray="4" />
              <line x1="30" y1="140" x2="850" y2="140" stroke="#1e293b" strokeDasharray="4" />
              
              {/* Chart Line Path */}
              <path 
                d={chartPaths[activeMetric].path} 
                fill="none" 
                stroke={chartPaths[activeMetric].stroke} 
                strokeWidth="3.5"
                strokeLinecap="round"
                className="transition-all duration-700 ease-in-out"
                style={{ 
                  strokeDasharray: "1000", 
                  strokeDashoffset: "0",
                  animation: "flow-line 2s linear" 
                }}
              />

              {/* Interactive nodes */}
              {chartPaths[activeMetric].points.map((pt, idx) => (
                <g key={idx} className="cursor-pointer group/node" 
                   onMouseEnter={() => setHoveredChartPoint({ x: pt.cx, y: pt.cy, val: pt.val })}
                   onMouseLeave={() => setHoveredChartPoint(null)}>
                  <circle 
                    cx={pt.cx} 
                    cy={pt.cy} 
                    r="6" 
                    fill="#0f172a" 
                    stroke={chartPaths[activeMetric].stroke} 
                    strokeWidth="3.5"
                    className="transition-all duration-300 group-hover/node:r-8"
                  />
                  <circle 
                    cx={pt.cx} 
                    cy={pt.cy} 
                    r="12" 
                    fill={chartPaths[activeMetric].stroke} 
                    fillOpacity="0.2"
                    className="opacity-0 group-hover/node:opacity-100 transition-opacity"
                  />
                  
                  {/* Label */}
                  <text 
                    x={pt.cx} 
                    y="190" 
                    fill="#64748b" 
                    fontSize="10" 
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>

            {/* Custom Tooltip on Hover */}
            {hoveredChartPoint && (
              <div 
                className="absolute bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-100 pointer-events-none shadow-xl transform -translate-x-1/2 -translate-y-[130%]"
                style={{ left: `${(hoveredChartPoint.x / 900) * 100}%`, top: `${(hoveredChartPoint.y / 200) * 100}%` }}
              >
                {hoveredChartPoint.val}
              </div>
            )}
          </div>
        </Card>

        {/* Regional Banking Hubs (1/3 width) */}
        <Card className="border border-slate-900 bg-slate-950/50 rounded-3xl backdrop-blur-md overflow-hidden relative p-6 flex flex-col justify-between">
          <div className="space-y-1 pb-2 border-b border-slate-900">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" /> Regional Banking Hubs
            </h2>
            <p className="text-xs text-slate-400">Location clusters. Click node to view regional branch status.</p>
          </div>

          {/* India Map drawing */}
          <div className="relative w-full h-[220px] my-4 bg-slate-950/80 border border-slate-900 rounded-2xl flex items-center justify-center p-2">
            <svg viewBox="0 0 350 350" className="w-full h-full">
              {/* routes */}
              <path d="M 160,170 L 150,80" stroke="#1e293b" strokeWidth="2" strokeDasharray="3" />
              <path d="M 160,170 L 80,220" stroke="#1e293b" strokeWidth="2" strokeDasharray="3" />
              <path d="M 160,170 L 120,320" stroke="#1e293b" strokeWidth="2" strokeDasharray="3" />
              <path d="M 160,170 L 170,310" stroke="#1e293b" strokeWidth="2" strokeDasharray="3" />
              <path d="M 160,170 L 270,170" stroke="#1e293b" strokeWidth="2" strokeDasharray="3" />

              {/* Bhopal */}
              <g className="cursor-pointer" onClick={() => setSelectedNode("Bhopal")}>
                <circle cx="160" cy="170" r="16" fill="rgba(34, 211, 238, 0.15)" className="animate-pulse" />
                <circle cx="160" cy="170" r="6" fill="#22d3ee" className="drop-shadow-[0_0_8px_#22d3ee]" />
                <text x="160" y="195" fill="#22d3ee" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">BHOPAL</text>
              </g>

              {/* Mumbai */}
              <g className="cursor-pointer" onClick={() => setSelectedNode("Mumbai")}>
                <circle cx="80" cy="220" r="12" fill="rgba(167, 139, 250, 0.15)" />
                <circle cx="80" cy="220" r="5" fill="#a78bfa" className="drop-shadow-[0_0_8px_#a78bfa]" />
                <text x="80" y="240" fill="#a78bfa" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">MUMBAI</text>
              </g>

              {/* Delhi */}
              <g className="cursor-pointer" onClick={() => setSelectedNode("Delhi")}>
                <circle cx="150" cy="80" r="12" fill="rgba(52, 211, 153, 0.15)" />
                <circle cx="150" cy="80" r="5" fill="#34d399" className="drop-shadow-[0_0_8px_#34d399]" />
                <text x="150" y="68" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">DELHI</text>
              </g>

              {/* Bengaluru */}
              <g className="cursor-pointer" onClick={() => setSelectedNode("Bengaluru")}>
                <circle cx="120" cy="320" r="12" fill="rgba(251, 191, 36, 0.15)" />
                <circle cx="120" cy="320" r="5" fill="#fbbf24" className="drop-shadow-[0_0_8px_#fbbf24]" />
                <text x="120" y="340" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">BANGALORE</text>
              </g>

              {/* Chennai */}
              <g className="cursor-pointer" onClick={() => setSelectedNode("Chennai")}>
                <circle cx="170" cy="310" r="8" fill="rgba(167, 139, 250, 0.1)" />
                <circle cx="170" cy="310" r="4.5" fill="#a78bfa" />
                <text x="212" y="313" fill="#a78bfa" fontSize="8" fontWeight="bold" className="font-mono">CHENNAI</text>
              </g>

              {/* Kolkata */}
              <g className="cursor-pointer" onClick={() => setSelectedNode("Kolkata")}>
                <circle cx="270" cy="170" r="12" fill="rgba(248, 113, 113, 0.15)" />
                <circle cx="270" cy="170" r="5" fill="#f87171" className="drop-shadow-[0_0_8px_#f87171]" />
                <text x="270" y="192" fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">KOLKATA</text>
              </g>
            </svg>
          </div>

          {/* Node detail display panel */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 uppercase tracking-widest font-bold">SELECTED HUB:</span>
              <span className="font-bold" style={{ color: networkNodes[selectedNode].color }}>
                {networkNodes[selectedNode].name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 uppercase">IP ADDRESS:</span>
              <span className="text-slate-300 font-bold">{networkNodes[selectedNode].ip}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 uppercase">LINK LATENCY:</span>
              <span className="text-slate-300 font-bold">{networkNodes[selectedNode].latency}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 uppercase">ROUTED BRANCHES:</span>
              <span className="text-slate-300 font-bold">{networkNodes[selectedNode].branches}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800/60">
              <span className="text-slate-500 uppercase">PORT STATUS:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                networkNodes[selectedNode].status === "Normal" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40" :
                networkNodes[selectedNode].status === "High Load" ? "bg-amber-950/60 text-amber-400 border border-amber-900/40" :
                "bg-slate-950 text-slate-400 border border-slate-800"
              }`}>
                {networkNodes[selectedNode].status}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Futuristic Multi-Grid Widget Layout (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Security Encryption (HSM) */}
        <Card className="border border-slate-900 bg-slate-950/50 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-slate-800 hover:shadow-[0_0_15px_rgba(99,102,241,0.08)] transition-all duration-300">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
            <div className="space-y-0.5">
              <h2 className="text-sm font-extrabold text-slate-200 flex items-center gap-2 tracking-wide">
                <Settings2 className="w-4 h-4 text-indigo-400" /> Security Encryption (HSM)
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">Data Encryption Modules</p>
            </div>
            <span className="text-[10px] bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold">SECURE</span>
          </div>

          <div className="flex gap-4 items-center justify-between flex-1 py-2">
            {/* Circular defense status ring */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#1e293b" strokeWidth="8" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r={radius} 
                  fill="transparent" 
                  stroke="#06b6d4" 
                  strokeWidth="8" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center font-mono">
                <span className="text-sm font-bold text-slate-100">{defenseIndex}%</span>
                <span className="text-[8px] text-slate-500 uppercase tracking-widest font-extrabold">SECURITY</span>
              </div>
            </div>

            {/* Cryptography Controls list */}
            <div className="flex-1 space-y-2.5">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1"><Lock className="w-3 h-3 text-cyan-400" /> Data Encryption</span>
                <button 
                  onClick={() => setQuantumCrypto(!quantumCrypto)}
                  className={`w-7 h-4 rounded-full p-0.5 transition-colors focus:outline-none ${quantumCrypto ? "bg-cyan-500" : "bg-slate-800"}`}
                >
                  <div className={`w-3 h-3 bg-slate-950 rounded-full transition-transform ${quantumCrypto ? "translate-x-3" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Database Integrity</span>
                <button 
                  onClick={() => setLedgerAudit(!ledgerAudit)}
                  className={`w-7 h-4 rounded-full p-0.5 transition-colors focus:outline-none ${ledgerAudit ? "bg-emerald-500" : "bg-slate-800"}`}
                >
                  <div className={`w-3 h-3 bg-slate-950 rounded-full transition-transform ${ledgerAudit ? "translate-x-3" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-purple-400" /> Malware Scanner</span>
                <button 
                  onClick={() => setThreatScan(!threatScan)}
                  className={`w-7 h-4 rounded-full p-0.5 transition-colors focus:outline-none ${threatScan ? "bg-purple-500" : "bg-slate-800"}`}
                >
                  <div className={`w-3 h-3 bg-slate-950 rounded-full transition-transform ${threatScan ? "translate-x-3" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Widget 2: Server CPU & Memory Load */}
        <Card className="border border-slate-900 bg-slate-950/50 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-slate-800 hover:shadow-[0_0_15px_rgba(34,211,238,0.08)] transition-all duration-300">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
            <div className="space-y-0.5">
              <h2 className="text-sm font-extrabold text-slate-200 flex items-center gap-2 tracking-wide">
                <Cpu className="w-4 h-4 text-cyan-400" /> Server CPU & Memory Load
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">Real-time Server Resources</p>
            </div>
            <span className="text-[10px] bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded font-mono font-bold animate-pulse">LIVE</span>
          </div>

          <div className="space-y-3 font-mono text-[10px]">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1"><HardDrive className="w-3 h-3 text-cyan-400" /> CPU Core Util</span>
                <span className="font-bold text-slate-200">32%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: "32%" }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1"><Server className="w-3 h-3 text-indigo-400" /> JVM Memory Heap</span>
                <span className="font-bold text-slate-200">48%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: "48%" }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-emerald-400" /> Mongo Pool (Atlas)</span>
                <span className="font-bold text-slate-200">142/500</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: "28.4%" }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Widget 3: Branch Database Status */}
        <Card className="border border-slate-900 bg-slate-950/50 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-slate-800 hover:shadow-[0_0_15px_rgba(52,211,153,0.08)] transition-all duration-300">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
            <div className="space-y-0.5">
              <h2 className="text-sm font-extrabold text-slate-200 flex items-center gap-2 tracking-wide">
                <Radio className="w-4 h-4 text-emerald-400" /> Branch Database Status
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">Branch Server Synchronization</p>
            </div>
            <span className="text-[10px] bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">STABLE</span>
          </div>

          <div className="space-y-2 font-mono text-[10px]">
            <div className="flex justify-between items-center p-1 hover:bg-slate-900/30 rounded transition-colors">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Bhopal Center
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">99.98%</span>
                <span className="text-cyan-400 font-bold bg-cyan-950/30 px-1 py-0.5 rounded">SYNCED</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-1 hover:bg-slate-900/30 rounded transition-colors">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Mumbai West
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">99.95%</span>
                <span className="text-purple-400 font-bold bg-purple-950/30 px-1 py-0.5 rounded">SYNCED</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-1 hover:bg-slate-900/30 rounded transition-colors">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Delhi North
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">99.99%</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/30 px-1 py-0.5 rounded">SYNCED</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Ledger Records List */}
      <Card className="border border-slate-900 bg-slate-950/50 rounded-3xl backdrop-blur-md overflow-hidden">
        <div className="p-5 border-b border-slate-900 flex justify-between items-center bg-slate-950/40">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" /> Recent Ledger Transactions
          </h2>
          <span className="text-[10px] text-slate-400 font-mono font-bold tracking-widest bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-lg">
            NET RECORDINGS: {stats.recentTransactions.length}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          {stats.recentTransactions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-mono text-sm">No transaction entries found in ledger database.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase font-bold text-slate-500 tracking-wider bg-slate-900/30 border-b border-slate-900">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Mode / Channel</th>
                  <th className="px-6 py-4">Execution Timestamp</th>
                  <th className="px-6 py-4 text-right">Amount (INR)</th>
                  <th className="px-6 py-4 text-center">Ledger Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 font-mono text-xs">
                {stats.recentTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4 text-slate-400">{tx.transactionId}</td>
                    <td className="px-6 py-4 text-slate-300 font-semibold">{tx.transferMode}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString("en-IN", { 
                        month: "short", 
                        day: "numeric", 
                        hour: "2-digit", 
                        minute: "2-digit",
                        second: "2-digit"
                      })}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${tx.type === "credit" ? "text-emerald-400" : "text-rose-400"}`}>
                      {tx.type === "credit" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === "credit" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30" : "bg-rose-950/60 text-rose-400 border border-rose-900/30"
                      } capitalize`}>
                        {tx.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
