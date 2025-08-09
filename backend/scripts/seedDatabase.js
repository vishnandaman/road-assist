const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Mechanic = require('../models/Mechanic');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roadassist');
    console.log('MongoDB Connected for seeding...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Mechanic.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const users = [
      {
        name: 'John Doe',
        email: 'u1@gmail.com',
        password: '123456',
        phone: '+1234567890',
        role: 'user',
        location: {
          type: 'Point',
          coordinates: [-74.006, 40.7128] // New York coordinates
        },
        vehicles: [
          {
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            licensePlate: 'ABC123'
          }
        ]
      },
      {
        name: 'Jane Smith',
        email: 'user2@gmail.com',
        password: '123456',
        phone: '+1234567891',
        role: 'user',
        location: {
          type: 'Point',
          coordinates: [-74.006, 40.7128]
        }
      },
      {
        name: 'Mike Johnson',
        email: 'mechanic1@gmail.com',
        password: '123456',
        phone: '+1234567892',
        role: 'mechanic',
        location: {
          type: 'Point',
          coordinates: [-74.006, 40.7128]
        }
      },
      {
        name: 'Sarah Wilson',
        email: 'mechanic2@gmail.com',
        password: '123456',
        phone: '+1234567893',
        role: 'mechanic',
        location: {
          type: 'Point',
          coordinates: [-74.006, 40.7128]
        }
      },
      {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: '123456',
        phone: '+1234567894',
        role: 'admin',
        location: {
          type: 'Point',
          coordinates: [-74.006, 40.7128]
        }
      }
    ];

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name} (${user.email})`);
    }

    // Create mechanic profiles for mechanics
    const mechanics = createdUsers.filter(user => user.role === 'mechanic');
    for (const mechanic of mechanics) {
      const mechanicProfile = new Mechanic({
        user: mechanic._id,
        specialties: ['towing', 'battery', 'tire'],
        experience: Math.floor(Math.random() * 10) + 1,
        hourlyRate: Math.floor(Math.random() * 30) + 30,
        availability: true,
        currentLocation: {
          type: 'Point',
          coordinates: [-74.006, 40.7128]
        }
      });
      await mechanicProfile.save();
      console.log(`Created mechanic profile for: ${mechanic.name}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('👤 Regular User: u1@gmail.com / 123456');
    console.log('👤 Another User: user2@gmail.com / 123456');
    console.log('🔧 Mechanic 1: mechanic1@gmail.com / 123456');
    console.log('🔧 Mechanic 2: mechanic2@gmail.com / 123456');
    console.log('👨‍💼 Admin: admin@gmail.com / 123456');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

// Run the seeder
const runSeeder = async () => {
  await connectDB();
  await seedData();
};

runSeeder();
