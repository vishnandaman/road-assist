const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roadassist');
    console.log('MongoDB Connected for checking...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Check database
const checkDatabase = async () => {
  try {
    const users = await User.find({});
    console.log(`Found ${users.length} users in database:`);
    
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Check specific user
    const specificUser = await User.findOne({ email: 'u1@gmail.com' });
    if (specificUser) {
      console.log('\n✅ User u1@gmail.com found:', specificUser.name);
    } else {
      console.log('\n❌ User u1@gmail.com NOT found');
    }

  } catch (err) {
    console.error('Error checking database:', err);
  }
};

// Run the check
const runCheck = async () => {
  await connectDB();
  await checkDatabase();
  process.exit(0);
};

runCheck();
