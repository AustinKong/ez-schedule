import { connectDb } from "./utils.js";
import { ObjectId } from "mongodb";

export async function createEntry(visitorId, entryData) {
  const db = await connectDb();

  const tagArray = entryData.tags.split(",").map(tag => tag.trim());

  return db.collection("entries").insertOne({
    visitor: visitorId,
    status: "waiting",
    tags: tagArray,
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
