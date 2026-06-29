"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerRegistrationValues, customerRegistrationSchema } from "@/lib/validations/customer";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  StepPersonal, StepContact, StepAddress, StepEducation,
  StepEmployment, StepNominee, StepDocuments, StepPhoto,
  StepCredentials, StepBranchSelection, StepAccountDetails, StepReview
} from "./components/form-steps";
import Loader from "@/components/ui/loader";
import CubeLoader from "@/components/ui/cube-loader";
import { CheckCircle2, Copy, ClipboardList } from "lucide-react";

const steps = [
  "Personal", "Contact", "Address", "Education", "Employment",
  "Nominee", "Documents", "Photo/Sign", "Credentials", "Branch", "Account", "Review"
];

export default function CustomerRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [successData, setSuccessData] = useState<any>(null);
  const router = useRouter();

  const form = useForm<CustomerRegistrationValues>({
    resolver: zodResolver(customerRegistrationSchema),
    defaultValues: {
      // Step 1: Personal
      firstName: "", middleName: "", lastName: "", gender: "",
      maritalStatus: undefined, nationality: "Indian",
      fatherName: "", motherName: "", spouseName: "",
      // Step 2: Contact
      mobile: "", alternateNumber: "", email: "", emergencyContact: "",
      // Step 3: Address
      sameAsPermanent: false,
      permanentAddress: { houseNumber: "", street: "", village: "", block: "", town: "", district: "", state: "", country: "", pincode: "" },
      currentAddress: { houseNumber: "", street: "", village: "", block: "", town: "", district: "", state: "", country: "", pincode: "" },
      // Step 4: Education
      education: {
        highSchool: false, highSchoolBoard: "", highSchoolYear: "",
        intermediate: false, intermediateBoard: "", intermediateYear: "",
        diploma: false,
        bachelor: false, bachelorUniversity: "", bachelorYear: "",
        master: false, masterUniversity: "", masterYear: "",
        doctorate: false, universityName: "", passingYear: "",
      },
      // Step 5: Employment
      employmentStatus: "", companyName: "", designation: "",
      monthlyIncome: "", annualIncome: "", workExperience: "",
      // Step 6: Nominee
      nomineeName: "", nomineeRelationship: "", nomineeMobile: "", nomineeAddress: "",
      // Step 7: Documents
      aadhaar: "", pan: "", passportNumber: "", drivingLicence: "", voterId: "",
      // Step 9: Credentials
      autoGenerateLogin: true, username: "", password: "", confirmPassword: "",
      // Step 10: Account Details
      accountType: "Savings Account",
      initialDeposit: "0",
      services: {
        debitCard: true, internetBanking: false,
        mobileBanking: true, smsAlerts: true,
        chequeBook: false, upi: false,
      },
      // Step 11: Branch
      branchId: "",
      // Banking IDs
      netbankingId: "", upiProvider: "", upiId: "", accountNumber: "",
    },
    mode: "onChange",
  });

  const nextStep = () => { if (currentStep < steps.length - 1) setCurrentStep(p => p + 1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(p => p - 1); };

  const onSubmit = async (data: CustomerRegistrationValues) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setSuccessData(result);
      } else {
        alert(result.message || "Failed to register customer.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting form. Please check if the server is running.");
    }
  };

  const onError = (errors: any) => {
    console.error("Form Validation Errors:", errors);
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (successData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative dark text-slate-200 bg-slate-950/80 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl p-8 text-center shadow-[0_0_60px_rgba(52,211,153,0.2)] overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/15 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/15 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 mx-auto w-24 h-24 bg-emerald-950/50 border-2 border-emerald-400/60 shadow-[0_0_30px_rgba(52,211,153,0.5)] text-emerald-400 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h2 className="relative z-10 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 mb-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
            Registration Submitted!
          </h2>
          <p className="relative z-10 text-emerald-100/70 mb-8 font-medium">
            Customer registration is pending account approval by administrator.
          </p>

          {/* Details Card */}
          <div className="relative z-10 bg-slate-900/60 backdrop-blur-md border border-emerald-500/30 rounded-xl p-6 text-left max-w-lg mx-auto space-y-4 shadow-[inset_0_0_20px_rgba(52,211,153,0.05)]">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest border-b border-emerald-500/20 pb-2">Registration Summary</h3>

            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-slate-400">Customer ID</span>
              <span className="font-bold font-mono text-emerald-300 text-lg flex items-center gap-2">
                {successData.customerId}
                <Copy className="w-4 h-4 cursor-pointer text-emerald-400/50 hover:text-emerald-300 transition-colors" onClick={() => navigator.clipboard.writeText(successData.customerId)} />
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-800/60">
              <span className="text-sm text-slate-400">Temporary Password</span>
              <span className="font-bold font-mono text-cyan-300 text-lg flex items-center gap-2">
                {successData.tempPassword}
                <Copy className="w-4 h-4 cursor-pointer text-cyan-400/50 hover:text-cyan-300 transition-colors" onClick={() => navigator.clipboard.writeText(successData.tempPassword)} />
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-800/60">
              <span className="text-sm text-slate-400">Account Number</span>
              <span className="font-semibold font-mono text-slate-200 flex items-center gap-2">
                {successData.accountNumber}
                <Copy className="w-4 h-4 cursor-pointer text-slate-400/50 hover:text-slate-300 transition-colors" onClick={() => navigator.clipboard.writeText(successData.accountNumber)} />
              </span>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
              <ClipboardList className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-amber-300 font-semibold text-sm">Pending Approval</p>
                <p className="text-amber-200/70 text-xs mt-0.5">This registration is queued for admin approval in <strong>Account Management → Account Approval</strong>. The account will be activated after approval.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 space-x-4">
            <Button
              variant="outline"
              onClick={() => { setSuccessData(null); form.reset(); setCurrentStep(0); }}
              className="border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white text-slate-300 transition-all"
            >
              Register Another Customer
            </Button>
            <Button
              onClick={() => router.push("/accounts/approval")}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_15px_rgba(52,211,153,0.4)] border-none transition-all"
            >
              Go to Account Approval
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration Form ───────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
          Register New Customer
        </h1>
        <p className="text-cyan-100/70 mt-2 font-medium">
          Complete the full KYC and account setup process in one place.
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800/80 backdrop-blur-sm -translate-y-1/2 rounded-full hidden md:block overflow-hidden border border-slate-700/50"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 -translate-y-1/2 rounded-full hidden md:block transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(52,211,153,0.8)]" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}>
          <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-r from-transparent to-white/60 blur-[2px] animate-pulse"></div>
        </div>

        <div className="flex justify-between relative z-10 w-full px-1">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center relative group">
              <div className="relative flex items-center justify-center">
                {index === currentStep && (
                  <div className="absolute inset-0 -m-2.5 rounded-full border border-emerald-400/60 animate-ping opacity-75" style={{ animationDuration: '2s' }}></div>
                )}
                {index === currentStep && (
                  <div className="absolute inset-0 -m-1 rounded-full border-t-2 border-r-2 border-teal-400 animate-spin shadow-[0_0_8px_rgba(45,212,191,0.8)]" style={{ animationDuration: '3s' }}></div>
                )}
                <div className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border transition-all duration-500 z-10
                  ${index === currentStep ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300 shadow-[inset_0_0_15px_rgba(52,211,153,0.5),0_0_15px_rgba(52,211,153,0.8)] scale-110' :
                    index < currentStep ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]' :
                    'border-slate-700/80 bg-slate-900/60 text-slate-500 backdrop-blur-sm'}`}
                >
                  {index === currentStep ? <CubeLoader /> : index + 1}
                </div>
              </div>
              <span className={`absolute top-10 sm:top-12 text-[10px] sm:text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-300 pointer-events-none
                ${index === currentStep
                  ? 'text-emerald-300 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] opacity-100 translate-y-0'
                  : index < currentStep
                    ? 'text-cyan-300/80 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                    : 'text-slate-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'}`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="relative dark text-slate-200 bg-slate-950/80 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(52,211,153,0.1)] overflow-hidden group transition-all duration-700 hover:border-emerald-400/50 hover:shadow-[0_0_50px_rgba(52,211,153,0.2)] z-10 mt-6">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-teal-500/20 transition-colors duration-700"></div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8 relative z-10">

            {/* Loader Overlay */}
            {form.formState.isSubmitting && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md rounded-xl">
                <Loader size="120px" />
                <p className="mt-6 text-cyan-300 font-bold tracking-widest text-lg animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">PROCESSING...</p>
              </div>
            )}

            {/* Step Rendering */}
            <div className="min-h-[400px]">
              {currentStep === 0 && <StepPersonal />}
              {currentStep === 1 && <StepContact />}
              {currentStep === 2 && <StepAddress />}
              {currentStep === 3 && <StepEducation />}
              {currentStep === 4 && <StepEmployment />}
              {currentStep === 5 && <StepNominee />}
              {currentStep === 6 && <StepDocuments />}
              {currentStep === 7 && <StepPhoto />}
              {currentStep === 8 && <StepCredentials />}
              {currentStep === 9 && <StepBranchSelection />}
              {currentStep === 10 && <StepAccountDetails />}
              {currentStep === 11 && <StepReview />}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-slate-800/60 mt-8 relative z-10">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white text-slate-300 transition-all duration-300"
              >
                Previous
              </Button>

              <div className="space-x-3">
                <Button type="button" variant="secondary" className="bg-slate-800/50 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all duration-300">
                  Save Draft
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_15px_rgba(52,211,153,0.4)] hover:shadow-[0_0_25px_rgba(52,211,153,0.6)] border-none transition-all duration-300">
                    Next Step
                  </Button>
                ) : (
                  <Button type="submit" className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-[0_0_15px_rgba(45,212,191,0.4)] hover:shadow-[0_0_25px_rgba(45,212,191,0.6)] border-none transition-all duration-300">
                    Submit Registration
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
