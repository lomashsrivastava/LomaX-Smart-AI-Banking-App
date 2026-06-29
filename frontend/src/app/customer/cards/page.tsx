"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { CreditCard, Power, Lock, Settings2, Eye, EyeOff, Info, ShieldCheck, Zap } from "lucide-react";

export default function CustomerCardsPage() {
  const [showCvv, setShowCvv] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [intlUsage, setIntlUsage] = useState(false);
  const [dailyLimit, setDailyLimit] = useState([50000]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            Card Management
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Control your debit and credit cards securely from anywhere.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all hover:scale-105">
          <CreditCard className="w-4 h-4 mr-2" />
          Apply New Card
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pt-4">
        
        {/* Virtual Card Representation */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-[1.586/1] rounded-3xl p-6 flex flex-col justify-between text-white shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-[1.02] overflow-hidden border border-white/10" 
               style={{
                 background: isFrozen ? 'linear-gradient(135deg, #1e293b, #0f172a)' : 'linear-gradient(135deg, #0284c7, #1e1b4b)',
                 opacity: isFrozen ? 0.95 : 1
               }}>
            
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />
            
            <div className="flex justify-between items-start z-10">
              <div className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-200">LomaX</div>
              <span className="flex items-center gap-1 bg-cyan-950/60 border border-cyan-400/30 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold">
                <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse"></span> ACTIVE
              </span>
            </div>
            
            <div className="z-10 mt-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-7 rounded bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center border border-amber-200/50 shadow-md">
                  <div className="w-6 h-4 border border-amber-600/30 rounded-sm" />
                </div>
                <div className="w-4 h-5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300/80 rotate-90 w-4 h-4">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="z-10 mt-4 space-y-4">
              <div className="font-mono text-xl tracking-widest flex justify-between px-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-bold text-slate-100">
                <span>4512</span>
                <span>8901</span>
                <span>••••</span>
                <span>3421</span>
              </div>
              
              <div className="flex justify-between items-end px-1">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-0.5 font-bold">Card Holder</p>
                  <p className="font-bold tracking-wide uppercase drop-shadow-sm text-sm text-slate-200">Rahul Sharma</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-0.5 font-bold">Valid Thru</p>
                  <p className="font-bold tracking-wider drop-shadow-sm text-sm text-slate-200">12/28</p>
                </div>
                
                {/* CVV Display */}
                <div className="bg-white/10 border border-white/10 px-2.5 py-1 rounded-xl backdrop-blur-md flex items-center cursor-pointer transition-colors hover:bg-white/20" onClick={() => setShowCvv(!showCvv)}>
                  <span className="font-mono text-xs mr-2 font-bold text-cyan-300">{showCvv ? "452" : "•••"}</span>
                  {showCvv ? <EyeOff className="w-3.5 h-3.5 text-cyan-300" /> : <Eye className="w-3.5 h-3.5 text-cyan-300" />}
                </div>
              </div>
            </div>
            
            {isFrozen && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-red-500/30 flex items-center justify-center mb-3 animate-bounce">
                  <Lock className="w-6 h-6 text-red-400" />
                </div>
                <p className="font-black tracking-wider text-base text-red-400 uppercase">Card Frozen</p>
                <p className="text-xs text-slate-400 mt-1">Unfreeze to unlock card status</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 flex gap-4">
            <Button 
              variant={isFrozen ? "default" : "destructive"} 
              className={`font-bold transition-all hover:scale-105 ${
                isFrozen 
                  ? "bg-cyan-500 hover:bg-cyan-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                  : "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              }`}
              onClick={() => setIsFrozen(!isFrozen)}
            >
              <Power className="w-4 h-4 mr-2" />
              {isFrozen ? "Unfreeze Card" : "Freeze Card"}
            </Button>
            <Button variant="outline" className="border-slate-800 bg-slate-900/60 hover:bg-slate-850/80 text-slate-200">
              <Settings2 className="w-4 h-4 mr-2" />
              Card Details
            </Button>
          </div>
        </div>

        {/* Card Controls */}
        <div className="space-y-6">
          <Card className="border-slate-900 bg-slate-950/50 rounded-3xl backdrop-blur-md overflow-hidden relative p-6">
            <CardContent className="p-0 space-y-8">
              
              <div>
                <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" /> Security Settings
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                    <div>
                      <p className="font-bold text-slate-200 text-sm">Online Transactions</p>
                      <p className="text-xs text-slate-500 mt-0.5">Enable for e-commerce and online payments</p>
                    </div>
                    <Switch defaultChecked disabled={isFrozen} />
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                    <div>
                      <p className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                        International Usage
                        {intlUsage && <span className="bg-indigo-950 text-indigo-400 border border-indigo-900/50 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">ACTIVE</span>}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Allow payments in foreign currencies</p>
                    </div>
                    <Switch checked={intlUsage} onCheckedChange={setIntlUsage} disabled={isFrozen} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-200 text-sm">Contactless (NFC)</p>
                      <p className="text-xs text-slate-500 mt-0.5">Tap to pay at retail stores</p>
                    </div>
                    <Switch defaultChecked disabled={isFrozen} />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-900">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-400" /> Daily Transaction Limit
                  </h3>
                  <span className="font-mono font-black text-cyan-400 text-lg bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-xl">
                    ₹{(dailyLimit?.[0] ?? 50000).toLocaleString('en-IN')}
                  </span>
                </div>
                
                <Slider 
                  value={dailyLimit} 
                  onValueChange={(val) => setDailyLimit(val as number[])} 
                  max={200000} 
                  step={5000}
                  disabled={isFrozen}
                  className="mb-2 cursor-pointer"
                />
                
                <div className="flex justify-between text-[10px] text-slate-550 font-mono mt-2 font-bold">
                  <span>₹0</span>
                  <span>₹2,00,000</span>
                </div>
              </div>

              {isFrozen && (
                <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl flex items-start">
                  <Info className="w-5 h-5 text-slate-500 mr-3 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your card is currently frozen. All security settings and limits are temporarily locked until you unfreeze the card.
                  </p>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
