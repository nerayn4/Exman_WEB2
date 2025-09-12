const request = require('supertest');
const app = require('../../../src/server');
const User = require('../../../src/models/User');
const Expense = require('../../../src/models/Expense');
const Income = require('../../../src/models/Income');

describe('Summary Routes Integration', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Créer un utilisateur de test
    const user = await User.create({
      email: 'summary-test@example.com',
      password: 'password123'
    });
    userId = user._id;

    // Créer des données de test
    await Expense.create([
      {
        amount: 100,
        date: new Date('2024-01-15'),
        userId: userId,
        description: 'Test expense 1'
      },
      {
        amount: 200,
        date: new Date('2024-01-20'),
        userId: userId,
        description: 'Test expense 2'
      }
    ]);

    await Income.create({
      amount: 1000,
      date: new Date('2024-01-10'),
      userId: userId,
      source: 'Test Income'
    });
  });

  beforeEach(async () => {
    // Obtenir un token d'authentification
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'summary-test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  test('GET /api/summary/monthly should return monthly summary', async () => {
    const response = await request(app)
      .get('/api/summary/monthly?month=2024-01')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.totals.expenses).toBe(300);
    expect(response.body.data.totals.incomes).toBe(1000);
  });

  test('GET /api/summary should return date range summary', async () => {
    const response = await request(app)
      .get('/api/summary?start=2024-01-01&end=2024-01-31')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('GET /api/summary/alerts should return budget alerts', async () => {
    const response = await request(app)
      .get('/api/summary/alerts')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('alert');
  });
});