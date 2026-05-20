const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    const adminData = {
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin123', // Will be hashed by model middleware
      phone: '03001234567',
      role: 'admin'
    };

    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      existingAdmin.name = adminData.name;
      existingAdmin.phone = adminData.phone;
      existingAdmin.role = adminData.role;
      existingAdmin.password = adminData.password;
      await existingAdmin.save();
      console.log('Admin user updated!');
    } else {
      await User.create(adminData);
      console.log('Admin user created!');
    }

    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
