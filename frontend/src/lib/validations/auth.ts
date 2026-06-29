import * as z from "zod";

export const loginSchema = z.object({
  customerId: z.string().min(1, "Customer ID or Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;
