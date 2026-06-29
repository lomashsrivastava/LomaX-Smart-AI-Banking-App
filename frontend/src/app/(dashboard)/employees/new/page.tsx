"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Mail, Phone, MapPin, Building2, User, Key, ChevronRight, Briefcase, FileText, Upload } from "lucide-react";
import Link from "next/link";

interface Branch {
  _id: string;
  branchName: string;
  branchCode: string;
  state: string;
  district: string;
  country: string;
}

const PERMISSIONS_LIST = [
  "Customer Management", "View Customers", "Add Customers", "Edit Customers", "Delete Customers",
  "Account Management", "Open Accounts", "Close Accounts", "Freeze Accounts",
  "Transactions", "Deposit", "Withdrawal", "Transfer", "Approve Transactions",
  "Loans", "Create Loan", "Review Loan", "Approve Loan", "Reject Loan",
  "Staff Management", "View Staff", "Add Staff", "Edit Staff", "Delete Staff",
  "Reports", "View Reports", "Export Reports", "Audit Reports"
];

function EmployeeWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillBranchId = searchParams.get("branchId");

  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [fetchingBranches, setFetchingBranches] = useState(true);

  const [step, setStep] = useState(1);
  const [successData, setSuccessData] = useState<{ empId: string; plainPassword: string; officialEmail: string } | null>(null);

  const [formData, setFormData] = useState({
    // Step 1: Personal & Contact
    firstName: "", middleName: "", lastName: "", gender: "", dateOfBirth: "",
    maritalStatus: "", nationality: "Indian",
    phone: "", alternatePhone: "", email: "", // Personal email
    emergencyContactName: "", emergencyContactNumber: "",
    address: "", city: "", state: "", country: "India", pincode: "", district: "",

    // Step 2: Employment & Branch
    employeeCode: "", joiningDate: "", employmentType: "Full Time",
    department: "", designation: "", reportingManager: "",
    selectedState: "", selectedDistrict: "", branchId: "",
    role: "", // Single primary role

    // Step 3: Access & Payroll
    permissions: [] as string[],
    salaryType: "Monthly", basicSalary: "", allowances: "",
    taxId: "", bankAccountNumber: "", paymentMethod: "Bank Transfer",

    // Step 4: Identity & Documents
    highestQualification: "", university: "", graduationYear: "",
    previousEmployer: "", yearsOfExperience: "", skills: "", specialization: "",
    nationalId: "", passportNumber: "", taxNumber: "",
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/branches");
      const data = await res.json();
      if (data.success) {
        setBranches(data.data);
        if (prefillBranchId) {
          const targetBranch = data.data.find((b: Branch) => b._id === prefillBranchId);
          if (targetBranch) {
            setFormData(prev => ({
              ...prev,
              selectedState: targetBranch.state,
              selectedDistrict: targetBranch.district,
              branchId: targetBranch._id
            }));
            // We removed setStep(2) here so the user always starts at step 1.
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch branches", error);
    } finally {
      setFetchingBranches(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionToggle = (perm: string) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(perm);
      if (exists) {
        return { ...prev, permissions: prev.permissions.filter(p => p !== perm) };
      } else {
        return { ...prev, permissions: [...prev.permissions, perm] };
      }
    });
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.role || !formData.branchId) {
      alert("Please fill all required fields (Name, Personal Email, Phone, Role, Branch)");
      return;
    }

    setLoading(true);
    try {
      // Structure payload perfectly
      const payload = {
        ...formData,
        state: formData.selectedState, // Overwrite state with branch state
        district: formData.selectedDistrict,
      };

      const res = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessData({
          empId: data.data.empId,
          plainPassword: data.data.plainPassword,
          officialEmail: data.data.officialEmail
        });
      } else {
        alert(data.message || "Failed to create employee");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Derived logic
  const uniqueStates = Array.from(new Set(branches.map(b => b.state))).sort();
  const availableDistricts = formData.selectedState 
    ? Array.from(new Set(branches.filter(b => b.state === formData.selectedState).map(b => b.district))).sort()
    : [];
  const availableBranches = formData.selectedDistrict
    ? branches.filter(b => b.state === formData.selectedState && b.district === formData.selectedDistrict).sort((a,b) => a.branchName.localeCompare(b.branchName))
    : [];

  const selectedBranchObj = branches.find(b => b._id === formData.branchId);

  const previewOfficialEmail = () => {
    if (!formData.firstName || !formData.lastName || !selectedBranchObj) return "Pending Details...";
    const cleanStr = (str: string) => str.replace(/\s+/g, "").toLowerCase();
    const fName = cleanStr(formData.firstName);
    const lName = cleanStr(formData.lastName);
    const bName = cleanStr(selectedBranchObj.branchName);
    const dist = cleanStr(selectedBranchObj.district);
    const st = cleanStr(selectedBranchObj.state);
    const ctr = cleanStr(selectedBranchObj.country || "india");
    return `${fName}${lName}.staff.${bName}.${dist}.${st}.${ctr}@lomaxbank.com`;
  };

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto mt-12 animate-in zoom-in-95 duration-500">
        <Card className="bg-slate-950/90 backdrop-blur-2xl border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden text-center p-12">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-pulse">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
            Staff Provisioned Successfully
          </h2>
          <p className="text-slate-400 mb-8">
            Please securely provide the following auto-generated credentials to the employee. They will need this to log into the enterprise system.
          </p>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-8 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-slate-500 flex items-center"><User className="w-4 h-4 mr-2"/> Employee ID</span>
              <span className="text-xl font-bold font-mono text-cyan-400">{successData.empId}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 pt-2">
              <span className="text-slate-500 flex items-center"><Mail className="w-4 h-4 mr-2"/> Official Email</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{successData.officialEmail}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500 flex items-center"><Key className="w-4 h-4 mr-2"/> Temporary Password</span>
              <span className="text-xl font-bold font-mono text-fuchsia-400">{successData.plainPassword}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.reload()} variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors duration-300">
              Add Another Employee
            </Button>
            <Link href="/employees">
              <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-none shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all duration-300 transform hover:-translate-y-0.5">
                Return to Directory
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative z-10 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 flex items-center">
            <UserPlus className="w-8 h-8 mr-3 text-indigo-400 animate-pulse" />
            Enterprise Staff Onboarding
          </h1>
          <p className="text-indigo-200/70 mt-1">
            4-Step Advanced Provisioning & Access Control Wizard
          </p>
        </div>
        <Link href="/employees">
          <Button variant="outline" className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 bg-slate-900/50 transition-colors duration-300">
            <ArrowLeft className="w-4 h-4 mr-2" /> Abort
          </Button>
        </Link>
      </div>

      {/* Progress Tracker with Animations */}
      <div className="flex items-center justify-between relative before:absolute before:top-1/2 before:w-full before:h-1 before:bg-slate-800 before:-z-10 z-10 px-4">
        {[
          { num: 1, title: "Personal Details", icon: User },
          { num: 2, title: "Employment & Role", icon: Briefcase },
          { num: 3, title: "Access & Security", icon: ShieldCheck },
          { num: 4, title: "Identity & Verify", icon: FileText }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center group cursor-default">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${
              step === s.num ? 'bg-gradient-to-br from-indigo-500 to-fuchsia-500 border-slate-950 text-white shadow-[0_0_20px_rgba(217,70,239,0.6)] animate-bounce' : 
              step > s.num ? 'bg-indigo-600 border-slate-950 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 
              'bg-slate-900 border-slate-800 text-slate-500'
            } transition-all duration-500`}>
              <s.icon className={`w-6 h-6 ${step === s.num ? 'animate-pulse' : ''}`} />
            </div>
            <span className={`text-xs mt-3 font-bold uppercase tracking-wider ${
              step === s.num ? 'text-fuchsia-400' : 
              step > s.num ? 'text-indigo-300' : 'text-slate-500'
            } transition-colors duration-300`}>{s.title}</span>
          </div>
        ))}
      </div>

      <Card className="bg-slate-950/80 backdrop-blur-2xl border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.15)] overflow-hidden min-h-[500px] flex flex-col justify-between transition-all duration-500">
        
        {fetchingBranches ? (
          <div className="flex items-center justify-center flex-1 h-full text-indigo-500">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-3 font-mono tracking-widest animate-pulse">Initializing System Framework...</span>
          </div>
        ) : (
          <div className="p-8 flex-1">
            {/* STEP 1: PERSONAL & CONTACT */}
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-700">
                <h2 className="text-2xl font-bold text-white border-b border-indigo-500/30 pb-2">Personal & Contact Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name *</label>
                    <Input placeholder="e.g. Vivek" value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} className="bg-slate-900/80 border-indigo-500/30 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Middle Name</label>
                    <Input placeholder="Optional" value={formData.middleName} onChange={e => handleChange('middleName', e.target.value)} className="bg-slate-900/80 border-indigo-500/30 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name *</label>
                    <Input placeholder="e.g. Singh" value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} className="bg-slate-900/80 border-indigo-500/30 text-white" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                    <Select value={formData.gender} onValueChange={(v) => handleChange('gender', v)}>
                      <SelectTrigger className="bg-slate-900/80 border-indigo-500/30 text-white"><SelectValue placeholder="Select..."/></SelectTrigger>
                      <SelectContent className="bg-slate-900 border-indigo-500/30 text-white">
                        <SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Birth</label>
                    <Input type="date" value={formData.dateOfBirth} onChange={e => handleChange('dateOfBirth', e.target.value)} className="bg-slate-900/80 border-indigo-500/30 text-white [color-scheme:dark]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Marital Status</label>
                    <Select value={formData.maritalStatus} onValueChange={(v) => handleChange('maritalStatus', v)}>
                      <SelectTrigger className="bg-slate-900/80 border-indigo-500/30 text-white"><SelectValue placeholder="Select..."/></SelectTrigger>
                      <SelectContent className="bg-slate-900 border-indigo-500/30 text-white">
                        <SelectItem value="Single">Single</SelectItem><SelectItem value="Married">Married</SelectItem><SelectItem value="Divorced">Divorced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Phone *</label>
                    <Input placeholder="+91 9876543210" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="bg-slate-900/80 border-indigo-500/30 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal Email *</label>
                    <Input type="email" placeholder="vivek@gmail.com" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="bg-slate-900/80 border-indigo-500/30 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emergency Contact</label>
                    <Input placeholder="Name - Phone" value={formData.emergencyContactName} onChange={e => handleChange('emergencyContactName', e.target.value)} className="bg-slate-900/80 border-indigo-500/30 text-white" />
                  </div>

                  <div className="col-span-1 md:col-span-3 space-y-2 mt-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Residential Address</label>
                    <Input placeholder="Full Address" value={formData.address} onChange={e => handleChange('address', e.target.value)} className="bg-slate-900/80 border-indigo-500/30 text-white" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: EMPLOYMENT & ROLE */}
            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-700">
                <h2 className="text-2xl font-bold text-white border-b border-indigo-500/30 pb-2">Employment & Branch Assignment</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Branch Assignment */}
                  <div className="col-span-1 md:col-span-3">
                    <h3 className="text-sm font-bold text-indigo-400 mb-3 uppercase tracking-widest flex items-center"><MapPin className="w-4 h-4 mr-2"/> Location Assignment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/10">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400">State *</label>
                        <Select value={formData.selectedState} onValueChange={(val) => { handleChange('selectedState', val); handleChange('selectedDistrict', ""); handleChange('branchId', ""); }}>
                          <SelectTrigger className="bg-slate-900/80 border-indigo-500/30 text-white"><SelectValue placeholder="Select State" /></SelectTrigger>
                          <SelectContent className="bg-slate-900 border-indigo-500/30 text-white">{uniqueStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400">District *</label>
                        <Select value={formData.selectedDistrict} onValueChange={(val) => { handleChange('selectedDistrict', val); handleChange('branchId', ""); }} disabled={!formData.selectedState}>
                          <SelectTrigger className="bg-slate-900/80 border-indigo-500/30 text-white disabled:opacity-50"><SelectValue placeholder="Select District" /></SelectTrigger>
                          <SelectContent className="bg-slate-900 border-indigo-500/30 text-white">{availableDistricts.map(district => <SelectItem key={district} value={district}>{district}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400">Branch *</label>
                        <Select value={formData.branchId} onValueChange={(val) => handleChange('branchId', val)} disabled={!formData.selectedDistrict}>
                          <SelectTrigger className="bg-slate-900/80 border-indigo-500/30 text-white disabled:opacity-50"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                          <SelectContent className="bg-slate-900 border-indigo-500/30 text-white">{availableBranches.map(branch => <SelectItem key={branch._id} value={branch._id}>{branch.branchName} ({branch.branchCode})</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Official Email Preview */}
                  <div className="col-span-1 md:col-span-3">
                    <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">Generated Official Email</span>
                        <span className="text-sm text-slate-300 max-w-lg block">This strict format is auto-generated for security compliance based on branch hierarchy.</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg font-mono text-emerald-300 text-sm break-all shadow-inner w-full sm:w-auto">
                        {previewOfficialEmail()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Role *</label>
                    <Select value={formData.role} onValueChange={(v) => handleChange('role', v)}>
                      <SelectTrigger className="bg-slate-900/80 border-indigo-500/30 text-white"><SelectValue placeholder="Select Role"/></SelectTrigger>
                      <SelectContent className="bg-slate-900 border-indigo-500/30 text-white">
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                        <SelectItem value="Bank Admin">Bank Admin</SelectItem>
                        <SelectItem value="Regional Manager">Regional Manager</SelectItem>
                        <SelectItem value="Branch Manager">Branch Manager</SelectItem>
                        <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                        <SelectItem value="Account Officer">Account Officer</SelectItem>
                        <SelectItem value="Teller">Teller</SelectItem>
                        <SelectItem value="Loan Officer">Loan Officer</SelectItem>
                        <SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
                        <SelectItem value="Auditor">Auditor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</label>
                    <Select value={formData.department} onValueChange={(v) => handleChange('department', v)}>
                      <SelectTrigger className="bg-slate-900/80 border-indigo-500/30 text-white"><SelectValue placeholder="Select Dept"/></SelectTrigger>
                      <SelectContent className="bg-slate-900 border-indigo-500/30 text-white">
                        <SelectItem value="Retail Banking">Retail Banking</SelectItem>
                        <SelectItem value="Corporate Banking">Corporate Banking</SelectItem>
                        <SelectItem value="Risk Management">Risk Management</SelectItem>
                        <SelectItem value="IT Security">IT Security</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employment Type</label>
                    <Select value={formData.employmentType} onValueChange={(v) => handleChange('employmentType', v)}>
                      <SelectTrigger className="bg-slate-900/80 border-indigo-500/30 text-white"><SelectValue placeholder="Select..."/></SelectTrigger>
                      <SelectContent className="bg-slate-900 border-indigo-500/30 text-white">
                        <SelectItem value="Full Time">Full Time</SelectItem>
                        <SelectItem value="Part Time">Part Time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ACCESS & PERMISSIONS (RBAC) */}
            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-700">
                <h2 className="text-2xl font-bold text-white border-b border-indigo-500/30 pb-2 flex items-center justify-between">
                  System Access & RBAC Permissions
                  <span className="text-sm font-normal text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
                    Selected: {formData.permissions.length}
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {PERMISSIONS_LIST.map((perm) => {
                    const isHeader = !perm.includes(" "); // Simple heuristic for headers in this mock list
                    if (isHeader || perm.endsWith("Management") || perm === "Transactions" || perm === "Loans" || perm === "Reports") {
                      return (
                        <div key={perm} className="col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-4 mt-4 mb-2">
                          <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-1">{perm}</h4>
                        </div>
                      );
                    }
                    return (
                      <label key={perm} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-indigo-900/30 hover:border-indigo-500/50 cursor-pointer transition-colors">
                        <Checkbox 
                          checked={formData.permissions.includes(perm)}
                          onCheckedChange={() => handlePermissionToggle(perm)}
                          className="border-indigo-500 data-[state=checked]:bg-indigo-500 text-white"
                        />
                        <span className="text-sm text-slate-300 font-medium">{perm}</span>
                      </label>
                    )
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Salary Type</label>
                    <Select value={formData.salaryType} onValueChange={(v) => handleChange('salaryType', v)}>
                      <SelectTrigger className="bg-slate-900/80 border-indigo-500/30 text-white"><SelectValue placeholder="Select..."/></SelectTrigger>
                      <SelectContent className="bg-slate-900 border-indigo-500/30 text-white">
                        <SelectItem value="Monthly">Monthly</SelectItem><SelectItem value="Hourly">Hourly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Basic Salary (USD)</label>
                    <Input type="number" placeholder="e.g. 5000" value={formData.basicSalary} onChange={e => handleChange('basicSalary', e.target.value)} className="bg-slate-900/80 border-indigo-500/30 text-white" />
                  </div>
                  <div className="space-y-2 flex items-end pb-2">
                     <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox checked={true} disabled className="border-emerald-500 data-[state=checked]:bg-emerald-500" />
                        <span className="text-sm text-emerald-400 font-bold">Require 2FA on First Login</span>
                      </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: IDENTITY & REVIEW */}
            {step === 4 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-700">
                <h2 className="text-2xl font-bold text-white border-b border-indigo-500/30 pb-2">Identity Verification & Review</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Document Simulators */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center"><Upload className="w-4 h-4 mr-2"/> Required Documents</h3>
                    
                    <div className="p-4 rounded-xl border border-dashed border-slate-600 bg-slate-900/50 hover:bg-slate-800 hover:border-indigo-500 transition-colors cursor-pointer flex items-center justify-between group">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 group-hover:bg-indigo-500 text-indigo-400 group-hover:text-white transition-all"><FileText className="w-5 h-5"/></div>
                        <div>
                          <p className="text-sm font-bold text-white">National ID / Passport</p>
                          <p className="text-xs text-slate-500">Upload PDF or JPG (Max 5MB)</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-indigo-400">Browse</Button>
                    </div>

                    <div className="p-4 rounded-xl border border-dashed border-slate-600 bg-slate-900/50 hover:bg-slate-800 hover:border-indigo-500 transition-colors cursor-pointer flex items-center justify-between group">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 group-hover:bg-indigo-500 text-indigo-400 group-hover:text-white transition-all"><FileText className="w-5 h-5"/></div>
                        <div>
                          <p className="text-sm font-bold text-white">Employment Contract Signed</p>
                          <p className="text-xs text-slate-500">Upload PDF (Max 5MB)</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-indigo-400">Browse</Button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center"><CheckCircle2 className="w-4 h-4 mr-2"/> Summary Pre-flight Check</h3>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500 text-sm">Full Name</span>
                        <span className="text-white font-bold text-sm">{formData.firstName} {formData.lastName || 'Pending'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 text-sm">Role & Dept</span>
                        <span className="text-white font-bold text-sm">{formData.role || 'Pending'} / {formData.department || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 text-sm">Target Branch</span>
                        <span className="text-cyan-400 font-bold text-sm">{selectedBranchObj?.branchName || 'Pending'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 text-sm">Permissions</span>
                        <span className="text-indigo-400 font-bold text-sm">{formData.permissions.length} Granted</span>
                      </div>
                      <div className="pt-3 border-t border-slate-800">
                        <p className="text-xs text-emerald-500 font-mono text-center">
                          All systems go. Credentials will be generated upon finalization.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Footer */}
        <div className="p-6 bg-slate-900 border-t border-indigo-500/30 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setStep(step - 1)} 
            disabled={step === 1 || loading || fetchingBranches}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Previous Step
          </Button>

          {step < 4 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              disabled={fetchingBranches}
              className="bg-indigo-600 hover:bg-indigo-500 text-white border-none shadow-[0_0_10px_rgba(99,102,241,0.3)]"
            >
              Continue Next Step <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={loading} 
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border-none px-8"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
              Finalize & Provision User
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function NewEmployeePage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <EmployeeWizard />
    </Suspense>
  );
}
