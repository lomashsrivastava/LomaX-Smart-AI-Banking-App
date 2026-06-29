"use client";

import { useState } from "react";
import { FileSignature, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoanApplyPage() {
  const [customerId, setCustomerId] = useState("");
  const [loanType, setLoanType] = useState("Personal Loan");
  const [amount, setAmount] = useState("");
  const [tenureMonths, setTenureMonths] = useState("");
  const [purpose, setPurpose] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/loans/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          customerId, loanType, 
          amount: parseFloat(amount), 
          tenureMonths: parseInt(tenureMonths), 
          purpose, 
          monthlyIncome: parseFloat(monthlyIncome) 
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: `Loan application successfully submitted! Application ID: ${data.data.applicationId}` });
        setCustomerId("");
        setAmount("");
        setTenureMonths("");
        setPurpose("");
        setMonthlyIncome("");
      } else {
        setMessage({ type: 'error', text: data.message || "Failed to submit loan application" });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "An error occurred while submitting the application." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] flex items-center gap-3">
          <FileSignature className="w-8 h-8 text-amber-400" /> Loan Origination
        </h1>
        <p className="text-slate-400 mt-2">Submit a new loan application for a verified customer.</p>
      </div>

      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden p-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
            message.type === 'success' 
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleApply} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-400" /> Customer ID
              </label>
              <Input 
                required
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Enter Customer ID"
                className="h-12 bg-slate-950/50 border-slate-700 text-lg font-mono placeholder:font-sans text-amber-400 placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] focus:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Loan Type</label>
              <select 
                value={loanType} 
                onChange={(e) => setLoanType(e.target.value)} 
                className="flex h-12 w-full rounded-md border border-slate-700 bg-slate-950/50 px-3 py-2 text-amber-400 placeholder:text-slate-600 focus-visible:outline-none focus-visible:border-amber-500 focus-visible:ring-1 focus-visible:ring-amber-500/20 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] focus:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] transition-all duration-300"
              >
                <option value="Personal Loan" className="bg-slate-950 text-amber-400">Personal Loan</option>
                <option value="Home Loan" className="bg-slate-950 text-amber-400">Home Loan</option>
                <option value="Car Loan" className="bg-slate-950 text-amber-400">Car Loan</option>
                <option value="Education Loan" className="bg-slate-950 text-amber-400">Education Loan</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Requested Amount (₹)</label>
              <Input 
                required
                type="number"
                min="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="h-12 bg-slate-950/50 border-slate-700 text-amber-400 placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] focus:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Tenure (Months)</label>
              <Input 
                required
                type="number"
                min="1"
                max="360"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(e.target.value)}
                placeholder="e.g. 60"
                className="h-12 bg-slate-950/50 border-slate-700 text-amber-400 placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] focus:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Monthly Income (₹)</label>
              <Input 
                required
                type="number"
                min="0"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="0"
                className="h-12 bg-slate-950/50 border-slate-700 text-amber-400 placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] focus:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] transition-all duration-300"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Loan Purpose</label>
              <Input 
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Briefly describe the purpose of the loan"
                className="h-12 bg-slate-950/50 border-slate-700 text-amber-400 placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] focus:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] transition-all duration-300"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all"
            >
              {loading ? "Submitting..." : "Submit Loan Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
