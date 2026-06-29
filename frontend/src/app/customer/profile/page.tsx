"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ShieldCheck, Mail, Phone, MapPin, Edit, ShieldAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CustomerProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header Profile Summary */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-950 shadow-lg">
          <AvatarImage src="" alt={user?.name || "User"} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-4xl">
            {user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left space-y-2 z-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user?.name || "Customer Name"}</h1>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center"><User className="w-4 h-4 mr-1" /> Customer ID: {user?.id}</span>
            <span className="flex items-center text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-4 h-4 mr-1" /> KYC Verified
            </span>
          </div>
        </div>

        <div className="z-10">
          <Button variant="outline" className="flex items-center">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Personal Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-900 pb-4">
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Full Name</dt>
                  <dd className="mt-1 text-base text-slate-900 dark:text-white">{user?.name || "Rahul Sharma"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Date of Birth</dt>
                  <dd className="mt-1 text-base text-slate-900 dark:text-white">15 Aug 1990</dd>
                </div>
                <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Registered Address</dt>
                  <dd className="mt-1 text-base text-slate-900 dark:text-white flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-1 text-slate-400 shrink-0" />
                    123, Tech Park Avenue, Koramangala, Bengaluru, Karnataka 560034
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-900 pb-4">
              <CardTitle className="text-lg">Security & Documents</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mr-4">
                    <span className="font-bold text-slate-500">PAN</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">PAN Card</p>
                    <p className="text-sm text-slate-500 font-mono">XXXXX1234X</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">Verified</span>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mr-4">
                    <span className="font-bold text-slate-500">UID</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Aadhaar Card</p>
                    <p className="text-sm text-slate-500 font-mono">XXXX XXXX 5678</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">Verified</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Details */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-900 pb-4">
              <CardTitle className="text-lg">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Email Address</p>
                  <p className="text-sm text-slate-500">{user?.email || "rahul@example.com"}</p>
                </div>
              </div>
              <div className="flex items-start pt-2">
                <Phone className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Mobile Number</p>
                  <p className="text-sm text-slate-500">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <ShieldAlert className="w-5 h-5 text-yellow-600 mr-2 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800 dark:text-yellow-500">
                    Keep your contact details updated to receive critical alerts and OTPs securely.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
