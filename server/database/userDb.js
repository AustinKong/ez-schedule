import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URI;
const client = new MongoClient(uri);
const dbName = process.env.DATABASE_NAME;

async function connectDB() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

// Find user by email
async function findUserByEmail(email) {
  const db = await connectDB();
  const user = await db.collection('users').findOne({ email });
  return user;
}

// Create new user
async function createUser(userData) {
  const db = await connectDB();
  const result = await db.collection('users').insertOne(userData);
  return result;
}

export default {
  findUserByEmail,
  createUser,
};
