"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRightLeft, Search, TrendingUp, TrendingDown, Clock, RefreshCw, Download, Filter } from "lucide-react";

export default function TransactionsHistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "credit" | "debit">("all");

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/transactions/history");
      const data = await res.json();
      if (data.success) { setTransactions(data.data); setFiltered(data.data); }
    } catch (err) { console.error("Failed to fetch transactions", err); }
    finally { setLoading(false); }
  }, []);

  const deleteTransaction = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction ledger entry? This action is permanent!")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        alert("Transaction deleted successfully");
        fetchHistory();
      } else {
        alert(data.message || "Failed to delete transaction");
      }
    } catch (err) {
      console.error("Error deleting transaction", err);
    }
  };

  const clearAllTransactions = async () => {
    if (!window.confirm("CRITICAL WARNING: Are you sure you want to clear the ENTIRE transaction ledger history? This cannot be undone!")) return;
    try {
      const res = await fetch("http://localhost:5000/api/transactions/clear-all", {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        alert("Entire transaction ledger history cleared");
        fetchHistory();
      } else {
        alert(data.message || "Failed to clear ledger history");
      }
    } catch (err) {
      console.error("Error clearing ledger history", err);
    }
  };

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  useEffect(() => {
    const q = search.toLowerCase();
    let result = transactions;
    if (typeFilter !== "all") result = result.filter(t => t.type === typeFilter);
    if (q) result = result.filter(t =>
      (t.transactionId || "").toLowerCase().includes(q) ||
      (t.transferMode || "").toLowerCase().includes(q) ||
      (t.sourceAccount?.accountNumber || "").includes(q) ||
      (t.sourceAccount?.firstName || "").toLowerCase().includes(q) ||
      (t.remarks || "").toLowerCase().includes(q)
    );
    setFiltered(result);
  }, [search, transactions, typeFilter]);

  const totalCredit = filtered.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebit = filtered.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            Transaction History
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Complete record of all network transactions. {!loading && <span className="text-slate-500">{filtered.length} of {transactions.length} shown.</span>}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={clearAllTransactions} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-800 bg-rose-950/20 text-rose-400 text-sm hover:bg-rose-950/40 transition-all font-bold"
          >
            Clear Ledger
          </button>
          <button onClick={fetchHistory} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm hover:border-slate-600 hover:text-slate-300 transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {!loading && transactions.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
            <p className="text-slate-400 text-xs font-medium mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-slate-200">{filtered.length}</p>
          </div>
          <div className="border border-emerald-800/40 bg-slate-900/50 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
            <p className="text-slate-400 text-xs font-medium mb-1">Total Credits</p>
            <p className="text-2xl font-bold text-emerald-400">+₹{totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="border border-rose-800/40 bg-slate-900/50 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl" />
            <p className="text-slate-400 text-xs font-medium mb-1">Total Debits</p>
            <p className="text-2xl font-bold text-rose-400">-₹{totalDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            placeholder="Search by Txn ID, Account, Name, Mode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-800/80 border border-slate-600/70 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "credit", "debit"] as const).map((f) => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${typeFilter === f
                ? f === "all" ? "bg-slate-700 border-slate-600 text-slate-200"
                  : f === "credit" ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-400"
                  : "bg-rose-950/50 border-rose-500/50 text-rose-400"
                : "border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-400"}`}>
              {f === "all" ? "All" : f === "credit" ? "Credits" : "Debits"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/40 border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-medium">Transaction ID</th>
                <th className="px-5 py-4 font-medium">Date & Time</th>
                <th className="px-5 py-4 font-medium">Account</th>
                <th className="px-5 py-4 font-medium">Mode</th>
                <th className="px-5 py-4 font-medium">Remarks</th>
                <th className="px-5 py-4 font-medium text-right">Amount</th>
                <th className="px-5 py-4 font-medium text-center">Status</th>
                <th className="px-5 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                    <p className="text-slate-400">Loading transactions...</p>
                  </div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-16 text-center">
                  <Clock className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">{transactions.length === 0 ? "No transactions recorded yet." : "No results match your search."}</p>
                  {search && <button onClick={() => { setSearch(""); setTypeFilter("all"); }} className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Clear filters</button>}
                </td></tr>
              ) : filtered.map((tx) => (
                <tr key={tx._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-cyan-300 text-xs">{tx.transactionId}</td>
                  <td className="px-5 py-4 text-slate-300 whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    <div className="text-xs text-slate-500 mt-0.5">{new Date(tx.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                  </td>
                  <td className="px-5 py-4">
                    {tx.sourceAccount ? (
                      <div>
                        <p className="text-slate-200 font-medium">{tx.sourceAccount.firstName} {tx.sourceAccount.lastName}</p>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">A/C: {tx.sourceAccount.accountNumber}</p>
                      </div>
                    ) : <span className="text-slate-500 text-xs">System</span>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {tx.type === "credit"
                        ? <div className="w-6 h-6 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center"><TrendingDown className="w-3 h-3 text-emerald-400" /></div>
                        : <div className="w-6 h-6 rounded-full bg-rose-950/60 border border-rose-500/30 flex items-center justify-center"><TrendingUp className="w-3 h-3 text-rose-400" /></div>}
                      <span className="text-slate-300 text-xs">{tx.transferMode}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs max-w-[120px] truncate">{tx.remarks || "—"}</td>
                  <td className="px-5 py-4 text-right">
                    <p className={`font-bold ${tx.type === "credit" ? "text-emerald-400" : "text-rose-400"}`}>
                      {tx.type === "credit" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`px-2.5 py-1 text-xs rounded-full border font-medium ${
                      tx.status === "completed" ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300" :
                      tx.status === "pending" ? "bg-amber-950/40 border-amber-500/30 text-amber-300" :
                      "bg-rose-950/40 border-rose-500/30 text-rose-300"
                    }`}>{tx.status.toUpperCase()}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button 
                      onClick={() => deleteTransaction(tx._id)}
                      className="text-xs font-bold text-rose-400 hover:text-rose-350 transition-colors bg-rose-950/20 border border-rose-900/30 px-2.5 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
