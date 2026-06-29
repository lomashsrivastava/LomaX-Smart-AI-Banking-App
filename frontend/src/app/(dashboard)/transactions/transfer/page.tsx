"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRightLeft, Search, CheckCircle2, AlertCircle, Building2, Loader2, RotateCcw } from "lucide-react";

interface AccountInfo {
  accountNumber: string; accountType: string; holderName: string;
  customerId: string; email: string; balance: number; status: string; branchName: string;
}

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 25000, 50000];
const inputClass = "w-full h-12 px-4 rounded-xl bg-slate-800/80 border border-slate-600/70 text-slate-100 placeholder:text-slate-500 text-sm font-mono focus:outline-none focus:border-blue-400/70 focus:ring-2 focus:ring-blue-400/20 transition-all caret-blue-400";
const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2";

function AccountLookupField({ label, value, onChange, color = "blue" }: { label: string; value: string; onChange: (v: string) => void; color?: string }) {
  const [info, setInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const borderColor = color === "blue" ? "focus:border-blue-400/70 focus:ring-blue-400/20" : "focus:border-indigo-400/70 focus:ring-indigo-400/20";
  const accentColor = color === "blue" ? "text-blue-400" : "text-indigo-400";
  const borderAccent = color === "blue" ? "border-blue-500/30 bg-blue-950/20" : "border-indigo-500/30 bg-indigo-950/20";

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setInfo(null); setError("");
    if (value.trim().length < 8) return;
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/transactions/lookup/${value.trim()}`);
        const data = await res.json();
        if (data.success) { setInfo(data.account); setError(""); }
        else { setError(data.message || "Account not found"); setInfo(null); }
      } catch { setError("Server error"); }
      finally { setLoading(false); }
    }, 600);
  }, [value]);

  return (
    <div className="space-y-3">
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Enter account number" autoComplete="off"
          className={`w-full h-12 px-4 pr-10 rounded-xl bg-slate-800/80 border border-slate-600/70 text-slate-100 placeholder:text-slate-500 text-sm font-mono focus:outline-none ${borderColor} transition-all caret-blue-400`} />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? <Loader2 className={`w-4 h-4 animate-spin ${accentColor}`} /> :
            info ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
            error ? <AlertCircle className="w-4 h-4 text-rose-400" /> :
            <Search className="w-4 h-4 text-slate-500" />}
        </div>
      </div>
      {error && <p className="text-rose-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
      {info && (
        <div className={`border rounded-xl p-3 animate-in fade-in duration-200 ${borderAccent}`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${accentColor} ${borderAccent}`}>
              {info.holderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-200 text-sm">{info.holderName}</p>
              <p className="text-xs text-slate-500 font-mono">{info.customerId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Balance</p>
              <p className="text-emerald-400 font-bold text-sm">₹{info.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="mt-2 flex gap-4 text-xs text-slate-500">
            <span>{info.accountType}</span>
            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{info.branchName}</span>
          </div>
        </div>
      )}
      {/* expose info for parent */}
      <input type="hidden" data-account-info={JSON.stringify(info)} />
    </div>
  );
}

export default function TransferPage() {
  const [sourceAccount, setSourceAccount] = useState("");
  const [targetAccount, setTargetAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [sourceInfo, setSourceInfo] = useState<AccountInfo | null>(null);
  const [targetInfo, setTargetInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string; txnId?: string } | null>(null);

  // Lookups for source and target
  const srcDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tgtDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [srcLoading, setSrcLoading] = useState(false);
  const [srcError, setSrcError] = useState("");
  const [tgtLoading, setTgtLoading] = useState(false);
  const [tgtError, setTgtError] = useState("");

  useEffect(() => {
    if (srcDebounce.current) clearTimeout(srcDebounce.current);
    setSourceInfo(null); setSrcError("");
    if (sourceAccount.trim().length < 8) return;
    srcDebounce.current = setTimeout(async () => {
      setSrcLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/transactions/lookup/${sourceAccount.trim()}`);
        const data = await res.json();
        if (data.success) { setSourceInfo(data.account); setSrcError(""); }
        else { setSrcError(data.message || "Account not found"); setSourceInfo(null); }
      } catch { setSrcError("Server error"); } finally { setSrcLoading(false); }
    }, 600);
  }, [sourceAccount]);

  useEffect(() => {
    if (tgtDebounce.current) clearTimeout(tgtDebounce.current);
    setTargetInfo(null); setTgtError("");
    if (targetAccount.trim().length < 8) return;
    tgtDebounce.current = setTimeout(async () => {
      setTgtLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/transactions/lookup/${targetAccount.trim()}`);
        const data = await res.json();
        if (data.success) { setTargetInfo(data.account); setTgtError(""); }
        else { setTgtError(data.message || "Account not found"); setTargetInfo(null); }
      } catch { setTgtError("Server error"); } finally { setTgtLoading(false); }
    }, 600);
  }, [targetAccount]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceInfo || !targetInfo) { setMessage({ type: "error", text: "Verify both account numbers first." }); return; }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { setMessage({ type: "error", text: "Enter a valid amount." }); return; }
    if (sourceInfo.balance < amt) { setMessage({ type: "error", text: `Insufficient balance in source account. Available: ₹${sourceInfo.balance.toLocaleString("en-IN")}` }); return; }
    setLoading(true); setMessage(null);
    try {
      const res = await fetch("http://localhost:5000/api/transactions/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transferType: "Internal Transfer", sourceAccount: sourceAccount.trim(), targetAccount: targetAccount.trim(), amount: amt, remarks }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `₹${amt.toLocaleString("en-IN")} transferred from ${sourceInfo.holderName} to ${targetInfo.holderName}.`, txnId: data.transaction?.transactionId });
        setSourceAccount(""); setTargetAccount(""); setAmount(""); setRemarks(""); setSourceInfo(null); setTargetInfo(null);
      } else {
        setMessage({ type: "error", text: data.message || "Transfer failed" });
      }
    } catch { setMessage({ type: "error", text: "Network error. Please try again." }); }
    finally { setLoading(false); }
  };

  const reset = () => { setSourceAccount(""); setTargetAccount(""); setAmount(""); setRemarks(""); setSourceInfo(null); setTargetInfo(null); setSrcError(""); setTgtError(""); setMessage(null); };
  const insufficientFunds = sourceInfo && amount && parseFloat(amount) > sourceInfo.balance;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 flex items-center gap-3">
            <ArrowRightLeft className="w-8 h-8 text-blue-400" /> Fund Transfer
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Transfer funds securely between LomaX accounts.</p>
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 border border-slate-700 rounded-xl hover:border-slate-600 hover:text-slate-300 transition-all">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-start gap-3 border animate-in fade-in duration-300 ${message.type === "success" ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-200" : "bg-rose-950/50 border-rose-500/40 text-rose-200"}`}>
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />}
          <div><p className="text-sm font-medium">{message.text}</p>{message.txnId && <p className="text-xs font-mono mt-1 opacity-70">TXN ID: {message.txnId}</p>}</div>
        </div>
      )}

      <div className="border border-slate-700/60 bg-slate-900/60 rounded-2xl backdrop-blur-md overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="p-6 border-b border-slate-800/60">
          <h2 className="font-semibold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-blue-400" /> Transfer Details
          </h2>
        </div>

        <form onSubmit={handleTransfer} className="p-6 space-y-6 relative z-10">
          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source */}
            <div>
              <label className={labelClass + " text-blue-400/80"}>Source Account (Sender)</label>
              <div className="relative">
                <input value={sourceAccount} onChange={(e) => setSourceAccount(e.target.value)} placeholder="Sender account number"
                  className="w-full h-12 px-4 pr-10 rounded-xl bg-slate-800/80 border border-slate-600/70 text-slate-100 placeholder:text-slate-500 text-sm font-mono focus:outline-none focus:border-blue-400/70 focus:ring-2 focus:ring-blue-400/20 transition-all caret-blue-400" autoComplete="off" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {srcLoading ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> :
                    sourceInfo ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                    srcError ? <AlertCircle className="w-4 h-4 text-rose-400" /> :
                    <Search className="w-4 h-4 text-slate-500" />}
                </div>
              </div>
              {srcError && <p className="text-rose-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{srcError}</p>}
              {sourceInfo && (
                <div className="mt-3 border border-blue-500/30 bg-blue-950/20 rounded-xl p-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                      {sourceInfo.holderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-200 text-sm">{sourceInfo.holderName}</p>
                      <p className="text-xs text-slate-500 font-mono">{sourceInfo.customerId}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-slate-500">{sourceInfo.accountType}</span>
                    <span className="text-emerald-400 font-bold">₹{sourceInfo.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Target */}
            <div>
              <label className={labelClass + " text-indigo-400/80"}>Target Account (Receiver)</label>
              <div className="relative">
                <input value={targetAccount} onChange={(e) => setTargetAccount(e.target.value)} placeholder="Receiver account number"
                  className="w-full h-12 px-4 pr-10 rounded-xl bg-slate-800/80 border border-slate-600/70 text-slate-100 placeholder:text-slate-500 text-sm font-mono focus:outline-none focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/20 transition-all caret-indigo-400" autoComplete="off" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {tgtLoading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> :
                    targetInfo ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                    tgtError ? <AlertCircle className="w-4 h-4 text-rose-400" /> :
                    <Search className="w-4 h-4 text-slate-500" />}
                </div>
              </div>
              {tgtError && <p className="text-rose-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{tgtError}</p>}
              {targetInfo && (
                <div className="mt-3 border border-indigo-500/30 bg-indigo-950/20 rounded-xl p-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                      {targetInfo.holderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-200 text-sm">{targetInfo.holderName}</p>
                      <p className="text-xs text-slate-500 font-mono">{targetInfo.customerId}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-slate-500">{targetInfo.accountType}</span>
                    <span className="text-slate-400">{targetInfo.branchName}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className={labelClass}>Transfer Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold text-lg">₹</span>
              <input required type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"
                className="w-full h-14 pl-9 rounded-xl bg-slate-800/80 border border-slate-600/70 text-blue-400 placeholder:text-slate-600 text-2xl font-bold focus:outline-none focus:border-blue-400/70 focus:ring-2 focus:ring-blue-400/20 transition-all caret-blue-400" />
            </div>
            {insufficientFunds && <p className="text-rose-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Exceeds source balance</p>}
            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK_AMOUNTS.map((q) => (
                <button key={q} type="button" onClick={() => setAmount(String(q))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${amount === String(q) ? "bg-blue-500/20 border-blue-500/50 text-blue-300" : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"}`}>
                  ₹{q.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className={labelClass}>Remarks <span className="text-slate-600 normal-case tracking-normal">(Optional)</span></label>
            <input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="e.g. Rent payment, loan installment"
              className="w-full h-12 px-4 rounded-xl bg-slate-800/80 border border-slate-600/70 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-400/70 focus:ring-2 focus:ring-blue-400/20 transition-all" />
          </div>

          {/* Transfer Summary */}
          {sourceInfo && targetInfo && amount && parseFloat(amount) > 0 && !insufficientFunds && (
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 text-sm space-y-2">
              <div className="flex justify-between text-slate-400"><span>From</span><span className="text-slate-200 font-medium">{sourceInfo.holderName} <span className="text-slate-500 font-mono text-xs">({sourceInfo.accountNumber})</span></span></div>
              <div className="flex justify-between text-slate-400"><span>To</span><span className="text-slate-200 font-medium">{targetInfo.holderName} <span className="text-slate-500 font-mono text-xs">({targetInfo.accountNumber})</span></span></div>
              <div className="flex justify-between text-slate-400"><span>Source balance after</span><span className="text-slate-300">₹{(sourceInfo.balance - parseFloat(amount)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between pt-2 border-t border-slate-700/50 font-bold text-base"><span className="text-slate-300">Transfer Amount</span><span className="text-blue-400">₹{parseFloat(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
            </div>
          )}

          <button type="submit" disabled={loading || !sourceInfo || !targetInfo || !amount || !!insufficientFunds}
            className="w-full h-14 text-base font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><ArrowRightLeft className="w-5 h-5" /> Process Fund Transfer</>}
          </button>
        </form>
      </div>
    </div>
  );
}
