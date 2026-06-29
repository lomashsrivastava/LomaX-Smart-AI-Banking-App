import * as z from "zod";

export const accountOpeningSchema = z.object({
  customerId: z.string().min(1, "Please select a customer"),
  accountType: z.enum([
    "Savings Account",
    "Current Account",
    "Salary Account",
    "Fixed Deposit",
    "Recurring Deposit"
  ], { message: "Account type is required" }),
  
  // Services
  services: z.object({
    debitCard: z.boolean().optional(),
    internetBanking: z.boolean().optional(),
    mobileBanking: z.boolean().optional(),
    smsAlerts: z.boolean().optional(),
    chequeBook: z.boolean().optional(),
    upi: z.boolean().optional(),
  }),

  // Branch Details
  branchName: z.string().min(2, "Branch name is required"),
  branchCode: z.string().min(2, "Branch code is required"),
  ifscCode: z.string().min(11, "Valid IFSC code is required").max(11),

  // Initial Deposit
  initialDeposit: z.string().min(1, "Amount is required"),
});

export type AccountOpeningValues = z.infer<typeof accountOpeningSchema>;
