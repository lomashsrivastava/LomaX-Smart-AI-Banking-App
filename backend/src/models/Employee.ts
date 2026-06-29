import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  // Basic Info
  empId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dateOfBirth?: Date;
  profilePhoto?: string;
  maritalStatus?: string;
  nationality?: string;

  // Contact Info
  phone: string;
  alternatePhone?: string;
  email: string; // Personal Email
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  address?: string;
  city?: string;
  state: string;
  country?: string;
  pincode?: string;
  district: string;

  // Employment Details
  employeeCode?: string;
  joiningDate?: Date;
  employmentType?: string;
  department?: string;
  designation?: string;
  reportingManager?: string;
  status: "Active" | "Inactive" | "Suspended" | "Resigned";

  // Banking Role Assignment
  role: string;
  permissionGroup?: string;
  accessLevel?: string;

  // Login & Security
  username?: string;
  officialEmail: string;
  password?: string;
  twoFactorEnabled: boolean;
  accountExpiryDate?: Date;

  // Branch Assignment
  branchId: mongoose.Types.ObjectId;
  additionalBranches?: mongoose.Types.ObjectId[];
  branchAccessType?: string;

  // Salary & Payroll
  salaryType?: string;
  basicSalary?: number;
  allowances?: number;
  taxId?: string;
  bankAccountNumber?: string;
  paymentMethod?: string;

  // Identity Verification
  nationalId?: string;
  passportNumber?: string;
  taxNumber?: string;
  idUpload?: string;
  addressProofUpload?: string;
  signatureUpload?: string;

  // Education & Professional
  highestQualification?: string;
  university?: string;
  graduationYear?: string;
  certifications?: string;
  previousEmployer?: string;
  yearsOfExperience?: number;
  skills?: string;
  specialization?: string;

  // Documents
  resumeUpload?: string;
  appointmentLetter?: string;
  employmentContract?: string;

  // Permissions Array
  permissions: string[];

  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    // Basic
    empId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    gender: { type: String },
    dateOfBirth: { type: Date },
    profilePhoto: { type: String },
    maritalStatus: { type: String },
    nationality: { type: String },

    // Contact
    phone: { type: String, required: true },
    alternatePhone: { type: String },
    email: { type: String, required: true }, // Not unique globally to allow personal emails to overlap if needed, but usually good to keep. We'll leave it as non-unique here since officialEmail is unique.
    emergencyContactName: { type: String },
    emergencyContactNumber: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String, required: true },
    country: { type: String },
    pincode: { type: String },
    district: { type: String, required: true },

    // Employment
    employeeCode: { type: String },
    joiningDate: { type: Date },
    employmentType: { type: String },
    department: { type: String },
    designation: { type: String },
    reportingManager: { type: String },
    status: { type: String, default: "Active", enum: ["Active", "Inactive", "Suspended", "Resigned"] },

    // Banking Role
    role: { type: String, required: true },
    permissionGroup: { type: String },
    accessLevel: { type: String },

    // Security
    username: { type: String },
    officialEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    twoFactorEnabled: { type: Boolean, default: false },
    accountExpiryDate: { type: Date },

    // Branch
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    additionalBranches: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    branchAccessType: { type: String, default: 'Single Branch' },

    // Payroll
    salaryType: { type: String },
    basicSalary: { type: Number },
    allowances: { type: Number },
    taxId: { type: String },
    bankAccountNumber: { type: String },
    paymentMethod: { type: String },

    // Identity
    nationalId: { type: String },
    passportNumber: { type: String },
    taxNumber: { type: String },
    idUpload: { type: String },
    addressProofUpload: { type: String },
    signatureUpload: { type: String },

    // Education & Professional
    highestQualification: { type: String },
    university: { type: String },
    graduationYear: { type: String },
    certifications: { type: String },
    previousEmployer: { type: String },
    yearsOfExperience: { type: Number },
    skills: { type: String },
    specialization: { type: String },

    // Documents
    resumeUpload: { type: String },
    appointmentLetter: { type: String },
    employmentContract: { type: String },

    // Permissions
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Employee || mongoose.model<IEmployee>("Employee", employeeSchema);
