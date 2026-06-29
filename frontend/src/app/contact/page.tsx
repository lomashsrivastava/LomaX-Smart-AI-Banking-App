"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone, Mail, MapPin, Clock, MessageSquare, Send, ChevronRight,
  Headphones, Wifi, ShieldCheck, AlertTriangle, ArrowLeft, CheckCircle2
} from "lucide-react";

const supportChannels = [
  {
    icon: Phone,
    title: "Phone Support",
    value: "1800-LOMAX-00",
    sub: "Toll-free · 24/7 Available",
    color: "emerald",
    glow: "rgba(52,211,153,0.3)",
  },
  {
    icon: Mail,
    title: "Email Support",
    value: "support@lomax.com",
    sub: "Response within 2 hours",
    color: "cyan",
    glow: "rgba(34,211,238,0.3)",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    value: "Chat with an Agent",
    sub: "Avg. wait time: 3 mins",
    color: "fuchsia",
    glow: "rgba(217,70,239,0.3)",
  },
  {
    icon: MapPin,
    title: "Visit a Branch",
    value: "725 Branches Nationwide",
    sub: "Find your nearest node",
    color: "violet",
    glow: "rgba(139,92,246,0.3)",
  },
];

const faqs = [
  { q: "How do I reset my Network ID password?", a: "Call 1800-LOMAX-00 or visit your nearest branch with a valid government ID. You will receive an OTP on your registered mobile number." },
  { q: "My account is locked. What do I do?", a: "After 5 failed attempts, accounts are temporarily suspended. Please wait 30 minutes or contact our 24/7 phone support to unlock immediately." },
  { q: "How do I report an unauthorized transaction?", a: "Immediately call our fraud hotline at 1800-LOMAX-FR. Your card will be blocked instantly and an investigation will be initiated within 24 hours." },
  { q: "How do I apply for a new account?", a: "You can visit any of our 725 branches nationwide with your KYC documents. The process takes approximately 30 minutes and your account will be activated same day." },
  { q: "What are the transaction limits?", a: "Standard accounts: ₹2,00,000/day for UPI & NEFT. Premium accounts: ₹10,00,000/day. Limits can be modified from your account settings after login." },
];

const categories = [
  { icon: Wifi, label: "Network Issues", color: "cyan" },
  { icon: ShieldCheck, label: "Security", color: "emerald" },
  { icon: AlertTriangle, label: "Fraud Alert", color: "rose" },
  { icon: Headphones, label: "General Support", color: "violet" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", id: "", email: "", category: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call - could integrate with /api/tickets
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "8s", animationDelay: "2s" }} />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-fuchsia-500/4 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "7s", animationDelay: "1s" }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.8) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800/60 backdrop-blur-xl bg-slate-950/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/login" className="flex items-center gap-3 group">
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                <img src="/lomax-logo.png" alt="LomaX" className="h-8 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  LomaX
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              NETWORK SUPPORT ACTIVE
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-6">
            <Headphones className="w-3.5 h-3.5" />
            24/7 Network Support Portal
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-500 mb-4 drop-shadow-[0_0_40px_rgba(34,211,238,0.4)]">
            Network Support
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Connect with the LomaX support grid. Our AI-powered agents and human specialists are ready to resolve any issue across our banking network.
          </p>
        </section>

        {/* Support Channels */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportChannels.map((ch, i) => {
              const Icon = ch.icon;
              return (
                <div key={i} className="group relative border border-slate-800/80 bg-slate-900/40 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    style={{ background: ch.glow }} />
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border`}
                    style={{ background: `${ch.glow.replace("0.3", "0.1")}`, borderColor: ch.glow.replace("0.3", "0.3") }}>
                    <Icon className="w-5 h-5" style={{ color: ch.glow.replace(/rgba\((\d+),(\d+),(\d+).*/, `rgb($1,$2,$3)`) }} />
                  </div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{ch.title}</p>
                  <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{ch.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{ch.sub}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: Contact Form */}
          <div className="lg:col-span-3">
            <div className="border border-slate-800/80 bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800/60">
                <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                  <Send className="w-5 h-5 text-cyan-400" />
                  Submit a Support Request
                </h2>
                <p className="text-slate-500 text-sm mt-1">Our team will respond within 2 hours</p>
              </div>

              {submitted ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">Request Submitted!</h3>
                  <p className="text-slate-400 text-sm mb-1">Your ticket has been logged in our system.</p>
                  <p className="text-slate-500 text-xs font-mono">Reference: TKT-{Math.floor(1000000 + Math.random() * 9000000)}</p>
                  <p className="text-slate-500 text-sm mt-4">Expected response: <span className="text-emerald-400">within 2 hours</span></p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", id: "", email: "", category: "", message: "" }); }}
                    className="mt-6 px-6 py-2 rounded-xl border border-cyan-500/30 text-cyan-400 text-sm hover:bg-cyan-500/10 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Category selector */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Support Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = form.category === cat.label;
                        return (
                          <button
                            key={cat.label}
                            type="button"
                            onClick={() => setForm({ ...form, category: cat.label })}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all duration-200 ${
                              isActive
                                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                                : "border-slate-800 bg-slate-900/40 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Full Name</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your registered name"
                        required
                        className="w-full h-11 px-4 rounded-xl bg-slate-950/60 border border-slate-700/60 text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Network ID / Account</label>
                      <input
                        value={form.id}
                        onChange={(e) => setForm({ ...form, id: e.target.value })}
                        placeholder="e.g. CUST100001"
                        className="w-full h-11 px-4 rounded-xl bg-slate-950/60 border border-slate-700/60 text-slate-200 placeholder:text-slate-600 text-sm font-mono focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className="w-full h-11 px-4 rounded-xl bg-slate-950/60 border border-slate-700/60 text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Describe your issue</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Please describe your issue in detail..."
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700/60 text-slate-200 placeholder:text-slate-600 text-sm resize-none focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold tracking-widest text-sm uppercase shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Submit Request</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: FAQ + Hours */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Hours */}
            <div className="border border-slate-800/80 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6">
              <h3 className="font-bold text-slate-200 flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-emerald-400" /> Support Hours
              </h3>
              <div className="space-y-3">
                {[
                  { day: "Phone & Chat", hours: "24 / 7 / 365", status: "Always On", color: "emerald" },
                  { day: "Email Support", hours: "24 hrs response", status: "Active", color: "cyan" },
                  { day: "Branch Services", hours: "Mon–Fri · 9AM–6PM", status: "Weekdays", color: "violet" },
                  { day: "Emergency Fraud", hours: "24 / 7 Hotline", status: "Always On", color: "rose" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-slate-300 font-medium">{s.day}</p>
                      <p className="text-slate-500 text-xs">{s.hours}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      s.color === "emerald" ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" :
                      s.color === "cyan" ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-400" :
                      s.color === "rose" ? "bg-rose-950/40 border-rose-500/30 text-rose-400" :
                      "bg-violet-950/40 border-violet-500/30 text-violet-400"
                    }`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="border border-slate-800/80 bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-800/60">
                <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Frequently Asked Questions</h3>
              </div>
              <div className="divide-y divide-slate-800/50">
                {faqs.map((faq, i) => (
                  <div key={i} className="group">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-start justify-between p-4 text-left hover:bg-slate-800/30 transition-colors"
                    >
                      <span className="text-sm text-slate-300 font-medium pr-4 group-hover:text-slate-200 transition-colors">{faq.q}</span>
                      <ChevronRight className={`w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5 transition-transform duration-200 ${openFaq === i ? "rotate-90 text-cyan-400" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800/60 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-sm">© 2025 LomaX Enterprise Banking. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs font-mono">
              <Link href="/login" className="text-slate-500 hover:text-cyan-400 transition-colors">← Back to Login</Link>
              <Link href="/security" className="text-slate-500 hover:text-cyan-400 transition-colors">Security Guidelines</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
