import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: function() { return this.type === "one-time"; } }, // obligatoire pour one-time
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String, default: "" },
  type: { type: String, enum: ["one-time", "recurring"], default: "one-time" },
  startDate: { type: Date, required: function() { return this.type === "recurring"; } }, // obligatoire pour recurring
  endDate: { type: Date }, // optionnel
  receipt: { type: String } // chemin du fichier
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);
