"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Wallet,
  ArrowRightLeft,
  Send,
  FileText,
  CreditCard,
  Landmark,
  FileBadge,
  Bell,
  Settings,
  LineChart,
  CircleDot,
  Search
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const customerRoutes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/customer/dashboard" },
  { label: "Smart Analytics", icon: LineChart, href: "/customer/analytics" },
  { label: "My Profile", icon: User, href: "/customer/profile" },
  { label: "My Accounts", icon: Wallet, href: "/customer/accounts" },
  { label: "Transactions", icon: ArrowRightLeft, href: "/customer/transactions" },
  { label: "Transfer Money", icon: Send, href: "/customer/transfer" },
  { label: "Statements", icon: FileText, href: "/customer/statements" },
  { label: "Cards", icon: CreditCard, href: "/customer/cards" },
  { label: "Loans", icon: Landmark, href: "/customer/loans" },
  { label: "Documents", icon: FileBadge, href: "/customer/documents" },
  { label: "Notifications", icon: Bell, href: "/customer/notifications" },
  { label: "Settings", icon: Settings, href: "/customer/settings" },
];

export function CustomerSidebar({ onSearchOpen }: { onSearchOpen?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "CU";
    return nameStr.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <div 
      className="flex flex-col h-full w-full border-r border-slate-800/50 overflow-hidden relative"
      style={{
        backgroundImage: "url('/sidebar-bg-new.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay to make text readable over the background image */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] z-0"></div>
      
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/50 shrink-0 relative z-10 flex justify-center items-center">
        <Link href="/customer/dashboard" className="block w-full">
          <div className="relative w-full h-[72px] rounded-xl overflow-hidden border border-slate-700/50 shadow-inner flex items-center justify-center transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>
            <img 
              src="/lomax-logo.png" 
              alt="LomaX Portal" 
              className="w-full h-full object-cover scale-[1.15] relative z-10" 
            />
          </div>
        </Link>
      </div>
      
      {/* Search Button */}
      <div className="px-3 pb-2 pt-1 relative z-10 shrink-0">
        <button
          onClick={onSearchOpen}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-slate-400 bg-slate-950/60 border border-slate-800/60 rounded-xl hover:border-cyan-500/30 hover:text-slate-200 transition-all group"
        >
          <Search className="w-3.5 h-3.5 group-hover:text-cyan-400 transition-colors" />
          <span className="flex-1 text-left">Search pages...</span>
          <kbd className="text-[9px] font-mono bg-slate-800/80 border border-slate-700/50 px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
      </div>

      {/* Main Navigation links */}
      <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar pb-10 relative z-10">
        <div className="flex flex-col space-y-1">
          {customerRoutes.map((route) => {
            const isActive = pathname.startsWith(route.href);
            const isNotifications = route.label === "Notifications";
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center text-[13px] py-2 px-3 rounded-lg transition-all duration-300 group/link relative overflow-hidden font-futuristic tracking-wide",
                  isActive
                    ? "bg-gradient-to-r from-cyan-600/30 to-transparent text-cyan-200 font-bold border-l-2 border-cyan-400 shadow-[inset_2px_0_10px_rgba(34,211,238,0.3)]"
                    : "text-indigo-200/60 hover:text-cyan-100 hover:bg-white/5 hover:translate-x-2"
                )}
              >
                {/* Hover glow effect for links */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-transparent opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                
                <route.icon className={cn(
                  "h-4 w-4 mr-2.5 transition-all duration-300", 
                  isActive 
                    ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] scale-110" 
                    : "text-indigo-350 group-hover/link:text-cyan-450 group-hover/link:scale-125 group-hover/link:rotate-6 group-hover/link:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
                )} />
                <span className="relative z-10 flex-1">{route.label}</span>
                {isNotifications && unreadCount > 0 && (
                  <span className="relative z-10 ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-fuchsia-600 text-white rounded-full min-w-5 text-center animate-pulse shadow-[0_0_8px_rgba(217,70,239,0.8)]">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Advanced Profile Section */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 relative z-20 shrink-0">
        <div className="flex flex-col space-y-3 group/profile">
          <div className="flex items-center space-x-3 p-2 rounded-xl border border-transparent hover:border-indigo-500/30 hover:bg-indigo-950/30 transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover/profile:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                  {getInitials(user?.name || "")}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate group-hover/profile:text-cyan-400 transition-colors">
                {user?.name || "Customer"}
              </p>
              <p className="text-[10px] text-slate-400 truncate font-mono">
                {user?.email || "customer@lomax.com"}
              </p>
            </div>
            <Settings className="w-4 h-4 text-slate-500 group-hover/profile:text-indigo-400 transition-colors group-hover/profile:rotate-90 duration-500" />
          </div>

          {/* Quick Actions (reveals on hover of the profile section) */}
          <div className="h-0 opacity-0 group-hover/profile:h-auto group-hover/profile:opacity-100 overflow-hidden transition-all duration-500 flex flex-col space-y-1.5 pt-2 border-t border-slate-800/50">
            <Link href="/customer/profile" className="flex items-center text-xs text-slate-300 hover:text-cyan-400 hover:bg-cyan-950/30 p-2 rounded-md transition-colors">
              <User className="w-3.5 h-3.5 mr-2" /> My Profile
            </Link>
            <Link href="/customer/settings" className="flex items-center text-xs text-slate-300 hover:text-indigo-400 hover:bg-indigo-950/30 p-2 rounded-md transition-colors">
              <Settings className="w-3.5 h-3.5 mr-2" /> Security Settings
            </Link>
            <button onClick={handleLogout} className="flex items-center text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 p-2 rounded-md transition-colors w-full text-left">
              <LayoutDashboard className="w-3.5 h-3.5 mr-2" /> Logout Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
