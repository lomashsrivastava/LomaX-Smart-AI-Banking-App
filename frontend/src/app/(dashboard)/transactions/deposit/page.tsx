"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowDownToLine, Search, CheckCircle2, AlertCircle, User, Building2, Loader2, Banknote, RotateCcw } from "lucide-react";

interface AccountInfo {
  accountNumber: string;
  accountType: string;
  holderName: string;
  customerId: string;
  email: string;
  balance: number;
  status: string;
  branchName: string;
}

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000];

const inputClass = "w-full h-12 px-4 rounded-xl bg-slate-800/80 border border-slate-600/70 text-slate-100 placeholder:text-slate-500 text-sm font-mono focus:outline-none focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/20 transition-all caret-emerald-400";
const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2";

export default function DepositPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string; txnId?: string } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-lookup account when number is entered
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setAccountInfo(null);
    setLookupError("");
    if (accountNumber.trim().length < 8) return;
    debounceRef.current = setTimeout(async () => {
      setLookupLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/transactions/lookup/${accountNumber.trim()}`);
        const data = await res.json();
        if (data.success) {
          setAccountInfo(data.account);
          setLookupError("");
        } else {
          setLookupError(data.message || "Account not found");
          setAccountInfo(null);
        }
      } catch {
        setLookupError("Server connection error");
      } finally {
        setLookupLoading(false);
      }
    }, 600);
  }, [accountNumber]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountInfo) { setMessage({ type: "error", text: "Please verify account number first." }); return; }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { setMessage({ type: "error", text: "Please enter a valid amount." }); return; }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("http://localhost:5000/api/transactions/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber: accountNumber.trim(), amount: amt, remarks }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `₹${amt.toLocaleString("en-IN")} deposited successfully to ${accountInfo.holderName}'s account.`, txnId: data.transaction?.transactionId });
        setAccountNumber(""); setAmount(""); setRemarks(""); setAccountInfo(null);
      } else {
        setMessage({ type: "error", text: data.message || "Deposit failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setAccountNumber(""); setAmount(""); setRemarks(""); setAccountInfo(null); setLookupError(""); setMessage(null); };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 flex items-center gap-3">
            <ArrowDownToLine className="w-8 h-8 text-emerald-400" /> Cash Deposit
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Deposit cash directly into a customer's account.</p>
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 border border-slate-700 rounded-xl hover:border-slate-600 hover:text-slate-300 transition-all">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-start gap-3 border animate-in fade-in duration-300 ${message.type === "success" ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-200" : "bg-rose-950/50 border-rose-500/40 text-rose-200"}`}>
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />}
          <div>
            <p className="text-sm font-medium">{message.text}</p>
            {message.txnId && <p className="text-xs font-mono mt-1 opacity-70">TXN ID: {message.txnId}</p>}
          </div>
        </div>
      )}

      <div className="border border-slate-700/60 bg-slate-900/60 rounded-2xl backdrop-blur-md overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="p-6 border-b border-slate-800/60">
          <h2 className="font-semibold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
            <Banknote className="w-4 h-4 text-emerald-400" /> Deposit Details
          </h2>
        </div>

        <form onSubmit={handleDeposit} className="p-6 space-y-6 relative z-10">
          {/* Account Number */}
          <div>
            <label className={labelClass}>Target Account Number</label>
            <div className="relative">
              <input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number (e.g. 927301982277160)"
                className={inputClass + " pr-10"}
                autoComplete="off"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {lookupLoading ? <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" /> :
                  accountInfo ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                  lookupError ? <AlertCircle className="w-4 h-4 text-rose-400" /> :
                  <Search className="w-4 h-4 text-slate-500" />}
              </div>
            </div>
            {lookupError && <p className="text-rose-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{lookupError}</p>}
          </div>

          {/* Account Preview Card */}
          {accountInfo && (
            <div className="border border-emerald-500/30 bg-emerald-950/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    {accountInfo.holderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">{accountInfo.holderName}</p>
                    <p className="text-xs text-slate-400 font-mono">{accountInfo.customerId}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-medium capitalize">{accountInfo.status}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-slate-500">Account Type</span><p className="text-slate-300 font-medium mt-0.5">{accountInfo.accountType}</p></div>
                <div><span className="text-slate-500">Current Balance</span><p className="text-emerald-400 font-bold mt-0.5">₹{accountInfo.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p></div>
                <div><span className="text-slate-500">Branch</span><p className="text-slate-300 font-medium mt-0.5 flex items-center gap-1"><Building2 className="w-3 h-3" />{accountInfo.branchName}</p></div>
                <div><span className="text-slate-500">Email</span><p className="text-slate-300 font-medium mt-0.5 truncate">{accountInfo.email}</p></div>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className={labelClass}>Deposit Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-lg">₹</span>
              <input
                required
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className={inputClass + " pl-9 h-14 text-2xl font-bold text-emerald-400 placeholder:text-slate-600"}
              />
            </div>
            {/* Quick amounts */}
            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK_AMOUNTS.map((q) => (
                <button key={q} type="button" onClick={() => setAmount(String(q))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${amount === String(q) ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"}`}>
                  ₹{q.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className={labelClass}>Remarks <span className="text-slate-600 normal-case tracking-normal">(Optional)</span></label>
            <input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Cash deposit via branch"
              className={inputClass}
            />
          </div>

          {/* Summary */}
          {accountInfo && amount && parseFloat(amount) > 0 && (
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 text-sm space-y-2">
              <div className="flex justify-between text-slate-400"><span>Depositing to</span><span className="text-slate-200 font-medium">{accountInfo.holderName}</span></div>
              <div className="flex justify-between text-slate-400"><span>Account</span><span className="font-mono text-slate-300">{accountInfo.accountNumber}</span></div>
              <div className="flex justify-between pt-2 border-t border-slate-700/50 font-bold text-base"><span className="text-slate-300">Total Deposit</span><span className="text-emerald-400">₹{parseFloat(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !accountInfo || !amount}
            className="w-full h-14 text-base font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing Deposit...</> : <><ArrowDownToLine className="w-5 h-5" /> Process Cash Deposit</>}
          </button>
        </form>
      </div>
    </div>
  );
}
