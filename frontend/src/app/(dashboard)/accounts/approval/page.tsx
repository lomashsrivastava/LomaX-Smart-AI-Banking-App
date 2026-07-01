"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, Clock, RefreshCw, User, CreditCard, Building2, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PendingApplication {
  _id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  pan: string;
  aadhaar: string;
  accountType: string;
  accountNumber: string;
  initialDeposit: number;
  branchName: string;
  branchCode: string;
  ifscCode: string;
  services: Record<string, boolean>;
  status: string;
  createdAt: string;
}

const getApiBase = () => {
  let base = process.env.NEXT_PUBLIC_API_URL;
  if (!base && typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      base = "https://lomax-backend.onrender.com";
    }
  }
  if (!base) {
    base = "http://localhost:5000";
  }
  
  // Normalize: remove trailing slash and /api suffix
  if (base.endsWith("/")) {
    base = base.slice(0, -1);
  }
  if (base.endsWith("/api")) {
    base = base.slice(0, -4);
  }
  return base;
};

const API_BASE = getApiBase();

export default function AccountApprovalPage() {
  const [applications, setApplications] = useState<PendingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/customer-accounts/${filter === "pending" ? "pending" : filter === "approved" ? "approved" : "all"}`);
      const data = await res.json();
      if (data.success) {
        const result = filter === "rejected"
          ? data.data.filter((a: any) => a.status === "rejected")
          : data.data;
        setApplications(result);
      }
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleApprove = async (id: string) => {
    setProcessing(id);
    try {
      const res = await fetch(`${API_BASE}/api/customer-accounts/${id}/approve`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast("✅ Account approved and activated successfully!", "success");
        fetchApplications();
      } else {
        showToast(data.message || "Approval failed", "error");
      }
    } catch {
      showToast("Server error during approval", "error");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason (optional):");
    setProcessing(id);
    try {
      const res = await fetch(`${API_BASE}/api/customer-accounts/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason || "Rejected by administrator" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Application rejected.", "error");
        fetchApplications();
      }
    } catch {
      showToast("Server error during rejection", "error");
    } finally {
      setProcessing(null);
    }
  };

  const serviceLabels: Record<string, string> = {
    debitCard: "Debit Card", internetBanking: "Internet Banking",
    mobileBanking: "Mobile Banking", smsAlerts: "SMS Alerts",
    chequeBook: "Cheque Book", upi: "UPI",
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl border font-semibold text-sm animate-in slide-in-from-top-2 duration-300
          ${toast.type === "success" ? "bg-emerald-950 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)]" : "bg-red-950 border-red-500/50 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
            Account Approval Queue
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Review and approve customer registration applications.</p>
        </div>
        <Button onClick={fetchApplications} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["pending", "approved", "rejected"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border capitalize ${filter === f
              ? f === "pending" ? "bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                : f === "approved" ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.2)]"
                : "bg-red-500/20 border-red-500/60 text-red-300"
              : "border-slate-700 text-slate-400 hover:bg-slate-800"}`}>
            {f === "pending" ? <><Clock className="inline w-3.5 h-3.5 mr-1.5" />Pending</> : f === "approved" ? <><CheckCircle2 className="inline w-3.5 h-3.5 mr-1.5" />Approved</> : <><XCircle className="inline w-3.5 h-3.5 mr-1.5" />Rejected</>}
          </button>
        ))}
        <span className="ml-auto text-slate-500 text-sm self-center">{applications.length} record{applications.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 animate-pulse">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 border border-slate-800 rounded-2xl bg-slate-950/40">
          <Clock className="w-12 h-12 mx-auto text-slate-700 mb-4" />
          <p className="text-slate-400 font-medium">No {filter} applications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="border border-slate-800/80 rounded-2xl bg-slate-950/60 backdrop-blur-md overflow-hidden hover:border-slate-700 transition-all">
              {/* Row Header */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-5">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                  {app.firstName?.[0]}{app.lastName?.[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-bold text-white text-lg">{app.firstName} {app.lastName}</h3>
                    <span className="font-mono text-emerald-400 text-sm">{app.customerId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                      app.status === "pending" ? "bg-amber-950/50 border-amber-500/40 text-amber-300"
                      : app.status === "approved" ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-300"
                      : "bg-red-950/50 border-red-500/40 text-red-300"}`}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-slate-400">
                    <span><Mail className="inline w-3.5 h-3.5 mr-1" />{app.email}</span>
                    <span><Phone className="inline w-3.5 h-3.5 mr-1" />{app.mobile}</span>
                    <span><CreditCard className="inline w-3.5 h-3.5 mr-1" />{app.accountType}</span>
                    <span><Building2 className="inline w-3.5 h-3.5 mr-1" />{app.branchName}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => setExpandedId(expandedId === app._id ? null : app._id)} className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs">
                    {expandedId === app._id ? "Hide Details" : "View Details"}
                  </Button>
                  {app.status === "pending" && (
                    <>
                      <Button size="sm" disabled={processing === app._id} onClick={() => handleApprove(app._id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-[0_0_10px_rgba(52,211,153,0.3)] text-xs gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />{processing === app._id ? "..." : "Approve"}
                      </Button>
                      <Button size="sm" disabled={processing === app._id} onClick={() => handleReject(app._id)}
                        className="bg-red-600/80 hover:bg-red-600 text-white border-none text-xs gap-1">
                        <XCircle className="w-3.5 h-3.5" />Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === app._id && (
                <div className="border-t border-slate-800/60 p-5 bg-slate-900/40 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><span className="text-slate-500 block text-xs">PAN</span><span className="text-slate-200 font-mono">{app.pan || "—"}</span></div>
                    <div><span className="text-slate-500 block text-xs">Aadhaar</span><span className="text-slate-200 font-mono">{app.aadhaar || "—"}</span></div>
                    <div><span className="text-slate-500 block text-xs">Account No.</span><span className="text-slate-200 font-mono">{app.accountNumber}</span></div>
                    <div><span className="text-slate-500 block text-xs">Initial Deposit</span><span className="text-emerald-400 font-bold">₹{app.initialDeposit?.toLocaleString()}</span></div>
                    <div><span className="text-slate-500 block text-xs">IFSC Code</span><span className="text-slate-200 font-mono">{app.ifscCode}</span></div>
                    <div><span className="text-slate-500 block text-xs">Branch Code</span><span className="text-slate-200 font-mono">{app.branchCode}</span></div>
                    <div><span className="text-slate-500 block text-xs">Submitted On</span><span className="text-slate-200">{new Date(app.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span></div>
                  </div>
                  {app.services && (
                    <div className="mt-4">
                      <span className="text-xs text-slate-500 block mb-2">Opted Services</span>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(app.services).filter(([, v]) => v).map(([k]) => (
                          <span key={k} className="px-3 py-1 text-xs rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-medium">{serviceLabels[k] || k}</span>
                        ))}
                        {Object.values(app.services).every(v => !v) && <span className="text-slate-500 text-xs">No services opted</span>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
