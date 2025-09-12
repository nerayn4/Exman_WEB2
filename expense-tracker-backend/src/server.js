import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const fs = require('fs');
const path = require('path');
const app = express();

//middlevare
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// DB + Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const DATA_FILE = path.join(__dirname, '..', 'data.json'); // expense-tracker-backend/data.json
let store = {
  expenses: [],
  incomes: [],
  nextId: 1
};


try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      store = { ...store, ...parsed };
    
      store.nextId = store.nextId || (Math.max(
        0,
        ...store.expenses.map(e => Number(e.id) || 0),
        ...store.incomes.map(i => Number(i.id) || 0)
      ) + 1);
      console.log('Loaded data from', DATA_FILE);
    }
  }
} catch (err) {
  console.warn('Could not load data file:', err);
}


function persist() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error persisting data:', err);
  }
}


function genId() {
  return String(store.nextId++);
}

app.get('/api/expenses', (req, res) => {
  res.json(store.expenses);
});

app.get('/api/expenses/:id', (req, res) => {
  const item = store.expenses.find(e => e.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Expense not found' });
  res.json(item);
});

app.post('/api/expenses', (req, res) => {
  const { amount, description, date, category } = req.body;
  if (amount == null) return res.status(400).json({ error: 'amount is required' });

  const expense = {
    id: genId(),
    amount: Number(amount),
    description: description || '',
    date: date || new Date().toISOString(),
    category: category || 'general',
    createdAt: new Date().toISOString()
  };
  store.expenses.push(expense);
  persist();
  res.status(201).json(expense);
});

app.put('/api/expenses/:id', (req, res) => {
  const idx = store.expenses.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Expense not found' });

  const { amount, description, date, category } = req.body;
  const current = store.expenses[idx];
  const updated = {
    ...current,
    amount: amount != null ? Number(amount) : current.amount,
    description: description != null ? description : current.description,
    date: date != null ? date : current.date,
    category: category != null ? category : current.category,
    updatedAt: new Date().toISOString()
  };
  store.expenses[idx] = updated;
  persist();
  res.json(updated);
});

app.delete('/api/expenses/:id', (req, res) => {
  const idx = store.expenses.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Expense not found' });
  const removed = store.expenses.splice(idx, 1)[0];
  persist();
  res.json({ deleted: removed });
});

app.get('/api/incomes', (req, res) => res.json(store.incomes));

app.get('/api/incomes/:id', (req, res) => {
  const it = store.incomes.find(i => i.id === req.params.id);
  if (!it) return res.status(404).json({ error: 'Income not found' });
  res.json(it);
});

app.post('/api/incomes', (req, res) => {
  const { amount, source, date } = req.body;
  if (amount == null) return res.status(400).json({ error: 'amount is required' });

  const income = {
    id: genId(),
    amount: Number(amount),
    source: source || 'unknown',
    date: date || new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  store.incomes.push(income);
  persist();
  res.status(201).json(income);
});

app.put('/api/incomes/:id', (req, res) => {
  const idx = store.incomes.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Income not found' });

  const { amount, source, date } = req.body;
  const curr = store.incomes[idx];
  const upd = {
    ...curr,
    amount: amount != null ? Number(amount) : curr.amount,
    source: source != null ? source : curr.source,
    date: date != null ? date : curr.date,
    updatedAt: new Date().toISOString()
  };
  store.incomes[idx] = upd;
  persist();
  res.json(upd);
});

app.delete('/api/incomes/:id', (req, res) => {
  const idx = store.incomes.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Income not found' });
  const removed = store.incomes.splice(idx, 1)[0];
  persist();
  res.json({ deleted: removed });
});


app.get('/', (req, res) => res.json({ status: 'ok', message: 'Backend running (in-memory DB)' }));


const PORT = process.env.PORT || 8080;
const srv = app.listen(PORT, () => console.log(`Server running on port ${PORT} (in-memory DB)`));

async function shutdown() {
  console.log('Shutting down, persisting data...');
  try { persist(); } catch (e) { console.error(e); }
  srv.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
