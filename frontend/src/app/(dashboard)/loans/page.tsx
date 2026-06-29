"use client";

import { useState, useEffect } from "react";
import { Landmark, Search, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoansListPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLoans = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/loans");
      const data = await res.json();
      if (data.success) {
        // Only show Active or Closed loans here
        const activeLoans = data.data.filter((l: any) => l.status === 'Active' || l.status === 'Closed');
        setLoans(activeLoans);
        setFiltered(activeLoans);
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
      l.customerId.toLowerCase().includes(q) ||
      l.loanType.toLowerCase().includes(q)
    ));
  }, [search, loans]);

  const deleteLoan = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this loan record? This action is permanent!")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/loans/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        alert("Loan record deleted successfully");
        fetchLoans();
      } else {
        alert(data.message || "Failed to delete loan");
      }
    } catch (err) {
      console.error("Error deleting loan", err);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] flex items-center gap-3">
            <Landmark className="w-8 h-8 text-amber-400" /> Active Loans
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Monitor and manage all active and closed customer loans.</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Search by ID, Customer, or Type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-900/60 border-slate-700 text-amber-400 placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] focus:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] transition-all duration-300"
        />
      </div>

      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/40 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Loan ID</th>
                <th className="px-6 py-4 font-medium">Customer ID</th>
                <th className="px-6 py-4 font-medium">Loan Type</th>
                <th className="px-6 py-4 font-medium text-right">Principal Amount</th>
                <th className="px-6 py-4 font-medium text-center">Interest</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 animate-pulse">Loading loans...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Landmark className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No active loans found.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((loan) => (
                  <tr key={loan._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-amber-400">{loan.applicationId}</td>
                    <td className="px-6 py-4 font-mono text-slate-300">{loan.customerId}</td>
                    <td className="px-6 py-4 text-slate-300 font-medium">{loan.loanType}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-200">
                      ₹{loan.amount.toLocaleString()}
                      <div className="text-xs text-slate-500 font-normal mt-0.5">{loan.tenureMonths} Months</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="flex items-center justify-center gap-1 text-rose-400 font-bold">
                        <TrendingUp className="w-3 h-3" /> {loan.interestRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-xs rounded-full border font-medium ${
                        loan.status === 'Active' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}>
                        {loan.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold"
                        onClick={() => deleteLoan(loan._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
