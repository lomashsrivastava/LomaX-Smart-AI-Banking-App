"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowRightLeft,
  CreditCard,
  Landmark,
  FileText,
  Bell,
  ShieldAlert,
  Headset,
  Building,
  UserCheck,
  FileSearch,
  Settings,
  CircleDot
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

const sidebarGroups = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    links: [
      { label: "Dashboard Home", href: "/dashboard" },
      { label: "Analytics", href: "/dashboard/analytics" },
      { label: "System Alerts", href: "/dashboard/alerts" },
    ],
  },
  {
    title: "Customer Management",
    icon: Users,
    links: [
      { label: "Register Customer", href: "/customers/register" },
      { label: "Customer List", href: "/customers" },
      { label: "Pending KYC", href: "/customers/kyc" },
    ],
  },
  {
    title: "Account Management",
    icon: Wallet,
    links: [
      { label: "Open New Account", href: "/accounts/new" },
      { label: "Account List", href: "/accounts" },
      { label: "Account Approval", href: "/accounts/approval" },
    ],
  },
  {
    title: "Transaction Management",
    icon: ArrowRightLeft,
    links: [
      { label: "Cash Deposit", href: "/transactions/deposit" },
      { label: "Cash Withdrawal", href: "/transactions/withdraw" },
      { label: "Fund Transfer", href: "/transactions/transfer" },
      { label: "Transaction History", href: "/transactions" },
    ],
  },
  {
    title: "Card Management",
    icon: CreditCard,
    links: [
      { label: "Issue Debit Card", href: "/cards/issue" },
      { label: "Card List", href: "/cards" },
      { label: "Card Controls", href: "/cards/controls" },
    ],
  },
  {
    title: "Loan Management",
    icon: Landmark,
    links: [
      { label: "Apply Loan", href: "/loans/apply" },
      { label: "Loan Applications", href: "/loans/applications" },
      { label: "Active Loans", href: "/loans" },
    ],
  },
  {
    title: "Statements & Reports",
    icon: FileText,
    links: [
      { label: "Account Statements", href: "/reports/statements" },
      { label: "Transaction Reports", href: "/reports/transactions" },
    ],
  },
  {
    title: "Notification Center",
    icon: Bell,
    links: [
      { label: "Send Notification", href: "/notifications/send" },
      { label: "Alert History", href: "/notifications" },
    ],
  },
  {
    title: "Security Center",
    icon: ShieldAlert,
    links: [
      { label: "Login History", href: "/security/logins" },
      { label: "Device Management", href: "/security/devices" },
    ],
  },
  {
    title: "Support Center",
    icon: Headset,
    links: [
      { label: "Ticket History", href: "/support/tickets" },
      { label: "Live Chat", href: "/support/chat" },
    ],
  },
  {
    title: "Branch Management",
    icon: Building,
    links: [
      { label: "Add Branch", href: "/branches/new" },
      { label: "Branch List", href: "/branches" },
      { label: "Branch Reports", href: "/branches/reports" },
    ],
  },
  {
    title: "Employee Management",
    icon: UserCheck,
    links: [
      { label: "Employee List", href: "/employees" },
      { label: "Roles & Permissions", href: "/employees/roles" },
    ],
  },
  {
    title: "Audit & Compliance",
    icon: FileSearch,
    links: [
      { label: "Audit Logs", href: "/audit/logs" },
      { label: "AML Monitoring", href: "/audit/aml" },
      { label: "Fraud Risk Dashboard", href: "/audit/fraud" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    links: [
      { label: "General Settings", href: "/settings/general" },
      { label: "System Preferences", href: "/settings/preferences" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
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
      
      <div className="p-4 border-b border-slate-800/50 shrink-0 relative z-10 flex justify-center items-center">
        <Link href="/dashboard" className="block w-full">
          <div className="relative w-full h-[72px] rounded-xl overflow-hidden border border-slate-700/50 shadow-inner flex items-center justify-center transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] group">
            {/* Subtle glow behind logo on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>
            
            <img 
              src="/lomax-logo.png" 
              alt="LomaX Admin" 
              className="w-full h-full object-cover scale-[1.15] relative z-10" 
            />
          </div>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar pb-10 relative z-10">
        <Accordion className="w-full space-y-1">
          {sidebarGroups.map((group, index) => {
            const isGroupActive = group.links.some(link => pathname.startsWith(link.href));
            
            return (
              <AccordionItem value={`item-${index}`} key={group.title} className="border-none">
                <AccordionTrigger 
                  className={cn(
                    "px-2 py-2 hover:no-underline rounded-lg transition-all duration-300 group/trigger overflow-hidden relative font-futuristic",
                    isGroupActive ? "bg-white/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "hover:bg-white/5 hover:shadow-[0_0_10px_rgba(217,70,239,0.2)]"
                  )}
                >
                  {/* Magical hover background gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 translate-x-[-100%] group-hover/trigger:translate-x-0 transition-transform duration-500 ease-out -z-10" />
                  
                  <div className="flex items-center text-[13px] tracking-wide relative z-10">
                    <group.icon className={cn(
                      "h-4 w-4 mr-2 transition-all duration-300 group-hover/trigger:scale-125 group-hover/trigger:rotate-6",
                      isGroupActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-indigo-300 group-hover/trigger:text-fuchsia-400 group-hover/trigger:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
                    )} />
                    <span className={cn(
                      "transition-all duration-300",
                      isGroupActive ? "text-cyan-300 font-bold drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]" : "text-cyan-100/70 font-semibold group-hover/trigger:text-fuchsia-200 group-hover/trigger:drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]"
                    )}>
                      {group.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-1 pt-1 px-1">
                  <div className="flex flex-col space-y-1 ml-3 border-l border-indigo-500/30 pl-3 py-1 relative">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center text-[12px] py-1.5 px-2 rounded-md transition-all duration-300 group/link relative overflow-hidden font-futuristic tracking-wide",
                          pathname === link.href
                            ? "bg-gradient-to-r from-cyan-600/30 to-transparent text-cyan-200 font-bold border-l-2 border-cyan-400 shadow-[inset_2px_0_10px_rgba(34,211,238,0.3)]"
                            : "text-indigo-200/60 hover:text-cyan-100 hover:bg-white/5 hover:translate-x-2"
                        )}
                      >
                        {/* Hover glow effect for links */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-transparent opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                        
                        <CircleDot className={cn(
                          "h-2 w-2 mr-2 transition-all duration-300", 
                          pathname === link.href ? "text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.9)] scale-110" : "text-indigo-500/50 group-hover/link:text-cyan-400 group-hover/link:scale-125 group-hover/link:drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]"
                        )} />
                        <span className="relative z-10">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Advanced Admin Profile Section */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 relative z-20 shrink-0">
        <div className="flex flex-col space-y-3 group/profile">
          <div className="flex items-center space-x-3 p-2 rounded-xl border border-transparent hover:border-indigo-500/30 hover:bg-indigo-950/30 transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover/profile:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">SA</span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate group-hover/profile:text-cyan-400 transition-colors">System Administrator</p>
              <p className="text-[10px] text-slate-400 truncate font-mono">admin@lomax.com</p>
            </div>
            <Settings className="w-4 h-4 text-slate-500 group-hover/profile:text-indigo-400 transition-colors group-hover/profile:rotate-90 duration-500" />
          </div>

          {/* Quick Actions (reveals on hover of the profile section) */}
          <div className="h-0 opacity-0 group-hover/profile:h-auto group-hover/profile:opacity-100 overflow-hidden transition-all duration-500 flex flex-col space-y-1.5 pt-2 border-t border-slate-800/50">
            <Link href="/settings/general" className="flex items-center text-xs text-slate-300 hover:text-cyan-400 hover:bg-cyan-950/30 p-2 rounded-md transition-colors">
              <ShieldAlert className="w-3.5 h-3.5 mr-2" /> All Admin Functions
            </Link>
            <Link href="/settings/security" className="flex items-center text-xs text-slate-300 hover:text-indigo-400 hover:bg-indigo-950/30 p-2 rounded-md transition-colors">
              <UserCheck className="w-3.5 h-3.5 mr-2" /> Change Password
            </Link>
            <button onClick={handleLogout} className="flex items-center text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 p-2 rounded-md transition-colors w-full text-left">
              <LayoutDashboard className="w-3.5 h-3.5 mr-2" /> Logout System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
