import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Branch } from './src/models/Branch';

dotenv.config();

const importBranches = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/lomax";
    try {
      await mongoose.connect(mongoURI);
      console.log("Connected to preferred MongoDB database");
    } catch (err: any) {
      console.warn("WARNING: Preferred connection failed. Details:", err.message || err);
      const fallbackURI = "mongodb://localhost:27017/lomax";
      if (mongoURI !== fallbackURI) {
        console.log("Attempting fallback connection to local MongoDB:", fallbackURI);
        await mongoose.connect(fallbackURI);
        console.log("✓ Connected to fallback local MongoDB successfully!");
      } else {
        throw err;
      }
    }

    const filePath = path.join(__dirname, 'branchesData2.csv');
    const data = fs.readFileSync(filePath, 'utf-8');
    
    // Split lines and drop the header
    const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const records = lines.slice(1); // skip header
    
    let importedCount = 0;
    
    // Format string helper for email generator
    const formatStr = (str: string) => str.trim().toLowerCase().replace(/\s+/g, "");

    for (const record of records) {
      const parts = record.split(',');
      if (parts.length < 10) continue;
      
      const [
        branchCode,
        branchName,
        ifscCode,
        micrCode,
        managerName,
        state,
        district,
        city,
        pincode,
        phone
      ] = parts;

      const country = "India"; // default
      const address = city;    // default
      const status = "Active"; // default

      // Auto-generate email
      const email = `${formatStr(branchName)}.${formatStr(district)}.${formatStr(state)}.${formatStr(country)}@lomaxbank.com`;

      // Use branchCode numbers for branchId to ensure uniqueness
      const branchId = `BID${branchCode.replace('BR', '')}`;

      // Check if branch already exists
      const existing = await Branch.findOne({ 
        $or: [
          { branchCode }, 
          { ifscCode }
        ] 
      });

      if (!existing) {
        const newBranch = new Branch({
          branchId,
          branchCode,
          branchName,
          ifscCode,
          micrCode,
          country,
          state,
          district,
          city,
          address,
          pincode,
          phone,
          email,
          managerName,
          status
        });
        try {
          await newBranch.save();
          importedCount++;
          if (importedCount % 20 === 0) {
            console.log(`Imported ${importedCount} branches...`);
          }
        } catch (saveError: any) {
          if (saveError.code === 11000) {
            console.log(`Skipping duplicate key for ${branchCode}`);
          } else {
            throw saveError;
          }
        }
      }
    }

    console.log(`Successfully imported ${importedCount} new branches.`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to import branches:", error);
    process.exit(1);
  }
};

importBranches();
