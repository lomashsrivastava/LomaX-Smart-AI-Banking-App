"use client";

import { useState } from "react";
import { useNotifications, NotificationItem } from "@/context/NotificationContext";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Info, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRightLeft, 
  Cpu, 
  Calendar,
  Eye,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FilterType = "all" | "transaction" | "system" | "alerts";

export default function CustomerNotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, loading } = useNotifications();
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "transaction") return n.type === "transaction";
    if (filter === "system") return n.type === "system";
    if (filter === "alerts") return ["warning", "error", "security"].includes(n.type);
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "transaction":
        return <ArrowRightLeft className="w-4 h-4 text-cyan-400" />;
      case "system":
        return <Cpu className="w-4 h-4 text-purple-405 text-indigo-400" />;
      case "error":
      case "security":
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "transaction":
        return "from-cyan-950/40 to-cyan-900/10 border-cyan-500/20";
      case "system":
        return "from-indigo-950/40 to-indigo-900/10 border-indigo-500/20";
      case "error":
      case "security":
        return "from-rose-950/40 to-rose-900/10 border-rose-500/20";
      case "warning":
        return "from-amber-950/40 to-amber-900/10 border-amber-500/20";
      default:
        return "from-slate-900/60 to-slate-950/20 border-slate-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 text-slate-100 font-futuristic">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-cyan-400 animate-swing" />
            <span>Activity Timeline</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time ledger events, security alerts, and system notifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={markAllAsRead} 
            disabled={notifications.filter(n => !n.read).length === 0}
            variant="outline"
            className="border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 text-slate-300 font-bold"
          >
            <CheckCheck className="w-4 h-4 mr-2 text-cyan-400" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/50 pb-4">
        {(["all", "transaction", "system", "alerts"] as FilterType[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all border uppercase tracking-wider",
              filter === t 
                ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]" 
                : "bg-slate-950/40 text-slate-400 border-slate-900 hover:border-slate-800 hover:text-slate-200"
            )}
          >
            {t === "alerts" ? "Security & Warnings" : `${t}s`}
          </button>
        ))}
      </div>

      {/* Timeline Feed Container */}
      <div className="relative pl-6 sm:pl-8 border-l border-slate-800/80 space-y-8 ml-3 sm:ml-4 pt-2">
        {filteredNotifications.map((n, idx) => (
          <div key={n.id} className="relative group">
            
            {/* Timeline Dot Indicator */}
            <div className={cn(
              "absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border z-10 transition-all duration-300",
              n.read 
                ? "bg-slate-950 border-slate-800 text-slate-500 group-hover:border-slate-650"
                : "bg-slate-950 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] scale-110"
            )}>
              {getIcon(n.type)}
            </div>

            {/* Glowing Unread indicator dot inside timeline */}
            {!n.read && (
              <span className="absolute -left-[45px] sm:-left-[53px] top-3.5 w-2 h-2 rounded-full bg-cyan-450 animate-ping z-25" />
            )}

            {/* Notification Card */}
            <div className={cn(
              "p-5 rounded-2xl bg-gradient-to-r border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-[0_0_20px_rgba(34,211,238,0.05)]",
              getTypeStyle(n.type),
              !n.read && "border-cyan-500/30 shadow-[inset_0_0_15px_rgba(34,211,238,0.05)]"
            )}>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={cn(
                    "text-sm font-bold tracking-wide",
                    n.read ? "text-slate-350" : "text-slate-100"
                  )}>
                    {n.title}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-600" />
                    {new Date(n.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className={cn(
                  "text-xs leading-relaxed",
                  n.read ? "text-slate-400" : "text-slate-200"
                )}>
                  {n.message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 md:self-center">
                {!n.read && (
                  <Button
                    onClick={() => markAsRead(n.id)}
                    size="sm"
                    className="h-7 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-md"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Mark Read
                  </Button>
                )}
              </div>
            </div>

          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-16 -ml-6 sm:-ml-8 bg-slate-900/30 border border-slate-800/80 rounded-2xl text-slate-450 text-sm">
            No activities or notifications found in this timeline category.
          </div>
        )}
      </div>

    </div>
  );
}
