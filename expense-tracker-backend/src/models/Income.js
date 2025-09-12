import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
  source: { type: String, default: "" },
  description: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Income", incomeSchema);
