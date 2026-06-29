"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, CreditCard, ExternalLink, History, TrendingUp, ShieldAlert, Landmark, Smartphone, Sparkles } from "lucide-react";
import { toast } from "sonner";

// Mock accounts for frontend display
const ACCOUNTS = [
  {
    id: "ACC1001",
    type: "Savings Account",
    number: "1000 4567 4021",
    balance: 145280.50,
    status: "Active",
    ifsc: "LOMX0001001",
    branch: "Koramangala, Bengaluru",
    interestRate: "3.5%",
    monthlyAvg: 112000,
  },
  {
    id: "ACC1002",
    type: "Current Account",
    number: "2000 8901 5532",
    balance: 25000.00,
    status: "Active",
    ifsc: "LOMX0001001",
    branch: "Koramangala, Bengaluru",
    interestRate: "0.0%",
    monthlyAvg: 20000,
  }
];

export default function CustomerAccountsPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Account details copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            My Accounts
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Manage and view details for all your linked LomaX accounts.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all hover:scale-105">
          Open New Account
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {ACCOUNTS.map((acc, index) => (
          <div key={acc.id} className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r ${index === 0 ? 'from-cyan-500 to-blue-500' : 'from-purple-500 to-indigo-500'} rounded-3xl transform transition-transform group-hover:scale-[1.01] -z-10 blur-2xl opacity-10`} />
            
            <Card className="border-slate-900 shadow-xl h-full flex flex-col overflow-hidden bg-slate-950/50 backdrop-blur-md rounded-3xl hover:border-slate-800 transition-all duration-300">
              <div className={`h-1.5 w-full bg-gradient-to-r ${index === 0 ? 'from-cyan-400 to-blue-500' : 'from-purple-400 to-indigo-500'}`} />
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-200">{acc.type}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-mono text-base text-slate-400">{acc.number}</span>
                      <button 
                        onClick={() => copyToClipboard(acc.number)}
                        className="text-slate-500 hover:text-cyan-400 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {acc.status}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col pt-2">
                <div className="mb-6">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Available Balance</p>
                  <h3 className="text-3xl font-extrabold text-slate-100">
                    <span className="text-xl mr-0.5 text-cyan-400 font-bold">₹</span>
                    {acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-900 mb-6 flex-1 text-xs">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">IFSC Code</p>
                    <p className="font-medium font-mono text-slate-350">{acc.ifsc}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Interest Rate</p>
                    <p className="font-semibold text-emerald-400 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 mr-1" />
                      {acc.interestRate} p.a.
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Home Branch</p>
                    <p className="font-semibold text-slate-300 flex items-center">
                      <Landmark className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
                      {acc.branch}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <Button variant="outline" className="flex-1 bg-transparent border-slate-900 hover:bg-slate-900/50 text-slate-300">
                    <History className="w-4 h-4 mr-2 text-cyan-400" />
                    Statement
                  </Button>
                  <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800">
                    <CreditCard className="w-4 h-4 mr-2 text-indigo-400" />
                    Manage Cards
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Action Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Card className="bg-cyan-950/20 border-cyan-500/10 rounded-2xl relative overflow-hidden group hover:border-cyan-500/35 transition-all">
            <div className="absolute top-0 right-0 p-12 bg-cyan-500/5 rounded-full blur-2xl" />
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-200 mb-2">Enable UPI</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">Link your account to UPI for instant peer-to-peer transfers.</p>
              <Button variant="link" className="text-cyan-400 hover:text-cyan-300 p-0 h-auto font-bold text-xs">
                Configure Now <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-purple-950/20 border-purple-500/10 rounded-2xl relative overflow-hidden group hover:border-purple-500/35 transition-all">
            <div className="absolute top-0 right-0 p-12 bg-purple-500/5 rounded-full blur-2xl" />
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-200 mb-2">Fixed Deposits</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">Earn up to 7.5% interest p.a. by opening a Fixed Deposit.</p>
              <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0 h-auto font-bold text-xs">
                Open FD <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-red-950/20 border-red-500/10 rounded-2xl relative overflow-hidden group hover:border-red-500/35 transition-all">
            <div className="absolute top-0 right-0 p-12 bg-red-500/5 rounded-full blur-2xl" />
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-500/30 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-200 mb-2">Security Controls</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">Manage domestic and international limits for your accounts.</p>
              <Button variant="link" className="text-red-400 hover:text-red-300 p-0 h-auto font-bold text-xs">
                Manage Limits <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
