const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const receiptController = require('../controllers/receiptController');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'receipt-' + uniqueSuffix + extension);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers JPEG, PNG et PDF sont autorisés'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: fileFilter
});

const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Le fichier est trop volumineux (max 5MB)' });
    }
  }
  if (error.message === 'Seuls les fichiers JPEG, PNG et PDF sont autorisés') {
    return res.status(400).json({ message: error.message });
  }
  next(error);
};
router.use(auth);
router.post('/expense/:id/receipt', 
  upload.single('receipt'),
  handleUploadError,
  receiptController.uploadReceipt
);

router.get('/expense/:id/receipt', receiptController.getReceipt);
router.delete('/expense/:id/receipt', receiptController.deleteReceipt);
module.exports = router;