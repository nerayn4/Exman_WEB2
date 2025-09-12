// Vérifiez que ceci est la SEULE déclaration d'express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true 
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Import des routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/incomes');
const categoryRoutes = require('./routes/categories');
const uploadRoutes = require('./routes/uploads');
const summaryRoutes = require('./routes/summary');
const dashboardRoutes = require('./routes/dashboard');

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware de gestion d'erreurs
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Connexion à la base de données
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

// Export pour les tests
module.exports = app;

// Démarrer le serveur seulement si ce n'est pas un test
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}