"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { CustomerRegistrationValues } from "@/lib/validations/customer";
import {
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
 FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// --- Step 1: Personal Details ---
export function StepPersonal() {
 const { control } = useFormContext<CustomerRegistrationValues>();

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-[800ms] ease-out">
 <div className="border-b border-emerald-500/20 pb-4 mb-6 relative group">
 <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>
 <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-in fade-in slide-in-from-left-4 duration-700">
 Personal Details
 </h2>
 <p className="text-sm text-teal-200/60 mt-1">Enter basic customer information.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <FormField control={control} name="firstName" render={({ field }) => (
 <FormItem className="group relative">
 <FormLabel className="text-slate-300 group-hover:text-emerald-300 group-focus-within:text-emerald-400 transition-colors drop-shadow-sm font-medium tracking-wide">First Name</FormLabel>
 <FormControl>
 <Input placeholder="First Name" {...field} className="text-cyan-300 [&::placeholder]:[text-shadow:none] placeholder:text-slate-500 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all shadow-inner hover:bg-slate-900/80" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )} />
 <FormField control={control} name="middleName" render={({ field }) => (
 <FormItem className="group relative">
 <FormLabel className="text-slate-300 group-hover:text-emerald-300 group-focus-within:text-emerald-400 transition-colors drop-shadow-sm font-medium tracking-wide">Middle Name</FormLabel>
 <FormControl>
 <Input placeholder="Middle Name" {...field} className="text-cyan-300 [&::placeholder]:[text-shadow:none] placeholder:text-slate-500 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all shadow-inner hover:bg-slate-900/80" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )} />
 <FormField control={control} name="lastName" render={({ field }) => (
 <FormItem className="group relative">
 <FormLabel className="text-slate-300 group-hover:text-emerald-300 group-focus-within:text-emerald-400 transition-colors drop-shadow-sm font-medium tracking-wide">Last Name</FormLabel>
 <FormControl>
 <Input placeholder="Last Name" {...field} className="text-cyan-300 [&::placeholder]:[text-shadow:none] placeholder:text-slate-500 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all shadow-inner hover:bg-slate-900/80" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )} />
 
 <FormField control={control} name="gender" render={({ field }) => (
 <FormItem className="group">
 <FormLabel className="text-slate-300 group-hover:text-slate-200 transition-colors drop-shadow-sm font-medium">Gender</FormLabel>
 <Select onValueChange={field.onChange} value={field.value || ""}>
 <FormControl>
 <SelectTrigger className="text-cyan-300 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 hover:bg-slate-900/80 transition-all">
 <SelectValue placeholder="Select gender" className="text-slate-500" />
 </SelectTrigger>
 </FormControl>
 <SelectContent className="dark bg-slate-900 border-slate-700 text-slate-200">
 <SelectItem value="Male" className="focus:bg-cyan-600 focus:text-white cursor-pointer transition-colors">Male</SelectItem>
 <SelectItem value="Female" className="focus:bg-cyan-600 focus:text-white cursor-pointer transition-colors">Female</SelectItem>
 <SelectItem value="Other" className="focus:bg-cyan-600 focus:text-white cursor-pointer transition-colors">Other</SelectItem>
 </SelectContent>
 </Select>
 <FormMessage />
 </FormItem>
 )} />

 <FormField control={control} name="maritalStatus" render={({ field }) => (
 <FormItem className="group">
 <FormLabel className="text-slate-300 group-hover:text-slate-200 transition-colors drop-shadow-sm font-medium">Marital Status</FormLabel>
 <Select onValueChange={field.onChange} value={field.value || ""}>
 <FormControl>
 <SelectTrigger className="text-cyan-300 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 hover:bg-slate-900/80 transition-all">
 <SelectValue placeholder="Select" className="text-slate-500" />
 </SelectTrigger>
 </FormControl>
 <SelectContent className="dark bg-slate-900 border-slate-700 text-slate-200">
 <SelectItem value="Single" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Single</SelectItem>
 <SelectItem value="Married" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Married</SelectItem>
 <SelectItem value="Divorced" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Divorced</SelectItem>
 <SelectItem value="Widowed" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Widowed</SelectItem>
 </SelectContent>
 </Select>
 <FormMessage />
 </FormItem>
 )} />
 
 <FormField control={control} name="nationality" render={({ field }) => (
 <FormItem className="group relative">
 <FormLabel className="text-slate-300 group-hover:text-emerald-300 group-focus-within:text-emerald-400 transition-colors drop-shadow-sm font-medium tracking-wide">Nationality</FormLabel>
 <FormControl>
 <Input {...field} className="text-cyan-300 [&::placeholder]:[text-shadow:none] placeholder:text-slate-500 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all shadow-inner hover:bg-slate-900/80" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )} />
 </div>

 <div className="relative mt-8 mb-6 border-b border-emerald-500/20 pb-3 group">
 <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>
 <h3 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)] animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
 Family Details
 </h3>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <FormField control={control} name="fatherName" render={({ field }) => (
 <FormItem className="group relative">
 <FormLabel className="text-slate-300 group-hover:text-emerald-300 group-focus-within:text-emerald-400 transition-colors drop-shadow-sm font-medium tracking-wide">Father Name</FormLabel>
 <FormControl>
 <Input {...field} className="text-cyan-300 [&::placeholder]:[text-shadow:none] placeholder:text-slate-500 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all shadow-inner hover:bg-slate-900/80" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )} />
 <FormField control={control} name="motherName" render={({ field }) => (
 <FormItem className="group relative">
 <FormLabel className="text-slate-300 group-hover:text-emerald-300 group-focus-within:text-emerald-400 transition-colors drop-shadow-sm font-medium tracking-wide">Mother Name</FormLabel>
 <FormControl>
 <Input {...field} className="text-cyan-300 [&::placeholder]:[text-shadow:none] placeholder:text-slate-500 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all shadow-inner hover:bg-slate-900/80" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )} />
 <FormField control={control} name="spouseName" render={({ field }) => (
 <FormItem className="group relative">
 <FormLabel className="text-slate-300 group-hover:text-emerald-300 group-focus-within:text-emerald-400 transition-colors drop-shadow-sm font-medium tracking-wide">Spouse Name</FormLabel>
 <FormControl>
 <Input {...field} className="text-cyan-300 placeholder:text-slate-500 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all shadow-inner hover:bg-slate-900/80" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )} />
 </div>
 </div>
 );
}

// --- Step 2: Contact Details ---
export function StepContact() {
 const { control } = useFormContext<CustomerRegistrationValues>();

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-right-16 zoom-in-[98%] duration-[700ms] ease-out">
 <div className="border-b border-emerald-500/20 pb-4 mb-6 relative group">
 <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>
 <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse">
 Contact Details
 </h2>
 <p className="text-sm text-teal-200/60 mt-1">How can we reach the customer?</p>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <FormField control={control} name="mobile" render={({ field }) => (
 <FormItem className="group relative">
 <FormLabel className="text-slate-300 group-hover:text-emerald-300 group-focus-within:text-emerald-400 transition-colors drop-shadow-sm font-medium tracking-wide">Mobile Number</FormLabel>
 <FormControl>
 <Input type="tel" {...field} className="text-cyan-300 [&::placeholder]:[text-shadow:none] placeholder:text-slate-500 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all shadow-inner hover:bg-slate-900/80" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )} />
 <FormField control={control} name="alternateNumber" render={({ field }) => (
 <FormItem className="group relative">
 <FormLabel className="text-slate-300 group-hover:text-emerald-300 group-focus-within:text-emerald-400 transition-colors drop-shadow-sm font-medium tracking-wide">Alternate Mobile Number</FormLabel>
 <FormControl>
 <Input type="tel" {...field} className="text-cyan-300 [&::placeholder]:[text-shadow:none] placeholder:text-slate-500 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all shadow-inner hover:bg-slate-900/80" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )} />
 <FormField control={control} name="email" render={({ field }) => (
 <FormItem className="group relative">
 <FormLabel className="text-slate-300 group-hover:text-emerald-300 group-focus-within:text-emerald-400 transition-colors drop-shadow-sm font-medium tracking-wide">Email Address</FormLabel>
 <FormControl>
 <Input type="email" {...field} className="text-cyan-300 [&::placeholder]:[text-shadow:none] placeholder:text-slate-500 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all shadow-inner hover:bg-slate-900/80" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )} />
 <FormField control={control} name="emergencyContact" render={({ field }) => (
 <FormItem className="group relative">
 <FormLabel className="text-slate-300 group-hover:text-emerald-300 group-focus-within:text-emerald-400 transition-colors drop-shadow-sm font-medium tracking-wide">Emergency Contact</FormLabel>
 <FormControl>
 <Input type="tel" {...field} className="text-cyan-300 [&::placeholder]:[text-shadow:none] placeholder:text-slate-500 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all shadow-inner hover:bg-slate-900/80" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )} />
 </div>
 </div>
 );
}

// --- Step 3: Address Details ---
export function StepAddress() {
 const { control, watch, setValue } = useFormContext<CustomerRegistrationValues>();
 const sameAsPermanent = watch("sameAsPermanent");
 const permanentAddress = watch("permanentAddress");

 useEffect(() => {
 if (sameAsPermanent) {
 if (permanentAddress) {
 setValue("currentAddress", {
 houseNumber: permanentAddress.houseNumber || "",
 street: permanentAddress.street || "",
 village: permanentAddress.village || "",
 block: permanentAddress.block || "",
 town: permanentAddress.town || "",
 district: permanentAddress.district || "",
 state: permanentAddress.state || "",
 country: permanentAddress.country || "",
 pincode: permanentAddress.pincode || ""
 }, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
 }
 } else {
 // Optional: Clear current address when unchecked if desired.
 // But usually it's left as is so users don't lose data by accidentally unchecking.
 }
 }, [sameAsPermanent, permanentAddress, setValue]);

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-top-12 duration-[900ms] ease-in-out">
 <div className="border-b border-emerald-500/20 pb-4 mb-6 relative group">
 <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>
 <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
 Address Details
 </h2>
 </div>

 <FormField control={control} name="sameAsPermanent" render={({ field }) => (
 <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border border-emerald-500/30 rounded-md bg-emerald-950/20 mb-6 hover:bg-amber-950/40 transition-colors cursor-pointer group">
 <FormControl>
 <Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500" />
 </FormControl>
 <div className="space-y-1 leading-none">
 <FormLabel className="text-amber-200 cursor-pointer group-hover:text-slate-200 transition-colors">Current Address is same as Permanent Address</FormLabel>
 </div>
 </FormItem>
 )} />

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Permanent Address Column */}
 <div className="space-y-4 border border-emerald-500/20 p-4 rounded-xl bg-emerald-950/10">
 <div className="border-b border-emerald-500/20 pb-2 mb-4 group">
 <h3 className="text-xl font-semibold text-orange-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">Permanent Address</h3>
 </div>
 <div className="space-y-4">
 <FormField control={control} name="permanentAddress.houseNumber" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">House Number</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="permanentAddress.street" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">Street</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="permanentAddress.village" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">Village</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="permanentAddress.block" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">Block</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="permanentAddress.town" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">Town / City</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="permanentAddress.district" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">District</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="permanentAddress.state" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">State</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="permanentAddress.country" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">Country</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="permanentAddress.pincode" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">Pincode</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 </div>
 </div>

 {/* Current Address Column */}
 <div className="space-y-4 border border-emerald-500/20 p-4 rounded-xl bg-emerald-950/10">
 <div className="border-b border-emerald-500/20 pb-2 mb-4 group">
 <h3 className="text-xl font-semibold text-amber-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">Current Address</h3>
 </div>
 <div className="space-y-4">
 <FormField control={control} name="currentAddress.houseNumber" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">House Number</FormLabel><FormControl><Input disabled={sameAsPermanent} {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80 disabled:opacity-70" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="currentAddress.street" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">Street</FormLabel><FormControl><Input disabled={sameAsPermanent} {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80 disabled:opacity-70" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="currentAddress.village" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">Village</FormLabel><FormControl><Input disabled={sameAsPermanent} {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80 disabled:opacity-70" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="currentAddress.block" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">Block</FormLabel><FormControl><Input disabled={sameAsPermanent} {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80 disabled:opacity-70" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="currentAddress.town" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">Town / City</FormLabel><FormControl><Input disabled={sameAsPermanent} {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80 disabled:opacity-70" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="currentAddress.district" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">District</FormLabel><FormControl><Input disabled={sameAsPermanent} {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80 disabled:opacity-70" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="currentAddress.state" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">State</FormLabel><FormControl><Input disabled={sameAsPermanent} {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80 disabled:opacity-70" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="currentAddress.country" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">Country</FormLabel><FormControl><Input disabled={sameAsPermanent} {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80 disabled:opacity-70" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="currentAddress.pincode" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400">Pincode</FormLabel><FormControl><Input disabled={sameAsPermanent} {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80 disabled:opacity-70" /></FormControl><FormMessage /></FormItem>
 )} />
 </div>
 </div>
 </div>
 </div>
 );
}

// --- Step 4: Education Details ---
export function StepEducation() {
 const { control, watch } = useFormContext<CustomerRegistrationValues>();
 const edu = watch("education");
 
 return (
 <div className="space-y-6 animate-in fade-in zoom-in-50 duration-[800ms] ease-out">
 <div className="border-b border-emerald-500/20 pb-4 mb-6 relative group">
 <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>
 <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
 Education Details
 </h2>
 </div>
 
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <FormField control={control} name="education.highSchool" render={({ field }) => (
 <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border border-emerald-500/30 bg-emerald-950/20 hover:bg-fuchsia-950/40 p-4 transition-colors cursor-pointer group">
 <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500" /></FormControl>
 <FormLabel className="font-medium text-fuchsia-200 cursor-pointer group-hover:text-slate-200 transition-colors">High School</FormLabel>
 </FormItem>
 )} />
 <FormField control={control} name="education.intermediate" render={({ field }) => (
 <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border border-emerald-500/30 bg-emerald-950/20 hover:bg-purple-950/40 p-4 transition-colors cursor-pointer group">
 <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500" /></FormControl>
 <FormLabel className="font-medium text-purple-200 cursor-pointer group-hover:text-slate-200 transition-colors">Intermediate</FormLabel>
 </FormItem>
 )} />
 <FormField control={control} name="education.bachelor" render={({ field }) => (
 <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border border-emerald-500/30 bg-emerald-950/20 hover:bg-fuchsia-950/40 p-4 transition-colors cursor-pointer group">
 <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500" /></FormControl>
 <FormLabel className="font-medium text-fuchsia-200 cursor-pointer group-hover:text-slate-200 transition-colors">Bachelor Degree</FormLabel>
 </FormItem>
 )} />
 <FormField control={control} name="education.master" render={({ field }) => (
 <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border border-emerald-500/30 bg-emerald-950/20 hover:bg-purple-950/40 p-4 transition-colors cursor-pointer group">
 <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500" /></FormControl>
 <FormLabel className="font-medium text-purple-200 cursor-pointer group-hover:text-slate-200 transition-colors">Master Degree</FormLabel>
 </FormItem>
 )} />
 </div>

 <div className="space-y-4">
 {edu?.highSchool && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-5 border border-emerald-500/30 rounded-xl bg-emerald-950/10 animate-in fade-in slide-in-from-top-4">
 <h3 className="md:col-span-2 text-fuchsia-300 font-semibold border-b border-emerald-500/20 pb-2">High School Details</h3>
 <FormField control={control} name="education.highSchoolBoard" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Board / School Name</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="education.highSchoolYear" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Passing Year</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 </div>
 )}
 
 {edu?.intermediate && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-5 border border-emerald-500/30 rounded-xl bg-emerald-950/10 animate-in fade-in slide-in-from-top-4">
 <h3 className="md:col-span-2 text-purple-300 font-semibold border-b border-emerald-500/20 pb-2">Intermediate Details</h3>
 <FormField control={control} name="education.intermediateBoard" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Board / College Name</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="education.intermediateYear" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Passing Year</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 </div>
 )}

 {edu?.bachelor && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-5 border border-emerald-500/30 rounded-xl bg-emerald-950/10 animate-in fade-in slide-in-from-top-4">
 <h3 className="md:col-span-2 text-fuchsia-300 font-semibold border-b border-emerald-500/20 pb-2">Bachelor Degree Details</h3>
 <FormField control={control} name="education.bachelorUniversity" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">University / College Name</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="education.bachelorYear" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Passing Year</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 </div>
 )}

 {edu?.master && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-5 border border-emerald-500/30 rounded-xl bg-emerald-950/10 animate-in fade-in slide-in-from-top-4">
 <h3 className="md:col-span-2 text-purple-300 font-semibold border-b border-emerald-500/20 pb-2">Master Degree Details</h3>
 <FormField control={control} name="education.masterUniversity" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">University / College Name</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="education.masterYear" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Passing Year</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 </div>
 )}
 </div>
 </div>
 );
}

// --- Step 5: Employment Details ---
export function StepEmployment() {
 const { control, watch } = useFormContext<CustomerRegistrationValues>();
 const empStatus = watch("employmentStatus");
 const showDetails = empStatus && !["Unemployed", "Student"].includes(empStatus);
 
 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-left-16 duration-[700ms] ease-out">
 <div className="border-b border-emerald-500/20 pb-4 mb-6 relative group">
 <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>
 <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
 Employment Details
 </h2>
 </div>

 <FormField control={control} name="employmentStatus" render={({ field }) => (
 <FormItem className="group">
 <FormLabel className="text-slate-300 group-focus-within:text-emerald-400 transition-colors font-medium">Employment Status</FormLabel>
 <Select onValueChange={field.onChange} value={field.value || ""}>
 <FormControl>
 <SelectTrigger className="text-cyan-300 font-semibold tracking-wide bg-slate-900/50 border-slate-700/50 hover:bg-slate-900/80 transition-all">
 <SelectValue placeholder="Select employment status" className="text-slate-500" />
 </SelectTrigger>
 </FormControl>
 <SelectContent className="dark bg-slate-900 border-slate-700 text-slate-200">
 <SelectItem value="Student" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Student</SelectItem>
 <SelectItem value="Fresher" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Fresher</SelectItem>
 <SelectItem value="Private Employee" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Private Employee</SelectItem>
 <SelectItem value="Government Employee" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Government Employee</SelectItem>
 <SelectItem value="Self Employed" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Self Employed</SelectItem>
 <SelectItem value="Business Owner" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Business Owner</SelectItem>
 <SelectItem value="Retired" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Retired</SelectItem>
 <SelectItem value="Unemployed" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Unemployed</SelectItem>
 </SelectContent>
 </Select>
 <FormMessage />
 </FormItem>
 )} />

 {showDetails && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-5 border border-emerald-500/30 rounded-xl bg-emerald-950/10 animate-in fade-in slide-in-from-top-4">
 <FormField control={control} name="companyName" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Company / Business Name</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="designation" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Designation</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="annualIncome" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Annual Income (₹)</FormLabel><FormControl><Input type="number" {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="workExperience" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Work Experience (Years)</FormLabel><FormControl><Input type="number" {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 </div>
 )}
 </div>
 );
}

// --- Step 6: Nominee Details ---
export function StepNominee() {
 const { control } = useFormContext<CustomerRegistrationValues>();
 return (
 <div className="space-y-6 animate-in fade-in spin-in-6 zoom-in-90 duration-[850ms] ease-out">
 <div className="border-b border-emerald-500/20 pb-4 mb-6 relative group">
 <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>
 <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
 Nominee Details
 </h2>
 <p className="text-sm text-teal-200/60 mt-1">In the event of unforeseen circumstances.</p>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <FormField control={control} name="nomineeName" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Nominee Name</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="nomineeRelationship" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Relationship</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="nomineeMobile" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Mobile Number</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="nomineeAddress" render={({ field }) => (
 <FormItem className="group relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Address</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" /></FormControl><FormMessage /></FormItem>
 )} />
 </div>
 </div>
 );
}

// --- Step 7: Documents ---
export function StepDocuments() {
 const { control } = useFormContext<CustomerRegistrationValues>();
 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-24 zoom-in-105 duration-[900ms] ease-out">
 <div className="border-b border-emerald-500/20 pb-4 mb-6 relative group">
 <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>
 <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
 Documents KYC
 </h2>
 <p className="text-sm text-teal-200/60 mt-1">Upload official identification documents.</p>
 </div>

 <div className="space-y-4 border border-emerald-500/30 p-6 rounded-xl bg-emerald-950/20 group hover:border-lime-400/50 hover:shadow-[0_0_20px_rgba(163,230,53,0.1)] transition-all">
 <h3 className="text-lg font-semibold text-lime-300 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)] border-b border-emerald-500/20 pb-2">Aadhaar Card</h3>
 <FormField control={control} name="aadhaar" render={({ field }) => (
 <FormItem className="relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Aadhaar Number</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/80 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900" /></FormControl><FormMessage /></FormItem>
 )} />
 <div className="grid grid-cols-2 gap-4 mt-2">
 <FormItem><FormLabel className="text-slate-300">Aadhaar Front</FormLabel><FormControl><Input type="file" className="text-lime-200 file:bg-lime-500 file:text-black file:border-none file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-lime-400 transition-all cursor-pointer bg-slate-900 border-slate-700 focus-visible:ring-lime-500" /></FormControl></FormItem>
 <FormItem><FormLabel className="text-slate-300">Aadhaar Back</FormLabel><FormControl><Input type="file" className="text-lime-200 file:bg-lime-500 file:text-black file:border-none file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-lime-400 transition-all cursor-pointer bg-slate-900 border-slate-700 focus-visible:ring-lime-500" /></FormControl></FormItem>
 </div>
 </div>

 <div className="space-y-4 border border-emerald-500/30 p-6 rounded-xl bg-emerald-950/20 group hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)] transition-all">
 <h3 className="text-lg font-semibold text-yellow-300 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)] border-b border-emerald-500/20 pb-2">PAN Card</h3>
 <FormField control={control} name="pan" render={({ field }) => (
 <FormItem className="relative"><FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">PAN Number</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-900/80 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormItem className="mt-2"><FormLabel className="text-slate-300">PAN Upload</FormLabel><FormControl><Input type="file" className="text-yellow-200 file:bg-yellow-500 file:text-black file:border-none file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-yellow-400 transition-all cursor-pointer bg-slate-900 border-slate-700 focus-visible:ring-yellow-500" /></FormControl></FormItem>
 </div>
 </div>
 );
}

// --- Step 8: Photo & Signature ---
export function StepPhoto() {
 return (
 <div className="space-y-6 animate-in fade-in zoom-in-[120%] duration-[750ms] ease-in-out">
 <div className="border-b border-emerald-500/20 pb-4 mb-6 relative group">
 <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>
 <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
 Photo & Signature
 </h2>
 <p className="text-sm text-teal-200/60 mt-1">Ensure clear and visible uploads.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <FormItem className="border-2 border-dashed border-emerald-500/40 bg-emerald-950/10 hover:bg-violet-950/30 p-8 text-center rounded-xl transition-all cursor-pointer group hover:border-violet-400/60 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]">
 <FormLabel className="block text-lg mb-4 text-violet-300 font-semibold tracking-wide drop-shadow-[0_0_5px_rgba(52,211,153,0.5)] cursor-pointer group-hover:scale-105 transition-transform">Passport Size Photo</FormLabel>
 <FormControl><Input type="file" className="max-w-xs mx-auto text-violet-200 file:bg-violet-600 file:text-white file:border-none file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-violet-500 transition-all cursor-pointer bg-slate-900 border-emerald-500/30 focus-visible:ring-violet-500" /></FormControl>
 </FormItem>
 
 <FormItem className="border-2 border-dashed border-emerald-500/40 bg-emerald-950/10 hover:bg-pink-950/30 p-8 text-center rounded-xl transition-all cursor-pointer group hover:border-pink-400/60 hover:shadow-[0_0_25px_rgba(244,114,182,0.15)]">
 <FormLabel className="block text-lg mb-4 text-pink-300 font-semibold tracking-wide drop-shadow-[0_0_5px_rgba(52,211,153,0.5)] cursor-pointer group-hover:scale-105 transition-transform">Signature Upload</FormLabel>
 <FormControl><Input type="file" className="max-w-xs mx-auto text-pink-200 file:bg-pink-600 file:text-white file:border-none file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-pink-500 transition-all cursor-pointer bg-slate-900 border-emerald-500/30 focus-visible:ring-pink-500" /></FormControl>
 </FormItem>
 </div>
 </div>
 );
}

// --- Step 9: Login Credentials ---
export function StepCredentials() {
 const { control, watch } = useFormContext<CustomerRegistrationValues>();
 const autoGenerate = watch("autoGenerateLogin");

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-left-12 slide-in-from-top-12 duration-[800ms] ease-out">
 <div className="border-b border-emerald-500/20 pb-4 mb-6 relative group">
 <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>
 <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
 Login Credentials
 </h2>
 <p className="text-sm text-teal-200/60 mt-1">Setup customer internet banking access.</p>
 </div>

 <FormField control={control} name="autoGenerateLogin" render={({ field }) => (
 <FormItem className="space-y-4">
 <FormLabel className="text-slate-300 font-medium text-lg">Credential Generation Method</FormLabel>
 <FormControl>
 <RadioGroup
 onValueChange={(val) => field.onChange(val === "true")}
 defaultValue={field.value ? "true" : "false"}
 className="flex flex-col space-y-3"
 >
 <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-emerald-500/30 rounded-xl bg-emerald-950/20 hover:bg-cyan-950/40 hover:border-cyan-400/50 transition-all cursor-pointer group">
 <FormControl><RadioGroupItem value="true" className="border-cyan-400 text-cyan-400 focus:ring-cyan-500" /></FormControl>
 <FormLabel className="font-semibold text-cyan-200 cursor-pointer group-hover:text-slate-200 transition-colors drop-shadow-[0_0_2px_rgba(34,211,238,0.5)]">Auto Generate (System will generate ID, Username, and Temp Password)</FormLabel>
 </FormItem>
 <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-emerald-500/30 rounded-xl bg-emerald-950/20 hover:bg-teal-950/40 hover:border-teal-400/50 transition-all cursor-pointer group">
 <FormControl><RadioGroupItem value="false" className="border-cyan-400 text-cyan-400 focus:ring-cyan-500" /></FormControl>
 <FormLabel className="font-semibold text-teal-200 cursor-pointer group-hover:text-slate-200 transition-colors drop-shadow-[0_0_2px_rgba(45,212,191,0.5)]">Manual Customer Login Creation</FormLabel>
 </FormItem>
 </RadioGroup>
 </FormControl>
 </FormItem>
 )} />

 {!autoGenerate && (
 <div className="grid grid-cols-1 gap-6 max-w-md mt-8 p-6 border border-emerald-500/40 rounded-xl bg-slate-900/60 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)] animate-in fade-in slide-in-from-top-4 duration-500">
 <FormField control={control} name="username" render={({ field }) => (
 <FormItem className="relative"><FormLabel className="text-slate-300 font-medium">Username</FormLabel><FormControl><Input {...field} className="text-cyan-300 bg-slate-950 border-slate-700 focus-visible:border-cyan-500 transition-all" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="password" render={({ field }) => (
 <FormItem className="relative"><FormLabel className="text-slate-300 font-medium">Password</FormLabel><FormControl><Input type="password" {...field} className="text-cyan-300 bg-slate-950 border-slate-700 focus-visible:border-cyan-500 transition-all font-mono tracking-widest" /></FormControl><FormMessage /></FormItem>
 )} />
 <FormField control={control} name="confirmPassword" render={({ field }) => (
 <FormItem className="relative"><FormLabel className="text-slate-300 font-medium">Confirm Password</FormLabel><FormControl><Input type="password" {...field} className="text-cyan-300 bg-slate-950 border-slate-700 focus-visible:border-cyan-500 transition-all font-mono tracking-widest" /></FormControl><FormMessage /></FormItem>
 )} />
 </div>
 )}
 </div>
 );
}

// --- Step 10: Review ---
export function StepReview() {
 const { getValues } = useFormContext<CustomerRegistrationValues>();
 const values = getValues();

 return (
 <div className="space-y-8 animate-in fade-in zoom-in-75 spin-in-2 duration-[1200ms] ease-out">
 <div className="border-b border-emerald-500/30 pb-4 mb-6 relative flex items-center justify-between">
 <div>
 <h2 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-pulse">
 Review & Submit
 </h2>
 <p className="text-emerald-200/70 mt-1 font-medium">Please review all information before finalizing.</p>
 </div>
 <div className="h-12 w-12 rounded-full border border-emerald-400 bg-emerald-950/50 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.5)]">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-6 shadow-[inset_0_0_20px_rgba(52,211,153,0.05)] hover:border-emerald-500/40 transition-all">
 <h3 className="text-lg font-bold text-emerald-300 border-b border-emerald-500/20 pb-2 mb-4 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">Personal Summary</h3>
 <div className="space-y-3">
 <p className="text-sm text-slate-400">Name: <span className="font-semibold text-cyan-300 ml-2">{values.firstName} {values.lastName}</span></p>
 <p className="text-sm text-slate-400">Gender: <span className="font-semibold text-cyan-300 ml-2">{values.gender}</span></p>
 <p className="text-sm text-slate-400">Marital Status: <span className="font-semibold text-cyan-300 ml-2">{values.maritalStatus}</span></p>
 </div>
 </div>
 
 <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-6 shadow-[inset_0_0_20px_rgba(45,212,191,0.05)] hover:border-emerald-500/40 transition-all">
 <h3 className="text-lg font-bold text-teal-300 border-b border-emerald-500/20 pb-2 mb-4 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">Contact Summary</h3>
 <div className="space-y-3">
 <p className="text-sm text-slate-400">Mobile: <span className="font-semibold text-cyan-300 ml-2">{values.mobile}</span></p>
 <p className="text-sm text-slate-400">Email: <span className="font-semibold text-cyan-300 ml-2">{values.email}</span></p>
 <p className="text-sm text-slate-400">Emergency: <span className="font-semibold text-cyan-300 ml-2">{values.emergencyContact}</span></p>
 </div>
 </div>
 </div>

 <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/40 p-6 rounded-xl mt-8 border border-emerald-500/30 shadow-[0_0_30px_rgba(52,211,153,0.15)] flex items-start gap-4">
 <div className="mt-1 flex-shrink-0 text-emerald-400 animate-pulse">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
 </div>
 <div>
 <h4 className="text-emerald-300 font-bold tracking-wide drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">Final Confirmation</h4>
 <p className="text-sm text-emerald-100/70 mt-1 leading-relaxed">
 By submitting, you electronically confirm that all provided information is accurate and physical KYC documents have been successfully verified against this data.
 </p>
 </div>
 </div>
 </div>
 );
}


// --- Step 10: Account Details ---
export function StepAccountDetails() {
  const { control, setValue } = useFormContext<CustomerRegistrationValues>();

  React.useEffect(() => {
    const generate = () => {
      let acc = "";
      for (let i = 0; i < 15; i++) acc += Math.floor(Math.random() * 10).toString();
      return acc;
    };
    setValue("accountNumber", generate());
  }, [setValue]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-[800ms] ease-out">
      <div className="border-b border-emerald-500/20 pb-4 mb-6 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-cyan-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>
        <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          Account Details
        </h2>
        <p className="text-sm text-cyan-200/60 mt-1">Configure account type, initial deposit, and banking services.</p>
      </div>

      {/* Account Type & Initial Deposit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField control={control} name="accountType" render={({ field }) => (
          <FormItem className="group">
            <FormLabel className="text-slate-300 group-focus-within:text-cyan-400 font-medium">Account Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger className="text-cyan-300 font-semibold bg-slate-900/50 border-slate-700/50 hover:bg-slate-900/80 transition-all">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="dark bg-slate-900 border-slate-700 text-slate-200">
                <SelectItem value="Savings Account" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Savings Account</SelectItem>
                <SelectItem value="Current Account" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Current Account</SelectItem>
                <SelectItem value="Salary Account" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Salary Account</SelectItem>
                <SelectItem value="Fixed Deposit" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Fixed Deposit</SelectItem>
                <SelectItem value="Recurring Deposit" className="focus:bg-cyan-600 focus:text-white cursor-pointer">Recurring Deposit</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={control} name="initialDeposit" render={({ field }) => (
          <FormItem className="group relative">
            <FormLabel className="text-slate-300 group-focus-within:text-cyan-400 font-medium">Initial Deposit (₹)</FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 font-bold text-lg">₹</span>
                <Input type="number" placeholder="0" {...field} className="pl-9 text-cyan-300 font-bold bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      {/* Services */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-cyan-300 mb-4 border-b border-cyan-500/20 pb-2">Banking Services & Facilities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {([
            { name: "services.debitCard", label: "Debit Card", desc: "ATM & POS access worldwide" },
            { name: "services.internetBanking", label: "Internet Banking", desc: "Full online account control" },
            { name: "services.mobileBanking", label: "Mobile Banking", desc: "Banking on the go" },
            { name: "services.smsAlerts", label: "SMS Alerts", desc: "Real-time transaction alerts" },
            { name: "services.chequeBook", label: "Cheque Book", desc: "Physical cheque book" },
            { name: "services.upi", label: "UPI Services", desc: "Instant UPI transfers" },
          ] as const).map((svc) => (
            <FormField key={svc.name} control={control} name={svc.name as any} render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-slate-700/60 bg-slate-900/40 p-4 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all cursor-pointer group">
                <FormControl>
                  <Checkbox
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 border-slate-600 mt-0.5"
                  />
                </FormControl>
                <div className="space-y-0.5">
                  <FormLabel className="font-semibold text-slate-200 group-hover:text-cyan-300 cursor-pointer transition-colors">{svc.label}</FormLabel>
                  <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{svc.desc}</p>
                </div>
              </FormItem>
            )} />
          ))}
        </div>
      </div>

      {/* Netbanking & UPI IDs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <FormField control={control} name="netbankingId" render={({ field }) => (
          <FormItem className="group relative">
            <FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Netbanking User ID</FormLabel>
            <div className="flex rounded-md shadow-sm">
              <FormControl>
                <Input {...field} placeholder="johndoe" className="rounded-r-none text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" />
              </FormControl>
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-slate-700/50 bg-slate-800 text-slate-400 sm:text-sm">
                @lomaxnetbanking.com
              </span>
            </div>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={control} name="upiId" render={({ field }) => (
          <FormItem className="group relative">
            <FormLabel className="text-slate-300 group-focus-within:text-emerald-400 font-medium">Custom UPI ID</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. 9876543210@ybl" className="text-cyan-300 bg-slate-900/50 border-slate-700/50 focus-visible:border-cyan-500 transition-all hover:bg-slate-900/80" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
    </div>
  );
}


// --- Step 11: Branch Selection ---
export function StepBranchSelection() {
  const { control, setValue, watch } = useFormContext<CustomerRegistrationValues>();
  const [branches, setBranches] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedState, setSelectedState] = React.useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>("");

  const currentBranchId = watch("branchId");

  React.useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/branches");
        const data = await response.json();
        if (data.success) {
          setBranches(data.data.filter((b: any) => b.status === "Active"));
        }
      } catch (error) {
        console.error("Failed to fetch branches", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  React.useEffect(() => {
    if (branches.length > 0 && currentBranchId) {
      const activeBranch = branches.find((b: any) => b._id === currentBranchId);
      if (activeBranch) {
        setSelectedState(activeBranch.state);
        setSelectedDistrict(activeBranch.district);
      }
    }
  }, [branches, currentBranchId]);

  // Derived state
  const uniqueStates = React.useMemo(() => {
    return Array.from(new Set(branches.map((b: any) => b.state))).sort();
  }, [branches]);

  const availableDistricts = React.useMemo(() => {
    if (!selectedState) return [];
    return Array.from(
      new Set(branches.filter((b: any) => b.state === selectedState).map((b: any) => b.district))
    ).sort();
  }, [branches, selectedState]);

  const availableBranches = React.useMemo(() => {
    if (!selectedDistrict) return [];
    return branches
      .filter((b: any) => b.state === selectedState && b.district === selectedDistrict)
      .sort((a: any, b: any) => a.branchName.localeCompare(b.branchName));
  }, [branches, selectedState, selectedDistrict]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-[800ms] ease-out">
      <div className="border-b border-emerald-500/20 pb-4 mb-6 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>
        <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
          Home Branch Selection
        </h2>
        <p className="text-sm text-cyan-200/60 mt-1">Select the primary banking branch for this customer's account.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8 text-emerald-500">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* State */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Select State</label>
            <Select
              value={selectedState}
              onValueChange={(val) => {
                setSelectedState(val || "");
                setSelectedDistrict("");
                setValue("branchId", "");
              }}
            >
              <SelectTrigger className="text-cyan-300 bg-slate-900/50 border-slate-700/50 h-14 text-lg">
                <SelectValue placeholder="Choose State" />
              </SelectTrigger>
              <SelectContent className="dark bg-slate-900 border-slate-700 text-slate-200">
                {uniqueStates.map((state) => (
                  <SelectItem key={state} value={state} className="cursor-pointer">
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* District */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Select District</label>
            <Select
              value={selectedDistrict}
              onValueChange={(val) => {
                setSelectedDistrict(val || "");
                setValue("branchId", "");
              }}
              disabled={!selectedState}
            >
              <SelectTrigger className="text-cyan-300 bg-slate-900/50 border-slate-700/50 h-14 text-lg disabled:opacity-50">
                <SelectValue placeholder={selectedState ? "Choose District" : "Select State First"} />
              </SelectTrigger>
              <SelectContent className="dark bg-slate-900 border-slate-700 text-slate-200">
                {availableDistricts.map((district) => (
                  <SelectItem key={district} value={district} className="cursor-pointer">
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Branch */}
          <FormField control={control} name="branchId" render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-slate-300">Select Home Branch</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                disabled={!selectedDistrict}
              >
                <FormControl>
                  <SelectTrigger className="text-cyan-300 bg-slate-900/50 border-emerald-500/50 h-14 text-lg focus:ring-emerald-500/50 focus:border-emerald-400 disabled:opacity-50">
                    <SelectValue placeholder={selectedDistrict ? "Select Branch" : "Select District First"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="dark bg-slate-900 border-emerald-500/50">
                  {availableBranches.length > 0 ? (
                    availableBranches.map((branch) => (
                      <SelectItem key={branch._id} value={branch._id} className="cursor-pointer hover:bg-emerald-900/50">
                        <div className="flex flex-col py-1">
                          <span className="font-bold text-emerald-400">{branch.branchName} ({branch.branchCode})</span>
                          <span className="text-xs text-slate-400">IFSC: {branch.ifscCode} | {branch.city}, {branch.state}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-500">No active branches available.</div>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      )}
    </div>
  );
}
