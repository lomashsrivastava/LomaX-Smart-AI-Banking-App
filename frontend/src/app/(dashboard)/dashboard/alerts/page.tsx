"use client";

import { BellRing, ShieldAlert, Zap, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SystemAlertsPage() {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)] flex items-center gap-3">
            <BellRing className="w-8 h-8 text-rose-400" /> System Alerts
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Real-time infrastructure and banking core alerts.</p>
        </div>
        <Button variant="outline" className="border-rose-700 text-rose-400 hover:bg-rose-950/50">
          Acknowledge All
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="border border-rose-500/30 bg-rose-950/20 rounded-2xl p-5 flex gap-4 items-start">
          <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400 shrink-0">
            <ServerCrash className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-rose-200 font-bold text-lg">High Latency in Payment Gateway</h3>
            <p className="text-rose-300/70 text-sm mt-1">The main IMPS payment gateway is experiencing latency spikes &gt;2000ms. Transactions may be delayed.</p>
            <p className="text-xs text-rose-400/50 mt-2 font-mono">Reported 2 mins ago • Infrastructure Team Notified</p>
          </div>
        </div>

        <div className="border border-amber-500/30 bg-amber-950/20 rounded-2xl p-5 flex gap-4 items-start">
          <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-amber-200 font-bold text-lg">Unusual Login Spike (Branch B-042)</h3>
            <p className="text-amber-300/70 text-sm mt-1">Detected a 400% increase in failed login attempts originating from the Mumbai North branch subnet.</p>
            <p className="text-xs text-amber-400/50 mt-2 font-mono">Reported 15 mins ago • Security Team Investigating</p>
          </div>
        </div>

        <div className="border border-blue-500/30 bg-blue-950/20 rounded-2xl p-5 flex gap-4 items-start">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-blue-200 font-bold text-lg">Scheduled Maintenance Reminder</h3>
            <p className="text-blue-300/70 text-sm mt-1">Core banking database will undergo scheduled index optimization at 02:00 AM IST.</p>
            <p className="text-xs text-blue-400/50 mt-2 font-mono">Reported 1 hour ago • Auto-Generated</p>
          </div>
        </div>
      </div>
    </div>
  );
}
