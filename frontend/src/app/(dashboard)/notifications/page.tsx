"use client";

import { Bell, Search, Filter, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NotificationsHistoryPage() {
  const notifications = [
    { id: "NOTIF-001", type: "SMS", recipient: "CUST-84921", subject: "OTP Verification", status: "Delivered", time: "10 mins ago" },
    { id: "NOTIF-002", type: "Email", recipient: "CUST-11234", subject: "Monthly Statement", status: "Delivered", time: "1 hour ago" },
    { id: "NOTIF-003", type: "Push", recipient: "All Users", subject: "Scheduled Maintenance", status: "Sent", time: "3 hours ago" },
    { id: "NOTIF-004", type: "Email", recipient: "CUST-55122", subject: "Loan Approved", status: "Failed", time: "1 day ago" },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] flex items-center gap-3">
            <Bell className="w-8 h-8 text-yellow-400" /> Notification History
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Log of all system alerts, SMS, and emails sent to customers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Search notifications..."
          className="pl-10 bg-slate-900/60 border-slate-700 text-slate-200 placeholder:text-slate-600 focus-visible:border-yellow-500"
        />
      </div>

      <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/40 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Recipient</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notif) => (
                <tr key={notif.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      {notif.type === 'SMS' ? <MessageSquare className="w-4 h-4 text-emerald-400" /> :
                       notif.type === 'Email' ? <Mail className="w-4 h-4 text-blue-400" /> :
                       <Smartphone className="w-4 h-4 text-purple-400" />}
                      {notif.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-300">{notif.recipient}</td>
                  <td className="px-6 py-4 text-slate-200 font-medium">{notif.subject}</td>
                  <td className="px-6 py-4 text-slate-400">{notif.time}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-xs rounded-full border font-medium ${
                      notif.status === 'Delivered' || notif.status === 'Sent' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                    }`}>
                      {notif.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
