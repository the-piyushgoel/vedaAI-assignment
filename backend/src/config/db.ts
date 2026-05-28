import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedaal';
    await mongoose.connect(connUri);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
};
