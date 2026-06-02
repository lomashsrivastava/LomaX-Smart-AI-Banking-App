'use client';
import { useAppStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import { Home, Vault, Brain, Activity, CreditCard, Zap, Heart, Target, Eye, Bell, Search } from 'lucide-react';
import type { ViewId } from '@/lib/types';
import { useEffect, useState } from 'react';
import BiometricGate from '@/components/BiometricGate';
import QuantumTerminal from '@/components/QuantumTerminal';

const HolographicCanvas = dynamic(() => import('@/components/HolographicCanvas'), { ssr: false });
const AICfoPanel = dynamic(() => import('@/components/AICfoPanel'), { ssr: false });
const DigitalTwinPanel = dynamic(() => import('@/components/DigitalTwinPanel'), { ssr: false });
const VaultPanel = dynamic(() => import('@/components/VaultPanel'), { ssr: false });
const CardPanel = dynamic(() => import('@/components/CardPanel'), { ssr: false });
const UpiPanel = dynamic(() => import('@/components/UpiPanel'), { ssr: false });
const FamilyBusinessPanel = dynamic(() => import('@/components/FamilyBizPanel'), { ssr: false });
const AdminPanopticon = dynamic(() => import('@/components/AdminPanopticon'), { ssr: false });
const GoalsPanel = dynamic(() => import('@/components/GoalsPanel'), { ssr: false });

const navItems: { id: ViewId; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'observatory', label: 'Observatory', icon: <Home className="w-5 h-5" />, color: '#00f0ff' },
  { id: 'vault', label: 'Vault', icon: <Vault className="w-5 h-5" />, color: '#c900ff' },
  { id: 'ai-cfo', label: 'AI CFO', icon: <Brain className="w-5 h-5" />, color: '#00f0ff' },
  { id: 'twin', label: 'Twin', icon: <Activity className="w-5 h-5" />, color: '#ff0055' },
  { id: 'cards', label: 'Cards', icon: <CreditCard className="w-5 h-5" />, color: '#00ffa3' },
  { id: 'upi', label: 'UPI', icon: <Zap className="w-5 h-5" />, color: '#ffb800' },
  { id: 'family', label: 'Family', icon: <Heart className="w-5 h-5" />, color: '#ff3366' },
  { id: 'goals', label: 'Goals', icon: <Target className="w-5 h-5" />, color: '#00f0ff' },
  { id: 'admin', label: 'Admin', icon: <Eye className="w-5 h-5" />, color: '#a1a1aa' },
];

function ObservatoryOverview() {
  const { netWorth, transactions, goals } = useAppStore();
  const todaySpend = transactions.filter(t => t.type === 'debit' && new Date(t.timestamp).toDateString() === new Date().toDateString()).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up h-full pb-10">
      <div className="text-center mt-12 mb-8">
        <h2 className="text-5xl font-black text-white tracking-tight font-mono mb-2">₹{(netWorth / 100000).toFixed(2)}<span className="text-[#a1a1aa] text-3xl">L</span></h2>
        <p className="text-sm font-medium text-[#00ffa3] tracking-widest uppercase">Net Worth (Singularity Active)</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <p className="text-[#a1a1aa] text-xs font-semibold uppercase tracking-widest mb-1">Today's Spend</p>
          <p className="text-2xl font-bold text-[#ff3366] font-mono">₹{todaySpend.toLocaleString('en-IN')}</p>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <p className="text-[#a1a1aa] text-xs font-semibold uppercase tracking-widest mb-1">Active Goals</p>
          <p className="text-2xl font-bold text-[#00f0ff] font-mono">{goals.filter(g => g.status === 'active').length}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { activeView, setActiveView, fetchInitialData, isFetchingData } = useAppStore();
  const [unlocked, setUnlocked] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    if (unlocked) {
      fetchInitialData();
    }
  }, [unlocked, fetchInitialData]);

  // Terminal Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setTerminalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!unlocked) {
    return <BiometricGate onUnlock={() => setUnlocked(true)} />;
  }

  if (isFetchingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050508]">
        <div className="w-20 h-20 border-[3px] border-[#00f0ff] border-t-transparent rounded-full animate-spin mb-6" />
        <h1 className="text-2xl font-black text-gradient-magic tracking-[0.3em] animate-pulse">LOMAX NEO</h1>
      </div>
    );
  }

  const renderPanel = () => {
    switch (activeView) {
      case 'observatory': return <ObservatoryOverview />;
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
    <div className="h-screen w-screen relative overflow-hidden bg-black font-sans">
      
      {/* 1. The Full-Screen 3D Holographic Canvas Background */}
      <div className="absolute inset-0 z-0">
        <HolographicCanvas />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* 2. Floating UI Container */}
      <div className="relative z-10 w-full h-full p-4 lg:p-8 flex flex-col pointer-events-none">
        
        {/* Top Header */}
        <header className="glass-panel px-6 py-4 flex items-center justify-between mb-6 pointer-events-auto rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#c900ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <span className="text-black font-black text-xl">N</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-widest">LOMAX <span className="text-[#00f0ff]">NEO</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTerminalOpen(true)}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#a1a1aa] hover:text-[#00f0ff] transition-colors cursor-pointer border border-white/5"
              title="Quantum Terminal (~)"
            >
              <span className="font-mono text-xl leading-none -mt-1">_</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/5">
              <Search className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/5 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ff3366] rounded-full shadow-[0_0_10px_#ff3366]" />
            </button>
          </div>
        </header>

        {/* Main Interface Layout */}
        <div className="flex flex-1 gap-6 min-h-0">
          
          {/* Floating Dock (Sidebar) */}
          <nav className="glass-panel w-24 py-6 flex flex-col items-center gap-4 pointer-events-auto shrink-0 rounded-[32px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveView(item.id)}
                className="relative group flex flex-col items-center gap-2 cursor-pointer w-full py-2"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  activeView === item.id 
                    ? 'bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] scale-110' 
                    : 'hover:bg-white/5 hover:scale-105'
                }`}>
                  <span style={{ color: activeView === item.id ? item.color : '#a1a1aa' }} className="transition-colors group-hover:drop-shadow-[0_0_10px_currentColor]">
                    {item.icon}
                  </span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  activeView === item.id ? 'text-white' : 'text-transparent group-hover:text-[#a1a1aa]'
                }`}>
                  {item.label}
                </span>
                {activeView === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                )}
              </button>
            ))}
          </nav>

          {/* Floating Content Panel */}
          <main className="glass-panel flex-1 rounded-[32px] overflow-hidden pointer-events-auto relative">
             {renderPanel()}
          </main>
        </div>

        {/* Quantum Terminal Overlay */}
        {terminalOpen && (
          <QuantumTerminal onClose={() => setTerminalOpen(false)} />
        )}
      </div>

    </div>
  );
}
