"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import apiClient from '@/services/api-client';
import { 
  Shield, 
  Key, 
  Smartphone, 
  Lock, 
  Unlock, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Monitor, 
  MapPin, 
  Calendar,
  Download,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Session {
  sessionId: string;
  deviceName: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastUsed: string;
}

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling2FA, setToggling2FA] = useState(false);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      // Fetch 2FA status
      const statusRes = await apiClient.get('/auth/2fa/status');
      if (statusRes.data.success) {
        setTwoFactorEnabled(statusRes.data.twoFactorEnabled);
      }
      
      // Fetch active sessions
      const sessionsRes = await apiClient.get('/auth/sessions');
      if (sessionsRes.data.success) {
        setSessions(sessionsRes.data.sessions);
      }
    } catch (error: any) {
      console.error('Failed to fetch security settings:', error);
      toast.error('Could not load security configurations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSecurityData();
    }
  }, [user]);

  const handleToggle2FA = async () => {
    try {
      setToggling2FA(true);
      const newState = !twoFactorEnabled;
      const res = await apiClient.post('/auth/2fa/toggle', { enable: newState });
      
      if (res.data.success) {
        setTwoFactorEnabled(newState);
        if (newState && res.data.backupCodes) {
          setBackupCodes(res.data.backupCodes);
          setShowBackupCodes(true);
          toast.success('Two-factor authentication enabled!');
        } else {
          setBackupCodes([]);
          setShowBackupCodes(false);
          toast.success('Two-factor authentication disabled.');
        }
      }
    } catch (error) {
      toast.error('Failed to update 2FA configuration.');
    } finally {
      setToggling2FA(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await apiClient.delete(`/auth/sessions/${sessionId}`);
      if (res.data.success) {
        setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
        toast.success('Device session successfully revoked.');
      }
    } catch (error) {
      toast.error('Failed to revoke device session.');
    }
  };

  const handleDownloadBackupCodes = () => {
    const text = `LomaX Bank Security - Backup Codes\n==================================\n\nSave these codes securely. Each code can be used once to access your account if you lose access to your email.\n\nBackup Codes:\n${backupCodes.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`;
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "lomax-backup-codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Calculate dynamic security score
  const calculateSecurityScore = () => {
    let score = 40; // Base score for having password
    if (twoFactorEnabled) score += 30;
    if (sessions.length <= 2) score += 20;
    else if (sessions.length <= 4) score += 10;
    if (backupCodes.length > 0 || twoFactorEnabled) score += 10;
    return score;
  };

  const score = calculateSecurityScore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-slate-100">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
          Security Center & Device Manager
        </h1>
        <p className="text-slate-400 mt-1">
          Monitor your account health, toggle security guards, and control active devices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Security Score Widget */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-medium">Security Score</span>
              <Shield className={`w-6 h-6 ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400'}`} />
            </div>
            
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black">{score}%</span>
              <span className="text-slate-400 font-semibold text-sm">Protected</span>
            </div>

            <div className="w-full bg-slate-800/80 rounded-full h-3 mt-4 overflow-hidden border border-slate-700/30">
              <div 
                className={`h-full transition-all duration-500 ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                style={{ width: `${score}%` }} 
              />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center text-sm space-x-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Strong Password Activated</span>
            </div>
            <div className="flex items-center text-sm space-x-2 text-slate-300">
              {twoFactorEnabled ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>2FA Security: {twoFactorEnabled ? 'Enabled' : 'Disabled (Recommended)'}</span>
            </div>
            <div className="flex items-center text-sm space-x-2 text-slate-300">
              {sessions.length <= 2 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              )}
              <span>Active Sessions: {sessions.length} devices logged in</span>
            </div>
          </div>
        </div>

        {/* 2FA Controller Card */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">Two-Factor Authentication (2FA)</h2>
            </div>
            <p className="text-slate-400 text-sm">
              Secure your account logins by requiring a 6-digit OTP code sent directly to your registered email address ({user?.email}) alongside your password.
            </p>

            {/* Toggle switch */}
            <div className="flex items-center justify-between mt-6 p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl">
              <div className="flex items-center space-x-3">
                {twoFactorEnabled ? (
                  <Lock className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Unlock className="w-5 h-5 text-slate-400" />
                )}
                <div>
                  <div className="font-semibold">{twoFactorEnabled ? '2FA Protection Enabled' : '2FA Protection Disabled'}</div>
                  <div className="text-xs text-slate-400">Requires OTP to sign in</div>
                </div>
              </div>
              
              <button
                onClick={handleToggle2FA}
                disabled={toggling2FA}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                  twoFactorEnabled 
                    ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20' 
                    : 'bg-sky-500 text-slate-950 hover:bg-sky-400 font-bold'
                }`}
              >
                {toggling2FA && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>{twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}</span>
              </button>
            </div>
          </div>

          {/* Backup codes panel */}
          {showBackupCodes && backupCodes.length > 0 && (
            <div className="mt-6 p-4 bg-slate-950/60 border border-emerald-500/30 rounded-xl space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Backup Codes Generated Successfully</span>
                </div>
                <button
                  onClick={handleDownloadBackupCodes}
                  className="flex items-center space-x-1 text-sky-400 hover:text-sky-300 text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download codes</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Write these backup codes down. If you lose access to your email, you can enter any code below to unlock your account. Each code can only be used once.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center text-sm font-semibold tracking-wider">
                {backupCodes.map((c, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800/80 p-2 rounded text-slate-200 hover:text-emerald-400 select-all">
                    {c}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Device Manager Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Device & Session Manager</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review browsers, locations, and IPs that currently have access to your LomaX account.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.sessionId} className="border-b border-slate-850 hover:bg-slate-800/10 transition-colors">
                  <td className="py-4 px-4 flex items-center space-x-3">
                    <div className="p-1.5 bg-slate-800 rounded">
                      <Monitor className="w-4 h-4 text-slate-300" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{session.deviceName}</div>
                      <div className="text-xs text-slate-400">{session.browser}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-slate-300">{session.ipAddress}</td>
                  <td className="py-4 px-4 text-sm text-slate-300">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{session.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-300">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(session.lastUsed).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleRevokeSession(session.sessionId)}
                      className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors"
                      title="Terminate device session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No active sessions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
