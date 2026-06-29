"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, User, MapPin, Briefcase, GraduationCap, FileText, Phone, Trash2, Landmark, Building2 } from "lucide-react";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [branch, setBranch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    const fetchCustomer = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/customers/${params.id}`);
        const resData = await response.json();
        if (resData.success) {
          setCustomer(resData.data);
          
          // Fetch branch details if branchId is present in registration data
          if (resData.data.registrationData?.branchId) {
            try {
              const branchRes = await fetch(`http://localhost:5000/api/branches/${resData.data.registrationData.branchId}`);
              const branchData = await branchRes.json();
              if (branchData.success) {
                setBranch(branchData.data);
              }
            } catch (err) {
              console.error("Failed to fetch assigned branch:", err);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch customer details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [params.id]);

  const handleDelete = async () => {
    if (!window.confirm("CRITICAL WARNING: Are you sure you want to permanently delete this customer? This action cannot be undone.")) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/auth/customers/${params.id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      
      if (data.success) {
        alert("Customer deleted successfully.");
        router.push("/customers");
      } else {
        alert(data.message || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-emerald-400 font-semibold animate-pulse tracking-widest">DECRYPTING DATA...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-red-400 font-bold">Customer Not Found</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/customers")}>Return to Directory</Button>
      </div>
    );
  }

  // Use registrationData if available, fallback to root customer properties
  const regData = customer.registrationData || {};
  const personal = {
    name: regData.firstName ? `${regData.firstName} ${regData.lastName}` : `${customer.firstName} ${customer.lastName}`,
    dob: regData.dob ? new Date(regData.dob).toLocaleDateString() : "N/A",
    gender: regData.gender || "N/A",
    maritalStatus: regData.maritalStatus || "N/A",
    nationality: regData.nationality || "N/A",
    father: regData.fatherName || "N/A",
    mother: regData.motherName || "N/A",
  };
  
  const contact = {
    mobile: regData.mobileNumber || customer.mobile || "N/A",
    email: regData.email || customer.email || "N/A",
    alternate: regData.alternateNumber || "N/A",
    emergency: regData.emergencyContact || "N/A",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 relative z-10 pb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/customers")} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md flex items-center gap-3">
              {personal.name}
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs rounded-full font-mono shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                {customer.customerId}
              </span>
            </h1>
            <p className="text-emerald-400/80 mt-1 font-mono text-sm">Account Status: <span className="uppercase text-emerald-400 font-bold">{customer.status}</span></p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={handleDelete}
          className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Delete Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Personal Details */}
        <Card className="bg-emerald-950/10 border-emerald-500/30 hover:border-emerald-400/60 shadow-[inset_0_0_20px_rgba(52,211,153,0.05)] transition-all group">
          <CardHeader className="border-b border-emerald-500/20 flex flex-row items-center gap-3">
            <User className="w-6 h-6 text-emerald-400" />
            <CardTitle className="text-emerald-300 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">Personal Info</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <div className="grid grid-cols-2 gap-2"><span className="text-slate-400">Date of Birth</span><span className="text-white font-medium">{personal.dob}</span></div>
            <div className="grid grid-cols-2 gap-2"><span className="text-slate-400">Gender</span><span className="text-white font-medium">{personal.gender}</span></div>
            <div className="grid grid-cols-2 gap-2"><span className="text-slate-400">Marital Status</span><span className="text-white font-medium">{personal.maritalStatus}</span></div>
            <div className="grid grid-cols-2 gap-2"><span className="text-slate-400">Nationality</span><span className="text-white font-medium">{personal.nationality}</span></div>
            <div className="grid grid-cols-2 gap-2"><span className="text-slate-400">Father's Name</span><span className="text-white font-medium">{personal.father}</span></div>
            <div className="grid grid-cols-2 gap-2"><span className="text-slate-400">Mother's Name</span><span className="text-white font-medium">{personal.mother}</span></div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="bg-blue-950/10 border-blue-500/30 hover:border-blue-400/60 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] transition-all group">
          <CardHeader className="border-b border-blue-500/20 flex flex-row items-center gap-3">
            <Phone className="w-6 h-6 text-blue-400" />
            <CardTitle className="text-blue-300 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div><span className="text-slate-400 text-xs uppercase tracking-wider block">Email Address</span><span className="text-white font-medium">{contact.email}</span></div>
            <div><span className="text-slate-400 text-xs uppercase tracking-wider block">Mobile Number</span><span className="text-white font-medium">{contact.mobile}</span></div>
            <div><span className="text-slate-400 text-xs uppercase tracking-wider block">Alternate Mobile</span><span className="text-white font-medium">{contact.alternate}</span></div>
            <div><span className="text-slate-400 text-xs uppercase tracking-wider block">Emergency Contact</span><span className="text-white font-medium">{contact.emergency}</span></div>
          </CardContent>
        </Card>

        {/* Address Details */}
        <Card className="bg-amber-950/10 border-amber-500/30 hover:border-amber-400/60 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)] transition-all group">
          <CardHeader className="border-b border-amber-500/20 flex flex-row items-center gap-3">
            <MapPin className="w-6 h-6 text-amber-400" />
            <CardTitle className="text-amber-300 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">Address Data</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <span className="text-amber-400 text-xs uppercase tracking-wider font-bold block mb-1">Permanent Address</span>
              {regData.permanentAddress ? (
                <p className="text-white font-medium text-sm leading-relaxed">
                  {regData.permanentAddress.houseNumber}, {regData.permanentAddress.street},<br/>
                  {regData.permanentAddress.village && `${regData.permanentAddress.village}, `}
                  {regData.permanentAddress.town}, {regData.permanentAddress.district},<br/>
                  {regData.permanentAddress.state}, {regData.permanentAddress.country} - {regData.permanentAddress.pincode}
                </p>
              ) : <p className="text-slate-500 italic">Not available</p>}
            </div>
            {regData.sameAsPermanent === false && regData.currentAddress && (
              <div>
                <span className="text-orange-400 text-xs uppercase tracking-wider font-bold block mb-1">Current Address</span>
                <p className="text-white font-medium text-sm leading-relaxed">
                  {regData.currentAddress.houseNumber}, {regData.currentAddress.street},<br/>
                  {regData.currentAddress.town}, {regData.currentAddress.pincode}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employment */}
        <Card className="bg-cyan-950/10 border-cyan-500/30 hover:border-cyan-400/60 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] transition-all group">
          <CardHeader className="border-b border-cyan-500/20 flex flex-row items-center gap-3">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            <CardTitle className="text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">Employment</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <div className="grid grid-cols-2 gap-2"><span className="text-slate-400">Status</span><span className="text-white font-medium">{regData.employmentStatus || "N/A"}</span></div>
            {regData.companyName && <div className="grid grid-cols-2 gap-2"><span className="text-slate-400">Organization</span><span className="text-white font-medium">{regData.companyName}</span></div>}
            {regData.designation && <div className="grid grid-cols-2 gap-2"><span className="text-slate-400">Designation</span><span className="text-white font-medium">{regData.designation}</span></div>}
            {regData.annualIncome && <div className="grid grid-cols-2 gap-2"><span className="text-slate-400">Income (₹)</span><span className="text-white font-medium">₹{regData.annualIncome}</span></div>}
            {regData.workExperience && <div className="grid grid-cols-2 gap-2"><span className="text-slate-400">Experience</span><span className="text-white font-medium">{regData.workExperience} Years</span></div>}
          </CardContent>
        </Card>
        
        {/* Education */}
        <Card className="bg-fuchsia-950/10 border-fuchsia-500/30 hover:border-fuchsia-400/60 shadow-[inset_0_0_20px_rgba(217,70,239,0.05)] transition-all group">
          <CardHeader className="border-b border-fuchsia-500/20 flex flex-row items-center gap-3">
            <GraduationCap className="w-6 h-6 text-fuchsia-400" />
            <CardTitle className="text-fuchsia-300 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">Education</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {regData.education?.highSchool && (
              <div>
                <span className="text-fuchsia-400 text-xs uppercase tracking-wider font-bold block">High School</span>
                <span className="text-white text-sm">{regData.education.highSchoolBoard || "N/A"} ({regData.education.highSchoolYear || "N/A"})</span>
              </div>
            )}
            {regData.education?.bachelor && (
              <div>
                <span className="text-purple-400 text-xs uppercase tracking-wider font-bold block">Bachelor's Degree</span>
                <span className="text-white text-sm">{regData.education.bachelorUniversity || "N/A"} ({regData.education.bachelorYear || "N/A"})</span>
              </div>
            )}
            {regData.education?.master && (
              <div>
                <span className="text-fuchsia-400 text-xs uppercase tracking-wider font-bold block">Master's Degree</span>
                <span className="text-white text-sm">{regData.education.masterUniversity || "N/A"} ({regData.education.masterYear || "N/A"})</span>
              </div>
            )}
            {(!regData.education?.highSchool && !regData.education?.bachelor && !regData.education?.master) && (
              <span className="text-slate-500 italic">No detailed education data provided.</span>
            )}
          </CardContent>
        </Card>

        {/* Documents / KYC */}
        <Card className="bg-lime-950/10 border-lime-500/30 hover:border-lime-400/60 shadow-[inset_0_0_20px_rgba(163,230,53,0.05)] transition-all group">
          <CardHeader className="border-b border-lime-500/20 flex flex-row items-center gap-3">
            <FileText className="w-6 h-6 text-lime-400" />
            <CardTitle className="text-lime-300 drop-shadow-[0_0_5px_rgba(163,230,53,0.5)]">KYC Documents</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wider block">PAN Number</span>
              <span className="text-lime-300 font-mono tracking-widest text-lg drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]">
                {regData.pan || (customer.pan === 'XXXXXXXXXX' ? 'Not Provided' : customer.pan) || "Not Provided"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wider block">Aadhaar / UID Number</span>
              <span className="text-yellow-300 font-mono tracking-widest text-lg drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                {regData.aadhaar || (customer.aadhaar === 'XXXXXXXXXXXX' ? 'Not Provided' : customer.aadhaar) || "Not Provided"}
              </span>
            </div>
            
            {regData.nomineeName && (
              <div className="mt-4 pt-4 border-t border-lime-500/20">
                 <span className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Nominee Info</span>
                 <div className="text-white text-sm">
                   <span className="font-semibold text-rose-300">{regData.nomineeName}</span> ({regData.nomineeRelationship})
                 </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Banking Setup Data */}
        {(regData.accountNumber || regData.netbankingId) && (
          <Card className="bg-teal-950/20 border-teal-500/40 hover:border-teal-400/70 shadow-[inset_0_0_25px_rgba(20,184,166,0.05)] transition-all group col-span-1 md:col-span-2 xl:col-span-3">
            <CardHeader className="border-b border-teal-500/20 flex flex-row items-center gap-3">
              <Landmark className="w-6 h-6 text-teal-400" />
              <CardTitle className="text-teal-300 drop-shadow-[0_0_5px_rgba(20,184,166,0.5)]">Banking Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-teal-950/40 p-4 rounded-lg border border-teal-500/20">
                <span className="text-teal-400/80 text-xs uppercase tracking-wider block mb-1">Account Number</span>
                <span className="text-white font-mono tracking-widest text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{regData.accountNumber || "N/A"}</span>
              </div>
              
              <div className="bg-teal-950/40 p-4 rounded-lg border border-teal-500/20">
                <span className="text-teal-400/80 text-xs uppercase tracking-wider block mb-1">Netbanking ID</span>
                <span className="text-white font-medium text-lg">{regData.netbankingId ? `${regData.netbankingId}@lomaxnetbanking.com` : "N/A"}</span>
              </div>

              <div className="bg-teal-950/40 p-4 rounded-lg border border-teal-500/20">
                <span className="text-teal-400/80 text-xs uppercase tracking-wider block mb-1">UPI Provider</span>
                <span className="text-white font-medium text-lg">{regData.upiProvider || "N/A"}</span>
              </div>

              <div className="bg-teal-950/40 p-4 rounded-lg border border-teal-500/20">
                <span className="text-teal-400/80 text-xs uppercase tracking-wider block mb-1">UPI ID</span>
                <span className="text-white font-medium text-lg">{regData.upiId || "N/A"}</span>
              </div>

            </CardContent>
          </Card>
        )}

        {/* Assigned Branch Data */}
        {branch && (
          <Card className="bg-indigo-950/20 border-indigo-500/40 hover:border-indigo-400/70 shadow-[inset_0_0_25px_rgba(99,102,241,0.05)] transition-all group col-span-1 md:col-span-2 xl:col-span-3">
            <CardHeader className="border-b border-indigo-500/20 flex flex-row items-center gap-3">
              <Building2 className="w-6 h-6 text-indigo-400" />
              <CardTitle className="text-indigo-300 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]">Assigned Home Branch</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-indigo-950/40 p-4 rounded-lg border border-indigo-500/20">
                <span className="text-indigo-400/80 text-xs uppercase tracking-wider block mb-1">Branch Name</span>
                <span className="text-white font-medium text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{branch.branchName}</span>
                <span className="text-indigo-300/80 text-xs block mt-1 font-mono">{branch.branchCode}</span>
              </div>
              
              <div className="bg-indigo-950/40 p-4 rounded-lg border border-indigo-500/20">
                <span className="text-indigo-400/80 text-xs uppercase tracking-wider block mb-1">Routing Codes</span>
                <span className="text-white font-mono text-sm block">IFSC: <span className="text-indigo-300">{branch.ifscCode}</span></span>
                <span className="text-white font-mono text-sm block">MICR: <span className="text-indigo-300">{branch.micrCode}</span></span>
              </div>

              <div className="bg-indigo-950/40 p-4 rounded-lg border border-indigo-500/20 lg:col-span-2">
                <span className="text-indigo-400/80 text-xs uppercase tracking-wider block mb-1">Contact & Address</span>
                <span className="text-white text-sm block">{branch.email} | {branch.phone}</span>
                <span className="text-slate-400 text-sm block mt-1">{branch.address}, {branch.city}, {branch.district}, {branch.state} - {branch.pincode}</span>
              </div>

            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
