'use client';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { CreditCard, Shield, Globe, Moon, Wifi, WifiOff, Lock, Unlock, Plus, Snowflake, Eye, EyeOff } from 'lucide-react';
import MagicButton from './MagicButton';

function RotatingCVV({ cvv, frozen }: { cvv: string; frozen: boolean }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(cvv);
  useEffect(() => {
    if (frozen) return;
    const interval = setInterval(() => {
      setCurrent(String(Math.floor(100 + Math.random() * 900)));
    }, 60000); // rotate every minute for demo
    return () => clearInterval(interval);
  }, [frozen]);
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-mono text-white">{visible ? current : '•••'}</span>
      <button onClick={() => setVisible(!visible)} className="text-[#6b7280] hover:text-[#00e5ff] transition-colors cursor-pointer">
        {visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
      </button>
    </div>
  );
}

const designGradients: Record<string, string> = {
  'galaxy-nebula': 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  'aurora-wave': 'linear-gradient(135deg, #000428, #004e92)',
  'deep-space': 'linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e)',
  'quantum-pulse': 'linear-gradient(135deg, #141e30, #243b55)',
};

export default function CardPanel() {
  const { cards, toggleCardStatus, toggleCardOnline, toggleCardInternational, toggleCardNightLock, generateVirtualCard } = useAppStore();
  const [selectedCard, setSelectedCard] = useState(cards[0]?.id || '');
  const card = cards.find(c => c.id === selectedCard);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#ff007f]/15">
          <CreditCard className="w-5 h-5 text-[#ff007f]" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">Holo-Cards</h3>
          <p className="text-[10px] text-[#9ca3af]">E-ink CVV rotation • Geo-fenced • Quantum-safe tokens</p>
        </div>
        <MagicButton onClick={generateVirtualCard} size="sm" variant="secondary" icon={<Plus className="w-3.5 h-3.5" />}>
          New Virtual
        </MagicButton>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Card Selector */}
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {cards.map(c => (
            <div key={c.id} onClick={() => setSelectedCard(c.id)}
              className={`relative flex-shrink-0 w-56 h-36 rounded-2xl p-4 cursor-pointer transition-all duration-300 overflow-hidden ${
                selectedCard === c.id ? 'scale-105 shadow-[0_0_20px_rgba(0,229,255,0.3)]' : 'opacity-70 hover:opacity-90'
              }`} style={{ background: designGradients[c.designTheme] || designGradients['galaxy-nebula'] }}>
              {/* Card overlay pattern */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1), transparent 60%)' }} />
              {c.status === 'frozen' && (
                <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <Snowflake className="w-8 h-8 text-blue-400 animate-pulse" />
                </div>
              )}
              <div className="relative z-20 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 capitalize">{c.cardType}</span>
                  <span className="text-[10px] font-semibold text-white/80 uppercase">{c.cardNetwork}</span>
                </div>
                <div>
                  <p className="text-sm font-mono text-white tracking-[3px]">•••• •••• •••• {c.lastFour}</p>
                  <div className="flex justify-between items-end mt-2">
                    <div>
                      <p className="text-[8px] text-white/40">EXPIRES</p>
                      <p className="text-[11px] font-mono text-white/80">{String(c.expiryMonth).padStart(2,'0')}/{c.expiryYear}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-white/40">CVV (E-INK)</p>
                      <RotatingCVV cvv={c.currentCvv} frozen={c.status === 'frozen'} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        {card && (
          <div className="space-y-3 animate-fade-in">
            <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Card Controls</h4>
            {[
              { label: 'Card Status', desc: card.status === 'frozen' ? 'Card is frozen' : 'Card is active', icon: card.status === 'frozen' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />, active: card.status === 'active', toggle: () => toggleCardStatus(card.id), color: card.status === 'active' ? '#10b981' : '#ef4444' },
              { label: 'Online Transactions', desc: card.onlineEnabled ? 'Allowed' : 'Blocked', icon: card.onlineEnabled ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />, active: card.onlineEnabled, toggle: () => toggleCardOnline(card.id), color: '#00e5ff' },
              { label: 'International Usage', desc: card.internationalEnabled ? 'Enabled' : 'Disabled', icon: <Globe className="w-4 h-4" />, active: card.internationalEnabled, toggle: () => toggleCardInternational(card.id), color: '#b900ff' },
              { label: 'Night Lock (10PM-8AM)', desc: card.nightLockEnabled ? 'Active — blocking' : 'Inactive', icon: <Moon className="w-4 h-4" />, active: card.nightLockEnabled, toggle: () => toggleCardNightLock(card.id), color: '#f59e0b' },
            ].map(ctrl => (
              <div key={ctrl.label} className="glass-card p-3 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: ctrl.color + '15', color: ctrl.color }}>{ctrl.icon}</div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">{ctrl.label}</p>
                  <p className="text-[10px] text-[#6b7280]">{ctrl.desc}</p>
                </div>
                <button onClick={ctrl.toggle} className={`w-10 h-5 rounded-full transition-all duration-300 cursor-pointer relative ${ctrl.active ? '' : 'bg-white/10'}`}
                  style={{ background: ctrl.active ? ctrl.color + '40' : undefined }}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${ctrl.active ? 'left-5.5' : 'left-0.5'}`}
                    style={{ background: ctrl.active ? ctrl.color : '#6b7280', left: ctrl.active ? '22px' : '2px' }} />
                </button>
              </div>
            ))}

            {/* Limits */}
            <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mt-4">Spending Limits</h4>
            <div className="glass-card p-4 rounded-xl space-y-3">
              {[
                { label: 'Per Transaction', value: card.limits.perTransaction },
                { label: 'Daily Limit', value: card.limits.daily },
                { label: 'Monthly Limit', value: card.limits.monthly },
              ].map(l => (
                <div key={l.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-[#9ca3af]">{l.label}</span>
                    <span className="text-[11px] font-mono text-white">₹{l.value.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (l.value / card.limits.monthly) * 100)}%`, background: 'linear-gradient(90deg, #00e5ff, #b900ff)' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Geo Controls */}
            <div className="glass-card p-4 rounded-xl">
              <h5 className="text-xs font-medium text-white mb-2 flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-[#00e5ff]" /> Geo Controls</h5>
              <div className="flex flex-wrap gap-1.5">
                {card.geoControls.map(g => (
                  <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/20">{g}</span>
                ))}
                {card.merchantControls.blocked.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20">
                    {card.merchantControls.blocked.length} MCC blocked
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
