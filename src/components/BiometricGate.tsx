'use client';
import { useState, useEffect } from 'react';
import { Fingerprint, ScanFace } from 'lucide-react';

interface BiometricGateProps {
  onUnlock: () => void;
}

export default function BiometricGate({ onUnlock }: BiometricGateProps) {
  const [scanning, setScanning] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleScan = () => {
    setScanning(true);
    // Simulate biometric WebAuthn verification delay
    setTimeout(() => {
      setScanning(false);
      setUnlocked(true);
      setTimeout(() => {
        onUnlock();
      }, 800);
    }, 1500);
  };

  if (unlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 opacity-0 pointer-events-none">
        <div className="text-[#00e5ff] text-2xl font-bold animate-pulse">Neural Handshake Confirmed</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="relative p-12 glass-panel rounded-3xl flex flex-col items-center max-w-sm w-full text-center">
        {/* Holographic scanning effect ring */}
        <div className={`absolute inset-0 rounded-3xl border border-[#00e5ff]/20 transition-all duration-1000 ${scanning ? 'animate-pulse-glow shadow-[0_0_50px_#00e5ff30]' : ''}`} />
        
        <div className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center animate-pulse-glow" style={{ background: 'linear-gradient(135deg, #00e5ff20, #b900ff20)' }}>
          <span className="text-2xl font-black text-gradient-magic">N</span>
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">LomaX Secure Vault</h2>
        <p className="text-xs text-[#9ca3af] mb-10">Post-Quantum biometric authentication required.</p>

        <button 
          onClick={handleScan}
          disabled={scanning}
          className={`relative group w-24 h-24 rounded-full flex items-center justify-center glass-card border transition-all duration-500 overflow-hidden ${scanning ? 'border-[#00e5ff] scale-95' : 'border-white/10 hover:border-[#00e5ff]/50 hover:scale-105'}`}
        >
          {scanning && <div className="absolute top-0 left-0 w-full h-1 bg-[#00e5ff]/50 animate-scanline shadow-[0_0_10px_#00e5ff]" />}
          <Fingerprint className={`w-10 h-10 transition-colors duration-500 ${scanning ? 'text-[#00e5ff]' : 'text-white group-hover:text-[#00e5ff]'}`} />
        </button>

        <p className={`mt-6 text-xs font-semibold transition-opacity duration-300 ${scanning ? 'text-[#00e5ff] animate-pulse' : 'text-[#6b7280]'}`}>
          {scanning ? 'Verifying Neural Signature...' : 'Tap to scan identity'}
        </p>
      </div>
    </div>
  );
}
