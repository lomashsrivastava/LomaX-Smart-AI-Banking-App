"use client";

import { useState, useEffect, useCallback } from "react";
import { CustomerSidebar } from "@/components/layout/customer-sidebar";
import { GlobalSearch } from "@/components/global-search";
import { Search } from "lucide-react";

export function CustomerShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global keyboard shortcut: Ctrl+K / Cmd+K
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="flex h-screen w-full bg-transparent overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-72 h-full flex-shrink-0 z-50 shadow-2xl">
          <CustomerSidebar onSearchOpen={() => setSearchOpen(true)} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 min-w-0 h-full relative">
          {/* Top bar with search trigger on mobile */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur shrink-0">
            <span className="font-bold text-cyan-400 text-lg tracking-wide">LomaX</span>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg hover:border-cyan-500/30 hover:text-slate-200 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
              <kbd className="text-[9px] font-mono bg-slate-800 px-1 rounded">⌘K</kbd>
            </button>
          </div>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative z-10 w-full">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
