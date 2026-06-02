'use client';
import { useAppStore } from '@/lib/store';
import { QrCode, Wallet, CalendarClock, Users, ArrowRight, Pause, Play, Zap } from 'lucide-react';
import MagicButton from './MagicButton';

export default function UpiPanel() {
  const { mandates, upiLite } = useAppStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#10b981]/15">
          <Zap className="w-5 h-5 text-[#10b981]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">UPI Pulse Network</h3>
          <p className="text-[10px] text-[#9ca3af]">NPCI-linked • UPI Lite offline • AutoPay mandates</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* UPI ID */}
        <div className="glass-card p-4 rounded-xl">
          <h4 className="text-xs font-semibold text-[#9ca3af] mb-2">Your UPI IDs</h4>
          {['aanya@lomax', 'aanya.design@lomax'].map((id, i) => (
            <div key={id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#00e5ff]/10">
                  <span className="text-[10px] text-[#00e5ff] font-bold">{i + 1}</span>
                </div>
                <span className="text-sm text-white font-mono">{id}</span>
              </div>
              {i === 0 && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981]">Default</span>}
            </div>
          ))}
        </div>

        {/* QR Code */}
        <div className="glass-card p-4 rounded-xl flex flex-col items-center">
          <h4 className="text-xs font-semibold text-[#9ca3af] mb-3">Payment QR</h4>
          <div className="w-40 h-40 rounded-xl border-2 border-[#00e5ff]/20 flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.05), rgba(185,0,255,0.05))' }}>
            <QrCode className="w-24 h-24 text-[#00e5ff]/30" />
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <p className="text-[10px] text-[#6b7280] mt-2">Scan to pay via any UPI app</p>
        </div>

        {/* UPI Lite Wallet */}
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#f59e0b]" />
              <h4 className="text-xs font-semibold text-white">UPI Lite Wallet</h4>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#f59e0b]">Offline Ready</span>
          </div>
          <div className="flex items-end justify-between mb-2">
            <p className="text-2xl font-bold text-white">₹{upiLite.balance.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-[#6b7280]">/ ₹{upiLite.maxBalance}</p>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full" style={{ width: `${(upiLite.balance / upiLite.maxBalance) * 100}%`, background: 'linear-gradient(90deg, #f59e0b, #10b981)' }} />
          </div>
          <MagicButton size="sm" variant="ghost" icon={<ArrowRight className="w-3.5 h-3.5" />}>Top Up</MagicButton>
        </div>

        {/* AutoPay Mandates */}
        <div>
          <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3 flex items-center gap-2">
            <CalendarClock className="w-3.5 h-3.5" /> AutoPay Mandates
          </h4>
          {mandates.map(m => (
            <div key={m.id} className="glass-card p-3 rounded-xl mb-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#b900ff]/10">
                <span className="text-[11px] font-bold text-[#b900ff]">{m.merchantName.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-white">{m.merchantName}</p>
                <p className="text-[10px] text-[#6b7280]">Max ₹{m.maxAmount} • {m.frequency} • Next: {new Date(m.nextDebitDate).toLocaleDateString()}</p>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full ${m.status === 'active' ? 'bg-[#10b981]/15 text-[#10b981]' : 'bg-[#f59e0b]/15 text-[#f59e0b]'}`}>
                {m.status === 'active' ? <Play className="w-2.5 h-2.5 inline mr-0.5" /> : <Pause className="w-2.5 h-2.5 inline mr-0.5" />}
                {m.status}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Send */}
        <div className="glass-card p-4 rounded-xl">
          <h4 className="text-xs font-semibold text-[#9ca3af] mb-3 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Frequent Contacts</h4>
          <div className="flex gap-4">
            {['Raj', 'Priya', 'Mom', 'Vikram', 'Neha'].map((name, i) => (
              <div key={name} className="flex flex-col items-center gap-1 cursor-pointer group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:shadow-[0_0_12px_rgba(0,229,255,0.4)]"
                  style={{ background: `hsl(${i * 65}, 70%, 25%)` }}>
                  <span className="text-xs font-semibold text-white">{name.charAt(0)}</span>
                </div>
                <span className="text-[10px] text-[#9ca3af] group-hover:text-[#00e5ff] transition-colors">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
