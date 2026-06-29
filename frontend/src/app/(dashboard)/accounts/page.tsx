"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  RefreshCw, Eye, EyeOff, Copy, Search, CheckCircle2, CreditCard,
  Building2, Phone, Mail, User, Shield, Trash2, Edit2, Save, X,
  BookOpen, FileText, ArrowDownRight, ArrowUpRight, DownloadCloud,
  Printer, Check, ShieldCheck, Landmark, Plus, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ApprovedAccount {
  _id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  pan: string;
  aadhaar: string;
  plainPassword: string;
  accountNumber: string;
  accountType: string;
  initialDeposit: number;
  branchName: string;
  branchCode: string;
  ifscCode: string;
  services: Record<string, boolean>;
  status: string;
  approvedAt: string;
  createdAt: string;
}

interface LiveAccountInfo {
  balance: number;
  status: string;
  cards: any[];
  loading: boolean;
}

interface TransactionInfo {
  data: any[];
  loading: boolean;
}

const serviceLabels: Record<string, string> = {
  debitCard: "Debit Card", internetBanking: "Net Banking",
  mobileBanking: "Mobile", smsAlerts: "SMS Alerts",
  chequeBook: "Cheque Book", upi: "UPI",
};

export default function AccountListPage() {
  const [accounts, setAccounts] = useState<ApprovedAccount[]>([]);
  const [filtered, setFiltered] = useState<ApprovedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPassFor, setShowPassFor] = useState<string | null>(null);

  // Live account & card details loaded per expanded account
  const [liveData, setLiveData] = useState<Record<string, LiveAccountInfo>>({});
  const [txData, setTxData] = useState<Record<string, TransactionInfo>>({});

  // Digital Passbook Modal State
  const [passbookAccount, setPassbookAccount] = useState<ApprovedAccount | null>(null);
  const [passbookTransactions, setPassbookTransactions] = useState<any[]>([]);
  const [editedRemarks, setEditedRemarks] = useState<Record<string, string>>({});
  const [passbookPage, setPassbookPage] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ApprovedAccount>>({});

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/customer-accounts/approved");
      const data = await res.json();
      if (data.success) {
        setAccounts(data.data);
        setFiltered(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch approved accounts", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Load live balance, card info, and transactions when expanded
  useEffect(() => {
    if (!expandedId) return;
    const acc = accounts.find(a => a._id === expandedId);
    if (!acc) return;

    const fetchLiveDetails = async () => {
      setLiveData(prev => ({
        ...prev,
        [expandedId]: { balance: acc.initialDeposit, status: "active", cards: [], loading: true }
      }));

      try {
        const res = await fetch(`http://localhost:5000/api/accounts/live/${acc.accountNumber}`);
        const data = await res.json();
        if (data.success) {
          setLiveData(prev => ({
            ...prev,
            [expandedId]: { balance: data.balance, status: data.status, cards: data.cards || [], loading: false }
          }));
        }
      } catch (err) {
        console.error("Failed to fetch live account details:", err);
        setLiveData(prev => ({
          ...prev,
          [expandedId]: { balance: acc.initialDeposit, status: "active", cards: [], loading: false }
        }));
      }
    };

    const fetchTransactions = async () => {
      setTxData(prev => ({
        ...prev,
        [expandedId]: { data: [], loading: true }
      }));

      try {
        const res = await fetch(`http://localhost:5000/api/transactions/account/${acc.accountNumber}`);
        const data = await res.json();
        if (data.success) {
          setTxData(prev => ({
            ...prev,
            [expandedId]: { data: data.data || [], loading: false }
          }));
        }
      } catch (err) {
        console.error("Failed to fetch transactions for passbook:", err);
        setTxData(prev => ({
          ...prev,
          [expandedId]: { data: [], loading: false }
        }));
      }
    };

    fetchLiveDetails();
    fetchTransactions();
  }, [expandedId, accounts]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`CRITICAL WARNING: Are you sure you want to permanently delete the account for ${name}? This action cannot be undone and will delete all associated customer records.`)) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/customer-accounts/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      
      if (data.success) {
        setAccounts(prev => prev.filter(a => a._id !== id));
        setFiltered(prev => prev.filter(a => a._id !== id));
      } else {
        alert(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting.");
    }
  };

  const handleEditInit = (acc: ApprovedAccount) => {
    setEditingId(acc._id);
    setEditForm({
      firstName: acc.firstName,
      lastName: acc.lastName,
      email: acc.email,
      mobile: acc.mobile,
      accountType: acc.accountType
    });
  };

  const handleEditSave = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/customer-accounts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      const data = await response.json();
      
      if (data.success) {
        setAccounts(prev => prev.map(a => a._id === id ? { ...a, ...editForm } : a));
        setFiltered(prev => prev.map(a => a._id === id ? { ...a, ...editForm } : a));
        setEditingId(null);
      } else {
        alert(data.message || "Failed to update account");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating.");
    }
  };

  useEffect(() => {
    const q = search.toLowerCase();
    if (!q) { setFiltered(accounts); return; }
    setFiltered(accounts.filter(a =>
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
      a.customerId.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.accountNumber.includes(q) ||
      a.mobile.includes(q) ||
      a.pan?.toLowerCase().includes(q)
    ));
  }, [search, accounts]);

  const copy = (text: string) => navigator.clipboard.writeText(text);

  const openPassbook = (acc: ApprovedAccount) => {
    setPassbookAccount(acc);
    const txs = txData[acc._id]?.data || [];
    const hasLive = liveData[acc._id];
    const liveBalance = hasLive ? hasLive.balance : acc.initialDeposit;

    // Mathematically calculate balance after each transaction walking backwards from live balance
    let tempBal = liveBalance;
    const computedTxs = txs.map((tx: any) => {
      const txWithBal = {
        ...tx,
        balanceAfter: tempBal
      };
      if (tx.type === "credit") {
        tempBal -= tx.amount;
      } else {
        tempBal += tx.amount;
      }
      return txWithBal;
    });

    setPassbookTransactions(computedTxs);
    setPassbookPage(1);
    
    // Map initial remarks so they are editable
    const initialRemarksMap: Record<string, string> = {};
    computedTxs.forEach((tx: any) => {
      initialRemarksMap[tx._id] = tx.remarks || tx.transferMode || "Transfer";
    });
    setEditedRemarks(initialRemarksMap);
  };


  const handleRemarkChange = (id: string, value: string) => {
    setEditedRemarks(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const printPassbook = () => {
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      const style = document.createElement("style");
      style.innerHTML = `
        @media print {
          body {
            background: #fff !important;
            color: #000 !important;
            font-family: serif !important;
          }
          .no-print {
            display: none !important;
          }
          .passbook-container {
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
          }
          .passbook-page {
            page-break-after: always;
          }
        }
      `;
      document.head.appendChild(style);
      
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>LomaX Digital Passbook - ${passbookAccount?.firstName} ${passbookAccount?.lastName}</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { font-family: 'Courier New', Courier, monospace; background-color: #fff; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #999; padding: 8px; text-align: left; }
              </style>
            </head>
            <body onload="window.print();window.close();">
              <div class="p-8 max-w-4xl mx-auto">
                ${printContent}
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
            Account List
          </h1>
          <p className="text-slate-400 mt-1 text-sm">{accounts.length} active account{accounts.length !== 1 ? "s" : ""} — showing all approved customers with live balances.</p>
        </div>
        <Button onClick={fetchAccounts} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh List
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Search by name, ID, account no, mobile, PAN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-900/60 border-slate-700 text-slate-200 placeholder:text-slate-600 focus-visible:border-emerald-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Accounts", value: accounts.length, color: "emerald" },
          { label: "Savings", value: accounts.filter(a => a.accountType === "Savings Account").length, color: "cyan" },
          { label: "Current", value: accounts.filter(a => a.accountType === "Current Account").length, color: "blue" },
          { label: "Others", value: accounts.filter(a => !["Savings Account", "Current Account"].includes(a.accountType)).length, color: "purple" },
        ].map(s => (
          <div key={s.label} className={`border border-${s.color}-500/20 bg-${s.color}-950/10 rounded-xl p-4`}>
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold text-${s.color}-400`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 animate-pulse">Loading accounts...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-slate-800 rounded-2xl bg-slate-950/40">
          <CreditCard className="w-12 h-12 mx-auto text-slate-700 mb-4" />
          <p className="text-slate-400 font-medium">{search ? "No accounts match your search." : "No approved accounts yet."}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((acc) => {
            const hasLive = liveData[acc._id];
            const liveBalance = hasLive ? hasLive.balance : acc.initialDeposit;
            
            return (
              <div key={acc._id} className="border border-slate-800/80 rounded-2xl bg-slate-950/60 backdrop-blur-md overflow-hidden hover:border-slate-700/80 transition-all">
                {/* Main Row */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-5">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                    {acc.firstName?.[0]}{acc.lastName?.[0]}
                  </div>

                  {/* Core Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-bold text-white text-lg">{acc.firstName} {acc.lastName}</h3>
                      <span className="font-mono text-emerald-400 text-sm bg-emerald-950/40 px-2 py-0.5 rounded">{acc.customerId}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold border bg-emerald-950/50 border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ACTIVE
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-slate-400">
                      <span><Mail className="inline w-3.5 h-3.5 mr-1" />{acc.email}</span>
                      <span><Phone className="inline w-3.5 h-3.5 mr-1" />{acc.mobile}</span>
                      <span><CreditCard className="inline w-3.5 h-3.5 mr-1" />{acc.accountType}</span>
                      <span><Building2 className="inline w-3.5 h-3.5 mr-1" />{acc.branchName}</span>
                    </div>
                    <div className="mt-2 font-mono text-cyan-300 text-sm font-semibold flex items-center gap-2">
                      <span className="text-slate-500 text-xs font-normal">A/C:</span>
                      {acc.accountNumber}
                      <Copy className="w-3.5 h-3.5 cursor-pointer text-slate-500 hover:text-cyan-300 transition-colors" onClick={() => copy(acc.accountNumber)} />
                    </div>
                  </div>

                  {/* Balance & Actions */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div className="text-right hidden sm:block mr-2">
                      <p className="text-xs text-slate-500">Live Balance</p>
                      <p className="text-lg font-bold text-emerald-400">
                        ₹{liveBalance?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "0.00"}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost" className="text-blue-400 hover:bg-blue-500/20 hover:text-blue-300" onClick={() => handleEditInit(acc)} title="Edit Account">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-red-400 hover:bg-red-500/20 hover:text-red-300" onClick={() => handleDelete(acc._id, `${acc.firstName} ${acc.lastName}`)} title="Delete Account">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setExpandedId(expandedId === acc._id ? null : acc._id)} className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs">
                      {expandedId === acc._id ? "Collapse" : "Full Details"}
                    </Button>
                  </div>
                </div>

                {/* Expanded Edit Form */}
                {editingId === acc._id && (
                  <div className="border-t border-slate-800/60 p-5 bg-slate-900/40 animate-in fade-in duration-300 space-y-4">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                      <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2"><Edit2 className="w-4 h-4" /> Edit Account Details</h4>
                      <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="text-slate-400 hover:text-white h-6 w-6"><X className="w-4 h-4" /></Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">First Name</label>
                        <Input value={editForm.firstName || ""} onChange={(e) => setEditForm(prev => ({...prev, firstName: e.target.value}))} className="bg-slate-900 border-slate-700 text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Last Name</label>
                        <Input value={editForm.lastName || ""} onChange={(e) => setEditForm(prev => ({...prev, lastName: e.target.value}))} className="bg-slate-900 border-slate-700 text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Email</label>
                        <Input value={editForm.email || ""} onChange={(e) => setEditForm(prev => ({...prev, email: e.target.value}))} className="bg-slate-900 border-slate-700 text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Mobile</label>
                        <Input value={editForm.mobile || ""} onChange={(e) => setEditForm(prev => ({...prev, mobile: e.target.value}))} className="bg-slate-900 border-slate-700 text-white" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button onClick={() => handleEditSave(acc._id)} className="bg-blue-600 hover:bg-blue-500 text-white"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
                    </div>
                  </div>
                )}

                {/* Expanded Full Details - Structured Parallel Grid Boxes */}
                {expandedId === acc._id && editingId !== acc._id && (
                  <div className="border-t border-slate-800/60 p-6 bg-slate-950/90 animate-in fade-in duration-300 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      
                      {/* Box 1: Customer Profile & Identification */}
                      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                        <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <User className="w-4 h-4" /> Personal Profile
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-slate-500 text-xs block">Full Name</span>
                            <span className="text-slate-200 font-semibold">{acc.firstName} {acc.lastName}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-slate-500 text-xs block">PAN Card</span>
                              <span className="text-slate-200 font-mono font-medium">{acc.pan || "—"}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 text-xs block">Aadhaar Number</span>
                              <span className="text-slate-200 font-mono font-medium">{acc.aadhaar || "—"}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs block">Contact Number</span>
                            <span className="text-slate-200 font-mono">{acc.mobile || "—"}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs block">Email Address</span>
                            <span className="text-slate-200 truncate block">{acc.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Box 2: Login Credentials & Portal Access */}
                      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                        <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Shield className="w-4 h-4" /> Portal Access
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-slate-500 text-xs block">Customer Portal ID</span>
                            <span className="text-cyan-300 font-mono font-bold flex items-center gap-2 mt-0.5">
                              {acc.customerId}
                              <Copy className="w-3.5 h-3.5 cursor-pointer text-slate-500 hover:text-cyan-300" onClick={() => copy(acc.customerId)} />
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs block">Secure Temp Password</span>
                            <span className="font-mono font-bold flex items-center gap-2 text-amber-300 mt-0.5">
                              {showPassFor === acc._id ? acc.plainPassword : "••••••••"}
                              <button onClick={() => setShowPassFor(showPassFor === acc._id ? null : acc._id)} className="text-slate-500 hover:text-amber-300 transition-colors">
                                {showPassFor === acc._id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              {showPassFor === acc._id && (
                                <Copy className="w-3.5 h-3.5 cursor-pointer text-slate-500 hover:text-amber-300" onClick={() => copy(acc.plainPassword)} />
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs block">Verification Status</span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Portal Verified
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Box 3: Account Financial Summary */}
                      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                        <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Landmark className="w-4 h-4" /> Account Ledger
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-slate-500 text-xs block">Account Number</span>
                            <span className="text-cyan-300 font-mono font-bold block">{acc.accountNumber}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs block">Account Type</span>
                            <span className="text-slate-200 font-medium block mt-0.5">{acc.accountType}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs block">Live Balance Ledger</span>
                            <span className="text-xl font-extrabold text-emerald-400 block mt-0.5">
                              ₹{liveBalance?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "0.00"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Box 4: Routing & Branch Details */}
                      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Building2 className="w-4 h-4" /> Branch Routing
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-slate-500 text-xs block">Home Branch</span>
                            <span className="text-slate-200 font-semibold block">{acc.branchName}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-slate-500 text-xs block">Branch Code</span>
                              <span className="text-slate-200 font-mono">{acc.branchCode}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 text-xs block">IFSC Code</span>
                              <span className="text-slate-200 font-mono">{acc.ifscCode}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs block">Status</span>
                            <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Active Routing</span>
                          </div>
                        </div>
                      </div>

                      {/* Box 5: Facilities Opted */}
                      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                        <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Info className="w-4 h-4" /> Opted Facilities
                        </h4>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-1.5">
                            {acc.services && Object.entries(acc.services).map(([k, v]) => (
                              <span key={k} className={`px-2.5 py-1 text-xs rounded-full border font-medium ${
                                v ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300" : "bg-slate-800/40 border-slate-700 text-slate-500 line-through"
                              }`}>
                                {serviceLabels[k] || k}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Box 6: Linked Cards (Shows Real-Time Card details) */}
                      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
                        <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" /> Linked Cards
                        </h4>
                        
                        {hasLive && hasLive.loading ? (
                          <div className="text-xs text-slate-500 py-4 animate-pulse">Loading linked cards...</div>
                        ) : hasLive && hasLive.cards && hasLive.cards.length > 0 ? (
                          <div className="space-y-3 overflow-y-auto max-h-[140px] pr-1">
                            {hasLive.cards.map((card: any) => (
                              <div key={card._id} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-1 relative">
                                <div className="flex justify-between items-center">
                                  <span className="font-mono text-cyan-400 font-bold text-xs">
                                    {card.cardNetwork} {card.cardType}
                                  </span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                    card.status === "Active" ? "bg-emerald-950 text-emerald-400 border border-emerald-500/20" : "bg-rose-950 text-rose-400 border border-rose-500/20"
                                  }`}>
                                    {card.status}
                                  </span>
                                </div>
                                <div className="text-slate-300 font-mono text-sm tracking-wider font-bold">
                                  **** **** **** {card.cardNumber.slice(-4)}
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                  <span>{card.cardHolderName}</span>
                                  <span>EXP: {card.expiryDate}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500 py-6 text-center border border-dashed border-slate-800 rounded-xl">
                            No cards linked to this account
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Box 7: Digital Passbook & Ledger Actions */}
                    <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-200 text-sm">Customer Digital Passbook Booklet</h5>
                          <p className="text-xs text-slate-500 mt-0.5">Generate, view, and print/download styled passbook ledger statement with editable particulars.</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => openPassbook(acc)}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs py-2 px-4 rounded-xl gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      >
                        <BookOpen className="w-4 h-4" /> Open Passbook
                      </Button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* digital Passbook modal overlay */}
      {passbookAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-slate-900 border-b border-slate-800 no-print">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                  Digital Passbook Booklet
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={printPassbook} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2 h-9 text-xs">
                  <Printer className="w-4 h-4" /> Print / PDF
                </Button>
                <Button onClick={() => setPassbookAccount(null)} variant="ghost" className="text-slate-400 hover:text-white h-9 w-9 p-0">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Modal Body - Designed to look like a physical booklet */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-950/30">
              
              <div ref={printRef} className="bg-[#fcfaf2] text-[#2c1d11] p-8 border border-[#e8dfc9] rounded-xl shadow-inner font-mono text-xs">
                
                {/* Cover / Customer Details Page */}
                <div className="border-b-2 border-dashed border-[#8c7853] pb-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-bold tracking-widest text-[#5c4d37] uppercase">LOMAX DIGITAL BANKING</h2>
                      <p className="text-[10px] text-slate-600 font-sans uppercase">Cyber-Security Grade Asset Ledger</p>
                    </div>
                    <div className="border border-[#8c7853] px-3 py-1 rounded bg-[#fffdf9] font-bold text-[#8c7853]">
                      PASSBOOK
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p><span className="text-[#8c7853] font-sans">A/C Holder:</span> <strong className="text-sm font-sans uppercase">{passbookAccount.firstName} {passbookAccount.lastName}</strong></p>
                      <p><span className="text-[#8c7853] font-sans">Account No:</span> <strong>{passbookAccount.accountNumber}</strong></p>
                      <p><span className="text-[#8c7853] font-sans">Customer ID:</span> <strong>{passbookAccount.customerId}</strong></p>
                      <p><span className="text-[#8c7853] font-sans">Account Type:</span> <span className="uppercase">{passbookAccount.accountType}</span></p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p><span className="text-[#8c7853] font-sans">Branch:</span> <span className="uppercase">{passbookAccount.branchName}</span></p>
                      <p><span className="text-[#8c7853] font-sans">IFSC:</span> <strong>{passbookAccount.ifscCode}</strong></p>
                      <p><span className="text-[#8c7853] font-sans">Issue Date:</span> {new Date(passbookAccount.createdAt).toLocaleDateString()}</p>
                      <p><span className="text-[#8c7853] font-sans">Page Number:</span> Page {passbookPage} of 50</p>
                    </div>
                  </div>
                </div>

                {/* Ledger entry instruction */}
                <div className="bg-[#fffdf8] border border-[#e6dec5] p-2 mb-4 text-[10px] text-slate-600 no-print flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>You can click and edit the **Particulars** of any transaction below directly before printing.</span>
                </div>

                {/* Ledger Sheet */}
                <table className="w-full text-left text-xs border border-[#8c7853]">
                  <thead>
                    <tr className="bg-[#f3edd9] border-b border-[#8c7853]">
                      <th className="px-3 py-2 border-r border-[#8c7853] text-[#5c4d37]">Date</th>
                      <th className="px-3 py-2 border-r border-[#8c7853] text-[#5c4d37]">Particulars / Narrative</th>
                      <th className="px-3 py-2 border-r border-[#8c7853] text-[#5c4d37] text-right">Debit (Dr)</th>
                      <th className="px-3 py-2 border-r border-[#8c7853] text-[#5c4d37] text-right">Credit (Cr)</th>
                      <th className="px-3 py-2 border-r border-[#8c7853] text-[#5c4d37] text-right">Balance</th>
                      <th className="px-3 py-2 text-[#5c4d37] text-center">Initials</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passbookTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-slate-500 italic">
                          No transactions recorded. Passbook empty.
                        </td>
                      </tr>
                    ) : (
                      passbookTransactions.map((tx) => {
                        const isCredit = tx.type === "credit";
                        return (
                          <tr key={tx._id} className="border-b border-[#e2d9be] hover:bg-[#faf4df]">
                            <td className="px-3 py-2 border-r border-[#8c7853] whitespace-nowrap">
                              {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                              <div className="text-[9px] text-slate-500 mt-0.5">{new Date(tx.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                            </td>
                            <td className="px-3 py-2 border-r border-[#8c7853]">
                              <input
                                type="text"
                                value={editedRemarks[tx._id] || ""}
                                onChange={(e) => handleRemarkChange(tx._id, e.target.value)}
                                className="bg-transparent border-none outline-none focus:ring-1 focus:ring-amber-500/50 w-full font-mono text-xs text-[#2c1d11]"
                              />
                            </td>
                            <td className="px-3 py-2 border-r border-[#8c7853] text-right text-rose-800 font-semibold">
                              {!isCredit ? `₹${tx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                            </td>
                            <td className="px-3 py-2 border-r border-[#8c7853] text-right text-emerald-800 font-semibold">
                              {isCredit ? `₹${tx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                            </td>
                            <td className="px-3 py-2 border-r border-[#8c7853] text-right font-bold text-[#5c4d37]">
                              {/* If tx doesn't store balance, we display fallback or calculated balance */}
                              ₹{(tx.balanceAfter || tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-3 py-2 text-center text-slate-400 italic text-[10px]">
                              [LMX]
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {/* Stamp Page Bottom */}
                <div className="mt-12 flex justify-between items-end">
                  <div className="text-center font-sans text-[8px] text-slate-500">
                    DIGITALLY SIGNED CERTIFICATE
                    <div className="font-mono text-[9px] text-[#8c7853] mt-1">LOMAX-SYS-SHA256</div>
                  </div>
                  <div className="text-center border-2 border-dashed border-[#8c7853] px-6 py-3 rounded-full text-[#8c7853] uppercase font-bold text-[9px] rotate-[-5deg]">
                    LomaX Branch Stamp
                  </div>
                  <div className="w-32 border-b border-[#8c7853] pb-1 text-center text-[10px] text-slate-600">
                    Branch Manager
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
