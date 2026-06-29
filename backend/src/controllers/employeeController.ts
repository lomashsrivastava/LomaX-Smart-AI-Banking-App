import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Employee from "../models/Employee";
import { Branch } from "../models/Branch";

// Generate random password (e.g. LomaX@4829)
const generatePassword = () => {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `LomaX@${digits}`;
};

// Generate Emp ID (e.g. EMP1001)
const generateEmpId = async () => {
  const count = await Employee.countDocuments();
  return `EMP${1001 + count}`;
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { branchId, firstName, lastName } = req.body;

    // Check if personal email exists (optional, keeping it just for sanity)
    if (req.body.email) {
      const existingEmp = await Employee.findOne({ email: req.body.email });
      if (existingEmp) {
        return res.status(400).json({ success: false, message: "Personal email already exists" });
      }
    }

    // Fetch branch to generate official email
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }

    // Generate Official Email: viveksingh.staff.aliganjbranch.banda.uttarpradesh.india@lomaxbank.com
    const cleanStr = (str: string) => str.replace(/\s+/g, "").toLowerCase();
    const fName = cleanStr(firstName);
    const lName = cleanStr(lastName);
    let bName = cleanStr(branch.branchName);
    if (!bName.endsWith("branch")) {
      bName += "branch";
    }
    const dist = cleanStr(branch.district);
    const st = cleanStr(branch.state);
    const ctr = cleanStr(branch.country || "india"); // fallback if country missing

    const officialEmail = `${fName}${lName}.staff.${bName}.${dist}.${st}.${ctr}@lomaxbank.com`;

    const existingOfficial = await Employee.findOne({ officialEmail });
    if (existingOfficial) {
      return res.status(400).json({ success: false, message: "Generated Official Email already exists. Please modify name or contact admin." });
    }

    const empId = await generateEmpId();
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newEmployee = new Employee({
      ...req.body,
      empId,
      password: hashedPassword,
      officialEmail
    });

    await newEmployee.save();

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: {
        _id: newEmployee._id,
        empId: newEmployee.empId,
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        officialEmail: newEmployee.officialEmail,
        role: newEmployee.role,
        branchId: newEmployee.branchId,
        plainPassword
      },
    });
  } catch (error: any) {
    console.error("Create Employee error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find()
      .populate("branchId", "branchName branchCode")
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: employees });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getEmployeesByBranch = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.params;
    const employees = await Employee.find({ branchId })
      .populate("branchId", "branchName branchCode")
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: employees });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateEmployeeStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const employee = await Employee.findByIdAndUpdate(id, { status }, { new: true }).select("-password");
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

    res.json({ success: true, data: employee });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

    res.json({ success: true, message: "Employee deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
