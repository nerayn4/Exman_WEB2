// routes/receiptRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as receiptController from "../controllers/receiptController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Middleware d'authentification
router.use(protect);

// Configuration de Multer pour l'upload des reçus
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `receipt-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const isValid = allowedTypes.test(file.mimetype) && allowedTypes.test(path.extname(file.originalname).toLowerCase());
  cb(isValid ? null : new Error("Seuls les fichiers JPEG, PNG et PDF sont autorisés"), isValid);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

// Middleware pour gérer les erreurs d'upload
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Le fichier est trop volumineux (max 5MB)" });
  }
  if (error.message === "Seuls les fichiers JPEG, PNG et PDF sont autorisés") {
    return res.status(400).json({ message: error.message });
  }
  next(error);
};

// Routes pour les reçus
router.post("/expense/:id/receipt", upload.single("receipt"), handleUploadError, receiptController.uploadReceipt);
router.get("/expense/:id/receipt", receiptController.getReceipt);
router.delete("/expense/:id/receipt", receiptController.deleteReceipt);

export default router;
