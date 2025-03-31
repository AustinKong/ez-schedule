import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.DATABASE_URI;
const client = new MongoClient(uri);
const dbName = process.env.DATABASE_NAME;

let db;

export async function connectDb() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}
