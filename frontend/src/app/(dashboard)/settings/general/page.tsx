"use client";

import { useState } from "react";
import { Settings, Save, Building, Globe, Banknote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function GeneralSettingsPage() {
  const [bankName, setBankName] = useState("LomaX Central Bank");
  const [hqAddress, setHqAddress] = useState("100 Financial District, Mumbai, IN");
  const [currency, setCurrency] = useState("INR");
  const [timezone, setTimezone] = useState("IST");
  
  // To avoid numeric overflow bugs, handle input as strings
  const [maxTransfer, setMaxTransfer] = useState("10000000"); // 1 Crore default
  const [minBalance, setMinBalance] = useState("5000");

  const [saving, setSaving] = useState(false);

  const handleMaxTransferChange = (val: string) => {
    // Strip non-digits
    const clean = val.replace(/\D/g, "");
    setMaxTransfer(clean);
  };

  const handleMinBalanceChange = (val: string) => {
    // Strip non-digits
    const clean = val.replace(/\D/g, "");
    setMinBalance(clean);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Platform settings updated and broadcasted to all Lomax active database nodes.");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-200">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500 drop-shadow-[0_0_10px_rgba(148,163,184,0.3)] flex items-center gap-3">
          <Settings className="w-8 h-8 text-slate-400" /> General Settings
        </h1>
        <p className="text-slate-400 mt-2">Configure core banking platform parameters and operational limits.</p>
      </div>

      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden p-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleSave} className="space-y-8 relative z-10">
          {/* Institution Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
              <Building className="w-5 h-5 text-slate-400" /> Institution Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Bank Name</label>
                <Input 
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-655 focus-visible:border-slate-500 focus-visible:ring-slate-500/20" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Headquarters Address</label>
                <Input 
                  value={hqAddress}
                  onChange={(e) => setHqAddress(e.target.value)}
                  className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-655 focus-visible:border-slate-500 focus-visible:ring-slate-500/20" 
                />
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div>
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
              <Globe className="w-5 h-5 text-slate-400" /> Regional & Compliance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Default Currency</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-955/50 px-3 py-2 text-slate-200 focus-visible:outline-none"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Timezone</label>
                <select 
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-955/50 px-3 py-2 text-slate-200 focus-visible:outline-none"
                >
                  <option value="IST">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>

          {/* Operational Limits */}
          <div>
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
              <Banknote className="w-5 h-5 text-slate-400" /> Global Operational Limits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Max Transfer Per Day (₹)</label>
                <Input 
                  type="text" 
                  value={maxTransfer}
                  onChange={(e) => handleMaxTransferChange(e.target.value)}
                  className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-655 focus-visible:border-slate-500 focus-visible:ring-slate-500/20" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Account Minimum Balance (₹)</label>
                <Input 
                  type="text" 
                  value={minBalance}
                  onChange={(e) => handleMinBalanceChange(e.target.value)}
                  className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-655 focus-visible:border-slate-500 focus-visible:ring-slate-500/20" 
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={saving} className="bg-slate-700 hover:bg-slate-600 text-white gap-2 font-bold">
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
