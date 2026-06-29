"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, ArrowLeft } from "lucide-react";
import Loader from "@/components/ui/loader";

export default function EditBranchPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    branchCode: "",
    branchName: "",
    ifscCode: "",
    micrCode: "",
    country: "",
    state: "",
    district: "",
    city: "",
    address: "",
    pincode: "",
    phone: "",
    email: "",
    managerName: "",
    status: "Active"
  });

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/branches/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setFormData({
            branchCode: data.data.branchCode,
            branchName: data.data.branchName,
            ifscCode: data.data.ifscCode,
            micrCode: data.data.micrCode,
            country: data.data.country,
            state: data.data.state,
            district: data.data.district,
            city: data.data.city,
            address: data.data.address,
            pincode: data.data.pincode,
            phone: data.data.phone,
            email: data.data.email,
            managerName: data.data.managerName,
            status: data.data.status
          });
        } else {
          alert("Branch not found");
          router.push("/branches");
        }
      } catch (error) {
        console.error("Failed to fetch branch details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [params.id, router]);

  // Auto-update email when related fields change
  useEffect(() => {
    const formatStr = (str: string) => str.trim().toLowerCase().replace(/\s+/g, "");
    if (formData.branchName && formData.district && formData.state && formData.country) {
      const generatedEmail = `${formatStr(formData.branchName)}.${formatStr(formData.district)}.${formatStr(formData.state)}.${formatStr(formData.country)}@lomaxbank.com`;
      if (formData.email !== generatedEmail) {
        setFormData(prev => ({ ...prev, email: generatedEmail }));
      }
    }
  }, [formData.branchName, formData.district, formData.state, formData.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`http://localhost:5000/api/branches/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        alert("Branch successfully updated!");
        router.push("/branches");
      } else {
        alert(data.message || "Failed to update branch");
      }
    } catch (error) {
      console.error("Failed to update branch", error);
      alert("Error connecting to the server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader size="100px" />
        <p className="mt-4 text-emerald-400 font-mono tracking-widest animate-pulse">FETCHING BRANCH CONFIGURATION...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 relative z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/branches")} className="text-slate-400 hover:text-white hover:bg-slate-800">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
            Edit Branch Details
          </h1>
          <p className="text-cyan-100/70 mt-2 font-medium">
            Update configuration and personnel for <span className="text-white font-bold">{formData.branchName}</span>.
          </p>
        </div>
      </div>

      <div className="relative dark text-slate-200 bg-slate-950/80 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(34,211,238,0.1)] overflow-hidden group">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-700"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-teal-500/20 transition-colors duration-700"></div>

        {saving && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md rounded-xl">
            <Loader size="120px" />
            <p className="mt-6 text-cyan-300 font-bold tracking-widest text-lg animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">UPDATING CONFIGURATION...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">Branch Code <span className="text-slate-500 text-xs">(Locked)</span></label>
              <Input readOnly name="branchCode" value={formData.branchCode} className="bg-slate-900/80 border-slate-700/50 text-slate-400 font-mono opacity-80 cursor-not-allowed focus-visible:ring-0" />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="text-slate-300 font-medium text-sm">Branch Name <span className="text-cyan-500">*</span></label>
              <Input required name="branchName" value={formData.branchName} onChange={handleChange} className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-cyan-500" />
            </div>
            
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">IFSC Code <span className="text-slate-500 text-xs">(Locked)</span></label>
              <Input readOnly name="ifscCode" value={formData.ifscCode} className="bg-slate-900/80 border-slate-700/50 text-slate-400 font-mono opacity-80 cursor-not-allowed focus-visible:ring-0" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">MICR Code <span className="text-slate-500 text-xs">(Locked)</span></label>
              <Input readOnly name="micrCode" value={formData.micrCode} className="bg-slate-900/80 border-slate-700/50 text-slate-400 font-mono opacity-80 cursor-not-allowed focus-visible:ring-0" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">Manager Name <span className="text-cyan-500">*</span></label>
              <Input required name="managerName" value={formData.managerName} onChange={handleChange} className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-cyan-500" />
            </div>

            {/* Geographical Data */}
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">Country <span className="text-cyan-500">*</span></label>
              <Input required name="country" value={formData.country} onChange={handleChange} className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-cyan-500" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">State <span className="text-cyan-500">*</span></label>
              <Input required name="state" value={formData.state} onChange={handleChange} className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-cyan-500" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">District <span className="text-cyan-500">*</span></label>
              <Input required name="district" value={formData.district} onChange={handleChange} className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-cyan-500" />
            </div>
            
            <div className="space-y-2 lg:col-span-3">
              <label className="text-slate-300 font-medium text-sm">Official Email <span className="text-slate-500 text-xs">(Auto-generated)</span></label>
              <Input readOnly name="email" value={formData.email} className="bg-slate-900/80 border-slate-700/50 text-cyan-300 font-mono tracking-wide opacity-80 cursor-not-allowed focus-visible:ring-0" />
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">City <span className="text-cyan-500">*</span></label>
              <Input required name="city" value={formData.city} onChange={handleChange} className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-cyan-500" />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="text-slate-300 font-medium text-sm">Address <span className="text-cyan-500">*</span></label>
              <Input required name="address" value={formData.address} onChange={handleChange} className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-cyan-500" />
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">Pincode <span className="text-cyan-500">*</span></label>
              <Input required name="pincode" value={formData.pincode} onChange={handleChange} className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-cyan-500 font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">Phone <span className="text-cyan-500">*</span></label>
              <Input required name="phone" value={formData.phone} onChange={handleChange} className="bg-slate-900/50 border-slate-700/50 text-cyan-300 focus-visible:border-cyan-500 font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 font-medium text-sm">Status <span className="text-cyan-500">*</span></label>
              <select name="status" value={formData.status} onChange={handleChange} className={`w-full h-10 px-3 py-2 rounded-md bg-slate-900/50 border border-slate-700/50 focus:outline-none focus:border-cyan-500 font-bold ${formData.status === 'Active' ? 'text-emerald-400' : 'text-red-400'}`}>
                <option value="Active" className="text-emerald-400">Active</option>
                <option value="Inactive" className="text-red-400">Inactive</option>
              </select>
            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800/50">
            <Button type="submit" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] border-none transition-all duration-300">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
