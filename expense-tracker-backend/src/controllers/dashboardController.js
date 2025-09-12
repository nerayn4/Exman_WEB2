import dashboardCalculations from "../models/Index.js";

export const getDashboardData = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const currentMonth = month || currentDate.getMonth() + 1;
    const currentYear = year || currentDate.getFullYear();

    const summary = await dashboardCalculations.calculateMonthlySummary(
      req.user._id,
      currentYear,
      currentMonth
    );

    const expensesByCategory = await dashboardCalculations.calculateExpensesByCategory(
      req.user._id,
      currentYear,
      currentMonth
    );

    const trends = await dashboardCalculations.calculateMonthlyTrends(req.user._id, 6);

    const alerts = [];
    if (summary.balance < 0) {
      alerts.push({
        type: "warning",
        message: `Budget dépassé de $${Math.abs(summary.balance).toFixed(2)} ce mois-ci`,
      });
    }
    if (summary.totalExpenses > summary.totalIncomes * 0.8) {
      alerts.push({
        type: "info",
        message: "Vous avez dépensé plus de 80% de vos revenus ce mois-ci",
      });
    }

    res.json({
      success: true,
      data: {
        summary,
        expensesByCategory,
        trends,
        alerts,
        period: {
          month: currentMonth,
          year: currentYear,
          monthName: new Date(currentYear, currentMonth - 1).toLocaleString("default", { month: "long" }),
        },
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getChartData = async (req, res) => {
  try {
    const { chartType } = req.params;
    let data;

    switch (chartType) {
      case "expenses-by-category":
        const currentDate = new Date();
        data = await dashboardCalculations.calculateExpensesByCategory(
          req.user._id,
          currentDate.getFullYear(),
          currentDate.getMonth() + 1
        );
        break;

      case "monthly-trends":
        data = await dashboardCalculations.calculateMonthlyTrends(req.user._id, 12);
        break;

      default:
        return res.status(400).json({ success: false, message: "Invalid chart type" });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error("Chart data error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
