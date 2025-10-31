const mongoose = require('mongoose');

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

async function connectWithRetry(uri, retries = 0) {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      autoIndex: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error(`MongoDB connection error (attempt ${retries + 1}):`, error.message);
    
    if (retries < MAX_RETRIES - 1) {
      console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(uri, retries + 1);
    } else {
      console.error('Max retries reached. Could not connect to MongoDB.');
      process.exit(1);
    }
  }
}

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set');
    process.exit(1);
  }

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');  
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });

  await connectWithRetry(uri);
};
