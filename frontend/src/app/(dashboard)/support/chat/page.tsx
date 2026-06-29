"use client";

import { useState } from "react";
import { 
  MessageSquare, Send, User, Bot, Clock, Headset, 
  Search, ShieldAlert, FileText, CheckCircle, RefreshCw, 
  Network, Laptop, Info 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: number;
  sender: "bot" | "system" | "user" | "agent";
  text: string;
  time: string;
}

export default function SupportChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "bot", text: "LomaX AI Support Assistant is online. Waiting for customer routing...", time: "09:00 AM" },
    { id: 2, sender: "system", text: "Customer CUST-49281 connected from Branch B-001.", time: "09:05 AM" },
    { id: 3, sender: "user", text: "Hi, I need help with my recent card transaction that was declined.", time: "09:06 AM" },
  ]);
  const [input, setInput] = useState("");

  // Ticket Lookup states (right sidebar)
  const [ticketIdQuery, setTicketIdQuery] = useState("");
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [foundTicket, setFoundTicket] = useState<any>(null);
  const [foundCustomer, setFoundCustomer] = useState<any>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages((prev) => [
      ...prev,
      { 
        id: Date.now(), 
        sender: "agent", 
        text: input, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ]);
    setInput("");
  };

  const lookupTicketAndCustomer = async () => {
    if (!ticketIdQuery) return;
    setLoadingTicket(true);
    setFoundTicket(null);
    setFoundCustomer(null);

    try {
      const ticketRes = await fetch(`http://localhost:5000/api/tickets/lookup/${ticketIdQuery}`);
      const ticketJson = await ticketRes.json();

      if (ticketJson.success) {
        setFoundTicket(ticketJson.data);
        
        // Next, automatically lookup customer details
        const custRes = await fetch(`http://localhost:5000/api/auth/lookup/customer/${ticketJson.data.customerId}`);
        const custJson = await custRes.json();
        
        if (custJson.success) {
          setFoundCustomer(custJson.data);
        }
      } else {
        alert("Ticket not found in central registry.");
      }
    } catch (err) {
      console.error("Support lookup error:", err);
      alert("Database error fetching ticket records.");
    } finally {
      setLoadingTicket(false);
    }
  };

  const injectTicketIntoChat = () => {
    if (!foundTicket) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "system",
        text: `Agent linked Ticket [${foundTicket.ticketId}] (${foundTicket.subject}) - Status: ${foundTicket.status}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-200">
      <div className="shrink-0">
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.3)] flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-fuchsia-400" /> Live Support Chat
        </h1>
        <p className="text-slate-400 mt-1 text-sm">Real-time assistance for active customer sessions linked to registry tickets.</p>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Active Chat Window (lg:col-span-8) */}
        <div className="lg:col-span-8 border border-slate-800/80 bg-slate-900/50 rounded-2xl backdrop-blur-md overflow-hidden flex flex-col relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Chat Header */}
          <div className="shrink-0 p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-850 flex items-center justify-center border border-slate-700">
                <User className="w-5 h-5 text-slate-350" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200">Active session: CUST-49281</h3>
                <div className="flex items-center gap-1.5 text-xs text-emerald-450">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Customer Online
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-rose-500/50 text-rose-455 hover:bg-rose-500/10 font-bold text-xs">
              End Session
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 z-10">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] flex items-end gap-2 ${msg.sender === 'agent' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.sender !== 'system' && (
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
                      msg.sender === 'agent' ? 'bg-fuchsia-900/50 border-fuchsia-500 text-fuchsia-300' :
                      msg.sender === 'bot' ? 'bg-cyan-900/50 border-cyan-500 text-cyan-300' :
                      'bg-slate-800 border-slate-600 text-slate-300'
                    }`}>
                      {msg.sender === 'agent' ? <Headset className="w-4 h-4" /> : msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-2xl ${
                    msg.sender === 'system' ? 'bg-slate-900/40 text-center text-xs text-fuchsia-400 w-full font-mono border border-fuchsia-900/20' :
                    msg.sender === 'agent' ? 'bg-fuchsia-600/20 border border-fuchsia-500/30 text-slate-200 rounded-br-none' :
                    msg.sender === 'bot' ? 'bg-cyan-950/40 border border-cyan-500/20 text-cyan-100 rounded-bl-none' :
                    'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                    {msg.sender !== 'system' && (
                      <div className={`text-[10px] mt-1 ${msg.sender === 'agent' ? 'text-fuchsia-300/50 text-right' : 'text-slate-500'}`}>
                        {msg.time}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="shrink-0 p-4 border-t border-slate-800 bg-slate-950/40 z-10">
            <form onSubmit={handleSend} className="flex gap-3">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response to the customer..."
                className="flex-1 bg-slate-900/60 border-slate-700 text-fuchsia-400 placeholder:text-slate-600 focus-visible:border-fuchsia-500 focus-visible:ring-fuchsia-500/20"
              />
              <Button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white shrink-0 px-6 font-bold">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Right Side: Ticket & Identity Inspector (lg:col-span-4) */}
        <div className="lg:col-span-4 border border-slate-800/80 bg-slate-950/60 p-5 rounded-2xl backdrop-blur-md flex flex-col space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-0.5 border-b border-slate-900 pb-3">
            <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-fuchsia-400" /> Session Registry
            </h3>
            <p className="text-[10px] text-slate-500">Query ticket details to associate with chat session.</p>
          </div>

          {/* Ticket ID search */}
          <div className="space-y-2 font-mono text-xs">
            <label className="text-slate-400 font-bold block">1. SEARCH REGISTERED TICKET</label>
            <div className="flex gap-2">
              <Input
                value={ticketIdQuery}
                onChange={(e) => setTicketIdQuery(e.target.value)}
                placeholder="Enter Ticket ID (e.g. TKT-...)"
                className="bg-slate-900/60 border-slate-800 text-xs font-mono text-fuchsia-400"
              />
              <Button 
                onClick={lookupTicketAndCustomer}
                disabled={loadingTicket}
                className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-xs font-bold shrink-0"
              >
                {loadingTicket ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Query"}
              </Button>
            </div>
          </div>

          {/* Render Result Cards */}
          {foundTicket && (
            <div className="space-y-4 font-mono text-xs animate-in fade-in duration-300">
              {/* Ticket Details */}
              <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-fuchsia-450" /> Ticket Details
                </span>
                <p className="text-slate-200 font-bold">{foundTicket.subject}</p>
                <p className="text-slate-450 text-[10px]">{foundTicket.description}</p>
                <div className="flex justify-between text-[10px] pt-1">
                  <span className="text-slate-500">STATUS:</span>
                  <span className="text-fuchsia-400 font-bold uppercase">{foundTicket.status}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">PRIORITY:</span>
                  <span className="text-rose-400 font-bold uppercase">{foundTicket.priority}</span>
                </div>
              </div>

              {/* Customer Details */}
              {foundCustomer && (
                <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-cyan-455" /> Customer Identity
                  </span>
                  <p className="text-slate-200 font-bold uppercase">{foundCustomer.firstName} {foundCustomer.lastName}</p>
                  <p className="text-slate-400 text-[10px]">Email: {foundCustomer.email}</p>
                  <p className="text-slate-400 text-[10px]">Phone: {foundCustomer.mobile}</p>
                </div>
              )}

              <Button
                onClick={injectTicketIntoChat}
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold gap-1.5 text-xs"
              >
                <CheckCircle className="w-4 h-4" /> Inject Details to Chat Log
              </Button>
            </div>
          )}

          {/* Session Diagnostics */}
          <div className="space-y-3 bg-slate-900/30 border border-slate-900 p-4 rounded-xl font-mono text-[10px] text-slate-500 mt-auto">
            <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-slate-400" /> DIAGNOSTICS
            </p>
            <div className="flex justify-between">
              <span>LATENCY:</span>
              <span className="text-emerald-450 font-bold">14 ms</span>
            </div>
            <div className="flex justify-between">
              <span>CONNECTION:</span>
              <span className="text-slate-400">WebSocket Secure</span>
            </div>
            <div className="flex justify-between">
              <span>AGENT AGENT:</span>
              <span className="text-slate-400 truncate max-w-[120px]">Chrome 122 (Win64)</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
