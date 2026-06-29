"use client";

import { LineChart, BarChart2, PieChart, Activity, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsDashboardPage() {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] flex items-center gap-3">
            <LineChart className="w-8 h-8 text-cyan-400" /> Executive Analytics
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Deep insights into banking operations and customer growth.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2">
            <Download className="w-4 h-4" /> Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
          <p className="text-slate-400 text-sm font-medium mb-1 relative z-10">Customer Acquisition Cost</p>
          <h3 className="text-3xl font-bold text-slate-200 relative z-10">₹845</h3>
          <p className="text-emerald-400 text-xs mt-2 font-medium relative z-10">-12% vs last quarter</p>
        </div>
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <p className="text-slate-400 text-sm font-medium mb-1 relative z-10">Loan Approval Rate</p>
          <h3 className="text-3xl font-bold text-slate-200 relative z-10">68%</h3>
          <p className="text-emerald-400 text-xs mt-2 font-medium relative z-10">+4% vs last quarter</p>
        </div>
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
          <p className="text-slate-400 text-sm font-medium mb-1 relative z-10">Active Card Users</p>
          <h3 className="text-3xl font-bold text-slate-200 relative z-10">45.2K</h3>
          <p className="text-emerald-400 text-xs mt-2 font-medium relative z-10">+18% YoY</p>
        </div>
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl"></div>
          <p className="text-slate-400 text-sm font-medium mb-1 relative z-10">Avg Resolution Time</p>
          <h3 className="text-3xl font-bold text-slate-200 relative z-10">2.4h</h3>
          <p className="text-rose-400 text-xs mt-2 font-medium relative z-10">+15m vs target</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
          <BarChart2 className="w-16 h-16 text-slate-700 mb-4" />
          <h3 className="text-lg font-bold text-slate-300">Revenue Growth Model</h3>
          <p className="text-slate-500 mt-2 text-sm max-w-sm">Detailed quarterly revenue charts are currently compiling.</p>
        </div>
        <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
          <PieChart className="w-16 h-16 text-slate-700 mb-4" />
          <h3 className="text-lg font-bold text-slate-300">Customer Demographics</h3>
          <p className="text-slate-500 mt-2 text-sm max-w-sm">Age, location, and income distribution visualization engine starting.</p>
        </div>
      </div>
    </div>
  );
}
