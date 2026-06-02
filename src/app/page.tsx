'use client';
import { useAppStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import { Home, Vault, Brain, Activity, CreditCard, Zap, Heart, Briefcase, Target, BarChart3, Eye, Settings, ChevronRight, TrendingUp, ArrowDownLeft, Bell, Search } from 'lucide-react';
import type { ViewId } from '@/lib/types';
import { useEffect } from 'react';

const HolographicCanvas = dynamic(() => import('@/components/HolographicCanvas'), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#00e5ff] border-t-transparent rounded-full animate-spin" /></div> });
const AICfoPanel = dynamic(() => import('@/components/AICfoPanel'), { ssr: false });
const DigitalTwinPanel = dynamic(() => import('@/components/DigitalTwinPanel'), { ssr: false });
const VaultPanel = dynamic(() => import('@/components/VaultPanel'), { ssr: false });
const CardPanel = dynamic(() => import('@/components/CardPanel'), { ssr: false });
const UpiPanel = dynamic(() => import('@/components/UpiPanel'), { ssr: false });
const FamilyBusinessPanel = dynamic(() => import('@/components/FamilyBizPanel'), { ssr: false });
const AdminPanopticon = dynamic(() => import('@/components/AdminPanopticon'), { ssr: false });

const navItems: { id: ViewId; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'observatory', label: 'Observatory', icon: <Home className="w-4 h-4" />, color: '#00e5ff' },
  { id: 'vault', label: 'Vault', icon: <Vault className="w-4 h-4" />, color: '#b900ff' },
  { id: 'ai-cfo', label: 'AI CFO', icon: <Brain className="w-4 h-4" />, color: '#00e5ff' },
  { id: 'twin', label: 'Twin', icon: <Activity className="w-4 h-4" />, color: '#b900ff' },
  { id: 'cards', label: 'Cards', icon: <CreditCard className="w-4 h-4" />, color: '#ff007f' },
  { id: 'upi', label: 'UPI', icon: <Zap className="w-4 h-4" />, color: '#10b981' },
  { id: 'family', label: 'Family & Biz', icon: <Heart className="w-4 h-4" />, color: '#f59e0b' },
  { id: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" />, color: '#10b981' },
  { id: 'admin', label: 'Admin', icon: <Eye className="w-4 h-4" />, color: '#ef4444' },
];

function GoalsPanel() {
  const { goals } = useAppStore();
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#10b981]/15"><Target className="w-5 h-5 text-[#10b981]" /></div>
        <div><h3 className="text-sm font-semibold text-white">Goal Constellation</h3><p className="text-[10px] text-[#9ca3af]">AI-optimized savings paths</p></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {goals.map(g => {
          const pct = (g.currentAmount / g.targetAmount) * 100;
          return (
            <div key={g.id} className="glass-card p-4 rounded-xl animate-fade-in-up">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: g.color, boxShadow: `0 0 8px ${g.color}60` }} />
                  <h4 className="text-sm font-medium text-white">{g.name}</h4>
                </div>
                <span className="text-xs font-bold" style={{ color: g.color }}>{pct.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden my-2">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${g.color}, ${g.color}80)` }} />
              </div>
              <div className="flex justify-between text-[10px] text-[#6b7280]">
                <span>₹{(g.currentAmount / 1000).toFixed(0)}K / ₹{(g.targetAmount / 1000).toFixed(0)}K</span>
                {g.deadline && <span>By {new Date(g.deadline).toLocaleDateString()}</span>}
              </div>
              {g.aiStrategy && <p className="text-[10px] text-[#00e5ff] mt-2 flex items-center gap-1"><Brain className="w-3 h-3" /> {g.aiStrategy}</p>}
              {g.predictedCompletionDate && <p className="text-[9px] text-[#6b7280] mt-1">AI predicts completion: {new Date(g.predictedCompletionDate).toLocaleDateString()}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ObservatoryOverview() {
  const { netWorth, transactions, accounts, goals, aiSuggestions } = useAppStore();
  const todaySpend = transactions.filter(t => t.type === 'debit' && new Date(t.timestamp).toDateString() === new Date().toDateString()).reduce((s, t) => s + t.amount, 0);
  const recentTxns = transactions.slice(0, 5);

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Net Worth', value: `₹${(netWorth / 100000).toFixed(1)}L`, change: '+3.2%', icon: <TrendingUp className="w-4 h-4" />, color: '#00e5ff' },
          { label: "Today's Spend", value: `₹${todaySpend.toLocaleString('en-IN')}`, change: '', icon: <ArrowDownLeft className="w-4 h-4" />, color: '#ef4444' },
          { label: 'Active Goals', value: `${goals.filter(g => g.status === 'active').length}`, change: '', icon: <Target className="w-4 h-4" />, color: '#10b981' },
          { label: 'AI Savings Found', value: `₹${aiSuggestions.reduce((s, a) => s + a.potentialSavings, 0)}/mo`, change: '', icon: <Brain className="w-4 h-4" />, color: '#b900ff' },
        ].map((m, idx) => (
          <div key={`${m.label}-${idx}`} className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: m.color + '15', color: m.color }}>{m.icon}</div>
              {m.change && <span className="text-[10px] text-[#10b981]">{m.change}</span>}
            </div>
            <p className="text-lg font-bold text-white">{m.value}</p>
            <p className="text-[10px] text-[#6b7280]">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-white/5">
          <span className="text-xs font-semibold text-white">Recent Activity</span>
          <span className="text-[10px] text-[#00e5ff] cursor-pointer hover:underline">View All</span>
        </div>
        {recentTxns.map(txn => (
          <div key={txn.id} className="flex items-center gap-3 px-3 py-2.5 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${txn.type === 'credit' ? 'bg-[#10b981]/15' : 'bg-[#ef4444]/15'}`}>
              {txn.type === 'credit' ? <ArrowDownLeft className="w-3.5 h-3.5 text-[#10b981]" /> : <TrendingUp className="w-3.5 h-3.5 text-[#ef4444]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white truncate">{txn.merchantName || txn.category}</p>
              <p className="text-[9px] text-[#6b7280]">{new Date(txn.timestamp).toLocaleDateString()}</p>
            </div>
            <span className={`text-xs font-semibold ${txn.type === 'credit' ? 'text-[#10b981]' : 'text-white'}`}>
              {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import BiometricGate from '@/components/BiometricGate';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { activeView, setActiveView, fetchInitialData, isFetchingData } = useAppStore();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (unlocked) {
      fetchInitialData();
    }
  }, [unlocked, fetchInitialData]);

  if (!unlocked) {
    return <BiometricGate onUnlock={() => setUnlocked(true)} />;
  }

  if (isFetchingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center neo-grid-bg bg-black">
        <div className="w-16 h-16 border-4 border-[#00e5ff] border-t-transparent rounded-full animate-spin mb-4" />
        <h1 className="text-xl font-bold text-gradient-magic tracking-widest animate-pulse">LomaX NEO</h1>
        <p className="text-xs text-[#9ca3af] mt-2">Connecting to secure financial ledger...</p>
      </div>
    );
  }

  const renderPanel = () => {
    switch (activeView) {
      case 'vault': return <VaultPanel />;
      case 'ai-cfo': return <AICfoPanel />;
      case 'twin': return <DigitalTwinPanel />;
      case 'cards': return <CardPanel />;
      case 'upi': return <UpiPanel />;
      case 'family': return <FamilyBusinessPanel />;
      case 'goals': return <GoalsPanel />;
      case 'admin': return <AdminPanopticon />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col neo-grid-bg relative">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 glass-panel rounded-none" style={{ borderRadius: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center animate-pulse-glow" style={{ background: 'linear-gradient(135deg, #00e5ff20, #b900ff20)' }}>
            <span className="text-sm font-black text-gradient-magic">N</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gradient-magic tracking-wide">LomaX NEO</h1>
            <p className="text-[9px] text-[#6b7280]">Financial Singularity OS</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors text-[#6b7280] hover:text-[#00e5ff] cursor-pointer">
            <Search className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors text-[#6b7280] hover:text-[#00e5ff] relative cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ background: 'linear-gradient(135deg, #00e5ff, #b900ff)' }}>
            <span className="text-[10px] font-bold text-white">A</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-16 lg:w-52 border-r border-white/5 flex flex-col py-4 overflow-y-auto flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl transition-all duration-200 mb-1 cursor-pointer group ${
                activeView === item.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
              }`}>
              <span style={{ color: activeView === item.id ? item.color : '#6b7280' }} className="transition-colors group-hover:drop-shadow-[0_0_6px_currentColor]">
                {item.icon}
              </span>
              <span className={`text-xs hidden lg:block transition-colors ${activeView === item.id ? 'text-white font-medium' : 'text-[#6b7280] group-hover:text-[#9ca3af]'}`}>
                {item.label}
              </span>
              {activeView === item.id && <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Observatory / Galaxy View */}
          <div className={`${activeView === 'observatory' ? 'flex-1' : 'hidden lg:block lg:w-1/2 xl:w-3/5'} p-4 overflow-y-auto`}>
            <div className="h-64 lg:h-80 mb-4 rounded-2xl overflow-hidden relative glass-card">
              <HolographicCanvas />
              <div className="absolute top-3 left-3 glass-panel px-3 py-1.5 rounded-lg">
                <span className="text-[9px] text-[#9ca3af]">OBSERVATORY — LIVE</span>
              </div>
            </div>
            <ObservatoryOverview />
          </div>

          {/* Side Panel */}
          {activeView !== 'observatory' && (
            <div className="flex-1 border-l border-white/5 overflow-hidden animate-slide-in-right">
              {renderPanel()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
