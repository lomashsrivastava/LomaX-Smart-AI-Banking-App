"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransferValues, transferSchema } from "@/lib/validations/transfer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  ArrowRight, 
  UserPlus, 
  Trash2, 
  Calendar, 
  Clock, 
  Users, 
  Send,
  Plus,
  RefreshCw,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import apiClient from "@/services/api-client";
import { toast } from "sonner";

interface RealAccount {
  _id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  status: string;
  branchName: string;
}

interface Beneficiary {
  _id: string;
  name: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

interface ScheduledTransfer {
  _id: string;
  sourceAccountNumber: string;
  targetAccountNumber: string;
  payeeName: string;
  amount: number;
  transferMode: string;
  scheduleType: string;
  frequency?: string;
  scheduledDate?: string;
  nextRunDate?: string;
  status: string;
}

const MOCK_ACCOUNTS = [
  { accountNumber: "100045674021", accountType: "Savings Account", balance: 145280.50 },
  { accountNumber: "200089015532", accountType: "Current Account", balance: 25000.00 },
];

export default function TransferMoneyPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"send" | "beneficiaries" | "schedules">("send");
  const [accounts, setAccounts] = useState<any[]>(MOCK_ACCOUNTS);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [scheduledTransfers, setScheduledTransfers] = useState<ScheduledTransfer[]>([]);
  
  // Send money wizard steps
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  
  // 2FA / OTP for instant transfer
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");

  // Scheduling states inside form
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleType, setScheduleType] = useState<"one-time" | "recurring">("one-time");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("daily");
  const [scheduledDate, setScheduledDate] = useState("");

  // Beneficiary form states
  const [bName, setBName] = useState("");
  const [bAccount, setBAccount] = useState("");
  const [bIfsc, setBIfsc] = useState("");
  const [bBank, setBBank] = useState("LomaX Bank");
  const [addingB, setAddingB] = useState(false);

  const form = useForm<TransferValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      transferType: "NEFT",
      sourceAccount: "",
      amount: "",
      remarks: "",
      payeeName: "",
      payeeAccount: "",
      ifscCode: "",
      upiId: "",
      targetAccount: "",
    },
  });

  const transferType = form.watch("transferType");

  const loadData = async () => {
    try {
      if (!user?.id) return;
      
      // Load accounts
      const accsRes = await apiClient.get(`/accounts/${user.id}`);
      if (accsRes.data.success && accsRes.data.accounts && accsRes.data.accounts.length > 0) {
        setAccounts(accsRes.data.accounts);
        form.setValue("sourceAccount", accsRes.data.accounts[0].accountNumber);
      } else {
        setAccounts(MOCK_ACCOUNTS);
        form.setValue("sourceAccount", MOCK_ACCOUNTS[0].accountNumber);
      }

      // Load Beneficiaries
      const bRes = await apiClient.get('/beneficiaries');
      if (bRes.data.success) {
        setBeneficiaries(bRes.data.data);
      }

      // Load Scheduled Transfers
      const sRes = await apiClient.get('/scheduled-transfers');
      if (sRes.data.success) {
        setScheduledTransfers(sRes.data.data);
      }
    } catch (error) {
      console.error("Failed to load transfer page data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onProceed = (data: TransferValues) => {
    setTransactionData(data);
    if (isScheduled) {
      // Direct call to schedule transfer instead of OTP validation
      handleScheduleSubmit(data);
    } else {
      setStep("otp");
    }
  };

  const handleOtpSubmit = async () => {
    if (otpValue.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }
    setOtpError("");
    setIsProcessing(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/transactions/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transferType: transactionData.transferType,
          sourceAccount: transactionData.sourceAccount,
          targetAccount: transactionData.targetAccount || transactionData.payeeAccount,
          amount: transactionData.amount,
          remarks: transactionData.remarks,
          payeeName: transactionData.payeeName,
          payeeAccount: transactionData.payeeAccount,
          ifscCode: transactionData.ifscCode,
          upiId: transactionData.upiId
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTransactionData(result.transaction);
        setStep("success");
        loadData();
      } else {
        setOtpError(result.message || "Transaction failed");
      }
    } catch (error) {
      console.error("Transfer failed:", error);
      setOtpError("Server connection failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScheduleSubmit = async (data: TransferValues) => {
    setIsProcessing(true);
    try {
      const res = await apiClient.post('/scheduled-transfers', {
        sourceAccountNumber: data.sourceAccount,
        targetAccountNumber: data.targetAccount || data.payeeAccount,
        payeeName: data.payeeName || user?.name || "Self",
        ifscCode: data.ifscCode,
        amount: data.amount,
        remarks: data.remarks,
        transferMode: data.transferType,
        scheduleType,
        frequency: scheduleType === 'recurring' ? frequency : undefined,
        scheduledDate: scheduleType === 'one-time' ? scheduledDate : undefined
      });

      if (res.data.success) {
        toast.success("Payment successfully scheduled!");
        form.reset();
        loadData();
        setActiveTab("schedules");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to schedule transfer.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName || !bAccount || !bIfsc) {
      toast.error("Please fill in all beneficiary fields.");
      return;
    }
    setAddingB(true);
    try {
      const res = await apiClient.post('/beneficiaries', {
        name: bName,
        accountNumber: bAccount,
        ifscCode: bIfsc,
        bankName: bBank
      });

      if (res.data.success) {
        toast.success("Beneficiary successfully saved!");
        setBName("");
        setBAccount("");
        setBIfsc("");
        setBBank("LomaX Bank");
        loadData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add beneficiary.");
    } finally {
      setAddingB(false);
    }
  };

  const handleDeleteBeneficiary = async (id: string) => {
    try {
      const res = await apiClient.delete(`/beneficiaries/${id}`);
      if (res.data.success) {
        setBeneficiaries(prev => prev.filter(b => b._id !== id));
        toast.success("Beneficiary removed.");
      }
    } catch (error) {
      toast.error("Failed to delete beneficiary.");
    }
  };

  const handleCancelSchedule = async (id: string) => {
    try {
      const res = await apiClient.patch(`/scheduled-transfers/${id}/cancel`);
      if (res.data.success) {
        setScheduledTransfers(prev => prev.map(s => s._id === id ? { ...s, status: 'cancelled' } : s));
        toast.success("Scheduled transfer cancelled.");
      }
    } catch (error) {
      toast.error("Failed to cancel scheduled transfer.");
    }
  };

  const handleSelectBeneficiary = (b: Beneficiary) => {
    form.setValue("payeeName", b.name);
    form.setValue("payeeAccount", b.accountNumber);
    form.setValue("ifscCode", b.ifscCode);
    toast.info(`Selected beneficiary: ${b.name}`);
  };

  const resetFlow = () => {
    form.reset();
    setStep("form");
    setTransactionData(null);
    setOtpValue("");
    setIsScheduled(false);
  };

  if (step === "success" && transactionData) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-8 text-center shadow-lg text-slate-100">
          <div className="mx-auto w-16 h-16 bg-emerald-950/30 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Transfer Initiated</h2>
          <p className="text-slate-400 mb-8">
            Your transfer of <span className="font-semibold text-emerald-400">₹{parseFloat(transactionData.amount).toLocaleString('en-IN')}</span> has been processed.
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-sm text-slate-400">Reference Number</span>
              <span className="font-semibold font-mono text-cyan-400">{transactionData.transactionId}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-sm text-slate-400">Transfer Type</span>
              <span className="font-medium">{transactionData.transferType || transactionData.transferMode}</span>
            </div>
            
            {transactionData.payeeName && (
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-sm text-slate-400">Beneficiary Name</span>
                <span className="font-medium text-slate-200">{transactionData.payeeName}</span>
              </div>
            )}
            
            {transactionData.payeeAccount && (
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-sm text-slate-400">Account Number</span>
                <span className="font-mono text-slate-200">{transactionData.payeeAccount}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Status</span>
              <span className="font-semibold text-emerald-400 uppercase text-xs px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                Completed
              </span>
            </div>
          </div>

          <div className="mt-8 space-x-4">
            <Button onClick={resetFlow} className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold">Make Another Transfer</Button>
            <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-850">Download Receipt</Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="max-w-md mx-auto space-y-6 mt-12 text-slate-100">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-cyan-950/30 text-cyan-400 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Security Verification</h2>
            <p className="text-sm text-slate-400 mt-2">
              Enter the 6-digit verification code generated for this transaction.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Input 
                type="text" 
                placeholder="• • • • • •" 
                className="h-14 text-center text-2xl tracking-widest font-mono bg-slate-950 border-slate-800 text-cyan-400 focus-visible:ring-cyan-500/20"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
                disabled={isProcessing}
              />
              {otpError && <p className="text-sm text-rose-400 mt-2 font-medium">{otpError}</p>}
            </div>

            <Button 
              className="w-full h-12 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold"
              onClick={handleOtpSubmit}
              disabled={isProcessing || otpValue.length !== 6}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Transfer...
                </>
              ) : (
                "Verify & Transfer"
              )}
            </Button>

            <button 
              type="button" 
              onClick={() => setStep("form")}
              className="w-full text-sm text-slate-400 hover:text-slate-200 py-2 transition-colors"
              disabled={isProcessing}
            >
              Cancel Transfer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 text-slate-100">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
          Payment Services & Transfers
        </h1>
        <p className="text-slate-400 mt-1">
          Perform instant fund transfers, schedule recurring payments, and manage payees.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab("send")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "send" ? "bg-slate-800 text-cyan-400 border border-slate-700/50" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Send Money</span>
        </button>
        <button
          onClick={() => setActiveTab("beneficiaries")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "beneficiaries" ? "bg-slate-800 text-cyan-400 border border-slate-700/50" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Payees Directory</span>
        </button>
        <button
          onClick={() => setActiveTab("schedules")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "schedules" ? "bg-slate-800 text-cyan-400 border border-slate-700/50" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Schedules</span>
        </button>
      </div>

      {/* TAB 1: SEND MONEY */}
      {activeTab === "send" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form (Col-2) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onProceed)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Transfer Type */}
                  <FormField control={form.control} name="transferType" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Transfer Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 bg-slate-950 border-slate-800 focus:ring-cyan-500/20 text-slate-100">
                            <SelectValue placeholder="Select transfer mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-950 border-slate-800 text-slate-100">
                          <SelectItem value="Own Account Transfer">Own Account Transfer</SelectItem>
                          <SelectItem value="Internal Transfer">Internal Transfer (LomaX)</SelectItem>
                          <SelectItem value="NEFT">NEFT (National Electronic Funds Transfer)</SelectItem>
                          <SelectItem value="RTGS">RTGS (Real Time Gross Settlement)</SelectItem>
                          <SelectItem value="IMPS">IMPS (Immediate Payment Service)</SelectItem>
                          <SelectItem value="UPI">UPI Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Source Account */}
                  <FormField control={form.control} name="sourceAccount" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Transfer From *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 bg-slate-950 border-slate-800 focus:ring-cyan-500/20 text-slate-100">
                            <SelectValue placeholder="Select source account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-950 border-slate-800 text-slate-100">
                          {accounts.map(acc => (
                            <SelectItem key={acc.accountNumber} value={acc.accountNumber}>
                              {acc.accountType} - {acc.accountNumber.slice(-4)} (₹{(acc.balance || acc.initialDeposit || 0).toLocaleString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Beneficiary Details Section */}
                <div className="border-t border-slate-850 pt-6">
                  <h3 className="text-lg font-bold mb-4">Beneficiary Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* NEFT / RTGS / IMPS / Internal */}
                    {["NEFT", "RTGS", "IMPS", "Internal Transfer"].includes(transferType) && (
                      <>
                        <FormField control={form.control} name="payeeName" render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-slate-300">Beneficiary Name *</FormLabel>
                            <FormControl>
                              <Input className="h-11 bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-cyan-500/20" placeholder="Enter full name of the payee" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="payeeAccount" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">Account Number *</FormLabel>
                            <FormControl>
                              <Input className="h-11 font-mono bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-cyan-500/20" placeholder="Enter account number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </>
                    )}

                    {/* IFSC Code */}
                    {["NEFT", "RTGS", "IMPS"].includes(transferType) && (
                      <FormField control={form.control} name="ifscCode" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">IFSC Code *</FormLabel>
                          <FormControl>
                            <Input className="h-11 font-mono uppercase bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-cyan-500/20" placeholder="e.g. HDFC0001234" maxLength={11} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}

                    {/* UPI ID */}
                    {transferType === "UPI" && (
                      <FormField control={form.control} name="upiId" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-slate-300">UPI ID / VPA *</FormLabel>
                          <FormControl>
                            <Input className="h-11 bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-cyan-500/20" placeholder="e.g. name@upi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}

                    {/* Own Account Transfer */}
                    {transferType === "Own Account Transfer" && (
                      <FormField control={form.control} name="targetAccount" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-slate-300">Transfer To *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-slate-950 border-slate-800 focus:ring-cyan-500/20 text-slate-100">
                                <SelectValue placeholder="Select target account" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-950 border-slate-800 text-slate-100">
                              {accounts.map(acc => (
                                <SelectItem key={acc.accountNumber} value={acc.accountNumber}>
                                  {acc.accountType} - {acc.accountNumber.slice(-4)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}

                  </div>
                </div>

                {/* Amount and Remarks */}
                <div className="border-t border-slate-850 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="amount" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Amount to Transfer (₹) *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
                            <Input type="number" className="pl-8 h-14 text-2xl font-bold bg-slate-950 border-slate-800 text-cyan-400 focus-visible:ring-cyan-500/20" placeholder="0.00" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="remarks" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Remarks (Optional)</FormLabel>
                        <FormControl>
                          <Input className="h-14 bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-cyan-500/20" placeholder="e.g. Rent, Bill Payment" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* Scheduling controls */}
                <div className="border-t border-slate-850 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-200">Schedule Payment</div>
                      <div className="text-xs text-slate-400">Automate one-time future or recurring transfers</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsScheduled(!isScheduled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isScheduled ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                        isScheduled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {isScheduled && (
                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-400 font-semibold uppercase block mb-1">Schedule Pattern</label>
                          <Select onValueChange={(val: any) => setScheduleType(val)} defaultValue={scheduleType}>
                            <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-200 h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
                              <SelectItem value="one-time">One-Time Future</SelectItem>
                              <SelectItem value="recurring">Recurring Schedule</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {scheduleType === "one-time" ? (
                          <div>
                            <label className="text-xs text-slate-400 font-semibold uppercase block mb-1">Execution Date</label>
                            <Input 
                              type="date" 
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              className="bg-slate-900 border-slate-800 text-slate-200 h-10"
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="text-xs text-slate-400 font-semibold uppercase block mb-1">Recurrence Frequency</label>
                            <Select onValueChange={(val: any) => setFrequency(val)} defaultValue={frequency}>
                              <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-200 h-10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
                                <SelectItem value="daily">Daily recurrence</SelectItem>
                                <SelectItem value="weekly">Weekly recurrence</SelectItem>
                                <SelectItem value="monthly">Monthly recurrence</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isProcessing}
                    className="h-12 px-8 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-base flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>{isScheduled ? 'Schedule Payment' : 'Proceed to Transfer'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </Form>
          </div>

          {/* Quick Payees panel (Col-1) */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-850 pb-2">
                <span className="font-bold text-slate-200">Quick Payees</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {beneficiaries.map((b) => (
                  <div 
                    key={b._id} 
                    onClick={() => handleSelectBeneficiary(b)}
                    className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg hover:border-cyan-500/40 hover:bg-slate-800/10 cursor-pointer transition-all group flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold text-sm group-hover:text-cyan-400 transition-colors">{b.name}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">Acc: {b.accountNumber}</div>
                      <div className="text-[10px] text-slate-500 font-mono">IFSC: {b.ifscCode}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">
                      {b.bankName}
                    </span>
                  </div>
                ))}
                {beneficiaries.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-500">
                    No beneficiaries saved yet. Use the Payee tab to save payees for fast auto-fill.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: BENEFICIARIES DIRECTORY */}
      {activeTab === "beneficiaries" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Beneficiary (Col-1) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl h-fit">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-cyan-400" />
              <span>Add New Payee</span>
            </h3>
            
            <form onSubmit={handleAddBeneficiary} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Payee Name *</label>
                <Input 
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={bName}
                  onChange={(e) => setBName(e.target.value)}
                  className="bg-slate-950 border-slate-800 h-10 text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Account Number *</label>
                <Input 
                  type="text"
                  placeholder="e.g. 1000223344"
                  value={bAccount}
                  onChange={(e) => setBAccount(e.target.value)}
                  className="bg-slate-950 border-slate-800 h-10 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">IFSC Code *</label>
                <Input 
                  type="text"
                  placeholder="e.g. LOMX0000001"
                  value={bIfsc}
                  onChange={(e) => setBIfsc(e.target.value)}
                  className="bg-slate-950 border-slate-800 h-10 font-mono uppercase text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Bank Name (Optional)</label>
                <Input 
                  type="text"
                  placeholder="e.g. LomaX Bank"
                  value={bBank}
                  onChange={(e) => setBBank(e.target.value)}
                  className="bg-slate-950 border-slate-800 h-10 text-slate-100"
                />
              </div>

              <Button 
                type="submit" 
                disabled={addingB}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold h-10 flex items-center justify-center space-x-1"
              >
                {addingB ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Save Beneficiary</span>
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* List of Beneficiaries (Col-2) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Saved Payees Directory</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-400 text-xs uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Payee Name</th>
                    <th className="py-3 px-4">Account Number</th>
                    <th className="py-3 px-4">IFSC</th>
                    <th className="py-3 px-4">Bank</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiaries.map((b) => (
                    <tr key={b._id} className="border-b border-slate-850/60 hover:bg-slate-800/10 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-sm text-slate-200">{b.name}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-300">{b.accountNumber}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{b.ifscCode}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-300">
                        <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-400">
                          {b.bankName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteBeneficiary(b._id)}
                          className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors"
                          title="Remove Payee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {beneficiaries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                        No saved beneficiaries found. Add a payee using the panel on the left.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: SCHEDULES */}
      {activeTab === "schedules" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Automated & Scheduled Transfers</h3>
              <p className="text-xs text-slate-400 mt-0.5">Track and cancel pending one-time future or recurring fund payments.</p>
            </div>
            <Clock className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Payee</th>
                  <th className="py-3 px-4">Source Account</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Mode / Schedule</th>
                  <th className="py-3 px-4">Next Run Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {scheduledTransfers.map((s) => (
                  <tr key={s._id} className="border-b border-slate-850/60 hover:bg-slate-800/10 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-sm text-slate-200">{s.payeeName}</div>
                      <div className="text-xs font-mono text-slate-400">Acc: {s.targetAccountNumber}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-slate-300">{s.sourceAccountNumber}</td>
                    <td className="py-4 px-4 font-bold text-cyan-400">₹{s.amount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-xs">
                      <div>{s.transferMode}</div>
                      <div className="text-slate-400 mt-0.5 font-medium">
                        {s.scheduleType === 'recurring' ? `Recurring (${s.frequency})` : 'One-Time Future'}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-300 font-mono">
                      {s.nextRunDate ? new Date(s.nextRunDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-xs">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                        s.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                        s.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        s.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {s.status === 'pending' ? (
                        <button
                          onClick={() => handleCancelSchedule(s._id)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/20 rounded transition-colors flex items-center space-x-1 ml-auto"
                          title="Cancel Transfer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {scheduledTransfers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                      No scheduled transfers found. Toggle schedule payment when sending money.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
