"use client";

import { useState } from "react";
import { 
  Smartphone, Laptop, Tablet, MapPin, Clock, XCircle, 
  ShieldCheck, ShieldAlert, KeyRound, Check, Plus, Settings, Info 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Device {
  id: string;
  type: "Laptop" | "Smartphone" | "Tablet";
  name: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  status: "Current Device" | "Active" | "Inactive";
  requiresMfa?: boolean;
  writePermissions?: boolean;
  sessionTimeout?: number; // in minutes
  ipWhitelist?: string;
}

export default function DeviceManagementPage() {
  const [devices, setDevices] = useState<Device[]>([
    { id: "DEV-1", type: "Laptop", name: "Dell XPS 15", os: "Windows 11", ip: "192.168.1.104", location: "Mumbai, IN", lastActive: "Just now", status: "Current Device", requiresMfa: true, writePermissions: true, sessionTimeout: 15, ipWhitelist: "192.168.1.*" },
    { id: "DEV-2", type: "Smartphone", name: "iPhone 14 Pro", os: "iOS 17.2", ip: "103.44.22.1", location: "Bangalore, IN", lastActive: "1 day ago", status: "Active", requiresMfa: true, writePermissions: false, sessionTimeout: 5, ipWhitelist: "" },
    { id: "DEV-3", type: "Tablet", name: "iPad Pro", os: "iPadOS 17", ip: "45.12.89.2", location: "Delhi, IN", lastActive: "3 weeks ago", status: "Inactive", requiresMfa: false, writePermissions: false, sessionTimeout: 30, ipWhitelist: "" },
  ]);

  // Form State for adding new device
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"Laptop" | "Smartphone" | "Tablet">("Laptop");
  const [newOs, setNewOs] = useState("");
  const [newIp, setNewIp] = useState("");
  const [newLocation, setNewLocation] = useState("");

  // Config Inspector State
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const handleRevoke = (id: string) => {
    if (!window.confirm("Are you sure you want to revoke network credentials for this device? It will be logged out instantly!")) return;
    setDevices(devices.filter(d => d.id !== id));
    if (selectedDevice?.id === id) {
      setSelectedDevice(null);
    }
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newOs) {
      alert("Please fill in the device name and OS.");
      return;
    }

    const newDev: Device = {
      id: `DEV-${Math.floor(1000 + Math.random() * 9000)}`,
      type: newType,
      name: newName,
      os: newOs,
      ip: newIp || "192.168.1.100",
      location: newLocation || "Mumbai, IN",
      lastActive: "Just now",
      status: "Active",
      requiresMfa: true,
      writePermissions: false,
      sessionTimeout: 15,
      ipWhitelist: "",
    };

    setDevices([...devices, newDev]);
    setShowAddForm(false);
    setNewName("");
    setNewOs("");
    setNewIp("");
    setNewLocation("");
  };

  const handleUpdateDeviceConfig = (id: string, updates: Partial<Device>) => {
    const updated = devices.map(d => {
      if (d.id === id) {
        const next = { ...d, ...updates };
        if (selectedDevice?.id === id) {
          setSelectedDevice(next);
        }
        return next;
      }
      return d;
    });
    setDevices(updated);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.3)] flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-teal-400" /> Device Management
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Review, authorize, and configure advanced hardware keys and devices accessing LomaX.</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-teal-600 hover:bg-teal-500 text-white gap-2 font-bold"
        >
          <Plus className="w-4 h-4" /> Authorize New Device
        </Button>
      </div>

      {/* Register Device Modal / Form Panel */}
      {showAddForm && (
        <form onSubmit={handleAddDevice} className="border border-slate-800 bg-slate-950/80 p-6 rounded-3xl backdrop-blur-md max-w-xl space-y-4 animate-in slide-in-from-top-6 duration-400">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest border-b border-slate-900 pb-2">New Device Credentials Registration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400">DEVICE TYPE</label>
              <select 
                value={newType} 
                onChange={(e: any) => setNewType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 focus-visible:outline-none"
              >
                <option value="Laptop">Laptop / Workstation</option>
                <option value="Smartphone">Smartphone / Mobile</option>
                <option value="Tablet">Tablet / iPad</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400">DEVICE NAME / MODEL</label>
              <Input 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. MacBook Pro M3"
                className="bg-slate-900/60 border-slate-700 text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400">OPERATING SYSTEM</label>
              <Input 
                value={newOs}
                onChange={(e) => setNewOs(e.target.value)}
                placeholder="e.g. macOS Sonoma"
                className="bg-slate-900/60 border-slate-700 text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400">IP ADDRESS</label>
              <Input 
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                placeholder="e.g. 192.168.1.150"
                className="bg-slate-900/60 border-slate-700 text-xs"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-mono text-slate-400">AUTHORIZATION REGION</label>
              <Input 
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Hyderabad, IN"
                className="bg-slate-900/60 border-slate-700 text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" className="border-slate-800 text-slate-400" onClick={() => setShowAddForm(false)}>Cancel</Button>
            <Button type="submit" className="bg-teal-600 text-white hover:bg-teal-500 font-bold">Register Device</Button>
          </div>
        </form>
      )}

      {/* Main Grid split: List (left) & Security Inspector (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Devices Cards List (lg:col-span-7) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((device) => (
            <div 
              key={device.id} 
              onClick={() => setSelectedDevice(device)}
              className={`border rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group transition-all cursor-pointer ${
                selectedDevice?.id === device.id
                  ? "bg-slate-900 border-teal-500/80 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                  : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-300">
                  {device.type === 'Laptop' ? <Laptop className="w-5 h-5" /> :
                   device.type === 'Smartphone' ? <Smartphone className="w-5 h-5" /> :
                   <Tablet className="w-5 h-5" />}
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-mono rounded-full border font-bold uppercase ${
                  device.status === 'Current Device' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 flex items-center gap-1' :
                  device.status === 'Active' ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400' :
                  'bg-slate-850 border-slate-750 text-slate-400'
                }`}>
                  {device.status === 'Current Device' && <ShieldCheck className="w-3 h-3 animate-pulse" />}
                  {device.status}
                </span>
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-slate-200 text-sm">{device.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{device.os}</p>
                <div className="space-y-1 text-[11px] text-slate-400 pt-3">
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-550" /> {device.location}</p>
                  <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-550" /> {device.lastActive}</p>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedDevice(device); }}
                  className="text-[10px] font-mono font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" /> SETTINGS
                </button>
                {device.status !== 'Current Device' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRevoke(device.id); }}
                    className="text-[10px] font-mono font-bold text-rose-455 hover:text-rose-350"
                  >
                    REVOKE ACCESS
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Security Inspector (lg:col-span-5) */}
        <div className="lg:col-span-5">
          {selectedDevice ? (
            <div className="border border-slate-800 bg-slate-950/80 p-6 rounded-3xl backdrop-blur-md space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-1 border-b border-slate-900 pb-3">
                <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-teal-400" /> Device Audit Controls
                </h3>
                <p className="text-[10px] text-slate-500">Configure permission policies for: {selectedDevice.name}</p>
              </div>

              <div className="space-y-5 font-mono text-xs">
                {/* Require MFA Toggle */}
                <div className="flex justify-between items-center bg-slate-900/30 p-3 rounded-xl border border-slate-850">
                  <div className="space-y-0.5">
                    <span className="text-slate-200 font-bold block">Require MFA Challenge</span>
                    <span className="text-[9px] text-slate-500">Force multi-factor code on transfer</span>
                  </div>
                  <button 
                    onClick={() => handleUpdateDeviceConfig(selectedDevice.id, { requiresMfa: !selectedDevice.requiresMfa })}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${selectedDevice.requiresMfa ? "bg-teal-500" : "bg-slate-800"}`}
                  >
                    <div className={`w-4 h-4 bg-slate-950 rounded-full transition-transform ${selectedDevice.requiresMfa ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>

                {/* Write Permissions Toggle */}
                <div className="flex justify-between items-center bg-slate-900/30 p-3 rounded-xl border border-slate-850">
                  <div className="space-y-0.5">
                    <span className="text-slate-200 font-bold block">Ledger Write Authority</span>
                    <span className="text-[9px] text-slate-500">Allow payouts and transfer actions</span>
                  </div>
                  <button 
                    onClick={() => handleUpdateDeviceConfig(selectedDevice.id, { writePermissions: !selectedDevice.writePermissions })}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${selectedDevice.writePermissions ? "bg-teal-500" : "bg-slate-800"}`}
                  >
                    <div className={`w-4 h-4 bg-slate-950 rounded-full transition-transform ${selectedDevice.writePermissions ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>

                {/* Session Timeout slider */}
                <div className="space-y-2 bg-slate-900/30 p-3 rounded-xl border border-slate-850">
                  <div className="flex justify-between">
                    <span className="text-slate-200 font-bold">Session Lock Duration</span>
                    <span className="text-teal-400 font-bold">{selectedDevice.sessionTimeout || 15} Mins</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="120" 
                    step="5"
                    value={selectedDevice.sessionTimeout || 15} 
                    onChange={(e) => handleUpdateDeviceConfig(selectedDevice.id, { sessionTimeout: Number(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400" 
                  />
                </div>

                {/* Subnet Whitelisting */}
                <div className="space-y-2 bg-slate-900/30 p-3.5 rounded-xl border border-slate-850">
                  <span className="text-slate-200 font-bold block">Authorized IP Subnet</span>
                  <Input 
                    placeholder="e.g. 192.168.1.* or 10.0.0.1"
                    value={selectedDevice.ipWhitelist || ""}
                    onChange={(e) => handleUpdateDeviceConfig(selectedDevice.id, { ipWhitelist: e.target.value })}
                    className="bg-slate-950/60 border-slate-800 text-xs font-mono text-teal-400"
                  />
                  <span className="text-[8px] text-slate-500 block">Blank allows any IP to authenticate.</span>
                </div>
              </div>

              <div className="bg-slate-900/20 border border-slate-900 p-3.5 rounded-xl text-[10px] text-slate-500 flex items-start gap-2">
                <Info className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <p>Auditing device security settings applies updates immediately on the device's next sync poll cycle (usually every 10 seconds).</p>
              </div>

            </div>
          ) : (
            <div className="border border-slate-850 bg-slate-900/20 p-8 rounded-3xl text-center text-slate-500 font-mono text-xs">
              SELECT A TARGET SECURITY AGENT DEVICE TO INSPECT OR CONFIGURE POLICIES.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
