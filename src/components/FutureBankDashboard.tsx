'use client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Briefcase, PiggyBank, DollarSign, BarChart3, Users, Building2,
  ChevronDown, UserPlus, CreditCard, Send, CheckCircle2, AlertCircle, AlertTriangle, UserCircle2, ArrowRightLeft,
  FileText, Activity, Server, Smartphone, Globe, ShieldCheck, Mail, Bell, Search, LayoutDashboard,
  Wallet, FileDown, ShieldAlert, Sliders, ChevronRight, Check
} from 'lucide-react';
import { useState } from 'react';

// --- MOCK DATA ---
const overviewData = [
  { name: '01 Apr', income: 150, expense: 120 },
  { name: '15 Apr', income: 230, expense: 160 },
  { name: '01 May', income: 325, expense: 180 },
  { name: '15 May', income: 280, expense: 210 },
  { name: '22 May', income: 380, expense: 199.85 },
];

const depositData = [
  { name: 'Savings Account', value: 65430, color: '#3b82f6' },
  { name: 'Current Account', value: 35250, color: '#a855f7' },
  { name: 'Fixed Deposit', value: 24750, color: '#22c55e' },
];

const loanData = [
  { name: 'Home Loan', value: 512.45, color: '#3b82f6' },
  { name: 'Business Loan', value: 412.30, color: '#a855f7' },
  { name: 'Personal Loan', value: 279.75, color: '#22c55e' },
];

const recentActivities = [
  { account: '50200012345678', name: 'Rahul Sharma', type: 'Savings Account', branch: 'Connaught Place', activity: 'Cash Deposit', amount: '₹ 1,50,000', date: '22 May 2024, 10:30 AM', status: 'Completed' },
  { account: '50200087654321', name: 'Priya Patel', type: 'Current Account', branch: 'Bandra West', activity: 'NEFT Transfer', amount: '₹ 25,00,000', date: '22 May 2024, 10:25 AM', status: 'Completed' },
  { account: '50200011223344', name: 'Amit Kumar', type: 'Fixed Deposit', branch: 'Koramangala', activity: 'FD Creation', amount: '₹ 5,00,000', date: '22 May 2024, 10:20 AM', status: 'Completed' },
  { account: '50200055667788', name: 'Neha Singh', type: 'Savings Account', branch: 'Hitech City', activity: 'IMPS Transfer', amount: '₹ 75,000', date: '22 May 2024, 10:15 AM', status: 'Completed' },
  { account: '50200099887766', name: 'Vikram Joshi', type: 'Current Account', branch: 'Salt Lake', activity: 'RTGS Transfer', amount: '₹ 12,50,000', date: '22 May 2024, 10:10 AM', status: 'Completed' },
];

// --- COMPONENTS ---
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, action }: { title: string, action?: React.ReactNode }) => (
  <div className="flex justify-between items-center p-4 border-b border-slate-100">
    <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
    {action && <div className="text-xs text-blue-600 font-medium cursor-pointer hover:text-blue-700">{action}</div>}
  </div>
);

export default function FutureBankDashboard() {
  const [activeOverviewTab, setActiveOverviewTab] = useState('This Quarter');
  const [activeActivityTab, setActiveActivityTab] = useState('All Activities');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">F</div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">FutureBank</h1>
            <p className="text-[10px] text-slate-500">Management System</p>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-6 scrollbar-hide">
          <div className="bg-blue-50 text-blue-700 rounded-lg px-4 py-2 flex items-center text-sm font-semibold cursor-pointer">
            <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-4">Core Banking</p>
            <ul className="space-y-1">
              {['Accounts', 'Customers', 'Deposits', 'Loans & Credit', 'Cards', 'Payments', 'Fund Transfer', 'Standing Orders', 'Cheque Management', 'Instruments'].map(item => (
                <li key={item} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between items-center group">
                  <span className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-blue-400" /> {item}
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500" />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-4">Operations</p>
            <ul className="space-y-1">
              {['Transactions', 'Reports', 'Compliance', 'Audit Trail', 'Risk Management', 'Limits & Controls'].map(item => (
                <li key={item} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between items-center group">
                  <span className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-blue-400" /> {item}
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500" />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-4">Administration</p>
            <ul className="space-y-1">
              {['Users & Roles', 'Branches & ATMs', 'System Settings', 'Logs & Alerts'].map(item => (
                <li key={item} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between items-center group">
                  <span className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-blue-400" /> {item}
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500" />
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100">
           <button className="w-full flex items-center justify-between px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:bg-slate-50">
             <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-slate-200" /> Light</span>
             <ChevronDown className="w-4 h-4" />
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search accounts, transactions, users, reports..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-12 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
               <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-mono">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right text-xs">
              <p className="text-slate-500">Wednesday, 22 May 2024 {'>'}</p>
              <p className="font-bold text-slate-900">10:30:45 AM</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700">
                <span className="text-lg leading-none">+</span>
              </button>
              <button className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full text-[8px] text-white flex items-center justify-center font-bold">6</span>
              </button>
              <button className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100">
                <Mail className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full text-[8px] text-white flex items-center justify-center font-bold">5</span>
              </button>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Super Admin</p>
                <p className="text-[10px] text-slate-500">System Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Row 1: KPIs */}
          <div className="grid grid-cols-6 gap-4">
            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Briefcase className="w-5 h-5" /></div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Total Assets</p>
                <h4 className="text-lg font-bold text-slate-800">₹ 2,452.75 Cr</h4>
                <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5"><TrendingUp className="w-3 h-3" /> 8.45% vs last month</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center"><PiggyBank className="w-5 h-5" /></div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Total Deposits</p>
                <h4 className="text-lg font-bold text-slate-800">₹ 1,825.40 Cr</h4>
                <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5"><TrendingUp className="w-3 h-3" /> 6.32% vs last month</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center"><DollarSign className="w-5 h-5" /></div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Total Loans</p>
                <h4 className="text-lg font-bold text-slate-800">₹ 1,204.50 Cr</h4>
                <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5"><TrendingUp className="w-3 h-3" /> 9.15% vs last month</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center"><BarChart3 className="w-5 h-5" /></div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Net Profit</p>
                <h4 className="text-lg font-bold text-slate-800">₹ 125.75 Cr</h4>
                <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5"><TrendingUp className="w-3 h-3" /> 12.75% vs last month</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Users className="w-5 h-5" /></div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Active Customers</p>
                <h4 className="text-lg font-bold text-slate-800">2,45,687</h4>
                <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5"><TrendingUp className="w-3 h-3" /> 5.27% vs last month</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center"><Building2 className="w-5 h-5" /></div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Branches</p>
                <h4 className="text-lg font-bold text-slate-800">256</h4>
                <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5"><TrendingUp className="w-3 h-3" /> 2 New this month</p>
              </div>
            </Card>
          </div>

          {/* Row 2: Charts & Quick Actions */}
          <div className="grid grid-cols-12 gap-6">
            {/* Business Overview */}
            <Card className="col-span-6 flex flex-col h-96">
              <div className="p-4 flex justify-between items-center border-b border-slate-100">
                <h3 className="font-semibold text-slate-800 text-sm">Business Overview</h3>
                <div className="flex gap-2">
                   {['This Month', 'Last Month', 'This Quarter', 'This Year'].map(tab => (
                     <button key={tab} onClick={() => setActiveOverviewTab(tab)} 
                       className={`text-[10px] px-2 py-1 rounded-md ${activeOverviewTab === tab ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}>
                       {tab}
                     </button>
                   ))}
                   <button className="text-[10px] flex items-center gap-1 border border-slate-200 px-2 py-1 rounded-md ml-2 text-slate-600 hover:bg-slate-50">
                     All Metrics <ChevronDown className="w-3 h-3" />
                   </button>
                </div>
              </div>
              <div className="flex-1 p-4 pb-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={overviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `${val}Cr`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expense" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-between">
                 <div>
                   <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5"><span className="w-2 h-0.5 bg-blue-500 block" /> Total Income</p>
                   <p className="text-sm font-bold text-slate-800">₹ 325.60 Cr</p>
                 </div>
                 <div>
                   <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5"><span className="w-2 h-0.5 bg-purple-500 block" /> Total Expense</p>
                   <p className="text-sm font-bold text-slate-800">₹ 199.85 Cr</p>
                 </div>
                 <div>
                   <p className="text-[10px] text-slate-500 font-medium">Net Profit</p>
                   <p className="text-sm font-bold text-slate-800 flex items-center gap-2">₹ 125.75 Cr <span className="text-emerald-500 text-[10px] flex items-center"><TrendingUp className="w-3 h-3 mr-0.5"/> 12.75%</span></p>
                 </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="col-span-3 h-96 flex flex-col">
              <CardHeader title="Quick Actions" />
              <div className="p-4 grid grid-cols-4 gap-4 flex-1 content-start">
                {[
                  { icon: <Briefcase/>, label: 'Create Account', color: 'text-blue-600 bg-blue-50' },
                  { icon: <PiggyBank/>, label: 'New Deposit', color: 'text-blue-600 bg-blue-50' },
                  { icon: <DollarSign/>, label: 'New Loan', color: 'text-rose-500 bg-rose-50' },
                  { icon: <ArrowRightLeft/>, label: 'Fund Transfer', color: 'text-purple-600 bg-purple-50' },
                  { icon: <UserPlus/>, label: 'Add Customer', color: 'text-purple-600 bg-purple-50' },
                  { icon: <CreditCard/>, label: 'Issue Card', color: 'text-purple-600 bg-purple-50' },
                  { icon: <Wallet/>, label: 'New FD', color: 'text-blue-600 bg-blue-50' },
                  { icon: <Send/>, label: 'Make Payment', color: 'text-blue-600 bg-blue-50' },
                  { icon: <ShieldCheck/>, label: 'Approve KYC', color: 'text-emerald-500 bg-emerald-50' },
                  { icon: <FileText/>, label: 'Cheque Book', color: 'text-blue-600 bg-blue-50' },
                  { icon: <FileDown/>, label: 'Account Statement', color: 'text-emerald-500 bg-emerald-50' },
                  { icon: <span className="font-bold">...</span>, label: 'More Actions', color: 'text-slate-500 bg-slate-100' },
                ].map((action, i) => (
                  <div key={i} className="flex flex-col items-center justify-center cursor-pointer group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${action.color} group-hover:scale-110 transition-transform`}>
                      {typeof action.icon === 'object' ? <div className="[&>svg]:w-4 [&>svg]:h-4">{action.icon}</div> : action.icon}
                    </div>
                    <span className="text-[9px] text-center font-medium text-slate-600 leading-tight">{action.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card className="col-span-3 h-96 flex flex-col">
              <CardHeader title="Recent Transactions" action="View All >" />
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {[
                  { name: 'NEFT Transfer', date: '22 May 2024, 10:25 AM', amt: '₹ 25,00,000', icon: <ArrowRightLeft className="w-4 h-4" />, bg: 'bg-emerald-50 text-emerald-500' },
                  { name: 'IMPS Transfer', date: '22 May 2024, 10:20 AM', amt: '₹ 5,75,000', icon: <Send className="w-4 h-4" />, bg: 'bg-blue-50 text-blue-500' },
                  { name: 'RTGS Transfer', date: '22 May 2024, 10:15 AM', amt: '₹ 12,50,000', icon: <ArrowRightLeft className="w-4 h-4" />, bg: 'bg-emerald-50 text-emerald-500' },
                  { name: 'Account Opening', date: '22 May 2024, 10:10 AM', amt: '₹ 0', icon: <UserCircle2 className="w-4 h-4" />, bg: 'bg-purple-50 text-purple-500' },
                  { name: 'Cash Deposit', date: '22 May 2024, 10:05 AM', amt: '₹ 3,25,000', icon: <DollarSign className="w-4 h-4" />, bg: 'bg-emerald-50 text-emerald-500' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.bg}`}>{tx.icon}</div>
                       <div>
                         <p className="text-xs font-semibold text-slate-800">{tx.name}</p>
                         <p className="text-[9px] text-slate-500">{tx.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-slate-800">{tx.amt}</p>
                       <p className="text-[9px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Row 3: Donuts & Lists */}
          <div className="grid grid-cols-12 gap-6">
            {/* Deposit Accounts */}
            <Card className="col-span-3 flex flex-col h-72">
              <CardHeader title="Deposit Accounts" />
              <div className="flex-1 p-4 flex items-center">
                 <div className="w-1/2 h-full relative">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={depositData} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                         {depositData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                       </Pie>
                     </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-[10px] text-slate-500">Total</span>
                     <span className="text-xs font-bold text-slate-800">1,25,430</span>
                   </div>
                 </div>
                 <div className="w-1/2 pl-2 space-y-3">
                    {depositData.map(d => (
                      <div key={d.name}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-[10px] font-semibold text-slate-600">{d.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 ml-3.5">{d.value.toLocaleString()} ({(d.value/125430*100).toFixed(1)}%)</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="p-3 border-t border-slate-100"><span className="text-[10px] text-blue-600 font-medium cursor-pointer hover:underline">View All Accounts →</span></div>
            </Card>

            {/* Loan Portfolio */}
            <Card className="col-span-3 flex flex-col h-72">
              <CardHeader title="Loan Portfolio" />
              <div className="flex-1 p-4 flex items-center">
                 <div className="w-1/2 h-full relative">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={loanData} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                         {loanData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                       </Pie>
                     </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-[10px] text-slate-500">Total</span>
                     <span className="text-xs font-bold text-slate-800">₹ 1,204.50 Cr</span>
                   </div>
                 </div>
                 <div className="w-1/2 pl-2 space-y-3">
                    {loanData.map(d => (
                      <div key={d.name}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-[10px] font-semibold text-slate-600">{d.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 ml-3.5">₹ {d.value} Cr ({(d.value/1204.5*100).toFixed(1)}%)</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="p-3 border-t border-slate-100"><span className="text-[10px] text-blue-600 font-medium cursor-pointer hover:underline">View All Loans →</span></div>
            </Card>

            {/* Top Branches */}
            <Card className="col-span-3 flex flex-col h-72">
              <CardHeader title="Top Performing Branches" action="View All >" />
              <div className="flex-1 p-4 space-y-3">
                {[
                  { name: 'Connaught Place, Delhi', val: '₹ 125.45 Cr', pct: '12.45%' },
                  { name: 'Bandra West, Mumbai', val: '₹ 98.75 Cr', pct: '10.32%' },
                  { name: 'Koramangala, Bangalore', val: '₹ 76.80 Cr', pct: '9.15%' },
                  { name: 'Hitech City, Hyderabad', val: '₹ 64.25 Cr', pct: '8.45%' },
                  { name: 'Salt Lake, Kolkata', val: '₹ 58.30 Cr', pct: '7.25%' },
                ].map((b, i) => (
                  <div key={b.name} className="flex justify-between items-center pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                       <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 text-[9px] flex items-center justify-center font-bold">{i+1}</span>
                       <span className="text-[10px] font-medium text-slate-600">{b.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-800">{b.val}</span>
                      <span className="text-[9px] text-emerald-500 flex items-center w-10 justify-end"><TrendingUp className="w-2.5 h-2.5 mr-0.5" /> {b.pct}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* System Alerts */}
            <Card className="col-span-3 flex flex-col h-72">
              <CardHeader title="System Alerts" action="View All >" />
              <div className="flex-1 p-4 space-y-4">
                {[
                  { title: 'High Value Transaction Alert', desc: '₹ 5,00,00,000', time: '22 May 2024, 10:30 AM', level: 'High', icon: <ShieldAlert className="w-4 h-4" />, bg: 'bg-red-50 text-red-500' },
                  { title: 'KYC Pending', desc: '156 Customers', time: '22 May 2024, 10:25 AM', level: 'Medium', icon: <UserCircle2 className="w-4 h-4" />, bg: 'bg-amber-50 text-amber-500' },
                  { title: 'Loan Overdue', desc: '23 Accounts', time: '22 May 2024, 10:20 AM', level: 'Medium', icon: <AlertCircle className="w-4 h-4" />, bg: 'bg-amber-50 text-amber-500' },
                  { title: 'Security Alert', desc: 'New Device Login', time: '22 May 2024, 10:15 AM', level: 'Low', icon: <ShieldCheck className="w-4 h-4" />, bg: 'bg-blue-50 text-blue-500' },
                ].map((alert, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div className="flex gap-2">
                       <div className={`w-6 h-6 rounded flex items-center justify-center mt-0.5 shrink-0 ${alert.bg}`}>{alert.icon}</div>
                       <div>
                         <p className="text-[11px] font-semibold text-slate-800 leading-tight">{alert.title}</p>
                         <p className="text-[9px] text-slate-500 mt-0.5">{alert.desc}</p>
                       </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-[8px] text-slate-400 mb-1">{alert.time}</p>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-medium ${alert.level === 'High' ? 'text-red-600 bg-red-50' : alert.level === 'Medium' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'}`}>{alert.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Row 4: Account Activities & System Status */}
          <div className="grid grid-cols-12 gap-6 pb-6">
            {/* Account Activities Table */}
            <Card className="col-span-8 flex flex-col">
              <div className="p-4 flex justify-between items-center border-b border-slate-100">
                <h3 className="font-semibold text-slate-800 text-sm">Recent Account Activities</h3>
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] text-blue-600 cursor-pointer">View All Activities</span>
                  <Sliders className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
              </div>
              <div className="border-b border-slate-100 flex px-4">
                {['All Activities', 'Account Opening', 'Transactions', 'KYC Updates', 'Other Activities'].map(tab => (
                  <div key={tab} onClick={() => setActiveActivityTab(tab)} 
                    className={`text-[11px] font-medium py-2 px-3 cursor-pointer border-b-2 transition-colors ${activeActivityTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                    {tab}
                  </div>
                ))}
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="font-semibold pb-2">Account Number</th>
                      <th className="font-semibold pb-2">Customer Name</th>
                      <th className="font-semibold pb-2">Account Type</th>
                      <th className="font-semibold pb-2">Branch</th>
                      <th className="font-semibold pb-2">Activity</th>
                      <th className="font-semibold pb-2">Amount</th>
                      <th className="font-semibold pb-2">Date & Time</th>
                      <th className="font-semibold pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map((act, i) => (
                      <tr key={i} className="text-[10px] text-slate-600 border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 font-semibold text-blue-600">{act.account}</td>
                        <td className="py-3 font-medium text-slate-800">{act.name}</td>
                        <td className="py-3">{act.type}</td>
                        <td className="py-3">{act.branch}</td>
                        <td className="py-3">{act.activity}</td>
                        <td className="py-3 font-semibold text-slate-800">{act.amount}</td>
                        <td className="py-3 text-slate-400">{act.date}</td>
                        <td className="py-3">
                          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-medium inline-block">
                            {act.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Right Stack: Status & Shortcuts */}
            <div className="col-span-4 flex flex-col gap-6">
              
              {/* System Status */}
              <Card>
                <CardHeader title="System Status" action="All Systems Operational" />
                <div className="p-4 grid grid-cols-2 gap-4">
                  {[
                    { label: 'Core Banking', status: 'Operational' },
                    { label: 'Mobile Banking', status: 'Operational' },
                    { label: 'Internet Banking', status: 'Operational' },
                    { label: 'ATM Network', status: 'Operational' },
                    { label: 'Payment Gateway', status: 'Operational' },
                  ].map(sys => (
                    <div key={sys.label}>
                      <p className="text-[10px] font-medium text-slate-600">{sys.label}</p>
                      <p className="text-[9px] font-semibold text-emerald-500 mt-0.5 flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> {sys.status}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Shortcuts */}
              <Card className="flex-1">
                <CardHeader title="Shortcuts" action="Edit >" />
                <div className="p-4 grid grid-cols-4 gap-y-4 gap-x-2">
                  {[
                    { icon: <FileText/>, label: 'Daily Reports' },
                    { icon: <BarChart3/>, label: 'Monthly Reports' },
                    { icon: <Building2/>, label: 'Branch Reports' },
                    { icon: <PieChart/>, label: 'MIS Reports' },
                    { icon: <Users/>, label: 'User Management' },
                    { icon: <ShieldCheck/>, label: 'Role Management' },
                    { icon: <Server/>, label: 'Backup & Restore' },
                    { icon: <FileDown/>, label: 'Data Export' },
                  ].map((sc, i) => (
                    <div key={i} className="flex flex-col items-center justify-center cursor-pointer group">
                      <div className="text-slate-500 group-hover:text-blue-600 mb-1.5 [&>svg]:w-4 [&>svg]:h-4">
                        {sc.icon}
                      </div>
                      <span className="text-[9px] text-center text-slate-500 group-hover:text-slate-800 leading-tight">{sc.label}</span>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          </div>

          {/* Footer */}
          <footer className="py-4 flex items-center justify-between border-t border-slate-200">
            <p className="text-[10px] text-slate-400">© 2024 FutureBank. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400">Version 2.1.0</span>
              <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
              </span>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
}
