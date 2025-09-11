import { useState } from "react";
import api from "../../api";   
import { useNavigate } from "react-router-dom";

function NewExpensePage() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/expenses", { amount, category, date });
      navigate("/expenses");
    } catch {
      alert("Erreur lors de la création");
    }
  }

  return (
    <div className="flex justify-center p-6">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-lg rounded p-6 w-96 flex flex-col gap-3"
      >
        <h1 className="text-xl font-bold text-center">Nouvelle Dépense</h1>
        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Montant"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className="bg-blue-600 text-white rounded py-2 hover:bg-blue-800">
          Ajouter
        </button>
      </form>
    </div>
  );
}

export default NewExpensePage;
