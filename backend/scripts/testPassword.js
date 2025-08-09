const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roadassist');
    console.log('MongoDB Connected for testing...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Test password functionality
const testPassword = async () => {
  try {
    // Find the user
    const user = await User.findOne({ email: 'u1@gmail.com' });
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', user.name);
    console.log('Stored password hash:', user.password);
    console.log('Password length:', user.password.length);

    // Test password comparison
    const testPassword = '123456';
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log('Password match:', isMatch);

    // Test with wrong password
    const wrongPassword = 'wrongpassword';
    const isWrongMatch = await bcrypt.compare(wrongPassword, user.password);
    console.log('Wrong password match:', isWrongMatch);

    // Create a new hash for comparison
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log('New hash:', newHash);
    console.log('New hash length:', newHash.length);

    const newMatch = await bcrypt.compare(testPassword, newHash);
    console.log('New hash match:', newMatch);

  } catch (err) {
    console.error('Error testing password:', err);
  }
};

// Run the test
const runTest = async () => {
  await connectDB();
  await testPassword();
  process.exit(0);
};

runTest();
