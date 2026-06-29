"use client";

import { Sliders, Save, Palette, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SystemPreferencesPage() {
  return (
    <div className="space-y-6 max-w-4xl pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500 drop-shadow-[0_0_10px_rgba(148,163,184,0.3)] flex items-center gap-3">
          <Sliders className="w-8 h-8 text-slate-400" /> System Preferences
        </h1>
        <p className="text-slate-400 mt-2">Personalize your admin dashboard experience.</p>
      </div>

      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden p-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-8 relative z-10">
          {/* Appearance */}
          <div>
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
              <Palette className="w-5 h-5 text-slate-400" /> UI Appearance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                <div>
                  <p className="font-medium text-slate-200">Dark Mode Enforced</p>
                  <p className="text-xs text-slate-500 mt-1">LomaX Banking strictly uses the futuristic Dark Glassmorphism theme.</p>
                </div>
                <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400 cursor-default">Locked On</Button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
              <Bell className="w-5 h-5 text-slate-400" /> Admin Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                <div>
                  <p className="font-medium text-slate-200">Email Alerts on Critical Audit Events</p>
                  <p className="text-xs text-slate-500 mt-1">Receive emails when High/Critical AML or Security logs occur.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
              <Shield className="w-5 h-5 text-slate-400" /> Session Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                <div>
                  <p className="font-medium text-slate-200">Auto-Logout Timer</p>
                  <p className="text-xs text-slate-500 mt-1">Log out automatically after inactivity.</p>
                </div>
                <select className="flex h-10 w-32 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus-visible:outline-none">
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button className="bg-slate-700 hover:bg-slate-600 text-white gap-2">
              <Save className="w-4 h-4" /> Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
