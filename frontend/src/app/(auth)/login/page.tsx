"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark, Loader2 } from "lucide-react";
import Link from "next/link";
import { LoginValues, loginSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/use-auth-store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<'customer' | 'admin' | 'employee'>('customer');
  
  // 2FA states
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loginCustomerId, setLoginCustomerId] = useState("");

  // Demo Popup State
  const [showDemoPopup, setShowDemoPopup] = useState(true);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!showDemoPopup) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowDemoPopup(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showDemoPopup]);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      customerId: "CUST100001",
      password: "100001TSUC", // Pre-populated reversed customer ID password
    },
  });

  const handleRoleChange = (role: 'customer' | 'admin' | 'employee') => {
    setActiveRole(role);
    if (role === 'customer') {
      form.setValue('customerId', 'CUST100001');
      form.setValue('password', '100001TSUC');
    } else if (role === 'admin') {
      form.setValue('customerId', 'admin@lomax.com');
      form.setValue('password', '123456789');
    } else {
      form.setValue('customerId', 'EMP100001');
      form.setValue('password', '123456789');
    }
  };

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    setOtpError("");
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (result.twoFactorRequired) {
          setTwoFactorRequired(true);
          setLoginCustomerId(result.customerId || data.customerId);
        } else {
          setAuth(result.user, result.token);
          if (result.user.role === 'admin') {
            router.push("/dashboard");
          } else {
            router.push("/customer/dashboard");
          }
        }
      } else {
        form.setError("password", { message: result.message || "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login failed:", error);
      form.setError("password", { message: "Server connection failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setOtpError("Verification code is required");
      return;
    }

    setIsLoading(true);
    setOtpError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: loginCustomerId, code: otpCode })
      });
      
      const result = await response.json();

      if (result.success) {
        setAuth(result.user, result.token);
        if (result.user.role === 'admin') {
          router.push("/dashboard");
        } else {
          router.push("/customer/dashboard");
        }
      } else {
        setOtpError(result.message || "Invalid or expired code");
      }
    } catch (error) {
      console.error("2FA Verification failed:", error);
      setOtpError("Server connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center lg:justify-between overflow-hidden bg-slate-950">
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110px); opacity: 0; }
        }
      `}</style>
      
      {/* Full-screen Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/lomax-bg.png" 
          alt="LomaX Core Banking" 
          className="w-full h-full object-fill"
        />
        {/* Dark gradient overlay that gets darker towards the right where the form is */}
        <div className="absolute inset-0 bg-slate-950/40 lg:bg-gradient-to-r lg:from-slate-950/10 lg:via-slate-950/40 lg:to-slate-950/95" />
      </div>

      {/* Left Side: Advanced Cybernetic AI Core (Desktop Only) */}
      <div className={`hidden ${showDemoPopup ? 'xl:flex' : 'lg:flex'} flex-col relative z-10 w-full max-w-2xl pl-12 xl:pl-32 group`}>
        
        {/* Complex Multi-Layer Reactor Core */}
        <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
          
          {/* Outer Energy Field */}
          <div className="absolute inset-[-20px] rounded-full bg-cyan-500/5 blur-[40px] animate-pulse" style={{ animationDuration: '4s' }}></div>
          
          {/* Orbital Ring 1 (Slow Spin Clockwise) */}
          <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-cyan-500/40 animate-[spin_10s_linear_infinite]"></div>
          
          {/* Orbital Ring 2 (Fast Spin Counter-Clockwise, Dashed) */}
          <div className="absolute inset-2 rounded-full border-r-2 border-b-2 border-dashed border-emerald-400/60 animate-[spin_6s_linear_infinite_reverse]"></div>
          
          {/* Orbital Ring 3 (Inner Ring, Pulsing) */}
          <div className="absolute inset-6 rounded-full border border-fuchsia-500/50 animate-ping" style={{ animationDuration: '3s' }}></div>
          
          {/* Orbital Ring 4 (Hexagonal / Polygon outline emulation) */}
          <div className="absolute inset-8 border border-blue-400/40 rotate-45 animate-[spin_15s_linear_infinite]"></div>
          <div className="absolute inset-8 border border-cyan-400/40 rotate-12 animate-[spin_15s_linear_infinite_reverse]"></div>

          {/* Central Glassmorphic AI Processor */}
          <div className="absolute inset-10 bg-gradient-to-br from-cyan-950/80 to-emerald-950/80 backdrop-blur-xl rounded-full border border-cyan-400/60 flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.4)] overflow-hidden">
            
            {/* Scanning Laser Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-300 shadow-[0_0_15px_#22d3ee] z-20" style={{ animation: 'scan 2.5s ease-in-out infinite alternate' }}></div>
            
            {/* Core Chip */}
            <div className="w-12 h-12 rounded-sm bg-cyan-500/20 rotate-45 border border-emerald-400 shadow-[inset_0_0_20px_rgba(52,211,153,0.8)] flex items-center justify-center animate-pulse z-10">
               <div className="w-4 h-4 bg-white rounded-full blur-[2px] animate-ping" style={{ animationDuration: '2s' }}></div>
            </div>
            
            {/* Background Grid inside processor */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay z-0"></div>
          </div>
          
          {/* Data Nodes & Connectors protruding outwards */}
          <div className="absolute top-1/2 -right-16 w-16 h-[1px] bg-cyan-500/60"></div>
          <div className="absolute top-1/2 -right-16 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] -translate-y-1/2 animate-ping" style={{ animationDuration: '1.5s' }}></div>

          <div className="absolute -bottom-16 left-1/2 w-[1px] h-16 bg-emerald-500/60"></div>
          <div className="absolute -bottom-16 left-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] -translate-x-1/2 animate-ping" style={{ animationDelay: '1s', animationDuration: '1.5s' }}></div>
          
          <div className="absolute top-1/2 -left-12 w-12 h-[1px] bg-blue-500/60"></div>
          <div className="absolute top-1/2 -left-12 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_#3b82f6] -translate-y-1/2 animate-ping" style={{ animationDelay: '0.5s', animationDuration: '1.5s' }}></div>
        </div>

        {/* Holographic Text Container */}
        <div className="relative">
          {/* Glitch Shadow Effect Behind Text */}
          <h1 className="absolute -inset-1 text-7xl xl:text-[9rem] font-black tracking-tighter leading-none text-cyan-500/30 blur-md translate-x-2 translate-y-2 animate-pulse" style={{ animationDuration: '3s' }}>
            LomaX
          </h1>
          
          {/* Main Text */}
          <h1 className="relative text-7xl xl:text-[9rem] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-500 drop-shadow-[0_0_50px_rgba(34,211,238,0.7)] animate-pulse" style={{ animationDuration: '4s' }}>
            LomaX
          </h1>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-[2px] w-16 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.9)] animate-pulse"></div>
          <p className="text-cyan-300 font-mono tracking-[0.2em] uppercase text-xl xl:text-2xl font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] whitespace-nowrap">
            Digital Banking Portal
          </p>
        </div>
      </div>

      <div className={`z-10 transition-all duration-500 flex flex-col items-center justify-center shrink-0 w-full ${showDemoPopup ? 'max-w-4xl lg:mr-[4%] xl:mr-[6%]' : 'max-w-md lg:mr-[8%] xl:mr-[12%]'}`}>
        <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full group-hover:bg-cyan-400/40 transition-colors duration-500"></div>
            <img 
              src="/lomax-logo.png" 
              alt="LomaX" 
              className="h-20 w-auto mb-2 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] mt-4">
            LomaX | Digital Banking
          </h1>
          <p className="text-cyan-100/70 mt-2 font-medium tracking-wide">
            Securely access your banking account.
          </p>
        </div>

        <div className={`w-full flex flex-col ${showDemoPopup ? 'md:flex-row items-stretch' : 'items-center'} justify-center gap-6`}>
          {/* Demo Credentials Console Card (shows on the left) */}
          {showDemoPopup && (
            <div className="w-full md:w-[400px] flex-1 relative group animate-in fade-in slide-in-from-left-10 duration-500 flex flex-col">
              {/* Ambient Glow behind the card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-emerald-500/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              
              <div className="h-full bg-slate-950/85 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.15)] overflow-hidden p-5 relative z-10 flex flex-col justify-between">
                {/* Cyber scanline */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-20 opacity-30 animate-pulse"></div>
                
                {/* Glowing corner brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3 border-b border-cyan-500/20 pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                      <h2 className="text-sm font-bold font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                        DEMO PORTAL CONSOLE
                      </h2>
                    </div>
                    <button 
                      onClick={() => setShowDemoPopup(false)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-500/20"
                      aria-label="Close popup"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Timer banner */}
                  <div className="flex items-center justify-between px-2.5 py-1.5 mb-3 bg-cyan-950/40 border border-cyan-500/20 rounded-lg text-[10px] font-mono text-cyan-300">
                    <span className="tracking-wider">TERMINAL AUTO-DISCONNECT IN:</span>
                    <span className="text-emerald-400 font-bold tracking-widest text-xs">
                      00:{String(countdown).padStart(2, '0')}
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] mb-3 leading-snug">
                    Select a simulation profile below to auto-fill credentials and access the LomaX Smart Banking Platform.
                  </p>

                  {/* Grid of Simulation Profiles */}
                  <div className="space-y-2.5">
                    {[
                      {
                        role: 'customer' as const,
                        title: 'Demo Customer Profile',
                        desc: 'Retail banking dashboard, statements, and transfers.',
                        user: 'CUST100001',
                        pass: '100001TSUC',
                        color: 'cyan'
                      },
                      {
                        role: 'admin' as const,
                        title: 'Demo Admin Console',
                        desc: 'System configurations and full audit registries.',
                        user: 'admin@lomax.com',
                        pass: '123456789',
                        color: 'emerald'
                      },
                      {
                        role: 'employee' as const,
                        title: 'Demo Employee Console',
                        desc: 'Cashier portal, ledger controls, and approvals.',
                        user: 'EMP100001',
                        pass: '123456789',
                        color: 'fuchsia'
                      }
                    ].map((profile) => (
                      <div 
                        key={profile.role}
                        className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between hover:border-cyan-500/30 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="text-xs font-bold text-slate-200 font-mono">{profile.title}</h3>
                            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{profile.desc}</p>
                          </div>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                            profile.role === 'customer' 
                              ? 'text-cyan-400 bg-cyan-950/40 border-cyan-500/20' 
                              : profile.role === 'admin'
                              ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20'
                              : 'text-fuchsia-400 bg-fuchsia-950/40 border-fuchsia-500/20'
                          }`}>
                            {profile.role.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-900">
                          <div className="font-mono text-[10px] text-slate-400 space-y-0.5">
                            <div><span className="text-slate-600">ID:</span> <code className="text-slate-300 font-bold">{profile.user}</code></div>
                            <div><span className="text-slate-600">PW:</span> <code className="text-slate-300 font-bold">{profile.pass}</code></div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              handleRoleChange(profile.role);
                              // Programmatically trigger login submit
                              setTimeout(() => {
                                form.handleSubmit(onSubmit)();
                              }, 150);
                            }}
                            className="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 hover:text-white border border-cyan-500/30 rounded text-[10px] font-mono font-bold tracking-wider transition-all duration-300"
                          >
                            SIMULATE LOGIN
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 text-center border-t border-cyan-500/10 pt-2">
                  <span className="text-[9px] font-mono text-slate-600 tracking-wider">
                    LOMAX QUANTUM SECURE PROTOCOL // SEC-9008
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main Login Card */}
          <div className="w-full md:w-[400px] flex-1 relative group animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both flex flex-col">
            {/* Ambient Glow behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-emerald-500/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            
            <div className="h-full bg-slate-950/60 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.15)] overflow-hidden p-8 relative z-10 flex flex-col justify-between">
              <div>
                {/* Quick Login Role Selector Switch */}
                <div className="flex justify-between items-center bg-slate-900/60 rounded-lg p-1 border border-cyan-500/20 mb-6">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('customer')}
                    className={`flex-1 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all duration-300 ${
                      activeRole === 'customer'
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className={`flex-1 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all duration-300 ${
                      activeRole === 'admin'
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('employee')}
                    className={`flex-1 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all duration-300 ${
                      activeRole === 'employee'
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Staff
                  </button>
                </div>

                {!twoFactorRequired ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      
                      <FormField control={form.control} name="customerId" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 font-medium tracking-wide">Customer ID / Email</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. CUST100001 or admin@lomax.com" className="h-12 bg-slate-900/50 border-cyan-500/30 text-cyan-200 placeholder:text-slate-600 focus-visible:border-cyan-400 focus-visible:ring-cyan-400/20 font-mono tracking-wider" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-slate-300 font-medium tracking-wide">Password</FormLabel>
                            <Link href="/forgot-password" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">
                              Forgot Access?
                            </Link>
                          </div>
                          <FormControl>
                            <Input type="password" placeholder="•••••••••••••••" className="h-12 bg-slate-900/50 border-cyan-500/30 text-emerald-400 font-mono tracking-widest placeholder:text-slate-600 focus-visible:border-cyan-400 focus-visible:ring-cyan-400/20" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )} />

                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold tracking-widest text-lg shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(52,211,153,0.6)] border-none transition-all duration-300 uppercase"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center font-mono">
                            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                            LOGGING IN...
                          </div>
                        ) : (
                          "Log In"
                        )}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <form onSubmit={onVerifyOTP} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-slate-300 font-semibold tracking-wide block">Two-Factor Authentication OTP</label>
                      <p className="text-xs text-slate-400">
                        A verification code has been sent to your registered email address. Please enter the code below.
                      </p>
                      <Input 
                        type="text" 
                        placeholder="Enter 6-digit OTP or Backup Code" 
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="h-12 bg-slate-900/50 border-cyan-500/30 text-cyan-200 placeholder:text-slate-600 focus-visible:border-cyan-400 focus-visible:ring-cyan-400/20 font-mono text-center tracking-widest text-lg"
                      />
                      {otpError && <p className="text-rose-400 text-xs mt-1 font-semibold">{otpError}</p>}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold tracking-widest text-lg shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(52,211,153,0.6)] border-none transition-all duration-300 uppercase"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center font-mono">
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          VERIFYING CODE...
                        </div>
                      ) : (
                        "Verify & Access"
                      )}
                    </Button>

                    <div className="text-center">
                      <button 
                        type="button"
                        onClick={() => {
                          setTwoFactorRequired(false);
                          setOtpCode("");
                          setOtpError("");
                        }}
                        className="text-xs font-semibold text-sky-400 hover:text-sky-300"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="mt-8 text-center text-sm">
                <p className="text-slate-400">New to LomaX Bank? Visit your nearest branch to open an account.</p>
                <div className="mt-5 flex items-center justify-center space-x-4 font-mono text-xs font-semibold tracking-widest">
                  <Link href="/security-guidelines" className="text-cyan-500/70 hover:text-cyan-400 transition-colors">SAFETY GUIDELINES</Link>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <button 
                    type="button" 
                    onClick={() => { setShowDemoPopup(true); setCountdown(60); }} 
                    className="text-cyan-500/70 hover:text-cyan-400 transition-colors uppercase tracking-widest font-mono"
                  >
                    DEMO PORTAL
                  </button>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <Link href="/contact" className="text-cyan-500/70 hover:text-cyan-400 transition-colors">CUSTOMER SUPPORT</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
