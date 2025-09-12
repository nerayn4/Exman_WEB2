import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    const res = await api.get("/expenses");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
  <div className="bg-black text-[#D4AF37] min-h-screen p-6">
    <h2 className="text-2xl font-bold mb-4">Expenses</h2>
    <Link
      to="/expenses/new"
      className="bg-[#D4AF37] text-black px-4 py-2 rounded mb-4 inline-block hover:bg-[#FFD700]"
    >
      + New Expense
    </Link>

    <table className="w-full bg-[#1a1a1a] shadow rounded text-[#D4AF37]">
      <thead className="bg-[#2a2a2a]">
        <tr>
          <th className="p-2 text-left">Amount</th>
          <th className="p-2 text-left">Date</th>
          <th className="p-2 text-left">Category</th>
          <th className="p-2 text-left">Type</th>
          <th className="p-2 text-left">Receipt</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((exp) => (
          <tr key={exp.id} className="border-t border-[#333] hover:bg-[#2a2a2a]">
            <td className="p-2">${exp.amount}</td>
            <td className="p-2">{exp.date}</td>
            <td className="p-2">{exp.categoryName}</td>
            <td className="p-2">{exp.type}</td>
            <td className="p-2">
              {exp.hasReceipt ? (
                <a
                  href={`${import.meta.env.VITE_API_URL}/receipts/${exp.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFD700] underline hover:text-[#D4AF37]"
                >
                  View Receipt
                </a>
              ) : (
                "—"
              )}
            </td>
            <td className="p-2">
              <Link
                to={`/expenses/${exp.id}/edit`}
                className="text-[#FFD700] mr-2 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={async () => {
                  if (!window.confirm("Delete this expense?")) return;
                  await api.delete(`/expenses/${exp.id}`);
                  fetchExpenses();
                }}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

}
