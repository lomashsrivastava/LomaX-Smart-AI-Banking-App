"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  X,
  LayoutDashboard,
  ArrowRightLeft,
  FileText,
  Bell,
  User,
  CreditCard,
  Landmark,
  LineChart,
  Settings,
  Wallet,
  Send,
  ChevronRight,
  Zap,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  category: "navigate" | "action";
  keywords: string[];
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: "dashboard", label: "Dashboard", description: "Go to your banking dashboard", href: "/customer/dashboard", icon: LayoutDashboard, category: "navigate", keywords: ["home", "overview", "dashboard"] },
  { id: "analytics", label: "Smart Analytics", description: "Financial health, insights, and spending", href: "/customer/analytics", icon: LineChart, category: "navigate", keywords: ["analytics", "health", "score", "spending", "insights"] },
  { id: "accounts", label: "My Accounts", description: "View all active bank accounts", href: "/customer/accounts", icon: Wallet, category: "navigate", keywords: ["accounts", "balance", "savings", "current"] },
  { id: "transfer", label: "Transfer Money", description: "Send funds to any account", href: "/customer/transfer", icon: ArrowRightLeft, category: "action", keywords: ["transfer", "send", "money", "payment", "neft", "imps", "upi"] },
  { id: "transactions", label: "Transactions", description: "View all recent transactions", href: "/customer/transactions", icon: Send, category: "navigate", keywords: ["transactions", "history", "ledger", "debit", "credit"] },
  { id: "statements", label: "Statements", description: "Download PDF or CSV statements", href: "/customer/statements", icon: FileText, category: "action", keywords: ["statement", "pdf", "csv", "export", "download", "report"] },
  { id: "cards", label: "Cards", description: "Manage debit and credit cards", href: "/customer/cards", icon: CreditCard, category: "navigate", keywords: ["card", "debit", "credit", "atm", "block"] },
  { id: "loans", label: "Loans", description: "View and apply for loans", href: "/customer/loans", icon: Landmark, category: "navigate", keywords: ["loan", "emi", "apply", "personal", "home"] },
  { id: "notifications", label: "Notifications", description: "View activity timeline and alerts", href: "/customer/notifications", icon: Bell, category: "navigate", keywords: ["notifications", "alerts", "timeline", "activity"] },
  { id: "profile", label: "My Profile", description: "View and update profile details", href: "/customer/profile", icon: User, category: "navigate", keywords: ["profile", "account", "name", "email", "update"] },
  { id: "settings", label: "Security Settings", description: "Manage 2FA, sessions, and devices", href: "/customer/settings", icon: Settings, category: "navigate", keywords: ["settings", "security", "2fa", "password", "session", "device"] },
];

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? QUICK_ACTIONS.filter(a =>
        a.label.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase()) ||
        a.keywords.some(k => k.includes(query.toLowerCase()))
      )
    : QUICK_ACTIONS;

  const handleSelect = useCallback((action: QuickAction) => {
    router.push(action.href);
    onClose();
    setQuery("");
  }, [router, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setActiveIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Reset active index on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) handleSelect(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  }, [filtered, activeIndex, handleSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, actions, accounts..."
            className="flex-1 bg-transparent text-slate-100 text-base placeholder:text-slate-500 outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No results for "<span className="text-slate-300">{query}</span>"
            </div>
          ) : (
            <>
              {!query && (
                <div className="px-4 pb-1 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-cyan-600" /> Quick Navigation
                  </span>
                </div>
              )}
              {query && (
                <div className="px-4 pb-1 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <Search className="w-3 h-3" /> Results
                  </span>
                </div>
              )}
              {filtered.map((action, idx) => (
                <button
                  key={action.id}
                  onClick={() => handleSelect(action)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3 text-left transition-colors group",
                    idx === activeIndex 
                      ? "bg-cyan-500/10 border-l-2 border-cyan-500" 
                      : "border-l-2 border-transparent hover:bg-slate-800/50"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    idx === activeIndex 
                      ? "bg-cyan-500/20 text-cyan-400" 
                      : "bg-slate-800 text-slate-400 group-hover:text-slate-200"
                  )}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-100">{action.label}</div>
                    <div className="text-xs text-slate-400 truncate">{action.description}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {action.category === "action" && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/20">
                        Action
                      </span>
                    )}
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-colors",
                      idx === activeIndex ? "text-cyan-400" : "text-slate-600"
                    )} />
                  </div>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[9px]">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[9px]">↵</kbd> Select</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> LomaX Command Palette
          </span>
        </div>
      </div>
    </div>
  );
}
