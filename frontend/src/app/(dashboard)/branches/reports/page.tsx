"use client";

import { Building2, Download, BarChart3, Users, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BranchReportsPage() {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)] flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-400" /> Branch Performance
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Compare and analyze branch-level KPIs and metrics.</p>
        </div>
        <Button variant="outline" className="border-indigo-700 text-indigo-400 hover:bg-indigo-950/50 gap-2">
          <Download className="w-4 h-4" /> Download Consolidated
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium mb-1">Top Branch (Revenue)</p>
            <h3 className="text-lg font-bold text-slate-200">Mumbai Central</h3>
          </div>
        </div>
        
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/20 text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium mb-1">Top Branch (Acquisition)</p>
            <h3 className="text-lg font-bold text-slate-200">Delhi Connaught</h3>
          </div>
        </div>
      </div>

      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md p-20 flex flex-col items-center justify-center text-center">
        <BarChart3 className="w-16 h-16 text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-slate-300">Branch Analytics Engine Starting</h3>
        <p className="text-slate-500 mt-2 max-w-md">The regional performance dashboards are currently syncing data. Check back later for detailed branch-vs-branch comparisons.</p>
      </div>
    </div>
  );
}
