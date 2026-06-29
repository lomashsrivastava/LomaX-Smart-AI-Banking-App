import express from "express";
import { 
  createEmployee, 
  getAllEmployees, 
  getEmployeesByBranch, 
  updateEmployeeStatus, 
  deleteEmployee 
} from "../controllers/employeeController";

const router = express.Router();

router.post("/", createEmployee);
router.get("/", getAllEmployees);
router.get("/branch/:branchId", getEmployeesByBranch);
router.put("/:id/status", updateEmployeeStatus);
router.delete("/:id", deleteEmployee);

export default router;
