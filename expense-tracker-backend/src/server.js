require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth.routes');
const expenseRoutes = require('./routes/expense.routes');
const incomeRoutes = require('./routes/income.routes');
const categoryRoutes = require('./routes/category.routes');
const summaryRoutes = require('./routes/summary.routes');  
const receiptRoutes = require('./routes/receipt.routes');
const userRoutes = require('./routes/user.routes'); 

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.use('/api/auth', authRoutes);


app.use('/api/expenses', expenseRoutes);


app.use('/api/incomes', incomeRoutes);


app.use('/api/categories', categoryRoutes);


app.use('/api/summary', summaryRoutes);


app.use('/api/receipts', receiptRoutes);

app.use('/api/user', userRoutes);


sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database sync failed:', err);
  });
