/**
 * MongoDB Atlas Connection Configuration
 * Uses Mongoose ODM with offline resilience and graceful degradation.
 */

let mongoose;
try {
  mongoose = await import('mongoose').then(m => m.default || m);
} catch (e) {
  mongoose = null;
}

let isConnected = false;
let connectedHost = null;
let lastError = null;

if (mongoose) {
  mongoose.set('bufferCommands', false);
}

export const connectDB = async (customUri = null) => {
  const uri = customUri || process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI not provided. Running server in offline-mode (local fallback).');
    isConnected = false;
    connectedHost = null;
    lastError = 'No MONGODB_URI configured';
    return false;
  }

  if (!mongoose) {
    console.warn('⚠️  Mongoose package not installed. Operating in degraded in-memory mode.');
    isConnected = false;
    connectedHost = null;
    lastError = 'Mongoose not installed';
    return false;
  }

  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    isConnected = true;
    connectedHost = conn.connection.host;
    lastError = null;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    connectedHost = null;
    lastError = error.message;
    console.warn(`⚠️  MongoDB Connection Failed (${error.message}). Server continues running with local fallback.`);
    return false;
  }
};

export const getDbStatus = () => ({
  connected: isConnected,
  host: connectedHost,
  error: lastError,
  hasUri: Boolean(process.env.MONGODB_URI)
});

export default connectDB;
