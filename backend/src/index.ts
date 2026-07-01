import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Required for resource sharing across domains
}));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Global Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests from this IP, please try again later." }
});
app.use(limiter);

import authRoutes from "./routes/authRoutes";
import accountRoutes from "./routes/accountRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import branchRoutes from "./routes/branchRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import customerAccountRoutes from "./routes/customerAccountRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import cardRoutes from "./routes/cardRoutes";
import loanRoutes from "./routes/loanRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import auditRoutes from "./routes/auditRoutes";
import beneficiaryRoutes from "./routes/beneficiaryRoutes";
import scheduledTransferRoutes from "./routes/scheduledTransferRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import healthRoutes from "./routes/healthRoutes";
import { serveDocsUI, serveSwaggerSpec } from "./controllers/docsController";
import { initCronJobs } from "./services/cronService";
import User from "./models/User";
import CustomerAccount from "./models/CustomerAccount";

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/customer-accounts", customerAccountRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/scheduled-transfers", scheduledTransferRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/health", healthRoutes);

// Interactive API Docs
app.get("/api/docs", serveDocsUI);
app.get("/api/docs/swagger.json", serveSwaggerSpec);

// Database Connection
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/lomax";
console.log("Attempting database connection to:", mongoURI.replace(/\/\/.*@/, "//***:***@"));

const migrateUserStatuses = async () => {
  try {
    const approvedCAs = await CustomerAccount.find({ status: 'approved' }).select('customerId');
    const customerIds = approvedCAs.map(ca => ca.customerId);
    const result = await User.updateMany(
      { customerId: { $in: customerIds }, status: 'pending' },
      { status: 'active' }
    );
    if (result.modifiedCount > 0) {
      console.log(`[Migration] Activated ${result.modifiedCount} approved users whose status was 'pending'.`);
    }
  } catch (err) {
    console.error('[Migration] Failed to migrate user statuses:', err);
  }
};

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("Connected to MongoDB successfully!");
    await migrateUserStatuses();
    if (process.env.NODE_ENV !== "test") {
      initCronJobs(); // Launch Scheduled Transfer Daemon
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  })
  .catch((err: any) => {
    console.error("MongoDB connection to preferred URI failed:", err.message || err);
    const fallbackURI = "mongodb://localhost:27017/lomax";
    if (mongoURI !== fallbackURI) {
      console.log("Attempting fallback connection to local MongoDB:", fallbackURI);
      mongoose.connect(fallbackURI)
        .then(async () => {
          console.log("Connected to local fallback MongoDB successfully!");
          await migrateUserStatuses();
          if (process.env.NODE_ENV !== "test") {
            initCronJobs(); // Launch Scheduled Transfer Daemon
            app.listen(PORT, () => {
              console.log(`Server running on port ${PORT}`);
            });
          }
        })
        .catch((fallbackErr: any) => {
          console.error("Fallback MongoDB connection error:", fallbackErr);
        });
    } else {
      console.error("MongoDB connection error:", err);
    }
  });

export default app;
export { app };

