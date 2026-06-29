"use client";

import { useState, useEffect } from "react";
import { 
  Headset, Search, CheckCircle2, Clock, AlertCircle, 
  Plus, X, RefreshCw, UserCheck, MessageSquarePlus, LifeBuoy 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TicketItem {
  _id: string;
  ticketId: string;
  customerId: string;
  subject: string;
  category: string;
  priority: "Low" | "High" | "Critical";
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [filtered, setFiltered] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Ticket Generator form state
  const [showWizard, setShowWizard] = useState(false);
  const [queryId, setQueryId] = useState("");
  const [fetchingUser, setFetchingUser] = useState(false);
  const [custDetails, setCustDetails] = useState<any>(null);

  // New ticket fields
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical Support");
  const [priority, setPriority] = useState<"Low" | "High" | "Critical">("High");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/tickets");
      const data = await res.json();
      if (data.success) {
        setTickets(data.data);
        setFiltered(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    if (!q) {
      setFiltered(tickets);
      return;
    }
    setFiltered(tickets.filter(t => 
      t.ticketId.toLowerCase().includes(q) ||
      t.customerId.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q)
    ));
  }, [search, tickets]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tickets/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTickets();
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // Lookup customer details using customerId or accountNumber
  const handleLookupCustomer = async () => {
    if (!queryId) return;
    setFetchingUser(true);
    setCustDetails(null);

    try {
      // 1. Try customerId route
      const custRes = await fetch(`http://localhost:5000/api/auth/lookup/customer/${queryId}`);
      const custJson = await custRes.json();

      if (custJson.success) {
        setCustDetails({
          customerId: custJson.data.customerId,
          name: `${custJson.data.firstName} ${custJson.data.lastName}`,
          email: custJson.data.email,
          mobile: custJson.data.mobile
        });
        setFetchingUser(false);
        return;
      }

      // 2. Try accountNumber route if customerId fails
      const accountRes = await fetch(`http://localhost:5000/api/accounts/live/${queryId}`);
      const accountJson = await accountRes.json();

      if (accountJson.success && accountJson.user) {
        setCustDetails({
          customerId: accountJson.user.customerId,
          name: `${accountJson.user.firstName} ${accountJson.user.lastName}`,
          email: accountJson.user.email,
          mobile: accountJson.user.mobile
        });
      } else {
        alert("No matching customer or account found in LomaX system.");
      }
    } catch (err) {
      console.error("Lookup customer error:", err);
      alert("Database error fetching customer record.");
    } finally {
      setFetchingUser(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custDetails) {
      alert("Please look up and bind a customer to the ticket first.");
      return;
    }
    if (!subject || !description) {
      alert("Please fill in the ticket subject and description.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: custDetails.customerId,
          subject,
          category,
          priority,
          description
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Support ticket ${data.data.ticketId} spawned successfully.`);
        // Reset states
        setSubject("");
        setDescription("");
        setCustDetails(null);
        setQueryId("");
        setShowWizard(false);
        fetchTickets();
      }
    } catch (err) {
      console.error("Create ticket error:", err);
      alert("Failed to submit support ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.3)] flex items-center gap-3">
            <Headset className="w-8 h-8 text-fuchsia-400" /> Support Tickets
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Manage and resolve customer support inquiries.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowWizard(!showWizard)}
            className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold gap-2"
          >
            <Plus className="w-4 h-4" /> Generate Ticket
          </Button>
          <button onClick={fetchTickets} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm hover:border-slate-600 hover:text-slate-300 transition-all w-fit">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main List Column */}
        <div className="flex-1 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by Ticket ID, Customer, Subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-900/60 border-slate-700 text-slate-250 placeholder:text-slate-600 focus-visible:border-fuchsia-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="py-20 text-center text-slate-500 animate-pulse font-mono">LOADING CENTRAL TICKETING LEDGER...</div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center border border-slate-800 rounded-2xl bg-slate-950/40">
                <Headset className="w-12 h-12 mx-auto text-slate-700 mb-4" />
                <p className="text-slate-400 font-medium">No support tickets found.</p>
              </div>
            ) : (
              filtered.map((ticket) => (
                <div key={ticket._id} className="border border-slate-800/80 rounded-2xl bg-slate-900/60 backdrop-blur-md overflow-hidden p-5 flex flex-col md:flex-row gap-6 relative group hover:border-slate-700/80 transition-all">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    ticket.status === 'Open' ? 'bg-fuchsia-500' :
                    ticket.status === 'In Progress' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}></div>
                  
                  <div className="flex-1 pl-4">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-mono text-fuchsia-400 font-bold">{ticket.ticketId}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full border font-medium ${
                        ticket.status === 'Open' ? 'bg-fuchsia-950/40 border-fuchsia-500/30 text-fuchsia-400' :
                        ticket.status === 'In Progress' ? 'bg-amber-950/40 border-amber-500/30 text-amber-400' :
                        'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {ticket.status}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full border font-medium ${
                        ticket.priority === 'Critical' ? 'bg-rose-950/40 border-rose-500/30 text-rose-400' :
                        ticket.priority === 'High' ? 'bg-orange-950/40 border-orange-500/30 text-orange-400' :
                        'bg-slate-800 border-slate-655 text-slate-400'
                      }`}>
                        {ticket.priority} Priority
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-200 mb-1">{ticket.subject}</h3>
                    <p className="text-sm text-slate-400 mb-4">{ticket.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Customer: <span className="font-mono text-slate-300">{ticket.customerId}</span></span>
                      <span>Category: <span className="text-slate-350">{ticket.category}</span></span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 justify-center shrink-0">
                    {ticket.status !== 'In Progress' && ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                      <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 w-full" onClick={() => updateStatus(ticket._id, 'In Progress')}>
                        Mark In Progress
                      </Button>
                    )}
                    {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                      <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-500 w-full" onClick={() => updateStatus(ticket._id, 'Resolved')}>
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Resolve
                      </Button>
                    )}
                    {ticket.status === 'Resolved' && (
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-450 hover:bg-slate-800 w-full" onClick={() => updateStatus(ticket._id, 'Closed')}>
                        Close Ticket
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Ticket Wizard Panel (lg:col-span-5) */}
        {showWizard && (
          <div className="w-full lg:w-[380px] shrink-0 border border-slate-800 bg-slate-950/80 p-6 rounded-3xl backdrop-blur-md space-y-6 relative overflow-hidden h-fit animate-in slide-in-from-right-6 duration-400">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-start border-b border-slate-900 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-widest flex items-center gap-1.5">
                  <MessageSquarePlus className="w-4 h-4 text-fuchsia-400" /> Spawn ticket
                </h3>
                <p className="text-[10px] text-slate-500">Auto-fetch details and generate ticket</p>
              </div>
              <button 
                onClick={() => setShowWizard(false)}
                className="p-1 rounded hover:bg-slate-900 text-slate-550 hover:text-slate-350"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Lookup entry */}
            <div className="space-y-2 font-mono text-xs">
              <label className="text-slate-400 font-bold block">1. BIND CUSTOMER / ACCOUNT</label>
              <div className="flex gap-2">
                <Input
                  value={queryId}
                  onChange={(e) => setQueryId(e.target.value)}
                  placeholder="Enter Customer ID or A/C"
                  className="bg-slate-900/60 border-slate-800 text-xs font-mono text-fuchsia-400"
                />
                <Button 
                  type="button"
                  onClick={handleLookupCustomer}
                  disabled={fetchingUser}
                  className="bg-slate-905 border border-slate-800 text-xs font-bold hover:bg-slate-850 shrink-0"
                >
                  {fetchingUser ? "..." : "Fetch"}
                </Button>
              </div>

              {custDetails && (
                <div className="bg-slate-900/60 border border-slate-850 p-3.5 rounded-xl space-y-2 mt-2 text-[11px] animate-in fade-in duration-300">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                    <UserCheck className="w-3.5 h-3.5" /> Customer Identity Bound
                  </div>
                  <p className="text-slate-300"><span className="text-slate-500">NAME:</span> {custDetails.name}</p>
                  <p className="text-slate-300"><span className="text-slate-500">CID:</span> {custDetails.customerId}</p>
                  <p className="text-slate-300"><span className="text-slate-500">EMAIL:</span> {custDetails.email}</p>
                  <p className="text-slate-300"><span className="text-slate-500">PHONE:</span> {custDetails.mobile}</p>
                </div>
              )}
            </div>

            {/* Ticket parameters */}
            <form onSubmit={handleCreateTicket} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">2. SUBJECT</label>
                <Input 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Summary of issue"
                  className="bg-slate-900/60 border-slate-800 text-xs text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">3. CATEGORY</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 focus-visible:outline-none"
                >
                  <option value="Technical Support">Technical Support / Server Lag</option>
                  <option value="Cards & ATM">Cards & ATM block/pin</option>
                  <option value="Billing & Charges">Billing & Operational Fees</option>
                  <option value="KYC Operations">KYC Document Uploads</option>
                  <option value="Security Alert">Security / Suspicious Payouts</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">4. PRIORITY LEVEL</label>
                <div className="flex gap-2">
                  {(["Low", "High", "Critical"] as const).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold text-center transition-all ${
                        priority === p
                          ? p === "Critical" ? "bg-rose-950/60 border-rose-500/50 text-rose-400" :
                            p === "High" ? "bg-amber-950/60 border-amber-500/50 text-amber-400" :
                            "bg-slate-800 border-slate-700 text-slate-200"
                          : "border-slate-850 bg-slate-900/20 text-slate-500 hover:text-slate-450"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">5. DETAILED EXPLANATION</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Provide transaction hashes, card numbers, or system logs if applicable..."
                  className="flex w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus-visible:outline-none"
                />
              </div>

              <Button 
                type="submit" 
                disabled={submitting || !custDetails}
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold gap-1.5 mt-2"
              >
                <LifeBuoy className="w-4 h-4" /> {submitting ? "Spawning..." : "Create Support Ticket"}
              </Button>
            </form>

          </div>
        )}

      </div>

    </div>
  );
}
