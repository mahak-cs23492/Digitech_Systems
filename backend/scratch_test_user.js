import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const runTest = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    // Clear any previous test user
    await User.deleteMany({ email: 'test_phone_register@gmail.com' });

    console.log('Creating test user with phone "+91 9927700201"...');
    const user = await User.create({
      name: 'Test Phone Register',
      email: 'test_phone_register@gmail.com',
      password: 'password123',
      phone: '+91 9927700201'
    });

    console.log('Saved User details:', user);

    console.log('Querying user from database...');
    const queried = await User.findOne({ email: 'test_phone_register@gmail.com' });
    console.log('Queried User phone value:', queried.phone);

    if (queried.phone === '+91 9927700201') {
      console.log('SUCCESS: Phone field is correctly stored and retrieved!');
    } else {
      console.error('FAILURE: Phone field mismatch or missing!');
    }

    // Clean up
    await User.deleteMany({ email: 'test_phone_register@gmail.com' });
    process.exit(0);
  } catch (error) {
    console.error('Error during test:', error);
    process.exit(1);
  }
};

runTest();
