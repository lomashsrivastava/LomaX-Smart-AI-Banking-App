"use client";

import { Card } from "@/components/ui/card";
import { ShieldCheck, UserCog, Briefcase, Glasses, Activity, Landmark, FileText, Database } from "lucide-react";

export default function RolesAndPermissionsPage() {
  const departments = [
    {
      title: "Executive & Administration",
      icon: <Landmark className="w-8 h-8 text-indigo-400" />,
      description: "Top-level management with global overrides and strategic system access.",
      roles: ["Super Admin", "Bank Admin", "Regional Director", "Regional Manager"],
      keyPermissions: ["Global Configuration", "Audit Log Access", "Cross-Branch Overrides", "High-Value Transaction Approval"],
    },
    {
      title: "Retail Banking & Operations",
      icon: <Briefcase className="w-8 h-8 text-cyan-400" />,
      description: "Day-to-day branch operations, customer onboarding, and transaction handling.",
      roles: ["Branch Manager", "Operations Manager", "Teller", "Account Officer"],
      keyPermissions: ["Customer Management", "Account Management", "Standard Deposits/Withdrawals", "Branch Staff Management"],
    },
    {
      title: "Risk & Compliance (KYC/AML)",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      description: "Regulatory adherence, fraud prevention, and account screening.",
      roles: ["Compliance Officer", "KYC Officer", "Risk Analyst", "Fraud Investigator"],
      keyPermissions: ["Approve KYC", "Freeze Accounts", "View Suspicious Activity Reports", "Sanctions Screening"],
    },
    {
      title: "Credit & Lending",
      icon: <Activity className="w-8 h-8 text-fuchsia-400" />,
      description: "Loan origination, underwriting, and debt recovery.",
      roles: ["Loan Officer", "Credit Manager", "Underwriter", "Recovery Officer"],
      keyPermissions: ["Create Loan", "Review Loan", "Approve Loan", "Access Credit History"],
    },
    {
      title: "Finance & Audit",
      icon: <FileText className="w-8 h-8 text-amber-400" />,
      description: "Internal reconciliation, tax reporting, and independent system audits.",
      roles: ["Finance Manager", "Internal Auditor", "Treasury Officer"],
      keyPermissions: ["View All Reports", "Export Financials", "Treasury Management", "Audit Access"],
    },
    {
      title: "Technology & Support",
      icon: <Database className="w-8 h-8 text-blue-400" />,
      description: "System maintenance, security administration, and user support.",
      roles: ["IT Administrator", "Security Officer", "Customer Support Executive"],
      keyPermissions: ["System Settings", "Security Management", "API Management", "View Customers (Support)"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 relative z-10 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Departments & RBAC Model
        </h1>
        <p className="text-indigo-100/70 mt-1 max-w-3xl">
          The platform utilizes a modern Role-Based Access Control (RBAC) architecture. 
          Staff are assigned to Departments with specific Titles, but their actual system access is governed entirely by the granular Permissions granted to them during onboarding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.title} className="bg-slate-950/80 backdrop-blur-xl border border-indigo-500/30 p-6 flex flex-col hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-300">
            <div className="flex items-center space-x-4 mb-4 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
                {dept.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">{dept.title}</h3>
                <span className="text-[10px] uppercase tracking-widest font-mono text-indigo-400">Department Node</span>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs mb-4 min-h-[40px]">{dept.description}</p>
            
            <div className="mb-4">
               <h4 className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 font-bold">Common Designations</h4>
               <div className="flex flex-wrap gap-1.5">
                 {dept.roles.map(r => (
                   <span key={r} className="text-[10px] bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded">
                     {r}
                   </span>
                 ))}
               </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 mt-auto">
              <h4 className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 font-bold">Standard Permissions</h4>
              <ul className="space-y-1.5">
                {dept.keyPermissions.map((perm) => (
                  <li key={perm} className="flex items-center text-[11px] text-slate-300">
                    <div className="w-1 h-1 rounded-full bg-cyan-500 mr-2 shadow-[0_0_5px_rgba(34,211,238,0.8)]"></div>
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
