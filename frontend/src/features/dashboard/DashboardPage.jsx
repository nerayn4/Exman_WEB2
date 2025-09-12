import { useEffect, useState } from "react";
import DashboardFilters from "../../components/DashboardFilters";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    expensesByCategory: [],
    monthlySpending: [],
  });

  const [alert, setAlert] = useState(null);

  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7),
    startDate: "",
    endDate: "",
    category: "",
    type: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/summary/monthly?month=${filters.month}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setSummary((prev) => ({
          ...prev,
          ...data,
        }));
      } catch (err) {
        console.error("Erreur summary:", err);
      }
    }
    fetchSummary();
  }, [filters.month]);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch("http://localhost:5000/api/summary/alerts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.alert) setAlert(data.message);
      } catch (err) {
        console.error("Erreur alerts:", err);
      }
    }
    fetchAlerts();
  }, []);

  return (
    <div className="bg-black text-[#D4AF37] min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <DashboardFilters filters={filters} setFilters={setFilters} />

      {alert && (
        <div className="bg-red-600 text-white p-3 rounded mb-4">{alert}</div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#1a1a1a] p-4 rounded shadow">
          Income: ${summary.totalIncome}
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded shadow">
          Expenses: ${summary.totalExpenses}
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded shadow">
          Balance: ${summary.balance}
        </div>
      </div>

      
      <div className="bg-[#1a1a1a] p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="value"
              data={summary.expensesByCategory || []}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#D4AF37"
              label
            >
              {(summary.expensesByCategory || []).map((entry, index) => (
                <Cell
                  key={index}
                  fill={["#D4AF37", "#FFD700", "#B8860B"][index % 3]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      
      <div className="bg-[#1a1a1a] p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Monthly Spending</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summary.monthlySpending || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#D4AF37" />
            <YAxis stroke="#D4AF37" />
            <Tooltip />
            <Legend />
            <Bar dataKey="expenses" fill="#D4AF37" />
            <Bar dataKey="income" fill="#FFD700" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
