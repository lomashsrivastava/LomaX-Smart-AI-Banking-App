"use client";

import { Shield, Fingerprint, Lock, ShieldCheck, MapPin, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginHistoryPage() {
  const mockLogins = [
    { id: 1, user: "EMP-001 (System Admin)", ip: "192.168.1.104", device: "Chrome / Windows 11", location: "Mumbai, IN", time: "Just now", status: "Success" },
    { id: 2, user: "EMP-045 (Branch Manager)", ip: "10.0.0.52", device: "Safari / macOS", location: "Delhi, IN", time: "2 hours ago", status: "Success" },
    { id: 3, user: "EMP-012 (Teller)", ip: "45.12.89.2", device: "Firefox / Linux", location: "Unknown", time: "5 hours ago", status: "Failed (Bad Password)" },
    { id: 4, user: "CUST-98213 (Customer)", ip: "103.44.22.1", device: "LomaX App / iOS", location: "Bangalore, IN", time: "1 day ago", status: "Success" },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] flex items-center gap-3">
            <Shield className="w-8 h-8 text-emerald-400" /> Authentication History
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Monitor all employee and customer login attempts across the network.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Total Logins (24h)</p>
              <h3 className="text-3xl font-bold text-slate-200">1,248</h3>
            </div>
            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Failed Attempts</p>
              <h3 className="text-3xl font-bold text-slate-200">24</h3>
            </div>
            <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-500/20 text-rose-400">
              <Lock className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Active Sessions</p>
              <h3 className="text-3xl font-bold text-slate-200">412</h3>
            </div>
            <div className="p-3 bg-violet-950/40 rounded-xl border border-violet-500/20 text-violet-400">
              <Fingerprint className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 font-medium text-slate-200">
          Recent Login Activity
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/20 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">IP Address & Device</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockLogins.map((login) => (
                <tr key={login.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-300">{login.user}</td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-emerald-400">{login.ip}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Monitor className="w-3 h-3" /> {login.device}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {login.location}</td>
                  <td className="px-6 py-4 text-slate-400">{login.time}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-xs rounded-full border font-medium ${
                      login.status === 'Success' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                    }`}>
                      {login.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
