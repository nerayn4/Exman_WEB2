import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Route pour récupérer le profil utilisateur
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

export default router;
