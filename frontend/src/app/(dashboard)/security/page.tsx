"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck, AlertTriangle, Lock, Fingerprint, Monitor,
  MapPin, Clock, Eye, Ban, RefreshCw, CheckCircle2, XCircle,
  KeyRound, Zap, Activity, Server, Globe
} from "lucide-react";

interface AuditLog {
  _id: string;
  action: string;
  performedBy: string;
  resourceType: string;
  ipAddress: string;
  details: string;
  severity: "Info" | "Warning" | "Critical";
  createdAt: string;
}

const staticThreats = [
  { id: 1, type: "Failed Login", ip: "45.12.89.2", user: "EMP-012", location: "Unknown", time: "5 hrs ago", level: "Warning" },
  { id: 2, type: "New Device Login", ip: "103.44.22.1", user: "CUST-98213", location: "Bangalore, IN", time: "1 day ago", level: "Info" },
  { id: 3, type: "Password Changed", ip: "192.168.1.104", user: "EMP-001", location: "Mumbai, IN", time: "2 days ago", level: "Info" },
  { id: 4, type: "Suspicious Transfer", ip: "182.68.4.55", user: "CUST-10042", location: "Hyderabad, IN", time: "3 days ago", level: "Critical" },
];

const severityStyle = {
  Info: "bg-cyan-950/40 border-cyan-500/30 text-cyan-400",
  Warning: "bg-amber-950/40 border-amber-500/30 text-amber-400",
  Critical: "bg-rose-950/40 border-rose-500/30 text-rose-400",
};

const threatStyle: Record<string, string> = {
  Info: "bg-cyan-950/40 border-cyan-500/30 text-cyan-400",
  Warning: "bg-amber-950/40 border-amber-500/30 text-amber-400",
  Critical: "bg-rose-950/40 border-rose-500/30 text-rose-400",
};

export default function SecurityCenterPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"threats" | "audit">("threats");

  useEffect(() => {
    fetch("http://localhost:5000/api/audit")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setLogs(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const criticalCount = logs.filter((l) => l.severity === "Critical").length;
  const warningCount = logs.filter((l) => l.severity === "Warning").length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" /> Security Center
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Real-time threat monitoring, audit logs, and access control across the LomaX network.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setLoading(true); fetch("http://localhost:5000/api/audit").then(r => r.json()).then(d => { if (d.success) setLogs(d.data); }).finally(() => setLoading(false)); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm hover:border-slate-600 hover:text-slate-300 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <Link
            href="/security/logins"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600/80 to-cyan-600/80 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
          >
            <Eye className="w-4 h-4" /> Login History
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "System Status", value: "SECURE", icon: ShieldCheck, color: "emerald", sub: "All systems nominal" },
          { label: "Critical Alerts", value: criticalCount || staticThreats.filter(t => t.level === "Critical").length, icon: AlertTriangle, color: "rose", sub: "Last 30 days" },
          { label: "Active Sessions", value: "412", icon: Activity, color: "cyan", sub: "Across all nodes" },
          { label: "Blocked IPs", value: "18", icon: Ban, color: "violet", sub: "Auto-blocked by AI" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const colors: Record<string, string> = {
            emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
            rose: "bg-rose-500/10 border-rose-500/20 text-rose-400",
            cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
            violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
          };
          const glows: Record<string, string> = {
            emerald: "bg-emerald-500/10",
            rose: "bg-rose-500/10",
            cyan: "bg-cyan-500/10",
            violet: "bg-violet-500/10",
          };
          return (
            <div key={i} className="border border-slate-800 bg-slate-900/50 rounded-2xl p-5 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 ${glows[stat.color]} rounded-full blur-2xl`} />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-slate-400 text-xs font-medium mb-1">{stat.label}</p>
                  <h3 className={`text-2xl font-bold ${stat.color === "emerald" ? "text-emerald-400" : stat.color === "rose" ? "text-rose-400" : stat.color === "cyan" ? "text-cyan-400" : "text-violet-400"}`}>
                    {stat.value}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">{stat.sub}</p>
                </div>
                <div className={`p-2.5 rounded-xl border ${colors[stat.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Health Bar */}
      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-200 flex items-center gap-2 text-sm"><Server className="w-4 h-4 text-emerald-400" /> System Health Overview</h2>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> All Operational</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Core Banking", status: "Operational", pct: 100, color: "emerald" },
            { label: "Auth Gateway", status: "Operational", pct: 100, color: "emerald" },
            { label: "Fraud AI Engine", status: "Operational", pct: 97, color: "emerald" },
            { label: "Encryption Layer", status: "Operational", pct: 100, color: "emerald" },
          ].map((s, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">{s.label}</span>
                <span className="text-emerald-400 font-mono">{s.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]" style={{ width: `${s.pct}%` }} />
              </div>
              <p className="text-xs text-slate-500">{s.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs: Threats + Audit */}
      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl overflow-hidden">
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab("threats")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${activeTab === "threats" ? "bg-slate-800/50 text-slate-200 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-400"}`}
          >
            <AlertTriangle className="w-4 h-4" /> Threat Activity
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${activeTab === "audit" ? "bg-slate-800/50 text-slate-200 border-b-2 border-cyan-500" : "text-slate-500 hover:text-slate-400"}`}
          >
            <Activity className="w-4 h-4" /> Live Audit Log
          </button>
        </div>

        {activeTab === "threats" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-950/30 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3">User / ID</th>
                  <th className="px-5 py-3">IP Address</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3 text-center">Level</th>
                </tr>
              </thead>
              <tbody>
                {staticThreats.map((t) => (
                  <tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-300">{t.type}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-400 text-xs">{t.user}</td>
                    <td className="px-5 py-3.5 font-mono text-emerald-400 text-xs">{t.ip}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-600" />{t.location}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs flex items-center gap-1.5"><Clock className="w-3 h-3" />{t.time}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${threatStyle[t.level]}`}>{t.level}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" /> Loading audit logs...
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Activity className="w-10 h-10 text-slate-600" />
                <p className="text-slate-500 text-sm">No audit logs recorded yet.</p>
                <p className="text-slate-600 text-xs">Logs are created when admin actions are performed.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-950/30 border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3">Action</th>
                    <th className="px-5 py-3">Performed By</th>
                    <th className="px-5 py-3">Resource</th>
                    <th className="px-5 py-3">IP Address</th>
                    <th className="px-5 py-3">Details</th>
                    <th className="px-5 py-3 text-center">Severity</th>
                    <th className="px-5 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 20).map((log) => (
                    <tr key={log._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-300">{log.action}</td>
                      <td className="px-5 py-3.5 font-mono text-emerald-400 text-xs">{log.performedBy}</td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">{log.resourceType}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-400 text-xs">{log.ipAddress}</td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs max-w-[200px] truncate">{log.details}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${severityStyle[log.severity]}`}>{log.severity}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">{new Date(log.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/security/logins", icon: Fingerprint, label: "Login History", sub: "All authentication attempts", color: "emerald" },
          { href: "/security/devices", icon: Monitor, label: "Device Management", sub: "Manage authorized devices", color: "cyan" },
          { href: "/audit", icon: Activity, label: "Full Audit Logs", sub: "Complete system activity", color: "violet" },
        ].map((item, i) => {
          const Icon = item.icon;
          const cls: Record<string, string> = {
            emerald: "border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500/40",
            cyan: "border-cyan-500/20 bg-cyan-950/10 hover:border-cyan-500/40",
            violet: "border-violet-500/20 bg-violet-950/10 hover:border-violet-500/40",
          };
          const ic: Record<string, string> = {
            emerald: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
            cyan: "text-cyan-400 bg-cyan-950/40 border-cyan-500/30",
            violet: "text-violet-400 bg-violet-950/40 border-violet-500/30",
          };
          return (
            <Link key={i} href={item.href} className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 ${cls[item.color]}`}>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${ic[item.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-200 text-sm group-hover:text-white transition-colors">{item.label}</p>
                <p className="text-slate-500 text-xs">{item.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
