import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Attempting to connect to MongoDB Atlas with connection string:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000 
})
.then(() => {
  console.log('SUCCESS: Connected to MongoDB Atlas successfully!');
  process.exit(0);
})
.catch(err => {
  console.error('CONNECTION FAILED:');
  console.error(err);
  process.exit(1);
});
