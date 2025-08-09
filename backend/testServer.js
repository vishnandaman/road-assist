require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Simple auth test route
app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  res.json({ message: 'Login endpoint reached', body: req.body });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});
