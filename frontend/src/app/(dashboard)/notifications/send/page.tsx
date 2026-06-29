"use client";

import { Send, Users, User, BellRing } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SendNotificationPage() {
  const [loading, setLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Notification sent successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] flex items-center gap-3">
          <Send className="w-8 h-8 text-yellow-400" /> Dispatch Notification
        </h1>
        <p className="text-slate-400 mt-2">Send manual alerts, emails, or SMS to customers.</p>
      </div>

      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden p-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleSend} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Audience</label>
              <select className="flex h-12 w-full rounded-md border border-slate-700 bg-slate-950/50 px-3 py-2 text-slate-200 focus-visible:outline-none focus-visible:border-amber-500 focus-visible:ring-1 focus-visible:ring-amber-500/20">
                <option value="single">Single Customer</option>
                <option value="all">All Customers</option>
                <option value="branch">Specific Branch</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Target ID (if applicable)</label>
              <Input 
                placeholder="e.g. CUST-12345 or B-001"
                className="h-12 bg-slate-950/50 border-slate-700 text-amber-400 placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] focus:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] transition-all duration-300"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Notification Channel</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer p-3 border border-slate-700 rounded-lg flex-1 justify-center bg-slate-950/50 hover:border-amber-500/50">
                  <input type="checkbox" className="accent-amber-500" defaultChecked /> SMS
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer p-3 border border-slate-700 rounded-lg flex-1 justify-center bg-slate-950/50 hover:border-amber-500/50">
                  <input type="checkbox" className="accent-amber-500" defaultChecked /> Email
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer p-3 border border-slate-700 rounded-lg flex-1 justify-center bg-slate-950/50 hover:border-amber-500/50">
                  <input type="checkbox" className="accent-amber-500" /> Push (App)
                </label>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Subject / Title</label>
              <Input 
                required
                placeholder="Notification subject"
                className="h-12 bg-slate-950/50 border-slate-700 text-amber-400 placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] focus:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] transition-all duration-300"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Message Body</label>
              <textarea 
                required
                rows={5}
                placeholder="Type your message here..."
                className="flex w-full rounded-md border border-slate-700 bg-slate-950/50 px-3 py-2 text-amber-400 placeholder:text-slate-600 focus-visible:outline-none focus-visible:border-amber-500 focus-visible:ring-1 focus-visible:ring-amber-500/20 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] focus:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] transition-all duration-300"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="h-12 px-8 font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(251,191,36,0.3)]"
            >
              <BellRing className="w-4 h-4 mr-2" /> {loading ? "Dispatching..." : "Send Notification"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
