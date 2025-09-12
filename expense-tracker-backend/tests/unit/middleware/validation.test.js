const { summaryValidation } = require('../../../src/middleware/validation');

describe('Validation Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      query: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockNext = jest.fn();
  });

  test('should pass valid month parameter', () => {
    mockReq.query.month = '2024-01';
    
    summaryValidation.monthlySummary(mockReq, mockRes, mockNext);
    
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  test('should reject invalid month parameter', () => {
    mockReq.query.month = 'invalid-date';
    
    summaryValidation.monthlySummary(mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalled();
  });
});