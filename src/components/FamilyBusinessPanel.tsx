'use client';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Heart, Briefcase, Users, Target, Receipt, DollarSign, UserPlus, Gift, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function FamilyBusinessPanel() {
  const [tab, setTab] = useState<'family' | 'business'>('family');
  const { familyGroup, invoices, goals } = useAppStore();

  return (
    <div className="flex flex-col h-full">
      {/* Tab Switcher */}
      <div className="flex border-b border-white/5">
        {[
          { id: 'family' as const, label: 'Family Hearth', icon: <Heart className="w-4 h-4" /> },
          { id: 'business' as const, label: 'Business Engine', icon: <Briefcase className="w-4 h-4" /> },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-all cursor-pointer ${
              tab === t.id ? 'text-[#00e5ff] border-b-2 border-[#00e5ff]' : 'text-[#6b7280] hover:text-[#9ca3af]'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === 'family' ? (
          <>
            {/* Family Overview */}
            <div className="glass-card p-4 rounded-xl text-center">
              <h3 className="text-sm font-semibold text-white mb-1">{familyGroup.name}</h3>
              <p className="text-2xl font-bold text-gradient-magic">₹{(familyGroup.totalNetWorth / 100000).toFixed(1)}L</p>
              <p className="text-[10px] text-[#9ca3af]">Combined Family Net Worth</p>
            </div>

            {/* Members */}
            <div>
              <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Family Members
              </h4>
              {familyGroup.members.map(m => (
                <div key={m.userId} className="glass-card p-3 rounded-xl mb-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
                    background: m.role === 'prime' ? 'linear-gradient(135deg, #00e5ff30, #b900ff30)' :
                      m.role === 'spouse' ? 'linear-gradient(135deg, #ff007f30, #f59e0b30)' : 'rgba(255,255,255,0.05)'
                  }}>
                    <span className="text-sm font-bold text-white">{m.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white">{m.name}</p>
                    <p className="text-[10px] text-[#6b7280] capitalize">{m.role}</p>
                  </div>
                  {m.allowance && (
                    <div className="text-right">
                      <p className="text-xs font-semibold text-[#f59e0b]">₹{m.allowance.amount.toLocaleString('en-IN')}</p>
                      <p className="text-[9px] text-[#6b7280]">{m.allowance.frequency} • Limit ₹{m.allowance.spendingLimit}</p>
                    </div>
                  )}
                  {m.role === 'prime' && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#00e5ff]/10 text-[#00e5ff]">Admin</span>}
                </div>
              ))}
            </div>

            {/* Shared Goals */}
            <div>
              <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Target className="w-3.5 h-3.5" /> Shared Goals
              </h4>
              {familyGroup.sharedGoals.map(g => {
                const pct = (g.currentAmount / g.targetAmount) * 100;
                return (
                  <div key={g.id} className="glass-card p-4 rounded-xl mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-white">{g.name}</p>
                      <span className="text-[10px] font-bold" style={{ color: g.color }}>{pct.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: g.color }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#6b7280]">
                      <span>₹{(g.currentAmount / 100000).toFixed(1)}L raised</span>
                      <span>Goal: ₹{(g.targetAmount / 100000).toFixed(1)}L</span>
                    </div>
                    {g.deadline && <p className="text-[9px] text-[#6b7280] mt-1">Deadline: {new Date(g.deadline).toLocaleDateString()}</p>}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Business Dashboard */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Cash Balance', value: '₹12.5L', icon: <DollarSign className="w-4 h-4" />, color: '#10b981' },
                { label: 'Unpaid Invoices', value: '₹2.3L', icon: <Receipt className="w-4 h-4" />, color: '#ef4444' },
                { label: 'This Month Rev', value: '₹4.1L', icon: <TrendingUp className="w-4 h-4" />, color: '#00e5ff' },
              ].map(s => (
                <div key={s.label} className="glass-card p-3 rounded-xl text-center">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ background: s.color + '15', color: s.color }}>{s.icon}</div>
                  <p className="text-sm font-bold text-white">{s.value}</p>
                  <p className="text-[9px] text-[#6b7280]">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Invoices */}
            <div>
              <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Receipt className="w-3.5 h-3.5" /> Invoices
              </h4>
              {invoices.map(inv => (
                <div key={inv.id} className="glass-card p-3 rounded-xl mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-white">{inv.clientName}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      inv.status === 'paid' ? 'bg-[#10b981]/15 text-[#10b981]' :
                      inv.status === 'overdue' ? 'bg-[#ef4444]/15 text-[#ef4444]' :
                      'bg-[#f59e0b]/15 text-[#f59e0b]'
                    }`}>
                      {inv.status === 'paid' ? <CheckCircle className="w-2.5 h-2.5" /> :
                       inv.status === 'overdue' ? <AlertCircle className="w-2.5 h-2.5" /> :
                       <Clock className="w-2.5 h-2.5" />}
                      {inv.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#6b7280]">{inv.items.length} item{inv.items.length > 1 ? 's' : ''} • GST ₹{inv.taxAmount.toLocaleString('en-IN')}</span>
                    <span className="text-white font-semibold">₹{inv.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[9px] text-[#6b7280] mt-1">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="glass-card p-4 rounded-xl">
              <h5 className="text-xs font-medium text-white mb-2">GST Summary — Current Quarter</h5>
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div><span className="text-[#6b7280]">Output Tax: </span><span className="text-white">₹50,400</span></div>
                <div><span className="text-[#6b7280]">Input Credit: </span><span className="text-[#10b981]">₹18,200</span></div>
                <div><span className="text-[#6b7280]">Net Payable: </span><span className="text-[#f59e0b]">₹32,200</span></div>
                <div><span className="text-[#6b7280]">Filing Status: </span><span className="text-[#10b981]">Up to date</span></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
