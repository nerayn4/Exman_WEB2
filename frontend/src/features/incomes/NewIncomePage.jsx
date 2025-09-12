import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function NewIncomePage() {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/incomes/", { amount, date, source, description });
    navigate("/incomes");
  };

  return (
  <div className="bg-black text-[#D4AF37] min-h-screen p-6">
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Income</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1a1a] p-6 rounded shadow">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full p-2 border border-[#D4AF37] bg-black text-[#D4AF37] rounded placeholder-[#D4AF37]/70"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-2 border border-[#D4AF37] bg-black text-[#D4AF37] rounded"
        />
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
          className="w-full p-2 border border-[#D4AF37] bg-black text-[#D4AF37] rounded placeholder-[#D4AF37]/70"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-[#D4AF37] bg-black text-[#D4AF37] rounded placeholder-[#D4AF37]/70"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#D4AF37] text-black rounded hover:bg-[#FFD700]"
        >
          Save
        </button>
      </form>
    </div>
  </div>
);

}
