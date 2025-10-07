// database/conn.js

import mongoose from 'mongoose';

// Your environment variable for the connection string
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error(
    'Please define the MONGO_URL environment variable in your .env file or Vercel environment variables'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  // If a connection is already cached, return it
  if (cached.conn) {
    console.log("=> Using existing database connection.");
    return cached.conn;
  }

  // If a promise is not already in progress, create a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Recommended for serverless environments
    };

    cached.promise = mongoose.connect(MONGO_URL, opts).then((mongoose) => {
      console.log("=> New database connection established.");
      return mongoose;
    });
  }
  
  // Wait for the connection promise to resolve
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // If the connection fails, reset the promise so the next request can try again
    cached.promise = null;
    throw e;
  }

  // Return the connection
  return cached.conn;
}

export default connect;