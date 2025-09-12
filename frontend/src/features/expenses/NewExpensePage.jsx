import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function NewExpensePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    date: "",
    categoryId: "",
    description: "",
    type: "one-time",
    startDate: "",
    endDate: "",
    receipt: null,
  });

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in form) {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    }

    await api.post("/expenses", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    navigate("/expenses");
  };

return (
  <div className="bg-black text-[#D4AF37] min-h-screen p-6">
    <h2 className="text-2xl font-bold mb-4">New Expense</h2>
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
        <label className="block mb-1">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Category</label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
          className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full"
        >
          <option value="">-- Select --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
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

      {form.type === "recurring" && (
        <>
          <div>
            <label className="block mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full"
            />
          </div>
        </>
      )}

      <div>
        <label className="block mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full placeholder-[#D4AF37]/70"
        />
      </div>

      <div>
        <label className="block mb-1">Receipt (JPG, PNG, PDF - max 5MB)</label>
        <input
          type="file"
          name="receipt"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleChange}
          className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-[#D4AF37] text-black px-4 py-2 rounded hover:bg-[#FFD700]"
      >
        Save
      </button>
    </form>
  </div>
);

}
