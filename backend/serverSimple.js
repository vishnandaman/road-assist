require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = require('./config/db');
connectDB();

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Try to import routes one by one
try {
  console.log('Testing authRoutes...');
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✅ authRoutes loaded successfully');
} catch (err) {
  console.error('❌ Error loading authRoutes:', err.message);
}

try {
  console.log('Testing userRoutes...');
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);
  console.log('✅ userRoutes loaded successfully');
} catch (err) {
  console.error('❌ Error loading userRoutes:', err.message);
}

try {
  console.log('Testing requestRoutes...');
  const requestRoutes = require('./routes/requestRoutes');
  app.use('/api/requests', requestRoutes);
  console.log('✅ requestRoutes loaded successfully');
} catch (err) {
  console.error('❌ Error loading requestRoutes:', err.message);
}

try {
  console.log('Testing mechanicRoutes...');
  const mechanicRoutes = require('./routes/mechanicRoutes');
  app.use('/api/mechanics', mechanicRoutes);
  console.log('✅ mechanicRoutes loaded successfully');
} catch (err) {
  console.error('❌ Error loading mechanicRoutes:', err.message);
}

// Error handling middleware
try {
  app.use(require('./middleware/errorHandler'));
  console.log('✅ errorHandler loaded successfully');
} catch (err) {
  console.error('❌ Error loading errorHandler:', err.message);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});
