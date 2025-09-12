
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = 'uploads/receipts';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Seuls JPG, PNG et PDF sont autorisés'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });


export const uploadReceipt = upload.single('receipt');
