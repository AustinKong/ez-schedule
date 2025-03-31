import { connectDb } from "./utils.js";
import { ObjectId } from "mongodb";

export async function createEntry(visitorId) {
  const db = await connectDb();
  return db.collection("entries").insertOne({
    visitor: visitorId,
    status: "waiting",
  });
}

export async function updateEntryStatus(entryId, status) {
  const db = await connectDb();
  return db
    .collection("entries")
    .updateOne({ _id: new ObjectId(entryId) }, { $set: { status } });
}

export async function getEntryById(entryId) {
  const db = await connectDb();
  return db.collection("entries").findOne({ _id: new ObjectId(entryId) });
}
