"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, User, ShieldCheck, Mail, Phone, ExternalLink, Trash2 } from "lucide-react";

interface Customer {
  _id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  pan: string;
  aadhaar: string;
  status: string;
  createdAt: string;
}

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/customers");
        const data = await response.json();
        if (data.success) {
          setCustomers(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`CRITICAL WARNING: Are you sure you want to permanently delete customer ${name}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/auth/customers/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      
      if (data.success) {
        setCustomers(customers.filter(c => c._id !== id));
      } else {
        alert(data.message || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting.");
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 relative z-10">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Customer Directory
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all registered customers on the platform.
          </p>
        </div>
      </div>

      <Card className="bg-slate-950/80 backdrop-blur-xl border border-emerald-500/30 shadow-xl overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-emerald-500/30 flex flex-col sm:flex-row gap-4 justify-between items-center bg-emerald-950/20">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search by ID, Name, or Email..." 
              className="pl-9 bg-slate-900/60 border-slate-700 text-cyan-400 placeholder:text-slate-600 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] focus:drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Total Customers: {customers.length}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-cyan-500" />
              <p>Loading customer data...</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-emerald-300 bg-emerald-950/40 uppercase tracking-wider shadow-[0_4px_15px_rgba(16,185,129,0.1)]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer ID</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Contact Info</th>
                  <th className="px-6 py-4 font-semibold">KYC Docs</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/20">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((cust) => (
                    <tr key={cust._id} className="hover:bg-emerald-900/30 hover:shadow-[inset_0_0_15px_rgba(52,211,153,0.1)] transition-all duration-300 group">
                      <td className="px-6 py-4 font-mono text-emerald-400/80 group-hover:text-emerald-300 transition-colors">
                        {cust.customerId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.4)] flex items-center justify-center mr-3 shrink-0 font-bold group-hover:scale-110 transition-transform">
                            {cust.firstName.charAt(0)}
                          </div>
                          <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            {cust.firstName} {cust.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-slate-300 group-hover:text-cyan-200 flex items-center text-xs transition-colors">
                            <Mail className="w-3 h-3 mr-1" /> {cust.email}
                          </span>
                          <span className="text-slate-300 group-hover:text-cyan-200 flex items-center text-xs transition-colors">
                            <Phone className="w-3 h-3 mr-1" /> {cust.mobile}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col space-y-1 font-mono text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                          <span>PAN: {cust.pan === 'XXXXXXXXXX' ? 'Not Provided' : cust.pan}</span>
                          <span>UID: {cust.aadhaar === 'XXXXXXXXXXXX' ? 'Not Provided' : cust.aadhaar}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          cust.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                        } capitalize`}>
                          {cust.status === 'active' && <ShieldCheck className="w-3 h-3 mr-1" />}
                          {cust.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/customers/${cust._id}`}>
                            <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20">
                              View <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(cust._id, cust.firstName)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-emerald-500/50 font-medium">
                      No customers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </Card>
    </div>
  );
}
