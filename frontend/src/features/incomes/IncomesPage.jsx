import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

export default function IncomesPage() {
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    api.get("/incomes/")
      .then((res) => setIncomes(res.data))
      .catch((err) => console.error(err));
  }, []);

  const deleteIncome = async (id) => {
    if (window.confirm("Delete this income?")) {
      await api.delete(`/incomes/${id}/`);
      setIncomes(incomes.filter((inc) => inc.id !== id));
    }
  };

  return (
  <div className="bg-black text-[#D4AF37] min-h-screen p-6">
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Incomes</h1>
        <Link
          to="/incomes/new"
          className="px-4 py-2 bg-[#D4AF37] text-black rounded hover:bg-[#FFD700]"
        >
          + Add Income
        </Link>
      </div>

      {incomes.length === 0 ? (
        <p className="text-[#999]">No incomes recorded yet.</p>
      ) : (
        <table className="w-full bg-[#1a1a1a] text-[#D4AF37] rounded shadow">
          <thead className="bg-[#2a2a2a] text-[#D4AF37]">
            <tr>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Source</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((inc) => (
              <tr key={inc.id} className="border-t border-[#333] hover:bg-[#2a2a2a]">
                <td className="p-2">${inc.amount}</td>
                <td className="p-2">{inc.date}</td>
                <td className="p-2">{inc.source}</td>
                <td className="p-2">{inc.description || "-"}</td>
                <td className="p-2 flex gap-2 justify-center">
                  <Link
                    to={`/incomes/${inc.id}/edit`}
                    className="px-2 py-1 bg-[#D4AF37] text-black rounded hover:bg-[#FFD700]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteIncome(inc.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

}
