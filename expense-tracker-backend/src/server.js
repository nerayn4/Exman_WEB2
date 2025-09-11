require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Swagger Docs (safe load)
let swaggerDocument = null;
try {
  const swaggerPath = path.join(__dirname, 'docs', 'openapi.yaml');
  if (fs.existsSync(swaggerPath)) {
    swaggerDocument = YAML.load(swaggerPath);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } else {
    console.warn('Swagger file not found at', swaggerPath);
  }
} catch (err) {
  console.error('Erreur lors du chargement de Swagger:', err);
}

// Routes 
app.use('/api/expenses', require('./src/routes/expenseRoutes'));
app.use('/api/incomes', require('./src/routes/incomeRoutes'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI non défini dans .env — impossible de se connecter à MongoDB');
  process.exit(1);
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


mongoose.connection.on('error', err => console.error('Mongoose connection error:', err));
mongoose.connection.once('open', () => console.log('Mongoose connection open'));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown example
process.on('SIGINT', async () => {
  console.log('SIGINT received — closing MongoDB connection and exiting');
  await mongoose.disconnect();
  process.exit(0);
});
