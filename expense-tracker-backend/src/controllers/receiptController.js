const Expense = require('../models/Expense');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

exports.uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const expense = await Expense.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!expense) {
      await unlinkAsync(req.file.path);
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.receiptUrl) {
      const oldReceiptPath = path.join(__dirname, '../uploads', expense.receiptUrl);
      if (fs.existsSync(oldReceiptPath)) {
        await unlinkAsync(oldReceiptPath);
      }
    }
    
    expense.receiptUrl = req.file.filename;
    await expense.save();
    
    res.json({ 
      message: 'Receipt uploaded successfully', 
      receiptUrl: expense.receiptUrl 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error uploading receipt', 
      error: error.message 
    });
  }
};

exports.getReceipt = async (req, res) => {
  try {
    const expense = await Expense.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!expense || !expense.receiptUrl) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    
    const receiptPath = path.join(__dirname, '../uploads', expense.receiptUrl);
    
    if (!fs.existsSync(receiptPath)) {
      return res.status(404).json({ message: 'Receipt file not found' });
    }
    
    const ext = path.extname(expense.receiptUrl).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.pdf') contentType = 'application/pdf';
    
    if (req.query.download === 'true') {
      res.setHeader('Content-Disposition', `attachment; filename="${expense.receiptUrl}"`);
    }
    
    res.setHeader('Content-Type', contentType);
    res.sendFile(receiptPath);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving receipt', 
      error: error.message 
    });
  }
};

exports.deleteReceipt = async (req, res) => {
  try {
    const expense = await Expense.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!expense || !expense.receiptUrl) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    
    const receiptPath = path.join(__dirname, '../uploads', expense.receiptUrl);
    
    if (fs.existsSync(receiptPath)) {
      await unlinkAsync(receiptPath);
    }
    
    expense.receiptUrl = null;
    await expense.save();
    
    res.json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting receipt', 
      error: error.message 
    });
  }
};