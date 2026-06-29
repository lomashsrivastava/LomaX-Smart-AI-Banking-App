"use client";

import { useState } from "react";
import { 
  ShieldCheck, ShieldAlert, KeyRound, Smartphone, Activity, 
  Terminal, Lock, Eye, EyeOff, Save, CheckCircle2, Copy, Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginSession {
  id: string;
  device: string;
  ip: string;
  location: string;
  activeSince: string;
  isCurrent: boolean;
}

export default function SecuritySettingsPage() {
  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // 2FA TOTP state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [totpCode, setTotpCode] = useState("");

  // Threat shield settings
  const [automatedThreatDetection, setAutomatedThreatDetection] = useState(true);
  const [auditLogEncryption, setAuditLogEncryption] = useState(true);
  const [rateLimit, setRateLimit] = useState("60");

  // Active Sessions state
  const [sessions, setSessions] = useState<LoginSession[]>([
    { id: "SESS-A", device: "Chrome 122 (Windows 11)", ip: "192.168.1.104", location: "Mumbai, IN", activeSince: "Just now", isCurrent: true },
    { id: "SESS-B", device: "Safari (iPhone 15 Pro)", ip: "103.44.22.1", location: "Bangalore, IN", activeSince: "5 hours ago", isCurrent: false },
    { id: "SESS-C", device: "Firefox (Ubuntu Dev)", ip: "45.12.89.2", location: "Delhi, IN", activeSince: "2 days ago", isCurrent: false },
  ]);

  // HSM keys
  const [hsmApiKey, setHsmApiKey] = useState("LMX-PUB-K832A9103D-SHIELD-X9");
  const [keyCopied, setKeyCopied] = useState(false);

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!newPassword) return { percent: 0, label: "Empty", color: "bg-slate-800" };
    let score = 0;
    if (newPassword.length >= 8) score += 25;
    if (/[A-Z]/.test(newPassword)) score += 25;
    if (/[0-9]/.test(newPassword)) score += 25;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 25;

    if (score <= 25) return { percent: 25, label: "Weak", color: "bg-rose-500" };
    if (score <= 50) return { percent: 50, label: "Fair", color: "bg-amber-500" };
    if (score <= 75) return { percent: 75, label: "Good", color: "bg-indigo-500" };
    return { percent: 100, label: "Strong & Secured", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    setUpdatingPassword(true);
    setTimeout(() => {
      setUpdatingPassword(false);
      alert("Platform security password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1200);
  };

  const handleTerminateSession = (id: string) => {
    if (!window.confirm("Are you sure you want to terminate this active login session?")) return;
    setSessions(sessions.filter(s => s.id !== id));
  };

  const handleToggle2fa = () => {
    if (twoFactorEnabled) {
      if (window.confirm("Are you sure you want to disable 2FA? This lowers account security.")) {
        setTwoFactorEnabled(false);
        setShowQrCode(false);
      }
    } else {
      setShowQrCode(true);
    }
  };

  const handleVerifyTotp = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length === 6) {
      setTwoFactorEnabled(true);
      setShowQrCode(false);
      setTotpCode("");
      alert("TOTP Multi-Factor Authentication successfully linked and enabled.");
    } else {
      alert("Please enter a valid 6-digit TOTP verification code.");
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(hsmApiKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(20,184,166,0.3)] flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-teal-400 animate-pulse" /> Security Controls
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Configure cryptographic API keys, password rotations, and active session monitoring.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Password & 2FA controls (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Password Rotation card */}
          <div className="border border-slate-800 bg-slate-900/40 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-teal-400" /> Administrative Password Rotation
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4 pt-4 font-mono text-xs">
              {/* Current password */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">CURRENT SECURITY KEY</label>
                <div className="relative">
                  <Input 
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="bg-slate-950/65 border-slate-700 text-slate-200 pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">NEW SECURITY KEY</label>
                <div className="relative">
                  <Input 
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter at least 8 characters"
                    className="bg-slate-950/65 border-slate-700 text-slate-200 pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Strength meter */}
                {newPassword && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>STRENGTH: <span className="font-bold text-slate-300">{strength.label}</span></span>
                    </div>
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-350 ${strength.color}`} style={{ width: `${strength.percent}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">CONFIRM NEW KEY</label>
                <div className="relative">
                  <Input 
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-type new password"
                    className="bg-slate-950/65 border-slate-700 text-slate-200 pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updatingPassword}
                  className="bg-teal-650 hover:bg-teal-555 text-white gap-2 font-bold shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                >
                  <Save className="w-4 h-4" /> {updatingPassword ? "Rotating keys..." : "Apply Security Rotation"}
                </Button>
              </div>
            </form>
          </div>

          {/* 2FA TOTP Card */}
          <div className="border border-slate-800 bg-slate-900/40 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-teal-400" /> Multi-Factor Authentication (2FA)
            </h3>

            <div className="space-y-4 pt-4 font-mono text-xs">
              <div className="flex justify-between items-center bg-slate-950/50 p-4 rounded-xl border border-slate-850">
                <div className="space-y-0.5">
                  <span className="text-slate-250 font-bold block text-sm">TOTP Hardware Authenticator</span>
                  <span className="text-[10px] text-slate-500">Enable verification codes on login and transfers</span>
                </div>
                <button 
                  onClick={handleToggle2fa}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors focus:outline-none ${twoFactorEnabled ? "bg-teal-500" : "bg-slate-800"}`}
                >
                  <div className={`w-4.5 h-4.5 bg-slate-950 rounded-full transition-transform ${twoFactorEnabled ? "translate-x-4.5" : "translate-x-0"}`} />
                </button>
              </div>

              {showQrCode && (
                <div className="border border-slate-850 bg-slate-950/50 p-5 rounded-2xl flex flex-col md:flex-row gap-5 items-center animate-in slide-in-from-top-4 duration-300">
                  {/* Glowing QR frame */}
                  <div className="w-28 h-28 border border-teal-500/30 rounded-xl bg-slate-900/80 p-2 relative flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-transparent to-cyan-500/10" />
                    {/* Simulated pixelated QR pattern */}
                    <div className="w-full h-full border border-dashed border-slate-700 rounded-md p-1.5 flex flex-wrap gap-1 opacity-80">
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-sm ${
                          (i % 3 === 0 || i % 7 === 0 || i === 0 || i === 6 || i === 42 || i === 48) 
                            ? "bg-teal-400" 
                            : "bg-slate-950"
                        }`} />
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleVerifyTotp} className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold">1. SCAN WITH GOOGLE AUTHENTICATOR</span>
                      <p className="text-[10px] text-slate-500">Scan QR or enter secret: <span className="text-teal-400 font-bold">LMX-MFA-SECRET-1982</span></p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold">2. VERIFICATION CODE</span>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="e.g. 123456"
                          maxLength={6}
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                          className="bg-slate-900/60 border-slate-800 text-center font-bold tracking-widest text-teal-400"
                        />
                        <Button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white font-bold shrink-0">
                          Verify & Link
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Active sessions & HSM keys (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* HSM API Keys */}
          <div className="border border-slate-800 bg-slate-900/40 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-teal-400" /> Cryptographic Key Exchange
            </h3>

            <div className="space-y-4 pt-4 font-mono text-xs">
              <div className="space-y-1.5">
                <span className="text-slate-400 font-bold block">HSM MODULE ACCESS KEY</span>
                <div className="flex gap-2">
                  <Input 
                    readOnly
                    value={hsmApiKey}
                    className="bg-slate-950/80 border-slate-800 text-teal-400/90 text-[10px] font-bold"
                  />
                  <Button 
                    type="button" 
                    onClick={copyApiKey}
                    className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-xs shrink-0"
                  >
                    {keyCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-450" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  onClick={() => {
                    if (window.confirm("WARNING: Regenerating keys will break integrations instantly. Procced?")) {
                      setHsmApiKey(`LMX-PUB-K${Math.floor(100000 + Math.random() * 900000)}T-SHIELD-X9`);
                    }
                  }}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[10px] h-8 text-rose-400 font-bold"
                >
                  Regenerate API Keys
                </Button>
              </div>
            </div>
          </div>

          {/* Active Sessions list */}
          <div className="border border-slate-800 bg-slate-900/40 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400 animate-pulse" /> Active User Sessions
            </h3>

            <div className="space-y-4 pt-4 font-mono text-xs">
              {sessions.map((sess) => (
                <div key={sess.id} className="border border-slate-850/60 bg-slate-950/40 p-3.5 rounded-xl space-y-2 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-250 font-bold text-xs">{sess.device}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{sess.ip} - {sess.location}</p>
                    </div>
                    {sess.isCurrent ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-450 border border-emerald-900/40 font-bold">CURRENT</span>
                    ) : (
                      <button 
                        onClick={() => handleTerminateSession(sess.id)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-455 border border-rose-900/40 font-bold hover:bg-rose-900/40"
                      >
                        REVOKE
                      </button>
                    )}
                  </div>
                  <div className="text-[9px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Logged in: {sess.activeSince}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threat Shield Configurations */}
          <div className="border border-slate-800 bg-slate-900/40 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-400" /> Platform Security Policy
            </h3>

            <div className="space-y-4 pt-4 font-mono text-xs">
              {/* Threat detection */}
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-slate-250 font-bold block">AI Threat Detection</span>
                  <span className="text-[9px] text-slate-500">Auto-block malicious rate spikes</span>
                </div>
                <button 
                  onClick={() => setAutomatedThreatDetection(!automatedThreatDetection)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${automatedThreatDetection ? "bg-teal-500" : "bg-slate-800"}`}
                >
                  <div className={`w-4 h-4 bg-slate-950 rounded-full transition-transform ${automatedThreatDetection ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Encryption */}
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-slate-250 font-bold block">Audit Encryption (AES-256)</span>
                  <span className="text-[9px] text-slate-500">Encrypt session logs before database write</span>
                </div>
                <button 
                  onClick={() => setAuditLogEncryption(!auditLogEncryption)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${auditLogEncryption ? "bg-teal-500" : "bg-slate-800"}`}
                >
                  <div className={`w-4 h-4 bg-slate-950 rounded-full transition-transform ${auditLogEncryption ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Rate limiting input */}
              <div className="space-y-1.5">
                <span className="text-slate-250 font-bold block">Rate Limit Threshold (req/min)</span>
                <Input 
                  type="text"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(e.target.value.replace(/\D/g, ""))}
                  className="bg-slate-950/50 border-slate-700 text-teal-400 font-bold"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
