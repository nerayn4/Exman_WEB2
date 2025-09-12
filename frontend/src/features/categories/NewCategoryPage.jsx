import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function NewCategoryPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/categories", { name });
    navigate("/categories");
  };

  return (
  <div className="bg-black text-[#D4AF37] min-h-screen p-6">
    <h2 className="text-2xl font-bold mb-4">New Category</h2>
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
        Save
      </button>
    </form>
  </div>
);

}
