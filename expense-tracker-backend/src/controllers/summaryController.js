const summaryCalculations = require('../utils/summaryCalculations');
exports.getMonthlySummary = async (req, res) => {
  try {
    const { month } = req.query;
    let year, monthNumber;

    if (month) {
      [year, monthNumber] = month.split('-').map(Number);
    } else {
      const now = new Date();
      year = now.getFullYear();
      monthNumber = now.getMonth() + 1;
    }
    if (!year || !monthNumber || monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({
        message: 'Invalid month parameter. Use format: YYYY-MM'
      });
    }

    const summary = await summaryCalculations.calculateMonthlySummary(
      req.userId,
      year,
      monthNumber
    );

    res.json({
      success: true,
      period: {
        month: monthNumber,
        year: year,
        monthName: new Date(year, monthNumber - 1).toLocaleString('default', { month: 'long' })
      },
      data: summary
    });

  } catch (error) {
    console.error('Monthly summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching monthly summary',
      error: error.message
    });
  }
};
exports.getSummaryByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({
        message: 'Start and end dates are required. Format: YYYY-MM-DD'
      });
    }
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    if (startDate > endDate) {
      return res.status(400).json({
        message: 'Start date must be before end date'
      });
    }
    const oneYearLater = new Date(startDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    if (endDate > oneYearLater) {
      return res.status(400).json({
        message: 'Date range cannot exceed 1 year'
      });
    }

    const summary = await summaryCalculations.calculateSummary(
      req.userId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      period: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        days: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      },
      data: summary
    });

  } catch (error) {
    console.error('Date range summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching summary for date range',
      error: error.message
    });
  }
};
exports.getBudgetAlerts = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const summary = await summaryCalculations.calculateMonthlySummary(
      req.userId,
      year,
      month
    );
    const budgetAlert = summary.alerts.find(alert => 
      alert.code === 'BUDGET_EXCEEDED'
    );

    if (budgetAlert) {
      res.json({
        alert: true,
        message: budgetAlert.message,
        details: {
          amount: budgetAlert.amount,
          period: `${year}-${month.toString().padStart(2, '0')}`
        }
      });
    } else {
      res.json({
        alert: false,
        message: 'Budget is within limits for the current month',
        details: {
          balance: summary.totals.balance,
          period: `${year}-${month.toString().padStart(2, '0')}`
        }
      });
    }

  } catch (error) {
    console.error('Budget alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking budget alerts',
      error: error.message
    });
  }
};
exports.getOverview = async (req, res) => {
  try {
    const now = new Date();
    const currentMonthSummary = await summaryCalculations.calculateMonthlySummary(
      req.userId,
      now.getFullYear(),
      now.getMonth() + 1
    );
    const prevMonth = new Date(now);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthSummary = await summaryCalculations.calculateMonthlySummary(
      req.userId,
      prevMonth.getFullYear(),
      prevMonth.getMonth() + 1
    );

    res.json({
      success: true,
      currentMonth: currentMonthSummary,
      previousMonth: prevMonthSummary,
      comparison: {
        expensesChange: currentMonthSummary.totals.expenses - prevMonthSummary.totals.expenses,
        incomeChange: currentMonthSummary.totals.incomes - prevMonthSummary.totals.incomes,
        balanceChange: currentMonthSummary.totals.balance - prevMonthSummary.totals.balance
      }
    });

  } catch (error) {
    console.error('Overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching overview',
      error: error.message
    });
  }
};