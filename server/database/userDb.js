import { connectDb } from "./utils.js";

export async function findUserByEmail(email) {
  const db = await connectDb();
  return await db.collection("users").findOne({ email });
}

export async function findUserById(userId) {
  const db = await connectDb();
  return db.collection("users").findOne({ _id: userId });
}

export async function createUser(userData) {
  const db = await connectDb();
  return await db.collection("users").insertOne(userData);
}
