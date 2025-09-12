// routes/expenseRoutes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import * as expenseController from "../controllers/expenseController.js";
import { uploadReceipt } from "../utils/upload.js";

const router = express.Router();
router.use(protect);

router.get("/", expenseController.getExpenses);
router.post("/", uploadReceipt, expenseController.createExpense);
router.get("/:id", expenseController.getExpense);
router.put("/:id", uploadReceipt, expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);

export default router;
