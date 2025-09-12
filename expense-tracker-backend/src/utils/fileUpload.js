// src/controllers/receiptController.js
import Expense from '../models/expense.js';
import fs from 'fs';
import path from 'path';

// UPLOAD D'UN REÇU
export const uploadReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);

    if (!expense) return res.status(404).json({ message: 'Dépense non trouvée' });
    if (expense.userId !== req.user.id)
      return res.status(403).json({ message: "Vous n'avez pas accès à cette dépense" });

    // Supprimer l'ancien fichier si présent
    if (expense.receipt) {
      const oldPath = path.join(process.cwd(), 'uploads', 'receipts', expense.receipt);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Sauvegarder le nouveau reçu
    expense.receipt = req.file.filename;
    await expense.save();

    res.json({ success: true, message: 'Reçu uploadé', receipt: expense.receipt });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// RÉCUPÉRER LE REÇU
export const getReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);

    if (!expense || expense.userId !== req.user.id)
      return res.status(404).json({ message: 'Reçu non trouvé' });

    if (!expense.receipt)
      return res.status(404).json({ message: 'Aucun reçu associé à cette dépense' });

    const filePath = path.join(process.cwd(), 'uploads', 'receipts', expense.receipt);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Fichier introuvable' });

    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// SUPPRIMER LE REÇU
export const deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);

    if (!expense || expense.userId !== req.user.id)
      return res.status(404).json({ message: 'Dépense non trouvée' });

    if (expense.receipt) {
      const filePath = path.join(process.cwd(), 'uploads', 'receipts', expense.receipt);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      expense.receipt = null;
      await expense.save();
    }

    res.json({ success: true, message: 'Reçu supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
