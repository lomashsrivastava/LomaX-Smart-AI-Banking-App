"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import apiClient from "@/services/api-client";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  RefreshCw, 
  ArrowRightLeft,
  FileBadge,
  Sparkles,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Account {
  id: string;
  _id: string;
  type: string;
  accountType: string;
  number: string;
  accountNumber: string;
  balance: number;
}

interface Transaction {
  _id: string;
  transactionId: string;
  type: 'credit' | 'debit';
  transferMode: string;
  amount: number;
  remarks?: string;
  payeeName?: string;
  createdAt: string;
}

export default function CustomerStatementsPage() {
  const { user } = useAuthStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccNum, setSelectedAccNum] = useState<string>("");
  
  // Date and Range filters
  const [dateRangeMode, setDateRangeMode] = useState<"7days" | "30days" | "ytd" | "custom">("30days");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<"all" | "credit" | "debit">("all");

  // Transactions preview
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Exporting state
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);

  // Set default dates based on range mode
  useEffect(() => {
    const end = new Date();
    const start = new Date();

    if (dateRangeMode === "7days") {
      start.setDate(end.getDate() - 7);
    } else if (dateRangeMode === "30days") {
      start.setDate(end.getDate() - 30);
    } else if (dateRangeMode === "ytd") {
      start.setMonth(0);
      start.setDate(1); // Jan 1st of current year
    } else {
      // Don't override custom selection
      return;
    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, [dateRangeMode]);

  // Load user accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user?.id) return;
      try {
        const res = await apiClient.get(`/accounts/${user.id}`);
        if (res.data.success && res.data.accounts && res.data.accounts.length > 0) {
          setAccounts(res.data.accounts);
          setSelectedAccNum(res.data.accounts[0].number || res.data.accounts[0].accountNumber);
        }
      } catch (err) {
        console.error("Failed to load accounts:", err);
        toast.error("Failed to load active bank accounts.");
      }
    };
    fetchAccounts();
  }, [user]);

  // Fetch transactions preview for selected account and date range
  const loadTransactionsPreview = async () => {
    if (!selectedAccNum) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/transactions/account/${selectedAccNum}`);
      if (res.data.success && res.data.data) {
        setTransactions(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load transaction history preview:", err);
      toast.error("Failed to load transaction history preview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactionsPreview();
  }, [selectedAccNum]);

  // Filter transactions preview on frontend based on dates and type
  const filteredTransactions = transactions.filter(t => {
    const txnDate = new Date(t.createdAt).toISOString().split("T")[0];
    
    // Date filter
    if (startDate && txnDate < startDate) return false;
    if (endDate && txnDate > endDate) return false;
    
    // Type filter
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    
    return true;
  });

  // Handle Export PDF
  const handleExportPDF = async () => {
    if (!selectedAccNum) return;
    setExportingPdf(true);
    try {
      const response = await apiClient.get('/transactions/statement/pdf', {
        params: {
          accountNumber: selectedAccNum,
          startDate: startDate || undefined,
          endDate: endDate || undefined
        },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `LomaX_Statement_${selectedAccNum}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("PDF Statement generated and downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to export PDF statement.");
    } finally {
      setExportingPdf(false);
    }
  };

  // Handle Export CSV
  const handleExportCSV = async () => {
    if (!selectedAccNum) return;
    setExportingCsv(true);
    try {
      const response = await apiClient.get('/transactions/statement/csv', {
        params: {
          accountNumber: selectedAccNum,
          startDate: startDate || undefined,
          endDate: endDate || undefined
        },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `LomaX_Statement_${selectedAccNum}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV Statement downloaded successfully!");
    } catch (error) {
      console.error("CSV generation failed:", error);
      toast.error("Failed to export CSV statement.");
    } finally {
      setExportingCsv(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 text-slate-100 font-futuristic">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2.5">
            <FileText className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            <span>Report & Statement Center</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Export official ledger records, compile audit files, and filter history.</p>
        </div>
      </div>

      {/* Grid Layout Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Filter Form Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] space-y-6">
            <h2 className="text-lg font-bold border-b border-slate-850 pb-3 flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>Statement Settings</span>
            </h2>

            {/* Account Selector */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase tracking-wider font-bold">Select Active Account</label>
              <select
                value={selectedAccNum}
                onChange={(e) => setSelectedAccNum(e.target.value)}
                className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3 text-sm focus:border-cyan-500/50 outline-none text-slate-200"
              >
                {accounts.map(acc => (
                  <option key={acc.number || acc.accountNumber} value={acc.number || acc.accountNumber}>
                    {acc.type || acc.accountType} - {acc.number || acc.accountNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Ranges */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase tracking-wider font-bold">Predefined Period</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { mode: "7days", label: "Last 7 Days" },
                  { mode: "30days", label: "Last 30 Days" },
                  { mode: "ytd", label: "Year to Date" },
                  { mode: "custom", label: "Custom Range" },
                ].map(r => (
                  <button
                    key={r.mode}
                    onClick={() => setDateRangeMode(r.mode as any)}
                    className={cn(
                      "py-2 px-3 text-xs font-bold rounded-lg border transition-all uppercase tracking-wide",
                      dateRangeMode === r.mode 
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" 
                        : "bg-slate-950/40 text-slate-450 border-slate-850 hover:border-slate-800 hover:text-slate-200"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Dates inputs */}
            <div className={cn(
              "grid grid-cols-2 gap-4 transition-all duration-300",
              dateRangeMode === "custom" ? "opacity-100 max-h-[100px] visible" : "opacity-40 pointer-events-none"
            )}>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-10 bg-slate-950 border border-slate-850 rounded-lg px-2 text-xs focus:border-cyan-500/50 outline-none text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-10 bg-slate-950 border border-slate-850 rounded-lg px-2 text-xs focus:border-cyan-500/50 outline-none text-slate-200"
                />
              </div>
            </div>

            {/* Type Filters */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase tracking-wider font-bold">Transaction Type</label>
              <div className="flex gap-2">
                {[
                  { val: "all", label: "All" },
                  { val: "credit", label: "Credits" },
                  { val: "debit", label: "Debits" }
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setTypeFilter(opt.val as any)}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all uppercase",
                      typeFilter === opt.val
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                        : "bg-slate-950/40 text-slate-400 border-slate-900 hover:border-slate-800"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Actions Panel */}
            <div className="border-t border-slate-850 pt-5 space-y-3">
              <label className="text-xs text-slate-400 uppercase tracking-wider font-bold">Export Options</label>
              <Button
                onClick={handleExportPDF}
                disabled={exportingPdf || !selectedAccNum}
                className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold flex items-center justify-center gap-2 rounded-xl transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] disabled:opacity-50"
              >
                {exportingPdf ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FileBadge className="w-4 h-4" />
                )}
                <span>Generate Branded PDF</span>
              </Button>

              <Button
                onClick={handleExportCSV}
                disabled={exportingCsv || !selectedAccNum}
                variant="outline"
                className="w-full h-11 border-slate-850 bg-slate-950/50 hover:bg-slate-900/50 text-slate-200 font-bold flex items-center justify-center gap-2 rounded-xl"
              >
                {exportingCsv ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-cyan-400" />
                )}
                <span>Download CSV File</span>
              </Button>
            </div>

          </div>
        </div>

        {/* Right Side: Ledger Preview Grid */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Summary Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-850">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Opening Balance</span>
              <span className="text-base font-bold text-slate-200">
                ₹{((accounts.find(a => (a.number || a.accountNumber) === selectedAccNum)?.balance || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-850">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Credits (In)</span>
              <span className="text-base font-bold text-emerald-400">
                +₹{filteredTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-850">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Debits (Out)</span>
              <span className="text-base font-bold text-rose-400">
                -₹{filteredTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-850">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Closing Balance</span>
              <span className="text-base font-bold text-cyan-400">
                ₹{((accounts.find(a => (a.number || a.accountNumber) === selectedAccNum)?.balance || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Ledger Table Container */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md shadow-lg min-h-[400px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-bold tracking-wider flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                  <span>Ledger Preview Grid</span>
                </h3>
                <span className="text-xs text-slate-450">{filteredTransactions.length} records in view window</span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono">
                      <th className="py-3 px-2">Date</th>
                      <th className="py-3 px-2">Transaction ID</th>
                      <th className="py-3 px-2">Description</th>
                      <th className="py-3 px-2">Type</th>
                      <th className="py-3 px-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t, idx) => (
                      <tr 
                        key={t._id}
                        className={cn(
                          "border-b border-slate-900 hover:bg-slate-950/20 transition-colors",
                          idx % 2 === 1 && "bg-slate-950/10"
                        )}
                      >
                        <td className="py-3.5 px-2 text-slate-400 font-mono">
                          {new Date(t.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-3.5 px-2 font-mono text-slate-400">{t.transactionId}</td>
                        <td className="py-3.5 px-2 font-medium max-w-[150px] truncate text-slate-200">
                          {t.remarks || t.payeeName || t.transferMode || 'Core Ledger Entry'}
                        </td>
                        <td className="py-3.5 px-2 font-bold">
                          {t.type === 'credit' ? (
                            <span className="text-emerald-500 font-mono">CREDIT</span>
                          ) : (
                            <span className="text-rose-500 font-mono">DEBIT</span>
                          )}
                        </td>
                        <td className={cn(
                          "py-3.5 px-2 text-right font-bold font-mono",
                          t.type === 'credit' ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredTransactions.length === 0 && !loading && (
                  <div className="text-center py-20 text-slate-500 flex flex-col items-center justify-center gap-3">
                    <Info className="w-8 h-8 text-slate-650" />
                    <span>No transaction records found in this account date range.</span>
                  </div>
                )}

                {loading && (
                  <div className="flex items-center justify-center py-20 text-cyan-400 gap-2 font-mono">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Decrypting ledger...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="border-t border-slate-900 mt-6 pt-4 text-[10px] text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-550" />
              <span>Statements generated are digitally signed and comply with RBI core node regulations.</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
