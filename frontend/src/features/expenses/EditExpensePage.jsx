import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

export default function EditExpensePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      const res = await api.get(`/expenses/${id}`);
      setForm(res.data);
    };
    const fetchCategories = async () => {
      const res = await api.get("/categories");
      setCategories(res.data);
    };
    fetchExpense();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) fd.append(key, form[key]);
    });
    await api.put(`/expenses/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    navigate("/expenses");
  };

  if (!form) return <p>Loading...</p>;

 return (
  <div className="bg-black text-[#D4AF37] min-h-screen p-6">
    <h2 className="text-2xl font-bold mb-4">Edit Expense</h2>
    <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1a1a] p-6 rounded shadow">
      <div>
        <label className="block mb-1">Amount</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
          className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full"
        >
          <option value="one-time">One-time</option>
          <option value="recurring">Recurring</option>
        </select>
      </div>

      {form.type === "one-time" && (
        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date || ""}
            onChange={handleChange}
            required
            className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full"
          />
        </div>
      )}

      {form.type === "recurring" && (
        <>
          <div>
            <label className="block mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate || ""}
              onChange={handleChange}
              required
              className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">End Date (optional)</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate || ""}
              onChange={handleChange}
              className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full"
            />
          </div>
        </>
      )}

      <div>
        <label className="block mb-1">Category</label>
        <select
          name="categoryId"
          value={form.categoryId || ""}
          onChange={handleChange}
          required
          className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Description</label>
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Replace Receipt</label>
        <input
          type="file"
          name="receipt"
          onChange={handleChange}
          className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-[#D4AF37] text-black px-4 py-2 rounded hover:bg-[#FFD700]"
      >
        Update
      </button>
    </form>
  </div>
);

}
