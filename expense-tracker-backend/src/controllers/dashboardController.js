const dashboardCalculations = require('../models/Index');

exports.getDashboardData = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const currentMonth = month || currentDate.getMonth() + 1;
    const currentYear = year || currentDate.getFullYear();
    
    const summary = await dashboardCalculations.calculateMonthlySummary(
      req.userId, 
      currentYear, 
      currentMonth
    );
    
    const expensesByCategory = await dashboardCalculations.calculateExpensesByCategory(
      req.userId,
      currentYear,
      currentMonth
    );
    
    const trends = await dashboardCalculations.calculateMonthlyTrends(req.userId, 6);
    
    const alerts = [];
    if (summary.balance < 0) {
      alerts.push({
        type: 'warning',
        message: `Budget dépassé de $${Math.abs(summary.balance).toFixed(2)} ce mois-ci`
      });
    }
    
    if (summary.totalExpenses > (summary.totalIncomes * 0.8)) {
      alerts.push({
        type: 'info',
        message: 'Vous avez dépensé plus de 80% de vos revenus ce mois-ci'
      });
    }
    
    res.json({
      summary,
      expensesByCategory,
      trends,
      alerts,
      period: {
        month: currentMonth,
        year: currentYear,
        monthName: new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' })
      }
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      message: 'Error fetching dashboard data', 
      error: error.message 
    });
  }
};

exports.getChartData = async (req, res) => {
  try {
    const { chartType, timeframe } = req.params;
    
    let data;
    switch (chartType) {
      case 'expenses-by-category':
        const currentDate = new Date();
        data = await dashboardCalculations.calculateExpensesByCategory(
          req.userId,
          currentDate.getFullYear(),
          currentDate.getMonth() + 1
        );
        break;
        
      case 'monthly-trends':
        data = await dashboardCalculations.calculateMonthlyTrends(req.userId, 12);
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid chart type' });
    }
    
    res.json(data);
    
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({ 
      message: 'Error fetching chart data', 
      error: error.message 
    });
  }
};