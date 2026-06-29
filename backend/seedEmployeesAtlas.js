const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const indianFirstNames = [
  "Aarav", "Aditya", "Amit", "Anjali", "Arjun", "Deepak", "Divya", "Ishaan", "Karan", "Kiran",
  "Neha", "Pooja", "Priya", "Rahul", "Rajesh", "Rohan", "Sandeep", "Sneha", "Sunita", "Vivek",
  "Abhishek", "Aishwarya", "Anil", "Arvind", "Gaurav", "Harish", "Jyoti", "Kunal", "Manish", "Manoj",
  "Nisha", "Pradeep", "Rakesh", "Sanjay", "Suresh", "Vikram", "Yash"
];

const indianLastNames = [
  "Sharma", "Patel", "Singh", "Kumar", "Mehta", "Joshi", "Verma", "Gupta", "Reddy", "Rao",
  "Nair", "Das", "Sen", "Choudhury", "Mishra", "Pandey", "Yadav", "Trivedi", "Deshmukh", "Pillai",
  "Bose", "Chatterjee", "Mukherjee", "Banerjee", "Dutta", "Iyer", "Iyengar", "Nayar", "Menon", "Jha",
  "Prasad", "Sinha", "Shukla", "Tiwari", "Saxena", "Johar"
];

const roles = ["branch_manager", "cashier", "relationship_manager", "loan_officer", "audit_officer"];

const cleanStr = (str) => str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

const run = async () => {
  let connectionSuccessful = false;
  let uri = process.env.MONGODB_URI;

  try {
    console.log("Attempting connection to MongoDB Atlas preferred URI...");
    await mongoose.connect(uri);
    console.log("SUCCESS: Connected to MongoDB Atlas preferred URI!");
    connectionSuccessful = true;
  } catch (err) {
    console.warn("WARNING: Preferred connection failed. Details:", err.message || err);
    console.log("Attempting fallback connection to local MongoDB database...");
    try {
      uri = "mongodb://localhost:27017/lomax";
      await mongoose.connect(uri);
      console.log("SUCCESS: Connected to fallback local MongoDB successfully!");
      connectionSuccessful = true;
    } catch (fallbackErr) {
      console.error("FAILURE: Both preferred and fallback database connections failed!");
      console.error(fallbackErr);
      process.exit(1);
    }
  }

  if (!connectionSuccessful) return;

  try {
    const db = mongoose.connection.db;

    // 1. Verify/Import branches if missing
    let branchesCount = await db.collection("branches").countDocuments();
    console.log(`Current branch count in database: ${branchesCount}`);

    if (branchesCount === 0) {
      console.log("Branches database is empty! Beginning import from branchesData2.csv...");
      const csvPath = path.join(__dirname, "branchesData2.csv");
      if (!fs.existsSync(csvPath)) {
        console.error(`Error: CSV file not found at ${csvPath}`);
        process.exit(1);
      }

      const csvData = fs.readFileSync(csvPath, "utf-8");
      const lines = csvData.split("\n").map(l => l.trim()).filter(l => l.length > 0);
      const records = lines.slice(1); // skip header row

      const branchesToInsert = [];
      let codeSeq = 1;
      
      for (const record of records) {
        const parts = record.split(",");
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

        const country = "India";
        const email = `${cleanStr(branchName)}.${cleanStr(district)}.${cleanStr(state)}.${cleanStr(country)}@lomaxbank.com`;
        const branchId = `BID${branchCode.replace('BR', '')}`;

        branchesToInsert.push({
          branchId,
          branchCode,
          branchName,
          ifscCode,
          micrCode,
          country,
          state,
          district,
          city,
          address: city,
          pincode,
          phone,
          email,
          managerName,
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      if (branchesToInsert.length > 0) {
        console.log(`Inserting ${branchesToInsert.length} branches in bulk...`);
        await db.collection("branches").insertMany(branchesToInsert);
        console.log("Branches imported successfully.");
        branchesCount = await db.collection("branches").countDocuments();
      }
    }

    // 2. Fetch all branches
    const branches = await db.collection("branches").find({}).toArray();
    console.log(`Successfully fetched ${branches.length} branches from database.`);

    // Pre-hashed password for '123456' using standard bcrypt format to bypass CPU cost
    const preHashedPassword = "$2b$10$XLFgiJg0..J6WLyXAIfqQuqgUqV4yH6CcSt57VaRATBXbgkZt.GW6";

    // 3. Seed employees per branch
    console.log("Beginning employee verification and seeding...");
    let totalEmployeesInserted = 0;
    let employeeIdCounter = 20001; // Start counter to avoid overlapping with default EMP001-EMP020

    // Fetch existing employee codes to prevent duplicates
    const existingEmployees = await db.collection("employees").find({}, { projection: { empId: 1 } }).toArray();
    const existingEmpIds = new Set(existingEmployees.map(e => e.empId));

    const employeesBuffer = [];
    const BATCH_SIZE = 1000;

    for (const branch of branches) {
      // Check existing employees count for this branch
      const currentBranchEmployeesCount = await db.collection("employees").countDocuments({ branchId: branch._id });

      // Determine a target count between 30 and 35
      const targetCount = 30 + Math.floor(Math.random() * 6); // 30 to 35
      const needToInsert = targetCount - currentBranchEmployeesCount;

      if (needToInsert > 0) {
        for (let k = 0; k < needToInsert; k++) {
          let empId = `EMP${employeeIdCounter}`;
          while (existingEmpIds.has(empId)) {
            employeeIdCounter++;
            empId = `EMP${employeeIdCounter}`;
          }
          existingEmpIds.add(empId);
          employeeIdCounter++;

          const fn = indianFirstNames[Math.floor(Math.random() * indianFirstNames.length)];
          const ln = indianLastNames[Math.floor(Math.random() * indianLastNames.length)];
          const gender = Math.random() > 0.5 ? "Male" : "Female";
          const role = roles[Math.floor(Math.random() * roles.length)];
          const phone = "9" + Math.floor(100000000 + Math.random() * 900000000); // 10 digit Indian style number starting with 9
          const personalEmail = `${fn.toLowerCase()}.${ln.toLowerCase()}.${empId.toLowerCase()}@gmail.com`;
          
          let bName = cleanStr(branch.branchName);
          if (!bName.endsWith("branch")) {
            bName += "branch";
          }
          const officialEmail = `${fn.toLowerCase()}${ln.toLowerCase()}${empId.replace(/\D/g, "")}.staff.${bName}.${cleanStr(branch.district)}.${cleanStr(branch.state)}.india@lomaxbank.com`;

          employeesBuffer.push({
            empId,
            firstName: fn,
            lastName: ln,
            gender,
            phone,
            email: personalEmail,
            officialEmail,
            role,
            status: "Active",
            password: preHashedPassword,
            twoFactorEnabled: false,
            branchId: branch._id,
            state: branch.state,
            district: branch.district,
            country: "India",
            city: branch.city || branch.district,
            address: branch.address || branch.city,
            pincode: branch.pincode || "400001",
            permissions: ["view_dashboard", "read_transactions"],
            createdAt: new Date(),
            updatedAt: new Date()
          });

          // Insert batch if buffer is full
          if (employeesBuffer.length >= BATCH_SIZE) {
            await db.collection("employees").insertMany(employeesBuffer);
            totalEmployeesInserted += employeesBuffer.length;
            console.log(`Successfully seeded ${totalEmployeesInserted} employees...`);
            employeesBuffer.length = 0; // Clear array
          }
        }
      }
    }

    // Insert remaining buffer
    if (employeesBuffer.length > 0) {
      await db.collection("employees").insertMany(employeesBuffer);
      totalEmployeesInserted += employeesBuffer.length;
      console.log(`Successfully seeded ${totalEmployeesInserted} employees...`);
    }

    console.log(`Seeding complete! Total employees added: ${totalEmployeesInserted}`);
    const finalCount = await db.collection("employees").countDocuments();
    console.log(`Total employees in database: ${finalCount}`);

    process.exit(0);
  } catch (err) {
    console.error("Error during seeding process:", err);
    process.exit(1);
  }
};

run();
