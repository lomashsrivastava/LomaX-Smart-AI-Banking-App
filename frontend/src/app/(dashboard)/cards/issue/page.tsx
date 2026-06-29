"use client";

import { useState } from "react";
import { CreditCard, Search, CheckCircle2, AlertCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function IssueCardPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardType, setCardType] = useState("Debit");
  const [cardNetwork, setCardNetwork] = useState("Visa");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleIssueCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/cards/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber, cardHolderName, cardType, cardNetwork }),
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: `Successfully issued ${cardNetwork} ${cardType} card ending in ${data.data.cardNumber.slice(-4)} for ${cardHolderName}.` });
        setAccountNumber("");
        setCardHolderName("");
      } else {
        setMessage({ type: 'error', text: data.message || "Failed to issue card" });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "An error occurred while issuing the card." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] flex items-center gap-3">
          <PlusCircle className="w-8 h-8 text-cyan-400" /> Issue New Card
        </h1>
        <p className="text-slate-400 mt-2">Generate and link a new Debit or Credit card to a customer account.</p>
      </div>

      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden p-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

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

        <form onSubmit={handleIssueCard} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" /> Target Account Number
              </label>
              <Input 
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter 12-digit account number"
                className="h-12 bg-slate-950/50 border-slate-700 text-lg font-mono placeholder:font-sans text-cyan-400 placeholder:text-slate-600 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] focus:drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all duration-300"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Name on Card</label>
              <Input 
                required
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                placeholder="Enter exact name to be printed on card"
                className="h-12 bg-slate-950/50 border-slate-700 uppercase text-cyan-400 placeholder:text-slate-600 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] focus:drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Card Type</label>
              <select 
                value={cardType} 
                onChange={(e) => setCardType(e.target.value)} 
                className="flex h-12 w-full rounded-md border border-slate-700 bg-slate-950/50 px-3 py-2 text-cyan-400 placeholder:text-slate-600 focus-visible:outline-none focus-visible:border-cyan-500 focus-visible:ring-1 focus-visible:ring-cyan-500/20 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] focus:drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all duration-300"
              >
                <option value="Debit" className="bg-slate-950 text-cyan-400">Debit Card</option>
                <option value="Credit" className="bg-slate-950 text-cyan-400">Credit Card</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Card Network</label>
              <select 
                value={cardNetwork} 
                onChange={(e) => setCardNetwork(e.target.value)} 
                className="flex h-12 w-full rounded-md border border-slate-700 bg-slate-950/50 px-3 py-2 text-cyan-400 placeholder:text-slate-600 focus-visible:outline-none focus-visible:border-cyan-500 focus-visible:ring-1 focus-visible:ring-cyan-500/20 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] focus:drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all duration-300"
              >
                <option value="Visa" className="bg-slate-950 text-cyan-400">Visa</option>
                <option value="MasterCard" className="bg-slate-950 text-cyan-400">MasterCard</option>
                <option value="RuPay" className="bg-slate-950 text-cyan-400">RuPay</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all"
            >
              {loading ? "Processing Issue Request..." : "Issue New Card"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
