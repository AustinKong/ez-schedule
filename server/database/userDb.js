import { connectDb } from "./utils.js";
import { ObjectId } from "mongodb";

export async function findUserByEmail(email) {
  const db = await connectDb();
  return await db.collection("users").findOne({ email });
}

export async function findUserById(userId) {
  // const db = await connectDb();
  // return db.collection("users").findOne({ _id: userId });

  const db = await connectDb();
  try {
    return db.collection("users").findOne({ _id: ObjectId.createFromHexString(userId) });
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // Handle invalid ObjectId errors
  }

}

export async function createUser(userData) {
  const db = await connectDb();
  return await db.collection("users").insertOne(userData);
}

export async function updateUser(userId, userData) {
  const db = await connectDb();

  const updateFields = {};
  if (userData.email) {
    updateFields.email = userData.email;
  }
  if (userData.password) {
    updateFields.password = userData.password;
  }

  await db.collection("users").updateOne(
    {_id: ObjectId.createFromHexString(userId)}, 
    {$set: updateFields}
  );
}

