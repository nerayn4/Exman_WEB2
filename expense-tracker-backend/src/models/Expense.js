const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date }, // obligatoire pour one-time
  categoryId: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['one-time', 'recurring'], default: 'one-time' },
  startDate: { type: Date }, // obligatoire pour recurring
  endDate: { type: Date }, // optionnel
  receipt: { type: String }, // chemin du fichier
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
