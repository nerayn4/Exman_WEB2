import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function DashboardChart({ expensesByCategory }) {
  const COLORS = ["#D4AF37", "#FFD700", "#B8860B", "#DAA520"];

  return (
    <div className="bg-black text-[#D4AF37] p-4 rounded-lg shadow">
      <h3 className="mb-4 font-semibold">Expenses by Category</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={expensesByCategory}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {expensesByCategory.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: "#1a1a1a", border: "none", color: "#D4AF37" }}
          labelStyle={{ color: "#D4AF37" }}
        />
      </PieChart>
    </div>
  );
}

