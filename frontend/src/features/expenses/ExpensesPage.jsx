import { useEffect, useState } from "react";
import api from "../../api";   

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    api.get("/expenses").then((res) => setExpenses(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Mes Dépenses</h1>
      <ul className="space-y-2">
        {expenses.map((exp) => (
          <li 
            key={exp._id} 
            className="border p-3 rounded shadow-sm flex justify-between"
          >
            <span>{exp.category} - {exp.amount}€</span>
            <span className="text-sm text-gray-500">
              {new Date(exp.date).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpensesPage;
