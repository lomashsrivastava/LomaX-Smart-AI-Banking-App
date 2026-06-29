import * as z from "zod";

export const customerRegistrationSchema = z.object({
  // Step 1: Personal Details
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  dob: z.date({ message: "Date of birth is required" }).optional(),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]).optional(),
  nationality: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  spouseName: z.string().optional(),

  // Step 2: Contact Details
  mobile: z.string().optional(),
  alternateNumber: z.string().optional(),
  email: z.string().optional(),
  emergencyContact: z.string().optional(),

  // Step 3: Address Details
  permanentAddress: z.object({
    houseNumber: z.string().optional(),
    street: z.string().optional(),
    village: z.string().optional(),
    block: z.string().optional(),
    town: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    pincode: z.string().optional(),
  }).optional(),
  sameAsPermanent: z.boolean().optional(),
  currentAddress: z.object({
    houseNumber: z.string().optional(),
    street: z.string().optional(),
    village: z.string().optional(),
    block: z.string().optional(),
    town: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    pincode: z.string().optional(),
  }).optional(),

  // Step 4: Education Details
  education: z.object({
    highSchool: z.boolean().optional(),
    highSchoolBoard: z.string().optional(),
    highSchoolYear: z.string().optional(),
    intermediate: z.boolean().optional(),
    intermediateBoard: z.string().optional(),
    intermediateYear: z.string().optional(),
    diploma: z.boolean().optional(),
    bachelor: z.boolean().optional(),
    bachelorUniversity: z.string().optional(),
    bachelorYear: z.string().optional(),
    master: z.boolean().optional(),
    masterUniversity: z.string().optional(),
    masterYear: z.string().optional(),
    doctorate: z.boolean().optional(),
    universityName: z.string().optional(),
    passingYear: z.string().optional(),
  }),

  // Step 5: Employment Details
  employmentStatus: z.string().optional(),
  companyName: z.string().optional(),
  designation: z.string().optional(),
  monthlyIncome: z.string().optional(),
  annualIncome: z.string().optional(),
  workExperience: z.string().optional(),

  // Step 6: Nominee Details
  nomineeName: z.string().optional(),
  nomineeRelationship: z.string().optional(),
  nomineeDob: z.date().optional(),
  nomineeMobile: z.string().optional(),
  nomineeAddress: z.string().optional(),

  // Step 7: Documents (Mocking file uploads with boolean or string for now)
  aadhaar: z.string().optional(),
  pan: z.string().optional(),
  passportNumber: z.string().optional(),
  drivingLicence: z.string().optional(),
  voterId: z.string().optional(),
  
  // File uploads will be mocked in local state for UI demonstration
  aadhaarFront: z.any().optional(),
  aadhaarBack: z.any().optional(),
  panUpload: z.any().optional(),

  // Step 8: Photo & Signature
  passportPhoto: z.any().optional(),
  signatureUpload: z.any().optional(),
  selfieUpload: z.any().optional(),

  // Step 9: Login Credentials
  autoGenerateLogin: z.boolean().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),

  // Step 10: Banking Setup
  netbankingId: z.string().optional(),
  upiProvider: z.string().optional(),
  upiId: z.string().optional(),
  accountNumber: z.string().optional(),

  // Account Details (collected during registration)
  accountType: z.string().optional(),
  initialDeposit: z.string().optional(),
  services: z.object({
    debitCard: z.boolean().optional(),
    internetBanking: z.boolean().optional(),
    mobileBanking: z.boolean().optional(),
    smsAlerts: z.boolean().optional(),
    chequeBook: z.boolean().optional(),
    upi: z.boolean().optional(),
  }).optional(),

  // Step 11: Branch Selection
  branchId: z.string().optional(),
}).refine((data) => {
  if (!data.autoGenerateLogin) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type CustomerRegistrationValues = z.infer<typeof customerRegistrationSchema>;
