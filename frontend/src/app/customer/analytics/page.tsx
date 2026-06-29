"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import apiClient from "@/services/api-client";
import { 
  TrendingUp, 
  ShieldAlert, 
  PieChart as PieIcon, 
  DollarSign, 
  Sliders, 
  Target, 
  Compass, 
  Loader2, 
  ArrowRight,
  Plus,
  TrendingDown,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Recharts components
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as ChartTooltip, 
  Legend as ChartLegend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const CHART_COLORS = [
  "#22d3ee", "#a855f7", "#f97316", "#10b981", "#ef4444", 
  "#3b82f6", "#eab308", "#ec4899", "#6366f1", "#64748b"
];

interface Account {
  id?: string;
  number: string;
  type: string;
  balance: number;
}

interface Budget {
  _id?: string;
  category: string;
  limitAmount: number;
  spentAmount: number;
}

interface SavingsGoal {
  _id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  category?: string;
  status: 'active' | 'achieved' | 'cancelled';
}

export default function SmartAnalyticsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"overview" | "budgets" | "goals">("overview");
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State from APIs
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Budget configuration states
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [configuringBudget, setConfiguringBudget] = useState(false);

  // Goal configuration states
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalDate, setGoalDate] = useState("");
  const [goalCategory, setGoalCategory] = useState("General");
  const [creatingGoal, setCreatingGoal] = useState(false);

  // Goal deposit states
  const [depositAmount, setDepositAmount] = useState("");
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [sourceAccountNum, setSourceAccountNum] = useState("");
  const [depositingGoal, setDepositingGoal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadAllAnalyticsData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // 1. Fetch smart analytics metrics
      const analRes = await apiClient.get('/analytics/smart');
      if (analRes.data.success) {
        setAnalyticsData(analRes.data.analytics);
      }

      // 2. Fetch budgets
      const budRes = await apiClient.get('/analytics/budgets');
      if (budRes.data.success) {
        setBudgets(budRes.data.data);
      }

      // 3. Fetch savings goals
      const sgRes = await apiClient.get('/analytics/savings');
      if (sgRes.data.success) {
        setSavingsGoals(sgRes.data.data);
      }

      // 4. Fetch customer accounts
      const accRes = await apiClient.get(`/accounts/${user.id}`);
      if (accRes.data.success && accRes.data.accounts) {
        setAccounts(accRes.data.accounts);
        if (accRes.data.accounts.length > 0) {
          setSourceAccountNum(accRes.data.accounts[0].number);
        }
      }
    } catch (error) {
      console.error("Failed to load analytics data:", error);
      toast.error("Failed to fetch smart banking analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAnalyticsData();
  }, [user]);

  const handleConfigureBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetLimit || parseFloat(budgetLimit) <= 0) {
      toast.error("Please enter a valid budget limit.");
      return;
    }
    setConfiguringBudget(true);
    try {
      const res = await apiClient.post('/analytics/budgets', {
        category: selectedCategory,
        limitAmount: parseFloat(budgetLimit)
      });
      if (res.data.success) {
        toast.success(`Limit set for ${selectedCategory}!`);
        setBudgetLimit("");
        loadAllAnalyticsData();
      }
    } catch (error) {
      toast.error("Failed to configure budget limit.");
    } finally {
      setConfiguringBudget(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget || parseFloat(goalTarget) <= 0) {
      toast.error("Please enter goal title and target amount.");
      return;
    }
    setCreatingGoal(true);
    try {
      const res = await apiClient.post('/analytics/savings', {
        title: goalTitle,
        targetAmount: parseFloat(goalTarget),
        targetDate: goalDate || undefined,
        category: goalCategory
      });
      if (res.data.success) {
        toast.success("Savings Goal initialized successfully!");
        setGoalTitle("");
        setGoalTarget("");
        setGoalDate("");
        loadAllAnalyticsData();
      }
    } catch (error) {
      toast.error("Failed to initialize savings goal.");
    } finally {
      setCreatingGoal(false);
    }
  };

  const handleGoalDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGoalId || !depositAmount || parseFloat(depositAmount) <= 0 || !sourceAccountNum) {
      toast.error("Invalid deposit details.");
      return;
    }
    setDepositingGoal(true);
    try {
      const res = await apiClient.post('/analytics/savings/deposit', {
        goalId: activeGoalId,
        amount: parseFloat(depositAmount),
        sourceAccountNumber: sourceAccountNum
      });
      if (res.data.success) {
        toast.success(res.data.message || "Goal successfully funded!");
        setDepositAmount("");
        setActiveGoalId(null);
        loadAllAnalyticsData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to make deposit.");
    } finally {
      setDepositingGoal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-100">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
        <p className="text-slate-400 text-sm">Parsing financial analytics data stream...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 text-slate-100">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-cyan-400" />
          <span>Smart Banking Analytics</span>
        </h1>
        <p className="text-slate-400 mt-1">
          Real-time financial health index, risk telemetry, smart budgets, and goal monitoring.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "overview" ? "bg-slate-800 text-cyan-400 border border-slate-700/50" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Insights</span>
        </button>
        <button
          onClick={() => setActiveTab("budgets")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "budgets" ? "bg-slate-800 text-cyan-400 border border-slate-700/50" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Budget Limits</span>
        </button>
        <button
          onClick={() => setActiveTab("goals")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "goals" ? "bg-slate-800 text-cyan-400 border border-slate-700/50" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Savings Goals</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && analyticsData && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Financial Health Meter */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 bg-cyan-500/5 rounded-full blur-2xl" />
              <div className="flex justify-between items-start mb-4">
                <span className="font-bold text-slate-300">Financial Health Score</span>
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              
              <div className="flex items-baseline space-x-2 my-2">
                <span className="text-4xl font-extrabold text-cyan-400">{analyticsData.financialHealth.score}</span>
                <span className="text-slate-500 text-sm">/ 100</span>
                <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded border ${
                  analyticsData.financialHealth.status === 'Excellent' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' :
                  analyticsData.financialHealth.status === 'Good' ? 'bg-cyan-950/20 text-cyan-400 border-cyan-500/20' :
                  analyticsData.financialHealth.status === 'Fair' ? 'bg-amber-950/20 text-amber-400 border-amber-500/20' :
                  'bg-rose-950/20 text-rose-400 border-rose-500/20'
                }`}>
                  {analyticsData.financialHealth.status}
                </span>
              </div>

              <div className="space-y-2 mt-4 border-t border-slate-850 pt-3">
                {analyticsData.financialHealth.findings.map((f: string, i: number) => (
                  <div key={i} className="text-xs text-slate-350 flex items-center space-x-1">
                    <span className="text-cyan-400">{f.slice(0, 1)}</span>
                    <span>{f.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Index telemetry */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 bg-rose-500/5 rounded-full blur-2xl" />
              <div className="flex justify-between items-start mb-4">
                <span className="font-bold text-slate-300">Risk Profile Index</span>
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              </div>
              
              <div className="flex items-baseline space-x-2 my-2">
                <span className="text-4xl font-extrabold text-rose-400">{analyticsData.riskDashboard.score}</span>
                <span className="text-slate-500 text-sm">/ 100</span>
                <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded border ${
                  analyticsData.riskDashboard.label === 'Low' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' :
                  analyticsData.riskDashboard.label === 'Medium' ? 'bg-amber-950/20 text-amber-400 border-amber-500/20' :
                  'bg-rose-950/20 text-rose-400 border-rose-500/20'
                }`}>
                  {analyticsData.riskDashboard.label} Risk
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-4 border-t border-slate-850 pt-3 leading-relaxed">
                Evaluated from transaction patterns, login concurrency, threat locks, and beneficiary changes. Keep 2FA active to minimize exposure.
              </p>
            </div>

            {/* Predictive Balance */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 bg-purple-500/5 rounded-full blur-2xl" />
              <div className="flex justify-between items-start mb-4">
                <span className="font-bold text-slate-300">Next Month Projection</span>
                <TrendingDown className="w-5 h-5 text-purple-400" />
              </div>
              
              <div className="my-2">
                <div className="text-xs text-slate-400 mb-0.5">Predicted Available Balance</div>
                <div className="text-3xl font-extrabold text-purple-400">
                  ₹{Math.round(analyticsData.predictiveBalance.predicted).toLocaleString()}
                </div>
              </div>

              <div className="text-xs text-slate-400 mt-4 border-t border-slate-850 pt-3 flex justify-between">
                <span>Weekly Burn Rate:</span>
                <span className="font-semibold text-slate-200">₹{Math.round(analyticsData.predictiveBalance.weeklySpendAvg).toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Pie Chart of category spending (Col-1) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-base font-bold mb-4 flex items-center space-x-1.5">
                <PieIcon className="w-4 h-4 text-cyan-400" />
                <span>Spend Categories</span>
              </h3>
              
              {isMounted && analyticsData.spendingCategories.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.spendingCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {analyticsData.spendingCategories.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', color: '#f8fafc' }}
                        formatter={(val: any) => [val !== undefined && val !== null ? `₹${val.toLocaleString()}` : '', 'Amount']}
                      />
                      <ChartLegend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-slate-500">
                  No debit records registered in the current billing cycle.
                </div>
              )}
            </div>

            {/* Area Chart of Trends (Col-2) */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-base font-bold mb-4 flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Cash Flow Trends (Weekly)</span>
              </h3>

              {isMounted && analyticsData.trends.weekly.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.trends.weekly}>
                      <defs>
                        <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDebit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <ChartTooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', color: '#f8fafc' }} />
                      <Area type="monotone" dataKey="credit" stroke="#10b981" fillOpacity={1} fill="url(#colorCredit)" name="Credits" />
                      <Area type="monotone" dataKey="debit" stroke="#ef4444" fillOpacity={1} fill="url(#colorDebit)" name="Debits" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-slate-500">
                  Insufficient data points to build week-on-week trend chart.
                </div>
              )}
            </div>

          </div>

          {/* Insights engine */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-base font-bold mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>NexaAdvisor Personalized Insights</span>
            </h3>
            
            <div className="space-y-4">
              {analyticsData.insights.map((insight: string, idx: number) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-950/30 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">Financial Advice #{idx+1}</div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">{insight}</div>
                  </div>
                </div>
              ))}
              {analyticsData.insights.length === 0 && (
                <div className="text-center py-4 text-xs text-slate-500">
                  Our algorithm is analyzing your transaction pattern history. Check back in a few days for custom recommendations.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SMART BUDGET LIMITS */}
      {activeTab === "budgets" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          
          {/* Configure Budget limit form (Col-1) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl h-fit">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <span>Set Category Limit</span>
            </h3>

            <form onSubmit={handleConfigureBudget} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Select Expense Category *</label>
                <Select onValueChange={(val) => setSelectedCategory(val || "")} defaultValue={selectedCategory}>
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 border-slate-800 text-slate-100">
                    <SelectItem value="Food">Food & Restaurants</SelectItem>
                    <SelectItem value="Travel">Travel & Commutes</SelectItem>
                    <SelectItem value="Shopping">Shopping & Fashion</SelectItem>
                    <SelectItem value="Bills">Bills & Utilities</SelectItem>
                    <SelectItem value="Healthcare">Healthcare & Pharmacy</SelectItem>
                    <SelectItem value="Entertainment">Entertainment & Subs</SelectItem>
                    <SelectItem value="Investment">Investment & Savings</SelectItem>
                    <SelectItem value="Education">Education & Courses</SelectItem>
                    <SelectItem value="Insurance">Insurance Policies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Monthly Spending Cap (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
                  <Input 
                    type="number"
                    placeholder="e.g. 10000"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    className="pl-8 bg-slate-950 border-slate-800 text-slate-100 h-10"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={configuringBudget}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold h-10 flex items-center justify-center"
              >
                {configuringBudget ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Enforce Spending Limit"
                )}
              </Button>
            </form>
          </div>

          {/* Budgets usage grid (Col-2) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Active Budgets vs Live Spent</h3>
            
            <div className="space-y-6">
              {budgets.map((b) => {
                const percentage = b.limitAmount > 0 ? (b.spentAmount / b.limitAmount) * 100 : 0;
                const cappedPercent = Math.min(100, percentage);
                
                return (
                  <div key={b.category} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-200">{b.category}</span>
                      <span className="text-xs text-slate-400 font-mono">
                        ₹{b.spentAmount.toLocaleString()} / <span className="text-cyan-400 font-semibold">₹{b.limitAmount.toLocaleString()}</span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-slate-950 border border-slate-850 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          percentage >= 95 ? 'bg-rose-500' :
                          percentage >= 80 ? 'bg-amber-500' :
                          'bg-cyan-400'
                        }`}
                        style={{ width: `${cappedPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>{percentage.toFixed(0)}% consumed</span>
                      {percentage >= 100 ? (
                        <span className="text-rose-400 font-semibold flex items-center space-x-0.5">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Over limit</span>
                        </span>
                      ) : percentage >= 85 ? (
                        <span className="text-amber-400 font-semibold">Approaching cap</span>
                      ) : (
                        <span className="text-emerald-400">Within safe zone</span>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {budgets.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No spending limits declared for this month. Set budget rules using the manager panel.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: SAVINGS GOALS */}
      {activeTab === "goals" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          
          {/* Initialize Goal (Col-1) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl h-fit">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>Create Savings Goal</span>
            </h3>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Goal Title *</label>
                <Input 
                  type="text"
                  placeholder="e.g. Dream Car, Emergency Fund"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-100 h-10"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Target Amount (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
                  <Input 
                    type="number"
                    placeholder="e.g. 50000"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="pl-8 bg-slate-950 border-slate-800 text-slate-100 h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Category</label>
                  <Select onValueChange={(val) => setGoalCategory(val || "")} defaultValue={goalCategory}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-slate-800 text-slate-100">
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Tech">Tech</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Target Date</label>
                  <Input 
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-100 h-10 text-xs"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={creatingGoal}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold h-10 flex items-center justify-center"
              >
                {creatingGoal ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create Goal"
                )}
              </Button>
            </form>
          </div>

          {/* Goals catalog & deposit popup (Col-2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeGoalId && (
              <div className="bg-slate-900 border border-cyan-500/20 rounded-xl p-6 shadow-xl animate-in slide-in-from-top-2">
                <h4 className="font-bold text-slate-200 mb-3 flex items-center space-x-1.5 text-sm">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  <span>Transfer Money to Savings Goal</span>
                </h4>
                
                <form onSubmit={handleGoalDeposit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">Source Account</label>
                    <Select onValueChange={(val) => setSourceAccountNum(val || "")} value={sourceAccountNum}>
                      <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-slate-800 text-slate-100">
                        {accounts.map(acc => (
                          <SelectItem key={acc.number} value={acc.number}>
                            {acc.type.slice(0, 7)}... ({acc.number.slice(-4)}) - ₹{acc.balance.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">Amount to Save (₹)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">₹</span>
                      <Input 
                        type="number"
                        placeholder="e.g. 5000"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="pl-6 bg-slate-950 border-slate-800 text-slate-100 h-10"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      type="submit"
                      disabled={depositingGoal}
                      className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold h-10 text-xs"
                    >
                      {depositingGoal ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Fund"}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setActiveGoalId(null)}
                      className="border-slate-850 text-slate-400 hover:bg-slate-800/20 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-6">Your Savings Goals Progress</h3>
              
              <div className="space-y-8">
                {savingsGoals.map((g) => {
                  const percentage = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
                  const cappedPercent = Math.min(100, percentage);
                  
                  return (
                    <div key={g._id} className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-slate-200 text-sm flex items-center space-x-2">
                            <span>{g.title}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-950 border border-slate-850 rounded text-slate-450 uppercase font-mono">
                              {g.category}
                            </span>
                          </div>
                          {g.targetDate && (
                            <div className="text-[10px] text-slate-550 mt-1 flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              <span>Target date: {new Date(g.targetDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono text-slate-400">
                            ₹{g.currentAmount.toLocaleString()} / <span className="text-cyan-400 font-semibold">₹{g.targetAmount.toLocaleString()}</span>
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-3.5 bg-slate-950 border border-slate-850 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-600 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${cappedPercent}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">{percentage.toFixed(0)}% completed</span>
                        {g.status === 'achieved' ? (
                          <span className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider">Goal Achieved!</span>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveGoalId(g._id);
                              setDepositAmount("");
                            }}
                            className="text-cyan-400 font-semibold hover:text-cyan-300 text-xs flex items-center space-x-0.5"
                          >
                            <span>Add Funds</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {savingsGoals.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    No active savings goals defined. Create one on the left to start saving.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
