const summaryCalculations = require('../../../src/utils/summaryCalculations');
const Expense = require('../../../src/models/Expense');
const Income = require('../../../src/models/Income');

jest.mock('../../../src/models/Expense');
jest.mock('../../../src/models/Income');

describe('Summary Calculations Utilities', () => {
  const mockUserId = '507f1f77bcf86cd799439011';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calculateMonthlySummary should return correct data', async () => {
    Expense.aggregate.mockResolvedValue([{ totalAmount: 1000, count: 5, average: 200 }]);
    Income.aggregate.mockResolvedValue([{ totalAmount: 2000, count: 2, average: 1000 }]);

    const result = await summaryCalculations.calculateMonthlySummary(mockUserId, 2024, 1);

    expect(result.totals.expenses).toBe(1000);
    expect(result.totals.incomes).toBe(2000);
    expect(result.totals.balance).toBe(1000);
  });

  test('checkAlerts should return budget exceeded alert', async () => {
    const alerts = await summaryCalculations.checkAlerts(mockUserId, 2000, 1000, -1000);
    
    expect(alerts).toHaveLength(1);
    expect(alerts[0].type).toBe('warning');
    expect(alerts[0].code).toBe('BUDGET_EXCEEDED');
  });
});