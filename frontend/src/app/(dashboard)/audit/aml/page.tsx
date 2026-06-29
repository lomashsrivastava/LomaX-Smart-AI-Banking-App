"use client";

import { ShieldAlert, AlertTriangle, CheckCircle, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AMLMonitoringPage() {
  const alerts = [
    { id: "AML-9921", customer: "CUST-84921", type: "Structuring", risk: "High", status: "Investigating", date: "2 hours ago" },
    { id: "AML-9920", customer: "CUST-11234", type: "Large Cash Deposit", risk: "Medium", status: "Pending Review", date: "5 hours ago" },
    { id: "AML-9919", customer: "CUST-55122", type: "Cross-border Transfer", risk: "Low", status: "Cleared", date: "1 day ago" },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)] flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-400" /> AML Monitoring
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Anti-Money Laundering automated alert system and investigations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">High Risk Alerts</p>
              <h3 className="text-3xl font-bold text-slate-200">12</h3>
            </div>
            <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-500/20 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Pending Reviews</p>
              <h3 className="text-3xl font-bold text-slate-200">45</h3>
            </div>
            <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/20 text-amber-400">
              <Search className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Cleared Alerts (30d)</p>
              <h3 className="text-3xl font-bold text-slate-200">328</h3>
            </div>
            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/20 text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center">
          <span className="font-medium text-slate-200">Recent Suspicious Activity Reports (SAR)</span>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">Generate Report</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/20 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Alert ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Flag Type</th>
                <th className="px-6 py-4 font-medium">Risk Level</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-rose-400">{alert.id}</td>
                  <td className="px-6 py-4 font-mono text-slate-300">{alert.customer}</td>
                  <td className="px-6 py-4 text-slate-300">{alert.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded border font-medium ${
                      alert.risk === 'High' ? 'bg-rose-950/40 border-rose-500/30 text-rose-400' :
                      alert.risk === 'Medium' ? 'bg-amber-950/40 border-amber-500/30 text-amber-400' :
                      'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                    }`}>
                      {alert.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{alert.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
