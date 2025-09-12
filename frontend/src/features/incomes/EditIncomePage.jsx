import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function EditIncomePage() {
  const { id } = useParams();
  const [income, setIncome] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/incomes/${id}/`)
      .then((res) => setIncome(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/incomes/${id}/`, income);
    navigate("/incomes");
  };

  if (!income) return <p className="p-6">Loading...</p>;

 return (
  <div className="bg-black text-[#D4AF37] min-h-screen p-6">
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Income</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1a1a] p-6 rounded shadow">
        <input
          type="number"
          value={income.amount}
          onChange={(e) => setIncome({ ...income, amount: e.target.value })}
          className="w-full p-2 border border-[#D4AF37] bg-black text-[#D4AF37] rounded"
        />
        <input
          type="date"
          value={income.date}
          onChange={(e) => setIncome({ ...income, date: e.target.value })}
          className="w-full p-2 border border-[#D4AF37] bg-black text-[#D4AF37] rounded"
        />
        <input
          type="text"
          value={income.source}
          onChange={(e) => setIncome({ ...income, source: e.target.value })}
          className="w-full p-2 border border-[#D4AF37] bg-black text-[#D4AF37] rounded"
        />
        <textarea
          value={income.description || ""}
          onChange={(e) => setIncome({ ...income, description: e.target.value })}
          className="w-full p-2 border border-[#D4AF37] bg-black text-[#D4AF37] rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#D4AF37] text-black rounded hover:bg-[#FFD700]"
        >
          Update
        </button>
      </form>
    </div>
  </div>
);

}
