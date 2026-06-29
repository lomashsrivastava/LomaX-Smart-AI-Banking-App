"use client";

import { useState, useEffect } from "react";
import apiClient from "@/services/api-client";
import { 
  ShieldAlert, 
  Users, 
  Activity, 
  Search, 
  Loader2, 
  AlertOctagon,
  Sparkles,
  TrendingUp,
  FileWarning
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ThreatUser {
  customerId: string;
  name: string;
  riskScore: number;
  failedLogins: number;
  status: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface FraudStats {
  averageRisk: number;
  criticalThreatsCount: number;
  highThreatsCount: number;
  largeTransactionsCount: number;
  riskBreakdown: ThreatUser[];
}

export default function FraudDashboardPage() {
  const [stats, setStats] = useState<FraudStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadFraudStats = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/analytics/admin/fraud');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error: any) {
      console.error("Failed to load fraud stats:", error);
      toast.error(error.response?.data?.message || "Failed to load admin threat dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFraudStats();
  }, []);

  const filteredUsers = stats?.riskBreakdown.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.customerId.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-100">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-2" />
        <p className="text-slate-400 text-sm font-futuristic">Aggregating telemetry logs and risk vectors...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 text-slate-100">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 to-amber-500 bg-clip-text text-transparent flex items-center space-x-2">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
          <span>Fraud & Threat Intelligence</span>
        </h1>
        <p className="text-slate-400 mt-1">
          Administrative dashboard for monitoring platform-wide security risks, account anomalies, and large transfers.
        </p>
      </div>

      {stats && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Heatmap Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Avg Risk */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 bg-amber-500/5 rounded-full blur-2xl" />
              <div className="text-xs font-semibold text-slate-450 uppercase mb-2 flex justify-between items-center">
                <span>Avg Platform Risk</span>
                <Activity className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-amber-500">
                {stats.averageRisk.toFixed(1)}%
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Weighted metric across all registered accounts.</p>
            </div>

            {/* Critical Threats */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 bg-rose-500/5 rounded-full blur-2xl" />
              <div className="text-xs font-semibold text-slate-450 uppercase mb-2 flex justify-between items-center">
                <span>Critical Alerts</span>
                <AlertOctagon className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-3xl font-extrabold text-rose-500">
                {stats.criticalThreatsCount}
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Active customer indexes with &gt;= 75% risk score.</p>
            </div>

            {/* High Threats */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 bg-orange-500/5 rounded-full blur-2xl" />
              <div className="text-xs font-semibold text-slate-450 uppercase mb-2 flex justify-between items-center">
                <span>High Threats</span>
                <FileWarning className="w-4 h-4 text-orange-450" />
              </div>
              <div className="text-3xl font-extrabold text-orange-400">
                {stats.highThreatsCount}
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Accounts showing elevated login or trade errors.</p>
            </div>

            {/* Large Transfers */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 bg-purple-500/5 rounded-full blur-2xl" />
              <div className="text-xs font-semibold text-slate-450 uppercase mb-2 flex justify-between items-center">
                <span>Large Spends</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-purple-400">
                {stats.largeTransactionsCount}
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Transactions &gt;= ₹50,000 processed in last 30 days.</p>
            </div>

          </div>

          {/* User breakdown list */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200">Customer Security Threat Registry</h3>
                <p className="text-xs text-slate-500">Search profiles to audit credentials or inspect suspicious behavior.</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                <Input
                  type="text"
                  placeholder="Search by ID or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-950 border-slate-800 text-slate-100 text-xs h-9 w-full"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-850 rounded-xl bg-slate-950">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-400 font-bold bg-slate-900/50">
                    <th className="p-3">Customer ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Risk Rating</th>
                    <th className="p-3">Failed Logins</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredUsers.map((u) => (
                    <tr key={u.customerId} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-3 font-mono text-cyan-400">{u.customerId}</td>
                      <td className="p-3 font-semibold">{u.name}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded font-bold border ${
                          u.status === 'Critical' ? 'bg-rose-950/30 text-rose-400 border-rose-500/20' :
                          u.status === 'High' ? 'bg-orange-950/30 text-orange-400 border-orange-500/20' :
                          u.status === 'Medium' ? 'bg-amber-950/30 text-amber-400 border-amber-500/20' :
                          'bg-emerald-950/30 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {u.riskScore}% ({u.status})
                        </span>
                      </td>
                      <td className="p-3 font-mono">{u.failedLogins} times</td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => {
                            toast.info(`Generating security audit dispatch for Customer ID: ${u.customerId}`);
                          }}
                          className="text-[11px] font-semibold text-rose-400 hover:text-rose-350 hover:underline"
                        >
                          Trigger Audit Log
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-500">
                        No customer logs match the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
