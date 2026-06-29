"use client";

import { useState } from "react";
import { 
  FileText, Download, Calendar, Search, Printer, 
  BookOpen, Eye, X, Landmark, TrendingDown, TrendingUp 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AccountDetails {
  balance: number;
  status: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    customerId: string;
  };
}

interface StatementTx {
  _id: string;
  transactionId: string;
  createdAt: string;
  transferMode: string;
  type: "credit" | "debit";
  amount: number;
  remarks: string;
}

export default function AccountStatementsPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Results
  const [accountData, setAccountData] = useState<AccountDetails | null>(null);
  const [txHistory, setTxHistory] = useState<StatementTx[]>([]);
  const [showPassbook, setShowPassbook] = useState(false);

  const generateStatement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber) {
      alert("Please enter a valid account number.");
      return;
    }
    setLoading(true);
    setShowPassbook(false);

    try {
      // 1. Fetch live account details
      const accountRes = await fetch(`http://localhost:5000/api/accounts/live/${accountNumber}`);
      const accountJson = await accountRes.json();

      if (!accountJson.success) {
        alert(accountJson.message || "Account not found in the LomaX core server database.");
        setLoading(false);
        return;
      }

      setAccountData(accountJson);

      // 2. Fetch transaction history
      const txRes = await fetch(`http://localhost:5000/api/transactions/account/${accountNumber}`);
      const txJson = await txRes.json();

      if (txJson.success) {
        let txs: StatementTx[] = txJson.data;
        // Filter by date if provided
        if (fromDate) {
          const start = new Date(fromDate);
          txs = txs.filter(t => new Date(t.createdAt) >= start);
        }
        if (toDate) {
          const end = new Date(toDate);
          end.setHours(23, 59, 59, 999);
          txs = txs.filter(t => new Date(t.createdAt) <= end);
        }
        setTxHistory(txs);
      }

      setShowPassbook(true);
    } catch (err) {
      console.error("Statement generation error", err);
      alert("Core transaction database sync failure. Please retry shortly.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Simulate generation of statement PDF
    alert(`Downloading statement PDF for account: ${accountNumber}...`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-200">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)] flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-400" /> Account Statements
        </h1>
        <p className="text-slate-400 mt-2">Generate PDF and print-ready digital passbooks for customer accounts.</p>
      </div>

      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden p-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={generateStatement} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400" /> Account Number
              </label>
              <Input 
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter 12-digit account number"
                className="h-12 bg-slate-950/50 border-slate-700 text-lg font-mono text-cyan-400 placeholder:text-slate-650 focus-visible:border-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">From Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-12 pl-10 bg-slate-950/50 border-slate-700 text-cyan-450 focus-visible:border-cyan-500" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">To Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input 
                  type="date" 
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-12 pl-10 bg-slate-950/50 border-slate-700 text-cyan-450 focus-visible:border-cyan-500" 
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={loading} className="bg-indigo-650 hover:bg-indigo-550 text-white gap-2 px-8 h-12 font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              {loading ? "Compiling Ledger..." : "Generate Statement"}
            </Button>
          </div>
        </form>
      </div>

      {/* Digital Passbook Viewer Box */}
      {showPassbook && accountData && (
        <div className="border border-slate-800 bg-slate-950 rounded-3xl p-6 relative overflow-hidden space-y-6 shadow-2xl animate-in slide-in-from-top-6 duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Viewer Header */}
          <div className="flex justify-between items-start border-b border-slate-900 pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-cyan-400" />
              <div>
                <h3 className="text-lg font-bold text-slate-200">LomaX Digital Passbook</h3>
                <p className="text-[10px] font-mono text-slate-500">REAL-TIME ACCOUNT HISTORY LEDGER STATEMENT</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/40 text-slate-400 text-xs hover:border-slate-700 hover:text-slate-200 transition-all font-mono"
              >
                <Printer className="w-3.5 h-3.5" /> PRINT PASSBOOK
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-850 bg-cyan-950/20 text-cyan-400 text-xs hover:bg-cyan-950/40 transition-all font-mono"
              >
                <Download className="w-3.5 h-3.5" /> DOWNLOAD PDF
              </button>
              <button 
                onClick={() => setShowPassbook(false)}
                className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-500 hover:text-slate-350"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Account Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/40 border border-slate-850 p-5 rounded-2xl font-mono text-xs">
            <div className="space-y-1.5">
              <p className="text-slate-500">ACCOUNT HOLDER</p>
              <p className="text-slate-200 font-bold uppercase">{accountData.user?.firstName} {accountData.user?.lastName}</p>
              <p className="text-slate-400 text-[10px]">{accountData.user?.email}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-slate-500">ACCOUNT METADATA</p>
              <p className="text-slate-200">A/C: <span className="text-cyan-400 font-bold">{accountNumber}</span></p>
              <p className="text-slate-400 text-[10px]">CIF: {accountData.user?.customerId}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-slate-500">CURRENT LEDGER BALANCE</p>
              <p className="text-emerald-400 font-black text-base">₹{accountData.balance?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
              <p className="text-slate-500 text-[9px]">STATUS: {accountData.status?.toUpperCase()}</p>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="border border-slate-850 bg-slate-900/20 rounded-2xl overflow-hidden font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950/60 border-b border-slate-850 text-slate-500 uppercase tracking-widest text-[9px]">
                <tr>
                  <th className="px-4 py-3">Value Date</th>
                  <th className="px-4 py-3">Reference ID</th>
                  <th className="px-4 py-3">Description / Remarks</th>
                  <th className="px-4 py-3 text-right">Debit (-)</th>
                  <th className="px-4 py-3 text-right">Credit (+)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/40">
                {txHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      NO SETTLEMENT ENTRIES FOUND IN SPECIFIED RANGE.
                    </td>
                  </tr>
                ) : (
                  txHistory.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="px-4 py-3 text-slate-450">
                        {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                      </td>
                      <td className="px-4 py-3 text-cyan-400/80 text-[10px]">{tx.transactionId}</td>
                      <td className="px-4 py-3 text-slate-300">
                        <span className="font-semibold text-slate-200">{tx.transferMode}</span>
                        {tx.remarks && <span className="text-slate-500 block text-[9px] truncate max-w-[180px]">{tx.remarks}</span>}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-rose-400">
                        {tx.type === "debit" ? `₹${tx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-400">
                        {tx.type === "credit" ? `₹${tx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
