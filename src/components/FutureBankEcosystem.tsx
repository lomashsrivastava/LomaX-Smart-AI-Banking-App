'use client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { 
  Briefcase, PiggyBank, DollarSign, BarChart3, Users, Building2,
  ChevronDown, UserPlus, CreditCard, Send, CheckCircle2, AlertCircle, AlertTriangle, UserCircle2, ArrowRightLeft,
  FileText, Activity, Server, Smartphone, Globe, ShieldCheck, Mail, Bell, Search, LayoutDashboard,
  Wallet, FileDown, ShieldAlert, Sliders, ChevronRight, Check, TrendingUp, ScanFace, QrCode, Plus, LogOut, HeartHandshake, FileBadge, LifeBuoy, ArrowLeft
} from 'lucide-react';
import { useState } from 'react';

// --- MOCK DATA ---
const overviewData = [
  { name: '1 Apr', income: 150, expense: 120 }, { name: '8 Apr', income: 230, expense: 160 },
  { name: '15 Apr', income: 325, expense: 180 }, { name: '22 Apr', income: 280, expense: 210 },
  { name: '30 Apr', income: 380, expense: 199 },
];
const reportData = [
  { name: 'Mon', val: 40 }, { name: 'Tue', val: 65 }, { name: 'Wed', val: 45 },
  { name: 'Thu', val: 80 }, { name: 'Fri', val: 50 }, { name: 'Sat', val: 90 }, { name: 'Sun', val: 70 }
];
const depositData = [
  { name: 'Savings', value: 95650, color: '#3b82f6' }, { name: 'Current', value: 45320, color: '#a855f7' },
  { name: 'Fixed Deposit', value: 28450, color: '#22c55e' }, { name: 'Loan Accounts', value: 18230, color: '#f43f5e' },
];

// --- REUSABLE COMPONENTS ---
const Card = ({ children, className = '', onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, action }: { title: string, action?: React.ReactNode }) => (
  <div className="flex justify-between items-center mb-3">
    <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
    {action && <div className="text-[10px] text-blue-600 font-medium cursor-pointer">{action}</div>}
  </div>
);

export default function FutureBankEcosystem() {
  // STATE MANAGEMENT
  const [activeRole, setActiveRole] = useState<'Admin' | 'Customer'>('Admin');
  const [activeModule, setActiveModule] = useState<'Dashboard' | 'Accounts' | 'Loans' | 'Cards'>('Dashboard');
  const [mobileScreen, setMobileScreen] = useState<'Home' | 'SendMoney' | 'AccountsList'>('Home');
  const [showCardModal, setShowCardModal] = useState(false);

  // VIEW RENDERS
  const renderAccountsModule = () => (
    <div className="p-6 h-full bg-[#f4f7fe]">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Briefcase/> Accounts Management</h2>
      <Card className="p-4 h-[90%] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
           <input type="text" placeholder="Search accounts..." className="border border-slate-200 rounded-lg px-4 py-2 text-sm w-64 bg-slate-50"/>
           <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Plus className="w-4 h-4"/> New Account</button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
              <th className="pb-3">Account Number</th><th className="pb-3">Customer Name</th>
              <th className="pb-3">Type</th><th className="pb-3">Balance</th><th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({length: 10}).map((_, i) => (
              <tr key={i} className="text-sm border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 font-mono text-blue-600 font-bold">502000{1000+i}</td>
                <td className="py-3 font-bold text-slate-800">Customer {i+1}</td>
                <td className="py-3 text-slate-600">{i % 2 === 0 ? 'Savings' : 'Current'}</td>
                <td className="py-3 font-bold text-slate-800">₹ {(Math.random() * 500000).toFixed(2)}</td>
                <td className="py-3"><span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  const renderLoansModule = () => (
    <div className="p-6 h-full bg-[#f4f7fe]">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><DollarSign/> Loan Portfolio Manager</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="p-4"><p className="text-xs text-slate-500">Active Loans</p><h3 className="text-xl font-bold">12,450</h3></Card>
        <Card className="p-4"><p className="text-xs text-slate-500">Pending Approvals</p><h3 className="text-xl font-bold text-amber-500">18</h3></Card>
        <Card className="p-4"><p className="text-xs text-slate-500">Overdue Amount</p><h3 className="text-xl font-bold text-red-500">₹ 28.45 Cr</h3></Card>
      </div>
      <Card className="p-4 h-[70%] flex items-center justify-center text-slate-400 font-bold">
         Interactive Loan Data Grid would render here...
      </Card>
    </div>
  );

  const renderCardsModule = () => (
    <div className="p-6 h-full bg-[#f4f7fe] relative">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><CreditCard/> Card Issuing Module</h2>
      <Card className="p-4 h-[85%]">
         <div className="flex justify-end mb-4">
           <button onClick={() => setShowCardModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><CreditCard className="w-4 h-4"/> Generate New Card</button>
         </div>
         <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="pb-3">Customer</th><th className="pb-3">Card Type</th><th className="pb-3">Number</th><th className="pb-3">Limit</th><th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[{ n: 'Rahul Sharma', t: 'Visa Platinum', num: '**** 5678', l: '₹ 2,00,000', s: 'Active' },
                { n: 'Shruti Patel', t: 'Mastercard Gold', num: '**** 9876', l: '₹ 1,50,000', s: 'Active' }].map((c, i) => (
                <tr key={i} className="text-sm border-b border-slate-50">
                  <td className="py-3 font-bold text-slate-800">{c.n}</td><td className="py-3 text-slate-600">{c.t}</td>
                  <td className="py-3 font-mono font-bold">{c.num}</td><td className="py-3 text-slate-800">{c.l}</td>
                  <td className="py-3"><span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">{c.s}</span></td>
                </tr>
              ))}
            </tbody>
         </table>
      </Card>

      {/* Floating Modal for Cards Module */}
      {showCardModal && (
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-80 bg-white rounded-2xl shadow-2xl p-6 relative">
             <button onClick={() => setShowCardModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold">✕</button>
             <h3 className="text-lg font-bold text-slate-800 mb-4">Generate New Card</h3>
             <div className="space-y-4">
               <div><label className="text-xs font-bold text-slate-500 mb-1 block">Customer ID</label><input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm" placeholder="Enter ID..."/></div>
               <div><label className="text-xs font-bold text-slate-500 mb-1 block">Card Type</label><select className="w-full border border-slate-200 rounded-lg p-2 text-sm"><option>Visa Platinum</option><option>Mastercard Gold</option></select></div>
               <button onClick={() => setShowCardModal(false)} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">Issue Card</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCustomerWebPortal = () => (
    <div className="p-6 h-full bg-[#f4f7fe] flex flex-col justify-center items-center text-center">
       <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6">
         <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Rahul" className="w-20 h-20 rounded-full" />
       </div>
       <h1 className="text-4xl font-black text-slate-800 mb-2">Welcome Back, Rahul!</h1>
       <p className="text-slate-500 mb-8 max-w-md">Access your banking services seamlessly from any device. Explore the mobile app emulator on the right for on-the-go banking.</p>
       <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
          <Card className="p-6 flex flex-col items-center gap-3"><Briefcase className="w-8 h-8 text-blue-600"/><h3 className="font-bold">My Accounts</h3></Card>
          <Card className="p-6 flex flex-col items-center gap-3"><ArrowRightLeft className="w-8 h-8 text-emerald-600"/><h3 className="font-bold">Transfers</h3></Card>
          <Card className="p-6 flex flex-col items-center gap-3"><CreditCard className="w-8 h-8 text-purple-600"/><h3 className="font-bold">My Cards</h3></Card>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f2c] p-6 font-sans overflow-x-auto overflow-y-hidden flex items-start justify-center gap-6 w-max mx-auto"
         style={{ background: 'radial-gradient(circle at bottom left, #1e3a8a 0%, #0a0f2c 40%)' }}>
      
      {/* =========================================================================
          LEFT COLUMN: Multi Role Login & Core Modules 
          ========================================================================= */}
      <div className="flex flex-col gap-6 w-[280px] shrink-0 h-[90vh]">
        
        {/* Multi Role Login Panel */}
        <Card className="p-4 flex flex-col gap-3 relative">
           <h2 className="text-sm font-bold text-slate-800 text-center mb-2 border-b border-slate-100 pb-2">Multi Role Login</h2>
           
           <div onClick={() => { setActiveRole('Admin'); setActiveModule('Dashboard'); }} 
                className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-all ${activeRole === 'Admin' ? 'bg-blue-50 border-blue-200 shadow-sm scale-105' : 'hover:bg-slate-50 border-transparent hover:border-slate-100'}`}>
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin" alt="Admin" className="w-10 h-10 rounded-full bg-white shadow-sm" />
             <div><p className="text-sm font-bold text-slate-800 leading-tight">Super Admin</p><p className="text-[10px] text-blue-600 font-medium">Full Access</p></div>
           </div>

           <div onClick={() => { setActiveRole('Customer'); setActiveModule('Dashboard'); }} 
                className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-all ${activeRole === 'Customer' ? 'bg-blue-50 border-blue-200 shadow-sm scale-105' : 'hover:bg-slate-50 border-transparent hover:border-slate-100'}`}>
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Rahul" alt="Customer" className="w-10 h-10 rounded-full bg-white shadow-sm" />
             <div><p className="text-sm font-bold text-slate-800 leading-tight">Customer</p><p className="text-[10px] text-blue-500 font-medium">Banking Services</p></div>
           </div>
        </Card>

        {/* All Core Modules Grid */}
        <Card className={`p-4 flex-1 flex flex-col overflow-hidden relative transition-opacity duration-300 ${activeRole === 'Customer' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <h2 className="text-sm font-bold text-slate-800 text-center mb-4 border-b border-slate-100 pb-2">Core Modules (Admin)</h2>
          <div className="grid grid-cols-3 gap-y-6 gap-x-2 flex-1 overflow-y-auto scrollbar-hide pb-10">
            {[
              { i: <LayoutDashboard/>, l: 'Dashboard', m: 'Dashboard', c: 'text-indigo-600 bg-indigo-50' },
              { i: <Briefcase/>, l: 'Accounts', m: 'Accounts', c: 'text-blue-600 bg-blue-50' },
              { i: <DollarSign/>, l: 'Loans', m: 'Loans', c: 'text-emerald-500 bg-emerald-50' },
              { i: <CreditCard/>, l: 'Cards', m: 'Cards', c: 'text-rose-500 bg-rose-50' },
              { i: <Users/>, l: 'Customers', m: 'Dashboard', c: 'text-purple-600 bg-purple-50' },
              { i: <PiggyBank/>, l: 'Deposits', m: 'Dashboard', c: 'text-amber-500 bg-amber-50' },
            ].map((mod, i) => (
              <div key={i} onClick={() => setActiveModule(mod.m as any)} className={`flex flex-col items-center justify-start cursor-pointer group ${activeModule === mod.m ? 'scale-110 font-black' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 ${mod.c} group-hover:scale-110 transition-transform shadow-sm ${activeModule === mod.m ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}>
                  <div className="[&>svg]:w-5 [&>svg]:h-5">{mod.i}</div>
                </div>
                <span className="text-[9px] text-center font-semibold text-slate-600 leading-tight w-full px-1">{mod.l}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* =========================================================================
          CENTER COLUMN: Dynamic Routing Engine
          ========================================================================= */}
      <div className="w-[1050px] shrink-0 bg-[#f4f7fe] rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh] border border-white/10 relative transition-all duration-500">
        
        {/* HEADER */}
        <header className="h-16 bg-white flex items-center justify-between px-6 shrink-0 z-20 shadow-sm relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
            <div>
              <h1 className="font-bold text-slate-900 leading-none text-lg">FutureBank</h1>
              <p className="text-[8px] text-slate-500 uppercase tracking-widest font-semibold">Banking Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <img src={activeRole === 'Admin' ? "https://api.dicebear.com/7.x/notionists/svg?seed=Admin" : "https://api.dicebear.com/7.x/notionists/svg?seed=Rahul"} alt="User" className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white shadow-sm" />
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">{activeRole === 'Admin' ? 'Super Admin' : 'Rahul Sharma'}</p>
                <p className="text-[10px] text-slate-500 font-medium">{activeRole === 'Admin' ? 'Administrator' : 'Customer'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* ROUTING ENGINE LOGIC */}
        {activeRole === 'Customer' ? renderCustomerWebPortal() : 
          activeModule === 'Accounts' ? renderAccountsModule() :
          activeModule === 'Loans' ? renderLoansModule() :
          activeModule === 'Cards' ? renderCardsModule() :
          (
            <div className="flex-1 overflow-y-auto p-4 flex">
              {/* Massive Admin Dashboard Overview (from Phase 13) */}
              <div className="flex-1 flex flex-col gap-4">
                {/* ROW 1: KPIs */}
                <div className="grid grid-cols-6 gap-3">
                  {[
                    { l: 'Total Customers', v: '1,24,568', p: '12.45%', c: 'text-blue-600 bg-blue-50', i: <Users/> },
                    { l: 'Total Accounts', v: '1,87,650', p: '8.35%', c: 'text-purple-600 bg-purple-50', i: <Building2/> },
                    { l: 'Total Deposits', v: '₹ 2,458.75 Cr', p: '10.21%', c: 'text-amber-500 bg-amber-50', i: <PiggyBank/> },
                    { l: 'Total Loans', v: '₹ 1,824.35 Cr', p: '9.32%', c: 'text-purple-600 bg-purple-50', i: <DollarSign/> },
                    { l: 'Total Profit', v: '₹ 125.75 Cr', p: '13.25%', c: 'text-emerald-500 bg-emerald-50', i: <BarChart3/> },
                    { l: 'Total Branches', v: '256', sub: 'Active', c: 'text-blue-600 bg-blue-50', i: <Building2/> }
                  ].map((kpi, i) => (
                    <Card key={i} className="p-3 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${kpi.c}`}><div className="[&>svg]:w-5 [&>svg]:h-5">{kpi.i}</div></div>
                      <div>
                        <p className="text-[9px] text-slate-500 font-bold tracking-wide">{kpi.l}</p>
                        <h4 className="text-sm font-black text-slate-800 leading-tight my-0.5">{kpi.v}</h4>
                        {kpi.p ? <p className="text-[9px] text-emerald-500 font-bold flex items-center"><TrendingUp className="w-2.5 h-2.5 mr-0.5" /> {kpi.p}</p> : <p className="text-[9px] text-slate-400">{kpi.sub}</p>}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* ROW 2: Charts */}
                <div className="grid grid-cols-12 gap-4">
                  <Card className="col-span-8 p-4 flex flex-col h-64">
                    <SectionHeader title="Business Overview" />
                    <div className="flex-1 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={overviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="cInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                            <linearGradient id="cExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={v => `${v}Cr`} />
                          <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#cInc)" />
                          <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#cExp)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                  <Card className="col-span-4 p-4 flex flex-col h-64">
                    <SectionHeader title="Recent Transactions" action="View All >" />
                    <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide pr-1">
                      {[{ name: 'NEFT Transfer', amt: '₹ 25,00,000', icon: <ArrowRightLeft className="w-3 h-3"/>, bg: 'bg-emerald-50 text-emerald-500' },
                        { name: 'IMPS Transfer', amt: '₹ 5,75,000', icon: <Send className="w-3 h-3"/>, bg: 'bg-blue-50 text-blue-500' },
                        { name: 'Cash Deposit', amt: '₹ 3,25,000', icon: <DollarSign className="w-3 h-3"/>, bg: 'bg-emerald-50 text-emerald-500' }].map((tx, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className={`w-7 h-7 rounded-full flex items-center justify-center ${tx.bg}`}>{tx.icon}</div>
                             <p className="text-[10px] font-bold text-slate-800">{tx.name}</p>
                          </div>
                          <p className="text-[10px] font-black text-slate-800">{tx.amt}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )
        }
      </div>

      {/* =========================================================================
          RIGHT COLUMN: Interactive Mobile Mockup
          ========================================================================= */}
      <div className="flex flex-col gap-6 w-[350px] shrink-0 h-[90vh]">
        
        {/* Date Time Header */}
        <div className="text-right px-4">
          <p className="text-xs text-slate-400 font-medium">Interactive Phone Emulator</p>
          <div className="flex items-center justify-end gap-2 mt-1">
             <h2 className="text-xl font-bold text-white tracking-wider">LIVE TEST</h2>
          </div>
        </div>

        {/* The iPhone Frame */}
        <div className="mx-auto w-[280px] h-[580px] bg-slate-900 rounded-[40px] p-2.5 shadow-2xl relative border-4 border-slate-800 transition-all duration-300">
           {/* Notch */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20 flex justify-center items-center"><div className="w-10 h-1.5 bg-slate-800 rounded-full"></div></div>
           
           {/* App Screen Container */}
           <div className="w-full h-full bg-[#f8fafc] rounded-[30px] overflow-hidden relative flex flex-col pt-8 pb-4">
              
              {mobileScreen === 'Home' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                  {/* Header */}
                  <div className="px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Rahul" alt="User" className="w-8 h-8 rounded-full border border-white" />
                      <div><p className="text-[10px] font-bold text-slate-800">Hi, Rahul</p><p className="text-[8px] text-slate-500">Welcome Back 👋</p></div>
                    </div>
                    <Bell className="w-4 h-4 text-slate-600"/>
                  </div>
                  {/* Balance Card */}
                  <div className="px-4 mt-2">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -mr-10 -mt-10"></div>
                        <p className="text-[10px] font-medium text-blue-100 mb-1">Total Balance</p>
                        <h2 className="text-2xl font-black">₹ 4,58,750.50</h2>
                        <p className="text-[9px] text-blue-200 mt-2">Savings •••• 4567</p>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex justify-between px-6 mt-4">
                    <div onClick={() => setMobileScreen('SendMoney')} className="flex flex-col items-center gap-1.5 cursor-pointer hover:scale-110 transition-transform">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 shadow flex items-center justify-center"><Send className="w-4 h-4"/></div>
                        <span className="text-[8px] font-bold text-slate-600">Send Money</span>
                    </div>
                    <div onClick={() => setMobileScreen('AccountsList')} className="flex flex-col items-center gap-1.5 cursor-pointer hover:scale-110 transition-transform">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 shadow flex items-center justify-center"><Briefcase className="w-4 h-4"/></div>
                        <span className="text-[8px] font-bold text-slate-600">Accounts</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 shadow flex items-center justify-center"><ScanFace className="w-4 h-4"/></div>
                        <span className="text-[8px] font-bold text-slate-600">Scan QR</span>
                    </div>
                  </div>
                  {/* My Cards */}
                  <div className="px-4 mt-6 flex-1">
                    <h3 className="text-[11px] font-bold text-slate-800 mb-2">My Cards</h3>
                    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-4 text-white shadow-md relative overflow-hidden h-[110px]">
                        <div className="flex justify-between items-start mb-4"><span className="text-[10px] font-bold">FutureBank</span><span className="text-[8px] bg-emerald-500 px-2 py-0.5 rounded-full font-bold">Active</span></div>
                        <p className="text-lg font-mono tracking-widest font-bold mb-2">•••• 5678</p>
                        <div className="flex justify-between items-end"><p className="text-[9px]">Rahul Sharma</p><p className="text-[12px] font-black italic">VISA</p></div>
                    </div>
                  </div>
                </div>
              )}

              {mobileScreen === 'SendMoney' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col px-4">
                   <div className="flex items-center gap-2 py-2 mb-4">
                     <button onClick={() => setMobileScreen('Home')}><ArrowLeft className="w-5 h-5 text-slate-800"/></button>
                     <h2 className="text-sm font-bold text-slate-800">Send Money</h2>
                   </div>
                   <div className="flex-1 flex flex-col justify-center items-center gap-6">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Send className="w-8 h-8"/></div>
                      <h3 className="text-xl font-bold text-slate-800 text-center">Instant Transfer active.</h3>
                      <button onClick={() => setMobileScreen('Home')} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-10">Back to Home</button>
                   </div>
                </div>
              )}

              {mobileScreen === 'AccountsList' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col px-4">
                   <div className="flex items-center gap-2 py-2 mb-4">
                     <button onClick={() => setMobileScreen('Home')}><ArrowLeft className="w-5 h-5 text-slate-800"/></button>
                     <h2 className="text-sm font-bold text-slate-800">My Accounts</h2>
                   </div>
                   <div className="space-y-3">
                     {[
                       { n: 'Savings Account', num: '•••• 4567', v: '₹ 2,45,750', i: <Briefcase/>, c: 'bg-blue-50 text-blue-600' },
                       { n: 'Current Account', num: '•••• 8901', v: '₹ 1,25,000', i: <PiggyBank/>, c: 'bg-purple-50 text-purple-600' },
                       { n: 'Fixed Deposit', num: '•••• 1822', v: '₹ 88,000', i: <FileText/>, c: 'bg-emerald-50 text-emerald-600' },
                     ].map((a, i) => (
                       <div key={i} className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-slate-50 cursor-pointer hover:border-blue-200">
                          <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.c}`}>{a.i}</div>
                             <div><p className="text-[10px] font-bold text-slate-800">{a.n}</p><p className="text-[8px] text-slate-400 font-mono">{a.num}</p></div>
                          </div>
                          <p className="text-[11px] font-black text-slate-800">{a.v}</p>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {/* Bottom Home Indicator */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-300 rounded-full cursor-pointer hover:bg-slate-400" onClick={() => setMobileScreen('Home')}></div>
           </div>
        </div>

      </div>
    </div>
  );
}
