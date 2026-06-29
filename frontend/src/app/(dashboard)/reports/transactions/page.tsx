"use client";

import { Activity, Download, PieChart, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TransactionReportsPage() {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-400" /> Transaction Analytics
          </h1>
          <p className="text-slate-400 mt-1 text-sm">System-wide transaction volumes, trends, and reports.</p>
        </div>
        <Button variant="outline" className="border-emerald-700 text-emerald-400 hover:bg-emerald-950/50 gap-2">
          <Download className="w-4 h-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6">
          <p className="text-slate-400 text-sm font-medium mb-1">Total Volume (30d)</p>
          <h3 className="text-3xl font-bold text-slate-200">₹45.2M</h3>
          <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12.5% vs last month</p>
        </div>
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6">
          <p className="text-slate-400 text-sm font-medium mb-1">Total Transactions</p>
          <h3 className="text-3xl font-bold text-slate-200">12,408</h3>
          <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +4.2% vs last month</p>
        </div>
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6">
          <p className="text-slate-400 text-sm font-medium mb-1">Failed Transactions</p>
          <h3 className="text-3xl font-bold text-slate-200">24</h3>
          <p className="text-rose-400 text-xs mt-2 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> -1.5% vs last month</p>
        </div>
      </div>

      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md p-20 flex flex-col items-center justify-center text-center">
        <PieChart className="w-16 h-16 text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-slate-300">Detailed Analytics Coming Soon</h3>
        <p className="text-slate-500 mt-2 max-w-md">The advanced analytics engine is currently aggregating historical data. Charts and visual reports will be available shortly.</p>
      </div>
    </div>
  );
}
