'use client';
import { Users, Briefcase, UserCircle, ArrowRightLeft } from 'lucide-react';

export default function FamilyBizPanel() {
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">Family & Biz</h2>
          <p className="text-xs text-[#9ca3af]">Multi-Entity Management Network</p>
        </div>
      </div>

      <div className="relative flex-1 rounded-xl border border-white/5 bg-black/40 p-8 flex items-center justify-center overflow-hidden">
        {/* Decorative background grid */}
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />

        {/* Central Node (User) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="w-20 h-20 rounded-full bg-[#00e5ff]/20 border-2 border-[#00e5ff] shadow-[0_0_30px_#00e5ff40] flex items-center justify-center animate-pulse-glow">
            <UserCircle className="w-8 h-8 text-[#00e5ff]" />
          </div>
          <span className="mt-2 text-sm font-bold text-white bg-black/50 px-3 py-1 rounded-full">Personal Context</span>
          <span className="text-[10px] text-[#00e5ff]">Active</span>
        </div>

        {/* Top Node (Family) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-pink-500/20 border border-pink-500 flex items-center justify-center">
            <Users className="w-6 h-6 text-pink-500" />
          </div>
          <span className="mt-2 text-xs font-bold text-white">Joint Family Vault</span>
          <button className="mt-1 flex items-center gap-1 text-[10px] text-pink-500 hover:text-white transition-colors">
            <ArrowRightLeft className="w-3 h-3" /> Switch Context
          </button>
        </div>
        {/* Connecting Line */}
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-0.5 h-[15%] bg-gradient-to-b from-pink-500/50 to-[#00e5ff]/50" />

        {/* Bottom Node (Business) */}
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
          <button className="mb-1 flex items-center gap-1 text-[10px] text-yellow-500 hover:text-white transition-colors">
            <ArrowRightLeft className="w-3 h-3" /> Switch Context
          </button>
          <div className="w-14 h-14 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-yellow-500" />
          </div>
          <span className="mt-2 text-xs font-bold text-white">Startup LLC</span>
        </div>
        {/* Connecting Line */}
        <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2 w-0.5 h-[15%] bg-gradient-to-t from-yellow-500/50 to-[#00e5ff]/50" />

      </div>
    </div>
  );
}
