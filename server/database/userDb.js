import { connectDb } from "./utils.js";
import { ObjectId } from "mongodb";

export async function findUserByEmail(email) {
  const db = await connectDb();
  return await db.collection("users").findOne({ email });
}

export async function findUserById(userId) {
  const db = await connectDb();
  try {
    return db
      .collection("users")
      .findOne({ _id: ObjectId.createFromHexString(userId) });
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // Handle invalid ObjectId errors
  }
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

  await db
    .collection("users")
    .updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      { $set: updateFields }
    );
}

// Function to fetch all managers
export async function getAllManagers() {
  const db = await connectDb();
  try {
    return await db.collection("users").find({ userRole: "manager" }).toArray();
  } catch (error) {
    console.error("Error fetching all managers:", error);
  }
}

// Function to fetch all users
export async function getAllUsers() {
  const db = await connectDb();
  try {
    return await db.collection("users").find({ userRole: "user" }).toArray();
  } catch (error) {
    console.error("Error fetching all users:", error);
  }
}

// Shared function to create a user/manager
export async function createUser({ email, password, username, userType }) {
  const db = await connectDb();

  try {
    let userData;
    if (userType === "user") {
      userData = {
        email,
        password,
        username,
        userRole: "user",
        createdAt: new Date(),
      };
    } else {
      userData = {
        email,
        password,
        username,
        userRole: "manager",
        createdAt: new Date(),
        managedGroups: [], // Initializing managedGroups to an empty array
      };
    }
    return await db.collection("users").insertOne(userData);
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export async function getUserByUsername(username) {
  const db = await connectDb();

  try {
    return db.collection("users").findOne({ username });
  } catch (error) {
    console.error("(usersDb.js)Error fetching user:", error);
  }
}
