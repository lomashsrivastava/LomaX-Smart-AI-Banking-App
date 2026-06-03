'use client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { 
  Briefcase, PiggyBank, DollarSign, BarChart3, Users, Building2,
  ChevronDown, UserPlus, CreditCard, Send, CheckCircle2, AlertCircle, AlertTriangle, UserCircle2, ArrowRightLeft,
  FileText, Activity, Server, Smartphone, Globe, ShieldCheck, Mail, Bell, Search, LayoutDashboard,
  Wallet, FileDown, ShieldAlert, Sliders, ChevronRight, Check, TrendingUp, ScanFace, QrCode, Phone, Plus, LogOut, HeartHandshake, FileBadge, LifeBuoy
} from 'lucide-react';
import { useState } from 'react';

// --- MOCK DATA ---
const overviewData = [
  { name: '1 Apr', income: 150, expense: 120 },
  { name: '8 Apr', income: 230, expense: 160 },
  { name: '15 Apr', income: 325, expense: 180 },
  { name: '22 Apr', income: 280, expense: 210 },
  { name: '30 Apr', income: 380, expense: 199 },
];

const reportData = [
  { name: 'Mon', val: 40 }, { name: 'Tue', val: 65 }, { name: 'Wed', val: 45 },
  { name: 'Thu', val: 80 }, { name: 'Fri', val: 50 }, { name: 'Sat', val: 90 }, { name: 'Sun', val: 70 }
];

const depositData = [
  { name: 'Savings', value: 95650, color: '#3b82f6' },
  { name: 'Current', value: 45320, color: '#a855f7' },
  { name: 'Fixed Deposit', value: 28450, color: '#22c55e' },
  { name: 'Loan Accounts', value: 18230, color: '#f43f5e' },
];

// --- REUSABLE COMPONENTS ---
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}>
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
  const [showCardModal, setShowCardModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0f2c] p-6 font-sans overflow-x-auto overflow-y-hidden flex items-start justify-center gap-6 w-max mx-auto"
         style={{ background: 'radial-gradient(circle at bottom left, #1e3a8a 0%, #0a0f2c 40%)' }}>
      
      {/* =========================================================================
          LEFT COLUMN: Multi Role Login & Core Modules 
          ========================================================================= */}
      <div className="flex flex-col gap-6 w-[280px] shrink-0 h-[90vh]">
        
        {/* Multi Role Login Panel */}
        <Card className="p-4 flex flex-col gap-3">
           <h2 className="text-sm font-bold text-slate-800 text-center mb-2 border-b border-slate-100 pb-2">Multi Role Login</h2>
           
           <div className="flex items-center gap-3 p-2 rounded-xl bg-blue-50 border border-blue-100 cursor-pointer hover:shadow-md transition-shadow">
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin" alt="Admin" className="w-10 h-10 rounded-full bg-white shadow-sm" />
             <div>
               <p className="text-sm font-bold text-slate-800 leading-tight">Super Admin</p>
               <p className="text-[10px] text-blue-600 font-medium">Full Access</p>
             </div>
           </div>

           <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Manager" alt="Manager" className="w-10 h-10 rounded-full bg-slate-100 shadow-sm" />
             <div>
               <p className="text-sm font-bold text-slate-800 leading-tight">Branch Manager</p>
               <p className="text-[10px] text-purple-600 font-medium">Branch Operations</p>
             </div>
           </div>

           <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Staff" alt="Staff" className="w-10 h-10 rounded-full bg-slate-100 shadow-sm" />
             <div>
               <p className="text-sm font-bold text-slate-800 leading-tight">Staff / Teller</p>
               <p className="text-[10px] text-emerald-600 font-medium">Daily Banking</p>
             </div>
           </div>

           <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:shadow-md transition-shadow mt-2">
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Customer" alt="Customer" className="w-10 h-10 rounded-full bg-white shadow-sm" />
             <div>
               <p className="text-sm font-bold text-slate-800 leading-tight">Customer</p>
               <p className="text-[10px] text-blue-500 font-medium">Banking Services</p>
             </div>
           </div>
        </Card>

        {/* All Core Modules Grid */}
        <Card className="p-4 flex-1 flex flex-col overflow-hidden relative">
          <h2 className="text-sm font-bold text-slate-800 text-center mb-4 border-b border-slate-100 pb-2">All Core Modules</h2>
          
          <div className="grid grid-cols-3 gap-y-6 gap-x-2 flex-1 overflow-y-auto scrollbar-hide pb-10">
            {[
              { i: <Briefcase/>, l: 'Accounts', c: 'text-blue-600 bg-blue-50' },
              { i: <Users/>, l: 'Customers', c: 'text-purple-600 bg-purple-50' },
              { i: <PiggyBank/>, l: 'Deposits FD/RD', c: 'text-amber-500 bg-amber-50' },
              { i: <DollarSign/>, l: 'Loans', c: 'text-emerald-500 bg-emerald-50' },
              { i: <CreditCard/>, l: 'Cards', c: 'text-rose-500 bg-rose-50' },
              { i: <ArrowRightLeft/>, l: 'Fund Transfer', c: 'text-cyan-500 bg-cyan-50' },
              { i: <FileText/>, l: 'Bill Payments', c: 'text-orange-500 bg-orange-50' },
              { i: <FileBadge/>, l: 'Cheque Mgmt', c: 'text-indigo-500 bg-indigo-50' },
              { i: <TrendingUp/>, l: 'Investments', c: 'text-green-600 bg-green-50' },
              { i: <ShieldCheck/>, l: 'Locker Mgmt', c: 'text-blue-500 bg-blue-50' },
              { i: <UserCircle2/>, l: 'Payroll', c: 'text-rose-500 bg-rose-50' },
              { i: <HeartHandshake/>, l: 'HR Management', c: 'text-amber-500 bg-amber-50' },
              { i: <BarChart3/>, l: 'Reports', c: 'text-red-500 bg-red-50' },
              { i: <AlertTriangle/>, l: 'Audit Trail', c: 'text-slate-500 bg-slate-100' },
              { i: <LifeBuoy/>, l: 'Complaints', c: 'text-purple-500 bg-purple-50' },
              { i: <Sliders/>, l: 'Settings', c: 'text-slate-600 bg-slate-100' },
              { i: <Globe/>, l: 'Assets', c: 'text-blue-500 bg-blue-50' },
              { i: <Bell/>, l: 'Notices', c: 'text-amber-500 bg-amber-50' },
            ].map((mod, i) => (
              <div key={i} className="flex flex-col items-center justify-start cursor-pointer group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 ${mod.c} group-hover:scale-110 transition-transform shadow-sm`}>
                  <div className="[&>svg]:w-5 [&>svg]:h-5">{mod.i}</div>
                </div>
                <span className="text-[9px] text-center font-semibold text-slate-600 leading-tight w-full px-1">{mod.l}</span>
              </div>
            ))}
          </div>
          
          {/* Decorative tech background overlay at bottom of modules */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-900/90 to-transparent pointer-events-none rounded-b-2xl border-t border-blue-500/20" 
               style={{ backgroundImage: 'radial-gradient(circle at 50% 100%, rgba(37,99,235,0.2) 0%, transparent 50%)' }}>
          </div>
        </Card>

      </div>

      {/* =========================================================================
          CENTER COLUMN: Main Admin Dashboard 
          ========================================================================= */}
      <div className="w-[1050px] shrink-0 bg-[#f4f7fe] rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh] border border-white/10 relative">
        
        {/* HEADER */}
        <header className="h-16 bg-white flex items-center justify-between px-6 shrink-0 z-20 shadow-sm relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
            <div>
              <h1 className="font-bold text-slate-900 leading-none text-lg">FutureBank</h1>
              <p className="text-[8px] text-slate-500 uppercase tracking-widest font-semibold">Banking Management System</p>
            </div>
          </div>

          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search anything..." 
              className="w-full bg-slate-50 rounded-full pl-10 pr-12 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
               <span className="text-[10px] bg-white text-slate-400 px-1.5 py-0.5 rounded font-mono shadow-sm">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-6 h-4 rounded overflow-hidden shadow-sm border border-slate-200">
               <div className="w-full h-1/2 bg-red-600" />
               <div className="w-full h-1/2 bg-white relative"><div className="absolute inset-0 bg-blue-800 w-[40%]" /></div>
               {/* Crude USA Flag representation */}
            </div>
            
            <button className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 bg-slate-50">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[8px] text-white flex items-center justify-center font-bold">23</span>
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 bg-slate-50">
              <Mail className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 bg-slate-50">
              <ShieldCheck className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="Admin" className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white shadow-sm" />
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">Super Admin</p>
                <p className="text-[10px] text-slate-500 font-medium">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-4 flex">
          
          {/* Left Mini Sidebar within Dashboard */}
          <div className="w-48 shrink-0 pr-4 flex flex-col gap-6">
             <div>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 pl-2">Main Navigation</p>
               <ul className="space-y-0.5">
                 <li className="px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-xl font-semibold flex items-center gap-3"><LayoutDashboard className="w-4 h-4"/> Dashboard</li>
                 <li className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-3"><Users className="w-4 h-4"/> Customers</li>
                 <li className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl flex items-center justify-between"><div className="flex items-center gap-3"><Briefcase className="w-4 h-4"/> Accounts</div> <ChevronRight className="w-3 h-3 text-slate-400"/></li>
                 <li className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl flex items-center justify-between"><div className="flex items-center gap-3"><PiggyBank className="w-4 h-4"/> Deposits (FD/RD)</div> <ChevronRight className="w-3 h-3 text-slate-400"/></li>
                 <li className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl flex items-center justify-between"><div className="flex items-center gap-3"><DollarSign className="w-4 h-4"/> Loans</div> <ChevronRight className="w-3 h-3 text-slate-400"/></li>
                 <li className="px-3 py-2 text-sm text-blue-600 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-between"><div className="flex items-center gap-3"><CreditCard className="w-4 h-4"/> Cards</div> <ChevronDown className="w-3 h-3 text-blue-500"/></li>
                 <div className="pl-10 space-y-1 my-1">
                    <p className="text-[11px] text-slate-500 hover:text-blue-600 cursor-pointer py-1 flex items-center gap-2"><CreditCard className="w-3 h-3"/> Debit Cards</p>
                    <p className="text-[11px] text-slate-500 hover:text-blue-600 cursor-pointer py-1 flex items-center gap-2"><CreditCard className="w-3 h-3"/> Credit Cards</p>
                    <p className="text-[11px] text-blue-600 font-semibold py-1 flex items-center gap-2"><Globe className="w-3 h-3"/> Virtual Cards</p>
                 </div>
                 <li className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-3"><Activity className="w-4 h-4"/> Transactions</li>
                 <li className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl flex items-center justify-between"><div className="flex items-center gap-3"><ArrowRightLeft className="w-4 h-4"/> Fund Transfer</div> <ChevronRight className="w-3 h-3 text-slate-400"/></li>
                 <li className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl flex items-center justify-between"><div className="flex items-center gap-3"><FileText className="w-4 h-4"/> Bill Payments</div> <ChevronRight className="w-3 h-3 text-slate-400"/></li>
                 <li className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl flex items-center justify-between"><div className="flex items-center gap-3"><FileBadge className="w-4 h-4"/> Cheque Mgmt</div> <ChevronRight className="w-3 h-3 text-slate-400"/></li>
                 <li className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl flex items-center justify-between"><div className="flex items-center gap-3"><TrendingUp className="w-4 h-4"/> Investments</div> <ChevronRight className="w-3 h-3 text-slate-400"/></li>
                 <li className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-3"><BarChart3 className="w-4 h-4"/> Income / Expense</li>
                 <li className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl flex items-center justify-between"><div className="flex items-center gap-3"><Users className="w-4 h-4"/> Payroll & Staff</div> <ChevronRight className="w-3 h-3 text-slate-400"/></li>
                 <li className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl flex items-center justify-between"><div className="flex items-center gap-3"><PieChart className="w-4 h-4"/> Reports & Analytics</div> <ChevronRight className="w-3 h-3 text-slate-400"/></li>
               </ul>
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-4">
            
            {/* ROW 1: KPIs */}
            <div className="grid grid-cols-6 gap-3">
              {[
                { l: 'Total Customers', v: '1,24,568', p: '12.45%', c: 'text-blue-600 bg-blue-50', i: <Users/> },
                { l: 'Total Accounts', v: '1,87,650', p: '8.35%', c: 'text-purple-600 bg-purple-50', i: <Building2/> },
                { l: 'Total Deposits', v: '₹ 2,458.75 Cr', p: '10.21%', c: 'text-amber-500 bg-amber-50', i: <PiggyBank/> },
                { l: 'Total Loans', v: '₹ 1,824.35 Cr', p: '9.32%', c: 'text-purple-600 bg-purple-50', i: <DollarSign/> },
                { l: 'Total Profit', v: '₹ 125.75 Cr', p: '13.25%', c: 'text-emerald-500 bg-emerald-50', i: <BarChart3/> },
                { l: 'Total Branches', v: '256', sub: 'Active Branches', c: 'text-blue-600 bg-blue-50', i: <Building2/> }
              ].map((kpi, i) => (
                <Card key={i} className="p-3 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${kpi.c}`}>
                    <div className="[&>svg]:w-5 [&>svg]:h-5">{kpi.i}</div>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold tracking-wide">{kpi.l}</p>
                    <h4 className="text-sm font-black text-slate-800 leading-tight my-0.5">{kpi.v}</h4>
                    {kpi.p ? 
                      <p className="text-[9px] text-emerald-500 font-bold flex items-center"><TrendingUp className="w-2.5 h-2.5 mr-0.5" /> {kpi.p}</p> :
                      <p className="text-[9px] text-slate-400">{kpi.sub}</p>
                    }
                  </div>
                </Card>
              ))}
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-12 gap-4">
              {/* Business Overview */}
              <Card className="col-span-5 p-4 flex flex-col h-64">
                <SectionHeader title="Business Overview" action={<span className="bg-slate-50 px-2 py-1 rounded text-slate-600 border border-slate-200 flex items-center gap-1">This Month <ChevronDown className="w-3 h-3"/></span>} />
                <div className="flex gap-4 mb-2 px-2">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600"><div className="w-2 h-2 rounded-full bg-blue-500"/> Income</div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-rose-500"><div className="w-2 h-2 rounded-full bg-rose-500"/> Expense</div>
                </div>
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
                  {/* Custom Tooltip Mock */}
                  <div className="absolute top-4 right-1/3 bg-white p-2 rounded-lg shadow-lg border border-slate-100 z-10 pointer-events-none">
                     <p className="text-[9px] text-slate-500 font-bold mb-1">22 Apr, 2024</p>
                     <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Income: ₹ 165.45 Cr</p>
                     <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"/> Expenses: ₹ 98.75 Cr</p>
                  </div>
                </div>
              </Card>

              {/* Account Summary */}
              <Card className="col-span-4 p-4 flex flex-col h-64">
                <SectionHeader title="Account Summary" action={<span className="text-slate-400">⋮</span>} />
                <div className="flex-1 flex items-center justify-between">
                   <div className="w-[45%] h-full relative flex items-center justify-center">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie data={depositData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none">
                           {depositData.map((e, i) => <Cell key={`cell-${i}`} fill={e.color} />)}
                         </Pie>
                       </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                       <span className="text-[8px] text-slate-500 font-bold">Total Accounts</span>
                       <span className="text-sm font-black text-slate-800">1,87,650</span>
                       <span className="text-[8px] text-blue-500 font-bold bg-blue-50 px-1.5 rounded mt-0.5">View Details</span>
                     </div>
                   </div>
                   <div className="w-[50%] space-y-3">
                      {depositData.map(d => (
                        <div key={d.name} className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                              <span className="text-[10px] font-bold text-slate-700">{d.name}</span>
                            </div>
                            <p className="text-xs font-black text-slate-800 ml-3.5">{d.value.toLocaleString()} <span className="text-[8px] text-slate-400 font-normal">({(d.value/187650*100).toFixed(2)}%)</span></p>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </Card>

              {/* Recent Transactions */}
              <Card className="col-span-3 p-4 flex flex-col h-64">
                <SectionHeader title="Recent Transactions" action="View All >" />
                <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide pr-1">
                  {[
                    { name: 'NEFT Transfer', date: '22 May, 10:25 AM', amt: '₹ 25,00,000', icon: <ArrowRightLeft className="w-3 h-3" />, bg: 'bg-emerald-50 text-emerald-500' },
                    { name: 'IMPS Transfer', date: '22 May, 10:20 AM', amt: '₹ 5,75,000', icon: <Send className="w-3 h-3" />, bg: 'bg-blue-50 text-blue-500' },
                    { name: 'RTGS Transfer', date: '22 May, 10:15 AM', amt: '₹ 12,50,000', icon: <ArrowRightLeft className="w-3 h-3" />, bg: 'bg-emerald-50 text-emerald-500' },
                    { name: 'Cash Deposit', date: '22 May, 10:05 AM', amt: '₹ 3,25,000', icon: <DollarSign className="w-3 h-3" />, bg: 'bg-emerald-50 text-emerald-500' },
                    { name: 'Cheque Deposit', date: '22 May, 10:00 AM', amt: '₹ 1,80,000', icon: <FileText className="w-3 h-3" />, bg: 'bg-amber-50 text-amber-500' },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className={`w-7 h-7 rounded-full flex items-center justify-center ${tx.bg}`}>{tx.icon}</div>
                         <div>
                           <p className="text-[10px] font-bold text-slate-800">{tx.name}</p>
                           <p className="text-[8px] text-slate-400">{tx.date}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-800">{tx.amt}</p>
                         <p className="text-[7px] text-emerald-500 font-bold mt-0.5">Completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* ROW 3 */}
            <div className="grid grid-cols-12 gap-4">
              {/* Quick Actions */}
              <Card className="col-span-5 p-4 flex flex-col h-40">
                <SectionHeader title="Quick Actions" />
                <div className="flex-1 grid grid-cols-6 gap-2 place-content-center">
                  {[
                    { i: <Briefcase/>, l: 'New Account', c: 'text-blue-600 bg-blue-50' },
                    { i: <PiggyBank/>, l: 'New FD', c: 'text-emerald-500 bg-emerald-50' },
                    { i: <PiggyBank/>, l: 'New RD', c: 'text-amber-500 bg-amber-50' },
                    { i: <DollarSign/>, l: 'New Loan', c: 'text-rose-500 bg-rose-50' },
                    { i: <CreditCard/>, l: 'Issue Card', c: 'text-purple-600 bg-purple-50' },
                    { i: <ArrowRightLeft/>, l: 'Fund Transfer', c: 'text-cyan-500 bg-cyan-50' },
                    { i: <ShieldCheck/>, l: 'KYC Verify', c: 'text-blue-600 bg-blue-50' },
                    { i: <span className="font-bold">...</span>, l: '', c: 'text-slate-500 bg-slate-100' }
                  ].map((act, i) => (
                    <div key={i} className="flex flex-col items-center justify-center cursor-pointer group">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 ${act.c} group-hover:scale-110 transition-transform`}>
                        {typeof act.i === 'object' ? <div className="[&>svg]:w-3.5 [&>svg]:h-3.5">{act.i}</div> : act.i}
                      </div>
                      <span className="text-[8px] text-center font-bold text-slate-500 leading-tight">{act.l}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Alerts & Notifications */}
              <Card className="col-span-4 p-4 flex flex-col h-40">
                <SectionHeader title="Alerts & Notifications" action="View All >" />
                <div className="flex-1 flex flex-col justify-center gap-3">
                  {[
                    { t: 'High Value Transaction', d: '₹ 50,00,000 by Rahul Sharma', time: '10:25 AM', i: <AlertTriangle className="w-3.5 h-3.5"/>, c: 'bg-rose-50 text-rose-500' },
                    { t: 'Loan Overdue', d: '23 Accounts Overdue', time: '09:45 AM', i: <AlertCircle className="w-3.5 h-3.5"/>, c: 'bg-amber-50 text-amber-500' },
                    { t: 'KYC Pending', d: '156 Customers', time: '09:20 AM', i: <UserCircle2 className="w-3.5 h-3.5"/>, c: 'bg-blue-50 text-blue-500' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${a.c}`}>{a.i}</div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-800">{a.t}</p>
                          <p className="text-[8px] text-slate-500">{a.d}</p>
                        </div>
                      </div>
                      <span className="text-[8px] text-slate-400 font-medium">{a.time}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Performing Branches */}
              <Card className="col-span-3 p-4 flex flex-col h-40">
                <SectionHeader title="Top Performing Branches" action="View All >" />
                <div className="flex-1 flex flex-col justify-center gap-2.5">
                  {[
                    { n: 'Connaught Place, Delhi', v: '₹ 125.45 Cr', p: '12.45%' },
                    { n: 'Bandra West, Mumbai', v: '₹ 98.75 Cr', p: '10.32%' },
                    { n: 'Koramangala, Bengaluru', v: '₹ 76.80 Cr', p: '9.15%' },
                    { n: 'Hitech City, Hyderabad', v: '₹ 64.25 Cr', p: '8.45%' },
                    { n: 'Salt Lake, Kolkata', v: '₹ 58.30 Cr', p: '7.25%' },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 text-[7px] flex items-center justify-center font-bold">{i+1}</span>
                        <span className="text-[9px] font-bold text-slate-600">{b.n}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-800">{b.v}</span>
                        <span className="text-[8px] text-emerald-500 font-bold flex items-center w-8 justify-end"><TrendingUp className="w-2 h-2 mr-0.5"/> {b.p}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* ROW 4 & 5 Mixed */}
            <div className="grid grid-cols-12 gap-4">
              
              {/* Card Management (Admin) */}
              <Card className="col-span-7 p-4 relative h-[380px]">
                <SectionHeader title="Card Management (Admin)" action={<div className="flex gap-2"><span className="text-slate-400">↻</span><span className="text-slate-400">✕</span></div>} />
                <div className="flex gap-4 mb-4 text-[10px] font-bold">
                   <span className="text-blue-600 border-b-2 border-blue-600 pb-1">All Cards</span>
                   <span className="text-slate-400 pb-1">Credit Card</span>
                </div>
                
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] text-slate-400 uppercase tracking-wide border-b border-slate-100">
                      <th className="pb-2">Customer Name</th>
                      <th className="pb-2">Card Type</th>
                      <th className="pb-2">Card Number</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { n: 'Rahul Sharma', t: 'Debit Card', num: '**** 5678', s: 'Active' },
                      { n: 'Shruti Patel', t: 'Credit Card', num: '**** 9876', s: 'Active' },
                      { n: 'Priya Patel', t: 'Debit Card', num: '**** 1234', s: 'Active' },
                      { n: 'Amit Kumar', t: 'Credit Card', num: '**** 4321', s: 'Active' },
                      { n: 'Neha Singh', t: 'Debit Card', num: '**** 8765', s: 'Active' },
                    ].map((c, i) => (
                      <tr key={i} className="text-[10px] border-b border-slate-50 last:border-0">
                        <td className="py-2.5 font-bold text-slate-800">{c.n}</td>
                        <td className="py-2.5 text-slate-500 flex items-center gap-1"><CreditCard className="w-3 h-3 text-blue-500"/> {c.t}</td>
                        <td className="py-2.5 font-mono text-slate-600">{c.num}</td>
                        <td className="py-2.5"><span className="text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Active</span></td>
                        <td className="py-2.5 text-slate-400 tracking-widest font-bold">...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Floating Generate Card Modal */}
                <div className="absolute bottom-4 right-4 w-56 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-slate-100 p-4 z-10" onClick={() => setShowCardModal(!showCardModal)}>
                   <h4 className="text-[11px] font-bold text-slate-800 text-center mb-3">Generate New Card</h4>
                   <div className="flex gap-2 mb-3 bg-slate-50 p-1 rounded-lg">
                     <button className="flex-1 bg-blue-600 text-white text-[9px] font-bold py-1.5 rounded-md shadow-sm">Debit Card</button>
                     <button className="flex-1 text-slate-500 text-[9px] font-bold py-1.5 rounded-md hover:bg-slate-200">Credit Card</button>
                   </div>
                   <div className="space-y-3">
                     <div>
                       <label className="text-[8px] font-bold text-slate-400 block mb-1">Select Customer</label>
                       <div className="text-[10px] font-bold text-slate-800 border border-slate-200 p-1.5 rounded-lg flex justify-between">Rahul Sharma <ChevronDown className="w-3 h-3 text-slate-400"/></div>
                     </div>
                     <div>
                       <label className="text-[8px] font-bold text-slate-400 block mb-1">Card Type</label>
                       <div className="text-[10px] font-bold text-slate-800 border border-slate-200 p-1.5 rounded-lg flex justify-between">VISA Platinum <ChevronDown className="w-3 h-3 text-slate-400"/></div>
                     </div>
                     <div>
                       <label className="text-[8px] font-bold text-slate-400 block mb-1">Card Limit</label>
                       <div className="text-[10px] font-bold text-slate-800 border border-slate-200 p-1.5 rounded-lg">₹ 2,00,000</div>
                     </div>
                     <button className="w-full bg-blue-600 text-white text-[10px] font-bold py-2 rounded-lg shadow hover:bg-blue-700 mt-2">Generate Card</button>
                   </div>
                </div>
              </Card>

              {/* Right Col stacked */}
              <div className="col-span-5 flex flex-col gap-4">
                 
                 {/* Deposits (FD/RD Management) */}
                 <Card className="p-4 h-48">
                    <SectionHeader title="Deposits (FD/RD Management)" />
                    <div className="flex gap-4 mb-2 text-[9px] font-bold">
                       <span className="text-blue-600 border-b-2 border-blue-600 pb-0.5">Fixed Deposit</span>
                       <span className="text-slate-400 pb-0.5">Recurring Deposit</span>
                    </div>
                    <div className="flex items-center">
                       <div className="w-[40%] h-24 relative flex items-center justify-center">
                         <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                             <Pie data={[{v:70,c:'#ef4444'},{v:20,c:'#eab308'},{v:10,c:'#3b82f6'}]} cx="50%" cy="50%" innerRadius={25} outerRadius={35} paddingAngle={0} dataKey="v" stroke="none">
                               {[{c:'#ef4444'},{c:'#eab308'},{c:'#3b82f6'}].map((e,i)=><Cell key={i} fill={e.c}/>)}
                             </Pie>
                           </PieChart>
                         </ResponsiveContainer>
                         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                           <span className="text-[6px] text-slate-500 font-bold">Total FD Amount</span>
                           <span className="text-[10px] font-black text-slate-800">₹ 1,245.80 Cr</span>
                         </div>
                       </div>
                       <div className="w-[60%] pl-2 space-y-2 text-[9px]">
                          <div className="flex justify-between items-center"><div className="flex items-center gap-1.5 text-slate-600 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Active FD</div> <span className="font-black text-slate-800">15,620</span></div>
                          <div className="flex justify-between items-center"><div className="flex items-center gap-1.5 text-slate-600 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"/> Matured Today</div> <span className="font-black text-slate-800">45</span></div>
                          <div className="flex justify-between items-center"><div className="flex items-center gap-1.5 text-slate-600 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-blue-300"/> Maturing This Month</div> <span className="font-black text-slate-800">320</span></div>
                          <div className="border-t border-slate-100 pt-1 mt-1 flex justify-between items-center text-[10px] font-black text-slate-800"><span>Interest Payout Today</span> <span>₹ 1.25 Cr</span></div>
                       </div>
                    </div>
                    <button className="text-[9px] text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full mt-2">FD Report</button>
                 </Card>

                 {/* Reports & Analytics */}
                 <Card className="p-4 flex-1">
                    <SectionHeader title="Reports & Analytics" action={<div className="flex gap-1 text-[8px] bg-slate-50 p-0.5 rounded"><span className="px-1.5 py-0.5 rounded text-slate-500">Daily</span><span className="bg-blue-600 text-white px-1.5 py-0.5 rounded shadow">Weekly</span><span className="px-1.5 py-0.5 rounded text-slate-500">Monthly</span></div>} />
                    <div className="flex justify-between items-end mb-2">
                       <div>
                         <p className="text-[9px] text-slate-400 font-bold">Total Transactions</p>
                         <p className="text-sm font-black text-slate-800">25,684 <span className="text-[8px] text-emerald-500 font-bold bg-emerald-50 px-1 rounded inline-flex items-center"><TrendingUp className="w-2 h-2 mr-0.5"/> 8.45%</span></p>
                       </div>
                       <div className="text-right">
                         <p className="text-[9px] text-slate-400 font-bold">Total Amount</p>
                         <p className="text-sm font-black text-slate-800">₹ 125.80 Cr <span className="text-[8px] text-emerald-500 font-bold bg-emerald-50 px-1 rounded inline-flex items-center"><TrendingUp className="w-2 h-2 mr-0.5"/> 12.45%</span></p>
                       </div>
                    </div>
                    <div className="h-20 w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reportData}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 7, fill: '#94a3b8' }} dy={5} />
                          <Bar dataKey="val" fill="#3b82f6" radius={[2,2,0,0]} barSize={8} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                 </Card>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* =========================================================================
          RIGHT COLUMN: Mobile Mockup & App Features
          ========================================================================= */}
      <div className="flex flex-col gap-6 w-[350px] shrink-0 h-[90vh]">
        
        {/* Date Time Header */}
        <div className="text-right px-4">
          <p className="text-xs text-slate-400 font-medium">Wednesday, 22 May 2024</p>
          <div className="flex items-center justify-end gap-2 mt-1">
             <h2 className="text-xl font-bold text-white">10:30:45 AM</h2>
             <div className="flex gap-2">
                <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-white"><ChevronRight className="w-3 h-3"/></div>
                <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-white"><ArrowRightLeft className="w-3 h-3"/></div>
             </div>
          </div>
        </div>

        {/* The iPhone Frame */}
        <div className="mx-auto w-[280px] h-[580px] bg-slate-900 rounded-[40px] p-2.5 shadow-2xl relative border-4 border-slate-800">
           {/* Notch */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>
           
           {/* App Screen */}
           <div className="w-full h-full bg-[#f8fafc] rounded-[30px] overflow-hidden relative flex flex-col pt-8 pb-4">
              
              {/* Header */}
              <div className="px-4 py-2 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                   <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Rahul" alt="User" className="w-8 h-8 rounded-full bg-blue-100 border border-white" />
                   <div>
                     <p className="text-[10px] font-bold text-slate-800 leading-tight">Hi, Rahul Sharma</p>
                     <p className="text-[8px] text-slate-500">Welcome Back 👋</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <Bell className="w-4 h-4 text-slate-600"/>
                   <Search className="w-4 h-4 text-slate-600"/>
                 </div>
              </div>

              {/* Balance Card */}
              <div className="px-4 mt-2">
                 <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -mr-10 -mt-10"></div>
                    <p className="text-[10px] font-medium text-blue-100 mb-1">Total Balance</p>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-black">₹ 4,58,750.50</h2>
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center"><div className="w-2 h-2 rounded-full border border-white" /></div>
                    </div>
                    <p className="text-[9px] text-blue-200">Savings •••• 4567</p>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between px-6 mt-4">
                 {[
                   { i: <Send/>, l: 'Send Money', c: 'text-blue-600' },
                   { i: <Plus/>, l: 'Add Money', c: 'text-emerald-500' },
                   { i: <ScanFace/>, l: 'Scan & Pay', c: 'text-purple-500' },
                   { i: <span className="font-bold">...</span>, l: 'More', c: 'text-slate-600' },
                 ].map((act, i) => (
                   <div key={i} className="flex flex-col items-center gap-1.5">
                     <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center ${act.c}`}>
                        {typeof act.i === 'object' ? <div className="[&>svg]:w-4 [&>svg]:h-4">{act.i}</div> : act.i}
                     </div>
                     <span className="text-[8px] font-bold text-slate-600">{act.l}</span>
                   </div>
                 ))}
              </div>

              {/* My Accounts */}
              <div className="px-4 mt-5">
                 <div className="flex justify-between items-center mb-2">
                   <h3 className="text-[11px] font-bold text-slate-800">My Accounts</h3>
                   <span className="text-[8px] font-bold text-blue-600">View All {'>'}</span>
                 </div>
                 <div className="space-y-2">
                   {[
                     { n: 'Savings Account', num: '•••• 4567', v: '₹ 2,45,750.50', c: 'text-blue-600 bg-blue-50', i: <Briefcase/> },
                     { n: 'Current Account', num: '•••• 8901', v: '₹ 1,25,000.00', c: 'text-purple-600 bg-purple-50', i: <PiggyBank/> },
                     { n: 'FD Account', num: '•••• 1822', v: '₹ 88,000.00', c: 'text-emerald-500 bg-emerald-50', i: <FileText/> },
                   ].map((a, i) => (
                     <div key={i} className="bg-white rounded-xl p-2.5 flex items-center justify-between shadow-sm border border-slate-50">
                        <div className="flex items-center gap-2">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.c}`}><div className="[&>svg]:w-3.5 [&>svg]:h-3.5">{a.i}</div></div>
                           <div>
                             <p className="text-[10px] font-bold text-slate-800">{a.n}</p>
                             <p className="text-[8px] text-slate-400 font-mono">{a.num}</p>
                           </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-800">{a.v}</p>
                     </div>
                   ))}
                 </div>
              </div>

              {/* My Cards */}
              <div className="px-4 mt-4 flex-1">
                 <div className="flex justify-between items-center mb-2">
                   <h3 className="text-[11px] font-bold text-slate-800">My Cards <span className="text-[8px] text-rose-500 font-normal">(Auto issued by Admin)</span></h3>
                   <div className="flex gap-1">
                     <span className="w-4 h-4 rounded bg-slate-200 text-slate-600 flex items-center justify-center text-[8px] font-bold">+</span>
                   </div>
                 </div>
                 <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-4 text-white shadow-md relative overflow-hidden h-[110px]">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-1">
                         <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center font-bold text-[8px]">F</div>
                         <span className="text-[10px] font-bold">FutureBank</span>
                       </div>
                       <span className="text-[8px] bg-emerald-500 px-2 py-0.5 rounded-full font-bold">Active</span>
                    </div>
                    <p className="text-lg font-mono tracking-widest font-bold mb-2">•••• 5678</p>
                    <div className="flex justify-between items-end">
                       <p className="text-[9px] font-medium">Rahul Sharma</p>
                       <div className="text-right">
                         <p className="text-[12px] font-black italic">VISA</p>
                         <p className="text-[6px] text-purple-200">Expires 12/28</p>
                       </div>
                    </div>
                 </div>
                 
                 {/* Card Quick Actions */}
                 <div className="flex justify-between px-2 mt-2">
                    {[
                      { l: 'Block Card', i: <ShieldAlert/> },
                      { l: 'Limit', i: <Sliders/> },
                      { l: 'PIN', i: <CheckCircle2/> },
                      { l: 'More', i: <span className="font-bold tracking-widest text-[10px]">...</span> },
                    ].map((ca, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                          {typeof ca.i === 'object' ? <div className="[&>svg]:w-3 [&>svg]:h-3">{ca.i}</div> : ca.i}
                        </div>
                        <span className="text-[7px] font-bold text-slate-500">{ca.l}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Bottom Home Indicator */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-300 rounded-full"></div>
           </div>
        </div>

        {/* Customer App Features Grid */}
        <Card className="p-4 flex-1">
           <h3 className="text-xs font-bold text-slate-800 text-center mb-4">Customer App Features</h3>
           <div className="grid grid-cols-4 gap-y-4 gap-x-2">
             {[
               { i: <Briefcase/>, l: 'Accounts', c: 'text-emerald-500' },
               { i: <ArrowRightLeft/>, l: 'Fund Transfer', c: 'text-blue-500' },
               { i: <FileText/>, l: 'Bill Pay', c: 'text-amber-500' },
               { i: <QrCode/>, l: 'UPI / QR', c: 'text-slate-700' },
               { i: <PiggyBank/>, l: 'FD / RD', c: 'text-orange-500' },
               { i: <DollarSign/>, l: 'Loans', c: 'text-emerald-600' },
               { i: <CreditCard/>, l: 'Cards', c: 'text-purple-600' },
               { i: <FileText/>, l: 'Cheque Book', c: 'text-blue-600' },
               { i: <TrendingUp/>, l: 'Investment', c: 'text-green-500' },
               { i: <FileDown/>, l: 'Apply Loan', c: 'text-rose-500' },
               { i: <FileText/>, l: 'e-Statement', c: 'text-blue-400' },
               { i: <LifeBuoy/>, l: 'Support', c: 'text-red-500' },
               { i: <UserCircle2/>, l: 'Profile', c: 'text-slate-600' },
               { i: <Sliders/>, l: 'Settings', c: 'text-slate-500' },
               { i: <Bell/>, l: 'Notifications', c: 'text-rose-500' },
               { i: <LogOut/>, l: 'Logout', c: 'text-slate-800' },
             ].map((f, i) => (
               <div key={i} className="flex flex-col items-center justify-center cursor-pointer group">
                  <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mb-1.5 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform ${f.c}`}>
                     <div className="[&>svg]:w-3.5 [&>svg]:h-3.5">{f.i}</div>
                  </div>
                  <span className="text-[7px] font-bold text-slate-500 text-center">{f.l}</span>
               </div>
             ))}
           </div>
        </Card>

      </div>

    </div>
  );
}
