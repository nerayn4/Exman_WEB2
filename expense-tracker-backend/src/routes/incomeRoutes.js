import express from "express";
import * as incomeController from "../controllers/incomeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();


router.use(protect);

router.get("/", incomeController.getIncomes);

router.post("/", incomeController.createIncome);

router.get("/:id", incomeController.getIncome);

router.put("/:id", incomeController.updateIncome);

router.delete("/:id", incomeController.deleteIncome);

export default router;
