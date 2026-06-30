"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search, Loader2, Users, Building2, UserPlus,
  ShieldCheck, Mail, Phone, Trash2, Globe, MapPin,
  Navigation, Map, ChevronRight
} from "lucide-react";

interface Employee {
  _id: string;
  empId: string;
  firstName: string;
  lastName: string;
  email: string;
  officialEmail: string;
  phone: string;
  role: string;
  department: string;
  branchId: { _id: string; branchName: string; branchCode: string };
  state: string;
  district: string;
  status: string;
}

interface Branch {
  _id: string;
  branchName: string;
  branchCode: string;
  city: string;
  district: string;
  state: string;
  country: string;
}

const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return "https://lomax-backend.onrender.com";
    }
  }
  return "http://localhost:5000";
};

const API_BASE = getApiBase();

export default function EmployeeListPage() {
  const [regions, setRegions] = useState<Record<string, Record<string, string[]>>>({});
  const [regionsLoading, setRegionsLoading] = useState(true);
  
  // Filtering selections
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Load lightweight region choices first
  useEffect(() => {
    const fetchRegions = async () => {
      setRegionsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/branches/regions`);
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
    fetchRegions();
  }, []);

  // Fetch branches under the selected district
  useEffect(() => {
    if (!selectedCountry || !selectedState || !selectedDistrict) {
      setAvailableBranches([]);
      setSelectedBranchId("");
      return;
    }

    const fetchBranches = async () => {
      setBranchesLoading(true);
      try {
        const queryParams = new URLSearchParams({
          country: selectedCountry,
          state: selectedState,
          district: selectedDistrict
        });
        const response = await fetch(`${API_BASE}/api/branches?${queryParams}`);
        const data = await response.json();
        if (data.success) {
          const list = data.data || [];
          setAvailableBranches(list);
          setSelectedBranchId(""); // Require user to select branch manually
        }
      } catch (error) {
        console.error("Failed to fetch branches", error);
      } finally {
        setBranchesLoading(false);
      }
    };

    fetchBranches();
  }, [selectedCountry, selectedState, selectedDistrict]);

  // Load all employees on mount
  useEffect(() => {
    const fetchAllEmployees = async () => {
      setEmployeesLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/employees`);
        const data = await response.json();
        if (data.success) {
          setEmployees(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch all employees", error);
      } finally {
        setEmployeesLoading(false);
      }
    };
    fetchAllEmployees();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove employee ${name}?`)) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/api/employees/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      
      if (data.success) {
        setEmployees(prev => prev.filter(e => e._id !== id));
      } else {
        alert(data.message || "Failed to delete employee");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting.");
    }
  };

  // Derive selection lists
  const countries = Object.keys(regions).sort();
  const states = selectedCountry && regions[selectedCountry] ? Object.keys(regions[selectedCountry]).sort() : [];
  const districts = selectedState && selectedCountry && regions[selectedCountry]?.[selectedState] ? regions[selectedCountry][selectedState].sort() : [];

  const filteredEmployees = employees.filter(e => {
    // Apply regional hierarchy filters locally
    if (selectedBranchId && (!e.branchId || e.branchId._id !== selectedBranchId)) {
      return false;
    }
    if (selectedDistrict && (!e.district || e.district.trim().toLowerCase() !== selectedDistrict.trim().toLowerCase())) {
      return false;
    }
    if (selectedState && (!e.state || e.state.trim().toLowerCase() !== selectedState.trim().toLowerCase())) {
      return false;
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchId = e.empId.toLowerCase().includes(term);
      const matchName = `${e.firstName} ${e.lastName}`.toLowerCase().includes(term);
      const matchEmail = e.officialEmail && e.officialEmail.toLowerCase().includes(term);
      const matchRole = e.role.toLowerCase().includes(term);
      return matchId || matchName || matchEmail || matchRole;
    }
    
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 relative z-10 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">
            Employee Directory
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Select branch parameters to search and manage system staff, roles, and branch assignments.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/employees/roles">
            <Button variant="outline" className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 bg-slate-900/50 rounded-xl px-4 py-2 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 mr-2" /> Roles & Depts
            </Button>
          </Link>
          <Link href="/employees/new">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] border-none rounded-xl px-4 py-2 text-xs font-semibold">
              <UserPlus className="w-4 h-4 mr-2" /> Register Staff
            </Button>
          </Link>
        </div>
      </div>

      {regionsLoading ? (
        <Card className="bg-slate-950/80 backdrop-blur-xl border border-indigo-500/20 shadow-xl overflow-hidden p-12">
          <div className="flex flex-col items-center justify-center text-indigo-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="animate-pulse text-sm">Synchronizing staff registry...</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">

          {/* Cascading Selector Card */}
          <Card className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Map className="w-4 h-4 text-blue-400" /> Regional Branch Hierarchy
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
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
                      setSelectedBranchId("");
                    }}
                    className="w-full bg-slate-900/80 border border-slate-850 hover:border-slate-700 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium appearance-none cursor-pointer"
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
                      setSelectedBranchId("");
                    }}
                    className={`w-full bg-slate-900/80 border text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium appearance-none cursor-pointer ${
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
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setSelectedBranchId("");
                    }}
                    className={`w-full bg-slate-900/80 border text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all font-medium appearance-none cursor-pointer ${
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

              {/* Branch Select */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">4. Assigned Branch</label>
                <div className="relative">
                  {branchesLoading ? (
                    <div className="w-full bg-slate-900/80 border border-slate-850 text-slate-500 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
                      <span>Loading...</span>
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    </div>
                  ) : (
                    <select
                      value={selectedBranchId}
                      disabled={!selectedDistrict || availableBranches.length === 0}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      className={`w-full bg-slate-900/80 border text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium appearance-none cursor-pointer ${
                        selectedDistrict && availableBranches.length > 0 ? "border-slate-850 hover:border-slate-700" : "border-slate-900 text-slate-600 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <option value="" className="bg-slate-950">
                        {availableBranches.length === 0 && selectedDistrict ? "No Branches Found" : "Select Branch"}
                      </option>
                      {availableBranches.map(b => (
                        <option key={b._id} value={b._id} className="bg-slate-950">
                          {b.branchName} ({b.branchCode})
                        </option>
                      ))}
                    </select>
                  )}
                  {!branchesLoading && <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />}
                </div>
              </div>

            </div>
          </Card>

          {/* Results Section */}
          {employeesLoading ? (
            <div className="text-center py-20 text-slate-500 animate-pulse flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <span className="text-xs">Querying staff records...</span>
            </div>
          ) : (
            <Card className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 shadow-xl overflow-hidden rounded-2xl animate-in fade-in zoom-in-98 duration-300">
              
              {/* Search & totals */}
              <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/30">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input 
                    placeholder="Search by ID, Name, Role..." 
                    className="pl-9 bg-slate-900/60 border-slate-750 text-indigo-400 placeholder:text-slate-600 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 drop-shadow-[0_0_6px_rgba(99,102,241,0.4)] focus:drop-shadow-[0_0_10px_rgba(99,102,241,0.7)] transition-all duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="text-xs text-indigo-400 font-bold tracking-widest font-mono shrink-0 bg-indigo-950/40 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
                  TOTAL ASSOCIATED STAFF: {filteredEmployees.length}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 bg-slate-900/50 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-bold">Employee</th>
                      <th className="px-6 py-4 font-bold">Role & Dept</th>
                      <th className="px-6 py-4 font-bold">Branch Info</th>
                      <th className="px-6 py-4 font-bold">Contact</th>
                      <th className="px-6 py-4 font-bold text-center">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((emp) => (
                        <tr key={emp._id} className="hover:bg-slate-900/30 transition-all duration-300 group">
                          {/* Name / ID */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-500/20 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.15)] flex items-center justify-center mr-3 shrink-0 group-hover:scale-105 transition-transform">
                                <Users className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-white text-sm">
                                  {emp.firstName} {emp.lastName}
                                </span>
                                <span className="text-slate-500 font-mono text-xs mt-0.5">{emp.empId}</span>
                              </div>
                            </div>
                          </td>

                          {/* Role & Dept */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-start gap-1">
                              <span className="bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded text-xs font-semibold">
                                {emp.role}
                              </span>
                              {emp.department && (
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{emp.department}</span>
                              )}
                            </div>
                          </td>

                          {/* Assigned Branch */}
                          <td className="px-6 py-4">
                            <div className="flex items-center text-slate-300 group-hover:text-blue-300 transition-colors text-xs font-medium">
                              <Building2 className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
                              {emp.branchId ? emp.branchId.branchName : "Unassigned"}
                            </div>
                          </td>

                          {/* Contact Details */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-1 text-slate-400 text-xs">
                              <span className="flex items-center" title="Official Email">
                                <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-500 shrink-0" /> {emp.officialEmail}
                              </span>
                              <span className="flex items-center">
                                <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-500 shrink-0" /> {emp.phone}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                              emp.status === 'Inactive' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {emp.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(emp._id, `${emp.firstName} ${emp.lastName}`)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                          No employees registered for this branch.
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
