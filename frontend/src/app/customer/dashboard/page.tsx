"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import apiClient from "@/services/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRightLeft, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  Send, 
  History,
  Wallet,
  Activity,
  Sparkles,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Account {
  id?: string;
  number: string;
  type: string;
  balance: number;
}

interface Transaction {
  transactionId: string;
  type: "credit" | "debit";
  amount: number;
  remarks?: string;
  transferMode?: string;
  payeeName?: string;
  createdAt: string;
}

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // 1. Fetch user accounts
      const accRes = await apiClient.get(`/accounts/${user.id}`);
      if (accRes.data.success && accRes.data.accounts) {
        const fetchedAccounts = accRes.data.accounts;
        setAccounts(fetchedAccounts);
        
        // 2. Fetch transaction history of the primary account
        if (fetchedAccounts.length > 0) {
          const primaryAcc = fetchedAccounts[0];
          const txnRes = await apiClient.get(`/transactions/account/${primaryAcc.number}`);
          if (txnRes.data.success && txnRes.data.data) {
            setTransactions(txnRes.data.data.slice(0, 5)); // top 5 transactions
          }
        }
      }
    } catch (error: any) {
      console.error("Dashboard load error:", error);
      toast.error("Failed to sync latest financial details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const formatAccountNumber = (num: string) => {
    if (!num) return "";
    const cleanNum = num.replace(/\s/g, "");
    if (cleanNum.length <= 4) return cleanNum;
    return `${cleanNum.slice(0, 4)} •••• •••• ${cleanNum.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-12 text-slate-100 animate-pulse">
        {/* Welcome Banner Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-900 rounded-lg"></div>
            <div className="h-4 w-40 bg-slate-900 rounded-lg"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 bg-slate-900 rounded-lg"></div>
            <div className="h-10 w-32 bg-slate-900 rounded-lg"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="h-5 w-40 bg-slate-900 rounded-lg mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-40 bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
                  <div className="h-4 w-20 bg-slate-850 rounded"></div>
                  <div className="h-8 w-40 bg-slate-855 rounded"></div>
                </div>
                <div className="h-40 bg-slate-900 border border-slate-855 rounded-2xl p-6 space-y-4">
                  <div className="h-4 w-20 bg-slate-855 rounded"></div>
                  <div className="h-8 w-40 bg-slate-855 rounded"></div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="h-5 w-32 bg-slate-900 rounded-lg mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-slate-900 border border-slate-850 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-1">
            <div className="h-[350px] bg-slate-900 border border-slate-855 rounded-2xl p-6 space-y-6">
              <div className="h-6 w-32 bg-slate-850 rounded"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="w-9 h-9 bg-slate-850 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-slate-855 rounded"></div>
                      <div className="h-2.5 w-16 bg-slate-855 rounded"></div>
                    </div>
                  </div>
                  <div className="h-3.5 w-14 bg-slate-850 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 text-slate-100 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-950/70 border border-slate-900 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.3)]">
              Welcome back, {user?.name || "Customer"}!
            </h1>
            <span className="flex items-center gap-1 bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> ONLINE
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            Customer ID: <span className="font-mono text-cyan-300 font-bold">{user?.id || "CUST100001"}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link href="/customer/cards">
            <Button variant="outline" className="border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-850/80 shadow-md">
              <CreditCard className="w-4 h-4 mr-2 text-cyan-400" />
              Manage Cards
            </Button>
          </Link>
          <Link href="/customer/transfer">
            <Button className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all hover:scale-105">
              <Send className="w-4 h-4 mr-2" />
              Transfer Money
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Accounts Summary & Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Account Cards Grid */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 text-slate-200 tracking-wide">
              <Wallet className="w-5 h-5 text-cyan-400" />
              <span>Active Accounts</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accounts.map((acc, index) => (
                <div 
                  key={acc.id || index}
                  className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 backdrop-blur-md"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                          {acc.type}
                        </span>
                        <p className="font-mono text-sm text-slate-400 mt-2.5 tracking-wider">{formatAccountNumber(acc.number)}</p>
                      </div>
                      <span className="flex items-center gap-1 bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span> Active
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Available Balance</p>
                      <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-slate-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        <span className="text-xl mr-0.5 text-cyan-400 font-bold">₹</span>{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </h2>
                    </div>
                  </div>
                </div>
              ))}

              {accounts.length === 0 && (
                <div className="col-span-2 text-center py-12 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-450 text-sm">
                  No accounts are registered under this profile yet.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-200 tracking-wide">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Send Money", icon: Send, href: "/customer/transfer", color: "text-cyan-400", bg: "bg-cyan-950/30 border-cyan-500/10 hover:border-cyan-500/40" },
                { label: "History", icon: History, href: "/customer/transactions", color: "text-purple-400", bg: "bg-purple-950/30 border-purple-500/10 hover:border-purple-500/40" },
                { label: "Cards", icon: CreditCard, href: "/customer/cards", color: "text-amber-400", bg: "bg-amber-950/30 border-amber-500/10 hover:border-amber-500/40" },
                { label: "Settings", icon: ArrowRightLeft, href: "/customer/accounts", color: "text-emerald-400", bg: "bg-emerald-950/30 border-emerald-500/10 hover:border-emerald-500/40" },
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <div className={`bg-slate-950/50 border ${action.bg} p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:scale-105 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all cursor-pointer group backdrop-blur-md`}>
                    <div className="w-12 h-12 rounded-xl bg-slate-900/80 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all border border-slate-900">
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <span className="text-xs font-bold text-slate-300">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Recent Transactions */}
        <div className="lg:col-span-1">
          <Card className="h-full border-slate-900 bg-slate-950/40 shadow-xl rounded-3xl backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-900">
              <CardTitle className="text-base font-bold text-slate-200 flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Recent Activity</span>
              </CardTitle>
              <Link href="/customer/transactions" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {transactions.map((txn) => {
                  const desc = txn.remarks || txn.payeeName || txn.transferMode || (txn.type === 'credit' ? 'Deposit' : 'Transfer');
                  return (
                    <div key={txn.transactionId} className="flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          txn.type === "credit" 
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30" 
                            : "bg-rose-950/60 text-rose-400 border border-rose-900/30"
                        }`}>
                          {txn.type === "credit" ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div className="max-w-[140px] truncate">
                          <p className="text-xs font-bold text-slate-250 truncate">{desc}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">
                            {new Date(txn.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className={`text-xs font-bold ${
                        txn.type === "credit" ? "text-emerald-400" : "text-slate-350"
                      }`}>
                        {txn.type === "credit" ? "+" : "-"}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  );
                })}
                
                {transactions.length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No recent transaction logs.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
