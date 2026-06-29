"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShieldCheck, Lock, AlertTriangle, KeyRound, RefreshCw,
  Globe, Smartphone, Fingerprint, Zap, ArrowLeft, ChevronRight
} from "lucide-react";

const sections = [
  {
    icon: KeyRound, color: "emerald", glow: "rgba(52,211,153,0.2)",
    title: "Password & Access Security",
    rules: [
      "Use a minimum of 12 characters combining uppercase, lowercase, numbers, and symbols.",
      "Never share your Customer ID, Email, or Password with anyone, including LomaX staff.",
      "Change your password every 90 days or immediately after a suspected breach.",
      "Do not reuse passwords across multiple platforms.",
      "Enable two-factor authentication (2FA) for all login sessions.",
    ],
  },
  {
    icon: Smartphone, color: "cyan", glow: "rgba(34,211,238,0.2)",
    title: "Device & Session Management",
    rules: [
      "Only access LomaX from trusted, personal devices. Avoid public computers.",
      "Always log out after completing your banking session.",
      "Review authorized devices regularly under Security → Devices.",
      "Keep your system software and browser updated to the latest versions.",
      "Lock your device screen when stepping away.",
    ],
  },
  {
    icon: Globe, color: "violet", glow: "rgba(139,92,246,0.2)",
    title: "Network & Connection Safety",
    rules: [
      "Avoid using public Wi-Fi networks for banking. Use mobile data or a VPN.",
      "Verify the URL shows https://lomax.com before entering credentials.",
      "Do not click links in emails claiming to be from LomaX — always type the URL.",
      "Enable firewall and antivirus protection on all banking devices.",
      "Report any suspicious network activity to our 24/7 security line.",
    ],
  },
  {
    icon: AlertTriangle, color: "rose", glow: "rgba(244,63,94,0.2)",
    title: "Fraud Prevention & Phishing",
    rules: [
      "LomaX will NEVER ask for your OTP, PIN, or password via phone, email, or SMS.",
      "Verify all fund transfer requests through official channels before proceeding.",
      "Be alert to unexpected OTPs — report them to fraud hotline immediately.",
      "Check sender email addresses carefully — official LomaX emails end @lomax.com.",
      "If you suspect fraud, freeze your account instantly from the Security Center.",
    ],
  },
  {
    icon: Fingerprint, color: "fuchsia", glow: "rgba(217,70,239,0.2)",
    title: "Biometric & Authentication",
    rules: [
      "Register your biometrics in the LomaX app for faster, more secure access.",
      "Never enroll someone else's biometrics on your account.",
      "If biometrics fail 3 times, the system locks the session automatically.",
      "Biometric data is stored locally on your device and never transmitted.",
      "Review active authentication tokens regularly and revoke unused ones.",
    ],
  },
  {
    icon: RefreshCw, color: "amber", glow: "rgba(251,191,36,0.2)",
    title: "Incident Response",
    rules: [
      "Report lost/stolen cards immediately via the Card Management portal or helpline.",
      "Disputed transactions must be raised within 30 days of the statement date.",
      "For account takeover suspicion, call 1800-LOMAX-FR to initiate emergency freeze.",
      "All security incidents are logged and investigated within 24 business hours.",
      "Keep your registered mobile number and email up-to-date for security alerts.",
    ],
  },
];

const borderMap: Record<string, string> = {
  emerald: "border-emerald-500/30 bg-emerald-950/15",
  cyan: "border-cyan-500/30 bg-cyan-950/15",
  violet: "border-violet-500/30 bg-violet-950/15",
  rose: "border-rose-500/30 bg-rose-950/15",
  fuchsia: "border-fuchsia-500/30 bg-fuchsia-950/15",
  amber: "border-amber-500/30 bg-amber-950/15",
};
const iconMap: Record<string, string> = {
  emerald: "text-emerald-400", cyan: "text-cyan-400", violet: "text-violet-400",
  rose: "text-rose-400", fuchsia: "text-fuchsia-400", amber: "text-amber-400",
};
const dotMap: Record<string, string> = {
  emerald: "bg-emerald-400", cyan: "bg-cyan-400", violet: "bg-violet-400",
  rose: "bg-rose-400", fuchsia: "bg-fuchsia-400", amber: "bg-amber-400",
};

export default function SecurityGuidelinesPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/4 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "6s", animationDelay: "3s" }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(52,211,153,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.8) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800/60 backdrop-blur-xl bg-slate-950/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/login" className="flex items-center gap-3 group">
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              <img src="/lomax-logo.png" alt="LomaX" className="h-8 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">LomaX</span>
            </Link>
            <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5"><Lock className="w-3 h-3 text-cyan-400" /> 256-bit SSL</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-emerald-400" /> ISO 27001</span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-6">
            <ShieldCheck className="w-3.5 h-3.5" /> LomaX Security Guide
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-500 mb-4 drop-shadow-[0_0_50px_rgba(52,211,153,0.4)]">
            Security Guidelines
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Enterprise-grade security guidelines to protect your LomaX Banking account and financial assets.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {[
              { label: "256-bit AES Encryption", icon: Lock, c: "emerald" },
              { label: "Multi-Factor Auth", icon: Fingerprint, c: "cyan" },
              { label: "Real-time Fraud AI", icon: Zap, c: "fuchsia" },
              { label: "Secure Access Architecture", icon: ShieldCheck, c: "violet" },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${borderMap[b.c]} ${iconMap[b.c]}`}>
                  <Icon className="w-3 h-3" />{b.label}
                </div>
              );
            })}
          </div>
        </section>

        {/* Warning Banner */}
        <section className="max-w-7xl mx-auto px-6 pb-8">
          <div className="border border-rose-500/30 bg-rose-950/20 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="font-bold text-rose-300 mb-1">⚠ Official Notice: LomaX Never Asks for Passwords</p>
              <p className="text-sm text-slate-400">
                LomaX will <span className="text-rose-400 font-semibold">never</span> request your OTP, PIN, or password via phone, email, or messaging.
                If you receive such requests, <Link href="/contact" className="text-rose-400 underline hover:text-rose-300 transition-colors">report it immediately</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Accordion Sections */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sections.map((sec, i) => {
              const Icon = sec.icon;
              const isOpen = openIdx === i;
              return (
                <div
                  key={i}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${borderMap[sec.color]}`}
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                >
                  <div className="p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${borderMap[sec.color]}`}>
                        <Icon className={`w-5 h-5 ${iconMap[sec.color]}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-200">{sec.title}</h3>
                        <p className="text-slate-500 text-xs mt-0.5">{sec.rules.length} guidelines</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
                  </div>
                  {isOpen && (
                    <div className="px-6 pb-6 space-y-3 border-t border-slate-800/40 pt-4">
                      {sec.rules.map((rule, ri) => (
                        <div key={ri} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${dotMap[sec.color]}`} />
                          <p className="text-sm text-slate-400">{rule}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="border border-slate-800/60 bg-slate-900/30 rounded-2xl p-8">
            <h3 className="text-center font-bold text-slate-200 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Back to Login", href: "/login", icon: ArrowLeft, c: "emerald" },
                { label: "Report Fraud", href: "/contact", icon: AlertTriangle, c: "rose" },
                { label: "Customer Support", href: "/contact", icon: ShieldCheck, c: "cyan" },
              ].map((a, i) => {
                const Icon = a.icon;
                return (
                  <Link key={i} href={a.href} className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition-all hover:scale-105 ${borderMap[a.c]}`}>
                    <Icon className={`w-5 h-5 ${iconMap[a.c]}`} />
                    <span className={`text-xs font-medium text-center ${iconMap[a.c]}`}>{a.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-800/60 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-sm">© 2025 LomaX Enterprise Banking — Security & Compliance Department</p>
            <div className="flex items-center gap-4 text-xs font-mono">
              <Link href="/login" className="text-slate-500 hover:text-emerald-400 transition-colors">← Back to Login</Link>
              <Link href="/contact" className="text-slate-500 hover:text-emerald-400 transition-colors">Customer Support</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
