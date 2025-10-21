import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
console.log("MONGODB_URI:", process.env.MONGO_URI);


const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI; // or MONGODB_URI if you prefer
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Assign the result to conn
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};


// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

export default connectDB;
