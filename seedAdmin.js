// seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'ngacha@creative.com';
    const password = 'ngacha123'; 

    // Check if admin already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const admin = new Admin({ email, password });
    await admin.save();

    console.log('Admin created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
}

createAdmin();
