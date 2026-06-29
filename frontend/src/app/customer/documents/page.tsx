"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, UploadCloud, CheckCircle2, Shield, File, Download } from "lucide-react";

export default function CustomerDocumentsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Document Vault
          </h1>
          <p className="text-muted-foreground mt-1">
            Securely upload, view, and manage your KYC and banking documents.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UploadCloud className="w-4 h-4 mr-2" />
          Upload New Document
        </Button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-blue-600 mr-3 shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-300">All documents are stored using AES-256 military-grade encryption.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Document Card: PAN */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-semibold flex items-center">
                <FileText className="w-5 h-5 mr-2 text-slate-400" />
                PAN Card
              </CardTitle>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Document Number</p>
              <p className="font-mono text-sm font-semibold">ABCDE1234F</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Uploaded On</p>
              <p className="text-sm">12 Mar 2024</p>
            </div>
            <div className="pt-2 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <File className="w-3 h-3 mr-2" /> View
              </Button>
              <Button variant="outline" size="sm" className="w-9 px-0">
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Document Card: Aadhaar */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-semibold flex items-center">
                <FileText className="w-5 h-5 mr-2 text-slate-400" />
                Aadhaar Card
              </CardTitle>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Document Number</p>
              <p className="font-mono text-sm font-semibold">XXXX XXXX 9876</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Uploaded On</p>
              <p className="text-sm">12 Mar 2024</p>
            </div>
            <div className="pt-2 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <File className="w-3 h-3 mr-2" /> View
              </Button>
              <Button variant="outline" size="sm" className="w-9 px-0">
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Document Card: Address Proof */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow border-dashed bg-slate-50/50 dark:bg-slate-900/50">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Missing Address Proof</h3>
            <p className="text-xs text-slate-500 mb-4">Upload a utility bill or passport to complete full KYC.</p>
            <Button size="sm">Upload Now</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
