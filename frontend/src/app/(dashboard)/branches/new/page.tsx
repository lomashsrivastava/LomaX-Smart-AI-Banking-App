"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Save, ArrowLeft } from "lucide-react";
import Loader from "@/components/ui/loader";

export default function AddBranchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    branchCode: "",
    branchName: "",
    ifscCode: "",
    micrCode: "",
    country: "India",
    state: "",
    district: "",
    city: "",
    address: "",
    pincode: "",
    phone: "",
    managerName: "",
    status: "Active"
  });

  const [generatedEmail, setGeneratedEmail] = useState("");

  // Automatically generate the email based on the fields
  useEffect(() => {
    const formatStr = (str: string) => str.trim().toLowerCase().replace(/\s+/g, "");
    if (formData.branchName && formData.district && formData.state && formData.country) {
      setGeneratedEmail(`${formatStr(formData.branchName)}.${formatStr(formData.district)}.${formatStr(formData.state)}.${formatStr(formData.country)}@lomaxbank.com`);
    } else {
      setGeneratedEmail("");
    }
  }, [formData.branchName, formData.district, formData.state, formData.country]);

  // Auto-generate Branch Code and IFSC Code on mount
  useEffect(() => {
    const code = Math.floor(100 + Math.random() * 900);
    const ifsc = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({
      ...prev,
      branchCode: prev.branchCode || `BR${code}`,
      ifscCode: prev.ifscCode || `LOMX0${ifsc}`
    }));
  }, []);

  // Auto-generate MICR Code based on Pincode
  useEffect(() => {
    if (formData.pincode && formData.pincode.length === 6) {
      if (!formData.micrCode || !formData.micrCode.startsWith(formData.pincode)) {
        const random3 = Math.floor(100 + Math.random() * 900);
        setFormData(prev => ({ ...prev, micrCode: `${formData.pincode}${random3}` }));
      }
    } else if (formData.pincode.length < 6 && formData.micrCode) {
       // Clear micr if pincode is removed
       setFormData(prev => ({ ...prev, micrCode: "" }));
    }
  }, [formData.pincode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        email: generatedEmail || "branch@lomaxbank.com"
      };

      const response = await fetch("http://localhost:5000/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success) {
        alert("Branch successfully created!");
        router.push("/branches");
      } else {
        alert(data.message || "Failed to create branch");
      }
    } catch (error) {
      console.error("Failed to create branch", error);
      alert("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 relative z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/branches")} className="text-slate-400 hover:text-white hover:bg-slate-800">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
            Add New Branch
          </h1>
          <p className="text-cyan-100/70 mt-2 font-medium">
            Register a new banking branch to the centralized network.
          </p>
        </div>
      </div>

      <div className="relative dark text-slate-200 bg-slate-950/80 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(52,211,153,0.1)] overflow-hidden group">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-teal-500/20 transition-colors duration-700"></div>

        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md rounded-xl">
            <Loader size="120px" />
            <p className="mt-6 text-cyan-300 font-bold tracking-widest text-lg animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">INITIALIZING BRANCH...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">Branch Code <span className="text-emerald-500">*</span></label>
              <Input readOnly required name="branchCode" value={formData.branchCode} placeholder="Auto-generated" className="bg-emerald-950/20 border-emerald-500/30 text-emerald-400 font-mono tracking-wide opacity-100 focus-visible:ring-0" />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="text-slate-300 font-medium text-sm">Branch Name <span className="text-emerald-500">*</span></label>
              <Input required name="branchName" value={formData.branchName} onChange={handleChange} placeholder="e.g. Main Branch" className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-emerald-500" />
            </div>
            
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">IFSC Code <span className="text-emerald-500">*</span></label>
              <Input readOnly required name="ifscCode" value={formData.ifscCode} placeholder="Auto-generated" className="bg-emerald-950/20 border-emerald-500/30 text-emerald-400 font-mono tracking-wide opacity-100 focus-visible:ring-0" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">MICR Code <span className="text-emerald-500">*</span></label>
              <Input readOnly required name="micrCode" value={formData.micrCode} placeholder="Auto-generated from Pincode" className="bg-emerald-950/20 border-emerald-500/30 text-emerald-400 font-mono tracking-wide opacity-100 focus-visible:ring-0" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">Manager Name <span className="text-emerald-500">*</span></label>
              <Input required name="managerName" value={formData.managerName} onChange={handleChange} placeholder="Full Name" className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-emerald-500" />
            </div>

            {/* Geographical Data */}
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">Country <span className="text-emerald-500">*</span></label>
              <Input required name="country" value={formData.country} onChange={handleChange} placeholder="e.g. India" className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">State <span className="text-emerald-500">*</span></label>
              <Input required name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Uttar Pradesh" className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">District <span className="text-emerald-500">*</span></label>
              <Input required name="district" value={formData.district} onChange={handleChange} placeholder="e.g. Lucknow" className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-emerald-500" />
            </div>
            
            <div className="space-y-2 lg:col-span-3">
              <label className="text-slate-300 font-medium text-sm">Auto-Generated Official Email</label>
              <Input disabled value={generatedEmail || "[branch_name].[district].[state].[country]@lomaxbank.com"} className="bg-emerald-950/20 border-emerald-500/30 text-emerald-400 font-mono tracking-wide opacity-100" />
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">City <span className="text-emerald-500">*</span></label>
              <Input required name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Lucknow" className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-emerald-500" />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="text-slate-300 font-medium text-sm">Address <span className="text-emerald-500">*</span></label>
              <Input required name="address" value={formData.address} onChange={handleChange} placeholder="e.g. Gomti Nagar" className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-emerald-500" />
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">Pincode <span className="text-emerald-500">*</span></label>
              <Input required name="pincode" value={formData.pincode} onChange={handleChange} placeholder="e.g. 226010" className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-emerald-500 font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">Phone <span className="text-emerald-500">*</span></label>
              <Input required name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 9876543210" className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-emerald-500 font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full h-10 px-3 py-2 rounded-md bg-slate-900/50 border border-slate-700/50 text-cyan-300 focus:outline-none focus:border-emerald-500">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800/50">
            <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_15px_rgba(52,211,153,0.4)] hover:shadow-[0_0_25px_rgba(52,211,153,0.6)] border-none transition-all duration-300">
              <Save className="w-4 h-4 mr-2" /> Register Branch
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
