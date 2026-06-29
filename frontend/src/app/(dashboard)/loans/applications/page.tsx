"use client";

import { useState, useEffect } from "react";
import { Landmark, Search, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoanApplicationsPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLoans = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/loans");
      const data = await res.json();
      if (data.success) {
        // Show Pending and Rejected loans here
        const apps = data.data.filter((l: any) => l.status === 'Pending' || l.status === 'Rejected');
        setLoans(apps);
        setFiltered(apps);
      }
    } catch (err) {
      console.error("Failed to fetch loans", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    if (!q) {
      setFiltered(loans);
      return;
    }
    setFiltered(loans.filter(l => 
      l.applicationId.toLowerCase().includes(q) ||
      l.customerId.toLowerCase().includes(q)
    ));
  }, [search, loans]);

  const updateStatus = async (id: string, newStatus: string) => {
    if (!window.confirm(`Are you sure you want to mark this application as ${newStatus}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/loans/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLoans();
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const deleteLoan = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this loan application? This action is permanent!")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/loans/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        alert("Loan application deleted successfully");
        fetchLoans();
      } else {
        alert(data.message || "Failed to delete loan application");
      }
    } catch (err) {
      console.error("Error deleting loan application", err);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] flex items-center gap-3">
            <Landmark className="w-8 h-8 text-amber-400" /> Loan Applications
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Review, approve, reject, or delete pending customer loan applications.</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Search by Application ID or Customer ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-900/60 border-slate-700 text-amber-400 placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] focus:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] transition-all duration-300"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-500 animate-pulse">Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-slate-800 rounded-2xl bg-slate-950/40">
            <Landmark className="w-12 h-12 mx-auto text-slate-700 mb-4" />
            <p className="text-slate-400 font-medium">No pending applications found.</p>
          </div>
        ) : (
          filtered.map((loan) => (
            <div key={loan._id} className="border border-slate-800/80 rounded-2xl bg-slate-900/60 backdrop-blur-md overflow-hidden relative group hover:border-slate-700/80 transition-all flex flex-col">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${loan.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
              
              <div className="p-6 flex-1 relative z-10 pl-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-bold text-slate-200 text-lg">{loan.loanType}</div>
                    <div className="font-mono text-xs text-amber-400 tracking-wider mt-1">{loan.applicationId}</div>
                  </div>
                  <div className={`px-2.5 py-1 text-xs rounded-full border font-bold uppercase tracking-wider ${
                    loan.status === 'Pending' ? 'bg-amber-950/40 border-amber-500/30 text-amber-400' : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                  }`}>
                    {loan.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Customer ID</div>
                    <div className="font-mono text-slate-300">{loan.customerId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Monthly Income</div>
                    <div className="font-medium text-emerald-400">₹{loan.monthlyIncome.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Requested Amount</div>
                    <div className="font-bold text-slate-200 text-lg">₹{loan.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Tenure / Rate</div>
                    <div className="font-medium text-slate-300">{loan.tenureMonths} Months @ {loan.interestRate}%</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Purpose</div>
                  <div className="text-sm text-slate-400">{loan.purpose}</div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end gap-3 pl-8">
                <Button 
                  variant="outline"
                  className="border-rose-700/50 text-rose-400 hover:bg-rose-700/20"
                  onClick={() => deleteLoan(loan._id)}
                >
                  Delete Record
                </Button>
                {loan.status === 'Pending' && (
                  <>
                    <Button 
                      variant="outline"
                      className="border-rose-600/50 text-rose-400 hover:bg-rose-600/20"
                      onClick={() => updateStatus(loan._id, 'Rejected')}
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    <Button 
                      className="bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      onClick={() => updateStatus(loan._id, 'Active')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Approve & Activate
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
