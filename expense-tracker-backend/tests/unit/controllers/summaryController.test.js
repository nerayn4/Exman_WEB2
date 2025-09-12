const summaryController = require('../../../src/controllers/summaryController');
const summaryCalculations = require('../../../src/utils/summaryCalculations');

jest.mock('../../../src/utils/summaryCalculations');

describe('Summary Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      userId: '507f1f77bcf86cd799439011',
      query: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('getMonthlySummary should return monthly data', async () => {
    mockReq.query.month = '2024-01';
    
    const mockSummary = {
      totals: { expenses: 1000, incomes: 2000, balance: 1000 },
      alerts: []
    };
    
    summaryCalculations.calculateMonthlySummary.mockResolvedValue(mockSummary);

    await summaryController.getMonthlySummary(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalled();
  });

  test('getBudgetAlerts should return alerts', async () => {
    const mockSummary = {
      totals: { balance: -500 },
      alerts: [{ type: 'warning', message: 'Budget exceeded' }]
    };
    
    summaryCalculations.calculateMonthlySummary.mockResolvedValue(mockSummary);

    await summaryController.getBudgetAlerts(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        alert: true
      })
    );
  });
});