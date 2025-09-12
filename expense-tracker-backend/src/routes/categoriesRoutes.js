import express from "express";
import * as categoryController from "../controllers/categoryController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();


router.use(protect);

router.get("/", categoryController.getUserCategories);      
router.get("/defaults", categoryController.getDefaultCategories);
router.post("/", categoryController.createCategory);         
router.put("/:id", categoryController.updateCategory);       
router.delete("/:id", categoryController.deleteCategory);    

export default router;
