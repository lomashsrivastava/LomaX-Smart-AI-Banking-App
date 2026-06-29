import mongoose from "mongoose";
import dotenv from "dotenv";
import { Branch } from "./src/models/Branch";

dotenv.config();

const updateEmails = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/lomax");
    console.log("Connected to MongoDB for email update");

    const branches = await Branch.find();
    let updatedCount = 0;

    for (const branch of branches) {
      const formatStr = (str: string) => str.trim().toLowerCase().replace(/\s+/g, "");
      
      if (branch.branchName && branch.district && branch.state && branch.country) {
        const newEmail = `${formatStr(branch.branchName)}.${formatStr(branch.district)}.${formatStr(branch.state)}.${formatStr(branch.country)}@lomaxbank.com`;
        
        if (branch.email !== newEmail) {
          branch.email = newEmail;
          await branch.save();
          updatedCount++;
          console.log(`Updated branch ${branch.branchName} to email: ${newEmail}`);
        }
      }
    }

    console.log(`Successfully updated ${updatedCount} branches.`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating emails:", error);
    process.exit(1);
  }
};

updateEmails();
