'use client';
import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Shield, ChevronDown } from 'lucide-react';

export default function VaultPanel() {
  const { transactions, accounts } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedTxn, setExpandedTxn] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = !search || t.aiNarrative.toLowerCase().includes(search.toLowerCase()) || t.merchantName?.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, search, filterType]);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Vault Constellation</h3>
            <p className="text-[10px] text-[#9ca3af]">Double-entry ledger • Post-quantum signed</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gradient-magic">₹{totalBalance.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-[#9ca3af]">Total Balance</p>
          </div>
        </div>

        {/* Account Cards Row */}
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {accounts.map(acc => (
            <div key={acc.id} className="flex-shrink-0 glass-card px-3 py-2 rounded-xl min-w-[140px]" style={{ borderColor: acc.color + '30' }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ background: acc.color }} />
                <span className="text-[10px] text-[#9ca3af] capitalize">{acc.accountType}</span>
              </div>
              <p className="text-sm font-semibold text-white">₹{acc.balance.toLocaleString('en-IN')}</p>
              <p className="text-[9px] text-[#6b7280] font-mono">{acc.accountNumber}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2 mt-3">
          <div className="flex-1 flex items-center gap-2 glass-card rounded-xl px-3 py-2">
            <Search className="w-3.5 h-3.5 text-[#6b7280]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..." className="flex-1 bg-transparent text-xs text-white placeholder-[#6b7280] outline-none" />
          </div>
          <div className="relative">
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="glass-card rounded-xl px-3 py-2 text-xs text-white bg-transparent border-white/10 outline-none appearance-none pr-7 cursor-pointer">
              <option value="all" className="bg-[#1a1a24]">All</option>
              <option value="credit" className="bg-[#1a1a24]">Credit</option>
              <option value="debit" className="bg-[#1a1a24]">Debit</option>
              <option value="transfer" className="bg-[#1a1a24]">Transfer</option>
              <option value="upi" className="bg-[#1a1a24]">UPI</option>
            </select>
            <Filter className="w-3 h-3 text-[#6b7280] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {filtered.map((txn, i) => {
          const isCredit = txn.type === 'credit' || txn.type === 'refund';
          const isExpanded = expandedTxn === txn.id;
          return (
            <div key={txn.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
              style={{ animationDelay: `${i * 30}ms` }} onClick={() => setExpandedTxn(isExpanded ? null : txn.id)}>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isCredit ? 'bg-[#10b981]/15' : txn.type === 'transfer' ? 'bg-[#f59e0b]/15' : 'bg-[#ef4444]/15'
                }`}>
                  {isCredit ? <ArrowDownLeft className="w-4 h-4 text-[#10b981]" /> :
                   txn.type === 'transfer' ? <ArrowLeftRight className="w-4 h-4 text-[#f59e0b]" /> :
                   <ArrowUpRight className="w-4 h-4 text-[#ef4444]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{txn.merchantName || txn.category}</p>
                  <p className="text-[10px] text-[#6b7280]">{txn.category} • {new Date(txn.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-semibold ${isCredit ? 'text-[#10b981]' : 'text-white'}`}>
                    {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[9px] text-[#6b7280] capitalize">{txn.status}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#6b7280] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-3 animate-fade-in">
                  <div className="glass-card p-3 rounded-xl space-y-2">
                    <p className="text-xs text-[#9ca3af]">{txn.aiNarrative}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div><span className="text-[#6b7280]">Type: </span><span className="text-white uppercase">{txn.type}</span></div>
                      <div><span className="text-[#6b7280]">Risk: </span>
                        <span className={txn.riskScore < 200 ? 'text-[#10b981]' : txn.riskScore < 500 ? 'text-[#f59e0b]' : 'text-[#ef4444]'}>{txn.riskScore}/1000</span>
                      </div>
                      <div><span className="text-[#6b7280]">Time: </span><span className="text-white">{new Date(txn.timestamp).toLocaleTimeString()}</span></div>
                      <div><span className="text-[#6b7280]">Decision: </span><span className="text-[#10b981] uppercase">{txn.fraudDecision}</span></div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <Shield className="w-3 h-3 text-[#00e5ff]" />
                      <span className="text-[9px] text-[#6b7280] font-mono truncate">Dilithium Sig: {txn.signature}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[#6b7280]">
            <Search className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
