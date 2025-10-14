// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const catRoutes = require('./routes/categories');
const txRoutes = require('./routes/transactions');
const bdRoutes = require('./routes/budgets');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/categories', catRoutes);
app.use('/api/transactions', txRoutes);
app.use('/api/budgets', bdRoutes);

app.get('/', (req, res) => res.json({ message: 'Budget Tracker API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
