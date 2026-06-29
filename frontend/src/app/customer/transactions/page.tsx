"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const TRANSACTIONS = [
  { id: "TXN982341", date: "2026-06-03", description: "Amazon Web Services", type: "debit", amount: 4500.00, status: "completed" },
  { id: "TXN982342", date: "2026-06-02", description: "Salary Credit - Acme Corp", type: "credit", amount: 125000.00, status: "completed" },
  { id: "TXN982343", date: "2026-06-01", description: "Starbucks Coffee", type: "debit", amount: 350.50, status: "completed" },
  { id: "TXN982344", date: "2026-05-28", description: "NEFT Transfer - Rahul", type: "debit", amount: 15000.00, status: "completed" },
  { id: "TXN982345", date: "2026-05-25", description: "Refund - Flipkart", type: "credit", amount: 1299.00, status: "completed" },
  { id: "TXN982346", date: "2026-05-22", description: "Electricity Bill", type: "debit", amount: 2450.00, status: "completed" },
  { id: "TXN982347", date: "2026-05-20", description: "Interest Credit", type: "credit", amount: 452.10, status: "completed" },
];

export default function CustomerTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = TRANSACTIONS.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Transaction History
          </h1>
          <p className="text-muted-foreground mt-1">
            View and download your recent account activity.
          </p>
        </div>
        <Button variant="outline" className="border-slate-300 dark:border-slate-700">
          <Download className="w-4 h-4 mr-2" />
          Download Statement
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by ID or description..." 
              className="pl-9 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus-visible:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">
                      {txn.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-300">
                      {new Date(txn.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${txn.type === 'credit' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500'}`}>
                          {txn.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{txn.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-semibold ${txn.type === 'credit' ? 'text-green-600 dark:text-green-500' : 'text-slate-900 dark:text-white'}`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 capitalize">
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No transactions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
          <span>Showing 1 to {filteredTransactions.length} of {filteredTransactions.length} entries</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>

      </div>
    </div>
  );
}
