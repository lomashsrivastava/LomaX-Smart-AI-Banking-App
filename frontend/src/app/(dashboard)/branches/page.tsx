"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search, Loader2, Building2, MapPin, Phone, Mail,
  CheckCircle2, XCircle, Trash2, Edit, ExternalLink,
  ChevronRight, Globe, Navigation, ShieldCheck, Map
} from "lucide-react";

interface Branch {
  _id: string;
  branchId: string;
  branchCode: string;
  branchName: string;
  ifscCode: string;
  micrCode: string;
  city: string;
  district: string;
  state: string;
  country: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  managerName: string;
  status: string;
}

export default function BranchDirectoryPage() {
  const [regions, setRegions] = useState<Record<string, Record<string, string[]>>>({});
  const [branches, setBranches] = useState<Branch[]>([]);
  const [regionsLoading, setRegionsLoading] = useState(true);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Hierarchical selection state
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    fetchRegions();
  }, []);

  // Fetch only the lightweight region options on initial load
  const fetchRegions = async () => {
    setRegionsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/branches/regions");
      const data = await response.json();
      if (data.success) {
        const regs = data.regions || {};
        setRegions(regs);
      }
    } catch (error) {
      console.error("Failed to fetch regions", error);
    } finally {
      setRegionsLoading(false);
    }
  };

  // Fetch specific branches only after Country, State, and District are selected
  useEffect(() => {
    if (!selectedCountry || !selectedState || !selectedDistrict) {
      setBranches([]);
      return;
    }

    const fetchFilteredBranches = async () => {
      setBranchesLoading(true);
      try {
        const queryParams = new URLSearchParams({
          country: selectedCountry,
          state: selectedState,
          district: selectedDistrict
        });
        const response = await fetch(`http://localhost:5000/api/branches?${queryParams}`);
        const data = await response.json();
        if (data.success) {
          setBranches(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch filtered branches", error);
      } finally {
        setBranchesLoading(false);
      }
    };

    fetchFilteredBranches();
  }, [selectedCountry, selectedState, selectedDistrict]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`CRITICAL WARNING: Are you sure you want to permanently delete branch ${name}?`)) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/branches/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      
      if (data.success) {
        setBranches(prev => prev.filter(b => b._id !== id));
      } else {
        alert(data.message || "Failed to delete branch");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting.");
    }
  };

  // Extract option list dynamically based on selection state
  const countries = Object.keys(regions).sort();
  const states = selectedCountry && regions[selectedCountry] ? Object.keys(regions[selectedCountry]).sort() : [];
  const districts = selectedState && selectedCountry && regions[selectedCountry]?.[selectedState] ? regions[selectedCountry][selectedState].sort() : [];

  // Filter branches client-side search
  const filteredBranches = branches.filter(b => 
    b.branchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.ifscCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 relative z-10 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
            Branch Management Portal
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Select Country, State, and District parameters to access the branch database.
          </p>
        </div>
        <Link href="/branches/new">
          <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] border-none px-5 py-2.5 rounded-xl font-semibold text-sm">
            <Building2 className="w-4 h-4 mr-2" /> Add New Branch
          </Button>
        </Link>
      </div>

      {regionsLoading ? (
        <Card className="bg-slate-950/80 backdrop-blur-xl border border-emerald-500/20 shadow-xl overflow-hidden p-12">
          <div className="flex flex-col items-center justify-center text-emerald-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="animate-pulse text-sm">Synchronizing region registry...</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          
          {/* Step Selector Card */}
          <Card className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Map className="w-4 h-4 text-cyan-400" /> Region Selector Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Country Select */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">1. Country</label>
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedState("");
                      setSelectedDistrict("");
                    }}
                    className="w-full bg-slate-900/80 border border-slate-850 hover:border-slate-700 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-950">Select Country</option>
                    {countries.map(c => (
                      <option key={c} value={c} className="bg-slate-950">{c}</option>
                    ))}
                  </select>
                  <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* State Select */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">2. State / Province</label>
                <div className="relative">
                  <select
                    value={selectedState}
                    disabled={!selectedCountry}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedDistrict("");
                    }}
                    className={`w-full bg-slate-900/80 border text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-medium appearance-none cursor-pointer ${
                      selectedCountry ? "border-slate-850 hover:border-slate-700" : "border-slate-900 text-slate-600 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <option value="" className="bg-slate-950">Select State</option>
                    {states.map(s => (
                      <option key={s} value={s} className="bg-slate-950">{s}</option>
                    ))}
                  </select>
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* District Select */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">3. District / County</label>
                <div className="relative">
                  <select
                    value={selectedDistrict}
                    disabled={!selectedState}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className={`w-full bg-slate-900/80 border text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all font-medium appearance-none cursor-pointer ${
                      selectedState ? "border-slate-850 hover:border-slate-700" : "border-slate-900 text-slate-600 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <option value="" className="bg-slate-950">Select District</option>
                    {districts.map(d => (
                      <option key={d} value={d} className="bg-slate-950">{d}</option>
                    ))}
                  </select>
                  <Navigation className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

            </div>
          </Card>

          {/* Table / Results Section */}
          {!selectedCountry || !selectedState || !selectedDistrict ? (
            <Card className="bg-slate-950/40 border border-slate-900 p-12 text-center rounded-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-slate-200 font-bold text-base">Select Regions to Query</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  LomaX Branch Directory will query the regional branch ledger database and load specific records matching your Country, State, and District selection.
                </p>
              </div>
            </Card>
          ) : branchesLoading ? (
            <div className="text-center py-20 text-slate-500 animate-pulse flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-xs">Querying branch database records...</span>
            </div>
          ) : (
            <Card className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 shadow-xl overflow-hidden rounded-2xl animate-in fade-in zoom-in-98 duration-300">
              
              {/* Search bar & summary */}
              <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/30">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input 
                    placeholder="Search query by name, code or city..." 
                    className="pl-9 bg-slate-900/60 border-slate-750 text-cyan-400 placeholder:text-slate-600 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] focus:drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="text-xs text-cyan-400 font-bold tracking-widest font-mono shrink-0 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1.5 rounded-lg">
                  RESULTS FOUND: {filteredBranches.length}
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 bg-slate-900/50 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-bold">Branch Info</th>
                      <th className="px-6 py-4 font-bold">Routing Details</th>
                      <th className="px-6 py-4 font-bold">Location</th>
                      <th className="px-6 py-4 font-bold">Contact</th>
                      <th className="px-6 py-4 font-bold text-center">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredBranches.length > 0 ? (
                      filteredBranches.map((branch) => (
                        <tr key={branch._id} className="hover:bg-slate-900/30 transition-all duration-300 group">
                          {/* Branch Code/Name */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-950 to-emerald-950 border border-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)] flex items-center justify-center mr-3 shrink-0 group-hover:scale-105 transition-transform">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-white text-sm">
                                  {branch.branchName}
                                </span>
                                <span className="text-slate-500 font-mono text-xs mt-0.5">{branch.branchCode}</span>
                              </div>
                            </div>
                          </td>

                          {/* IFSC / MICR */}
                          <td className="px-6 py-4">
                             <div className="flex flex-col space-y-1 font-mono text-xs text-slate-400">
                              <span>IFSC: <strong className="text-cyan-300 font-bold">{branch.ifscCode}</strong></span>
                              <span>MICR: <strong className="text-slate-300 font-medium">{branch.micrCode}</strong></span>
                             </div>
                          </td>

                          {/* Location */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-1">
                              <span className="text-slate-300 flex items-center text-xs">
                                <MapPin className="w-3.5 h-3.5 mr-1.5 text-cyan-500 shrink-0" /> {branch.city}, {branch.state}
                              </span>
                              <span className="text-slate-500 text-[10px] pl-5">{branch.country}</span>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-1">
                              <span className="text-slate-300 flex items-center text-xs">
                                <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-500 shrink-0" /> {branch.email}
                              </span>
                              <span className="text-slate-300 flex items-center text-xs">
                                <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-500 shrink-0" /> {branch.phone}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              branch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            } capitalize`}>
                              {branch.status === 'Active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                              {branch.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1 sm:gap-2">
                              <Link href={`/branches/${branch._id}`}>
                                <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-8 w-8 p-0">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link href={`/branches/edit/${branch._id}`}>
                                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 h-8 w-8 p-0">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(branch._id, branch.branchName)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                          No branches match search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

        </div>
      )}
    </div>
  );
}
