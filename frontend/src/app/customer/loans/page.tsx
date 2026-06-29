"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Landmark, ArrowRight, Clock, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function CustomerLoansPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Loans & Mortgages
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your active loans, upcoming EMIs, and explore new financing options.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Apply for New Loan
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Loan Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-800 mr-4">
                  <Landmark className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Home Loan</h3>
                  <p className="text-sm font-mono text-slate-500">LN-8849-2910</p>
                </div>
              </div>
              <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Active
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-semibold">Principal Amount</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">₹45,00,000</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-semibold">Interest Rate</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">8.5% p.a.</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-semibold">Tenure</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">240 Months</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-semibold">EMI</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">₹39,052</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-600 dark:text-slate-300">Repayment Progress (32%)</span>
                  <span className="text-slate-900 dark:text-white">76 of 240 EMIs Paid</span>
                </div>
                <Progress value={32} className="h-3 bg-slate-100 dark:bg-slate-800" />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Paid: ₹14,40,000</span>
                  <span>Remaining: ₹30,60,000</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Loan Statement
                </Button>
                <Button className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                  Make Pre-payment
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6 flex items-start">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-4 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-1">Pre-approved Personal Loan Offer!</h4>
              <p className="text-sm text-blue-700/80 dark:text-blue-300/80 mb-3">Based on your excellent repayment history, you are eligible for an instant personal loan of up to ₹5,00,000 with zero documentation.</p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Claim Offer</Button>
            </div>
          </div>
        </div>

        {/* Sidebar / Next EMI */}
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming EMI
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 rounded-full mb-2">
                <span className="text-red-600 dark:text-red-400 font-bold text-2xl">05</span>
                <span className="text-red-600 dark:text-red-400 ml-1 uppercase text-sm font-semibold tracking-wider">Days Left</span>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 mb-1">Due Date: 10th June 2026</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">₹39,052</p>
              </div>
              
              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 mb-4">Auto-debit is enabled from your Savings Account (...4021).</p>
                <Button variant="outline" className="w-full">
                  Pay Manually Instead
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
