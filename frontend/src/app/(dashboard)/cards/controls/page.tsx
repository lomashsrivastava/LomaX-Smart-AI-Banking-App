"use client";

import { useState } from "react";
import { Settings, ShieldAlert, Wifi, CreditCard, Lock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CardControlsPage() {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] flex items-center gap-3">
          <Settings className="w-8 h-8 text-cyan-400" /> Global Card Controls
        </h1>
        <p className="text-slate-400 mt-2">Manage system-wide card security policies and default limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Policies */}
        <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden p-6 relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2 relative z-10">
            <ShieldAlert className="w-5 h-5 text-rose-400" /> Fraud Prevention Policies
          </h2>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
              <div>
                <p className="font-medium text-slate-200">Auto-Block on Suspicious Activity</p>
                <p className="text-xs text-slate-500 mt-1">Blocks card after 3 failed PIN attempts or unusual location.</p>
              </div>
              <Button size="sm" variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">Enabled</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
              <div>
                <p className="font-medium text-slate-200">International Transactions (Default)</p>
                <p className="text-xs text-slate-500 mt-1">Allow international payments for newly issued cards.</p>
              </div>
              <Button size="sm" variant="outline" className="border-rose-500/50 text-rose-400 hover:bg-rose-500/10">Disabled</Button>
            </div>
          </div>
        </div>

        {/* Default Limits */}
        <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden p-6 relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2 relative z-10">
            <CreditCard className="w-5 h-5 text-cyan-400" /> Default Usage Limits
          </h2>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-200">Online Transactions Limit</p>
                  <p className="text-xs text-slate-500 mt-1">Maximum amount per day.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-cyan-400">₹50,000</p>
                <button className="text-xs text-slate-500 hover:text-cyan-400 underline">Edit</button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-200">Contactless (Tap & Pay) Limit</p>
                  <p className="text-xs text-slate-500 mt-1">Maximum amount per transaction without PIN.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-cyan-400">₹5,000</p>
                <button className="text-xs text-slate-500 hover:text-cyan-400 underline">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
