import * as z from "zod";

export const transferTypes = [
  "Own Account Transfer",
  "Internal Transfer",
  "NEFT",
  "RTGS",
  "IMPS",
  "UPI"
] as const;

export const transferSchema = z.object({
  transferType: z.enum(transferTypes, {
    message: "Please select a transfer type",
  }),
  sourceAccount: z.string().min(1, "Source account is required"),
  amount: z.string().min(1, "Amount is required"),
  remarks: z.string().optional(),
  
  // Conditional fields (all optional base, validated in superRefine)
  payeeName: z.string().optional(),
  payeeAccount: z.string().optional(),
  ifscCode: z.string().optional(),
  upiId: z.string().optional(),
  targetAccount: z.string().optional(), // For own account transfer
}).superRefine((data, ctx) => {
  
  // Validate Amount
  const amountNum = parseFloat(data.amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Amount must be greater than zero",
      path: ["amount"],
    });
  }

  // UPI Validation
  if (data.transferType === "UPI") {
    if (!data.upiId || data.upiId.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid UPI ID is required",
        path: ["upiId"],
      });
    }
  } 
  // NEFT / RTGS / IMPS / Internal Validation
  else if (["NEFT", "RTGS", "IMPS", "Internal Transfer"].includes(data.transferType)) {
    if (!data.payeeName || data.payeeName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payee name is required",
        path: ["payeeName"],
      });
    }
    if (!data.payeeAccount || data.payeeAccount.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid payee account number is required",
        path: ["payeeAccount"],
      });
    }
    
    // IFSC only for NEFT/RTGS/IMPS (Not Internal)
    if (["NEFT", "RTGS", "IMPS"].includes(data.transferType)) {
      if (!data.ifscCode || data.ifscCode.length !== 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valid 11-character IFSC code is required",
          path: ["ifscCode"],
        });
      }
    }
  }
  // Own Account Validation
  else if (data.transferType === "Own Account Transfer") {
    if (!data.targetAccount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Target account is required",
        path: ["targetAccount"],
      });
    }
    if (data.sourceAccount === data.targetAccount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Source and target accounts must be different",
        path: ["targetAccount"],
      });
    }
  }
});

export type TransferValues = z.infer<typeof transferSchema>;
