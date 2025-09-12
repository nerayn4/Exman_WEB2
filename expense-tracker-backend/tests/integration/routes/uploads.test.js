const request = require('supertest');
const app = require('../../../src/server');
const User = require('../../../src/models/User');
const Expense = require('../../../src/models/Expense');
const fs = require('fs');
const path = require('path');

describe('Upload Routes Integration', () => {
  let authToken;
  let expenseId;

  beforeAll(async () => {
    const user = await User.create({
      email: 'upload-test@example.com',
      password: 'password123'
    });

    const expense = await Expense.create({
      amount: 100,
      date: new Date(),
      userId: user._id,
      description: 'Test expense for upload'
    });

    expenseId = expense._id;
  });

  beforeEach(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'upload-test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  test('POST /api/uploads/expense/:id/receipt should upload file', async () => {
    // Créer un fichier test temporaire
    const testFilePath = path.join(__dirname, '../fixtures/test-receipt.txt');
    fs.writeFileSync(testFilePath, 'test receipt content');

    const response = await request(app)
      .post(`/api/uploads/expense/${expenseId}/receipt`)
      .set('Authorization', `Bearer ${authToken}`)
      .attach('receipt', testFilePath);

    // Nettoyer
    fs.unlinkSync(testFilePath);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('successfully');
  });
});