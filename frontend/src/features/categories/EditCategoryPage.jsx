import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

export default function EditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await api.get("/categories");
      const category = res.data.find((c) => c.id === id);
      if (category) setName(category.name);
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/categories/${id}`, { name });
    navigate("/categories");
  };

  return (
  <div className="bg-black text-[#D4AF37] min-h-screen p-6">
    <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-[#1a1a1a] p-6 rounded shadow"
    >
      <div>
        <label className="block mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
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
