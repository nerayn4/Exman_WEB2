import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Cannot delete category: It might be in use.");
    }
  };

  return (
  <div className="bg-black text-[#D4AF37] min-h-screen p-6">
    <h2 className="text-2xl font-bold mb-4">Categories</h2>
    <Link
      to="/categories/new"
      className="bg-[#D4AF37] text-black px-4 py-2 rounded mb-4 inline-block hover:bg-[#FFD700]"
    >
      + New Category
    </Link>

    <ul className="bg-[#1a1a1a] shadow rounded divide-y divide-[#333]">
      {categories.map((cat) => (
        <li key={cat.id} className="flex justify-between items-center p-3 hover:bg-[#2a2a2a]">
          <span>{cat.name}</span>
          <div className="space-x-2">
            <Link
              to={`/categories/${cat.id}/edit`}
              className="text-[#FFD700] hover:underline"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(cat.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

}
