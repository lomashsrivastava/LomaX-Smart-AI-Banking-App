"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Building2, MapPin, Phone, Mail, Users, User, CheckCircle2, XCircle, Landmark, Edit } from "lucide-react";

export default function BranchDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [branch, setBranch] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchRes = await fetch(`http://localhost:5000/api/branches/${params.id}`);
        const branchData = await branchRes.json();
        
        if (branchData.success) {
          setBranch(branchData.data);
        } else {
          alert("Branch not found");
          router.push("/branches");
          return;
        }

        const empRes = await fetch(`http://localhost:5000/api/employees/branch/${params.id}`);
        const empData = await empRes.json();
        if (empData.success) {
          setEmployees(empData.data);
        }

      } catch (error) {
        console.error("Failed to fetch branch details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-emerald-400 font-mono tracking-widest animate-pulse">DECRYPTING BRANCH DATA...</p>
      </div>
    );
  }

  if (!branch) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 relative z-10 pb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/branches")} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md flex items-center gap-3">
              {branch.branchName}
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs rounded-full font-mono shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                {branch.branchCode}
              </span>
            </h1>
            <p className="text-emerald-400/80 mt-1 font-mono text-sm flex items-center">
              Network Status: 
              <span className={`ml-2 uppercase font-bold flex items-center ${branch.status === 'Active' ? 'text-emerald-400' : 'text-red-400'}`}>
                {branch.status === 'Active' ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                {branch.status}
              </span>
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push(`/branches/edit/${branch._id}`)}
          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
        >
          <Edit className="w-4 h-4 mr-2" /> Edit Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Core Identifiers */}
        <Card className="bg-emerald-950/10 border-emerald-500/30 hover:border-emerald-400/60 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] transition-all group">
          <CardHeader className="border-b border-emerald-500/20 flex flex-row items-center gap-3">
            <Landmark className="w-6 h-6 text-emerald-400" />
            <CardTitle className="text-emerald-300 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">Core Identifiers</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wider block">Branch ID</span>
              <span className="text-white font-mono tracking-widest text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{branch.branchId}</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wider block">IFSC Routing Code</span>
              <span className="text-emerald-300 font-mono tracking-widest text-lg drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">{branch.ifscCode}</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wider block">MICR Code</span>
              <span className="text-cyan-300 font-mono tracking-widest text-lg drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{branch.micrCode}</span>
            </div>
          </CardContent>
        </Card>

        {/* Location & Contact */}
        <Card className="bg-cyan-950/10 border-cyan-500/30 hover:border-cyan-400/60 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] transition-all group col-span-1 md:col-span-2">
          <CardHeader className="border-b border-cyan-500/20 flex flex-row items-center gap-3">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <CardTitle className="text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">Location & Contact Directory</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div>
                <span className="text-cyan-400 text-xs uppercase tracking-wider font-bold block mb-1">Physical Address</span>
                <p className="text-white font-medium text-sm leading-relaxed">
                  {branch.address}<br/>
                  {branch.city}, {branch.district}<br/>
                  {branch.state}, {branch.country} - {branch.pincode}
                </p>
              </div>
              <div>
                <span className="text-cyan-400 text-xs uppercase tracking-wider font-bold block mb-1">Network Opening Date</span>
                <p className="text-white font-medium text-sm">
                  {new Date(branch.openingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-cyan-400 text-xs uppercase tracking-wider font-bold block mb-1">Official Communication</span>
                <div className="flex items-center text-white text-sm mb-2">
                  <Mail className="w-4 h-4 mr-2 text-slate-400" /> {branch.email}
                </div>
                <div className="flex items-center text-white text-sm">
                  <Phone className="w-4 h-4 mr-2 text-slate-400" /> {branch.phone}
                </div>
              </div>
              <div>
                <span className="text-cyan-400 text-xs uppercase tracking-wider font-bold block mb-1">Branch Manager</span>
                <div className="flex items-center text-white text-sm">
                  <User className="w-4 h-4 mr-2 text-emerald-400" /> <span className="font-bold">{branch.managerName}</span>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Branch Staff */}
        <Card className="bg-fuchsia-950/10 border-fuchsia-500/30 hover:border-fuchsia-400/60 shadow-[inset_0_0_20px_rgba(217,70,239,0.05)] transition-all group col-span-1 md:col-span-3">
          <CardHeader className="border-b border-fuchsia-500/20 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-fuchsia-400" />
              <CardTitle className="text-fuchsia-300 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">Branch Staff & Employees</CardTitle>
            </div>
            <Button 
              size="sm"
              onClick={() => router.push(`/employees/new?branchId=${branch._id}`)}
              className="bg-fuchsia-600/80 hover:bg-fuchsia-500 text-white shadow-[0_0_10px_rgba(217,70,239,0.4)] border-none"
            >
              Add Employee
            </Button>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            {employees.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-center py-8">
                 <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-slate-600" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-300 mb-2">No Employees Assigned</h3>
                 <p className="text-slate-500 max-w-md text-sm">
                   There are currently no staff members assigned to this branch. Click "Add Employee" to register new staff.
                 </p>
               </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-fuchsia-300 bg-fuchsia-950/40 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-semibold rounded-tl-lg">ID</th>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Role</th>
                      <th className="px-4 py-3 font-semibold">Contact</th>
                      <th className="px-4 py-3 font-semibold rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-fuchsia-500/10">
                    {employees.map(emp => (
                      <tr key={emp._id} className="hover:bg-fuchsia-900/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-fuchsia-400/80">{emp.empId}</td>
                        <td className="px-4 py-3 font-bold text-slate-200">{emp.firstName} {emp.lastName}</td>
                        <td className="px-4 py-3 text-slate-400">
                          <div className="flex flex-col items-start gap-1">
                            <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-xs">
                              {emp.role}
                            </span>
                            {emp.department && (
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest">{emp.department}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col text-xs text-slate-400 space-y-1">
                            <span className="flex items-center"><Mail className="w-3 h-3 mr-1 text-emerald-400" /> {emp.officialEmail}</span>
                            <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> {emp.phone}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            emp.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-slate-500/10'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
