import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { protect } from "../middleware/auth.js";

dotenv.config();
const router = express.Router();

// Générateur de token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

// SIGNUP
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email et mot de passe requis" });

  try {
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Utilisateur déjà existant" });

    const user = await User.create({ email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email et mot de passe requis" });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const token = generateToken(user._id);
    res.json({
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// PROFIL UTILISATEUR
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;
