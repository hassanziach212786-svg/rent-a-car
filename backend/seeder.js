const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Car = require('./models/carModel');
const Location = require('./models/locationModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Location.deleteMany();

    // Add Admin
    await User.create({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin123', // Will be hashed by model middleware
      phone: '03001234567',
      role: 'admin'
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();