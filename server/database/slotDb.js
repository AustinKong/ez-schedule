import { connectDb } from "./utils.js";
import { ObjectId } from "mongodb";

export async function createSlot({ host, start, end }) {
  const db = await connectDb();
  return db.collection("slots").insertOne({ host, entries: [], start, end });
}

export async function addEntryToSlot(slotId, entryId) {
  const db = await connectDb();
  return db
    .collection("slots")
    .updateOne(
      { _id: new ObjectId(slotId) },
      { $push: { entries: new ObjectId(entryId) } }
    );
}

export async function getSlotById(slotId) {
  const db = await connectDb();
  return db.collection("slots").findOne({ _id: new ObjectId(slotId) });
}

export async function getSlotsByHost(hostId) {
  const db = await connectDb();
  return db
    .collection("slots")
    .find({ host: hostId })
    .sort({ start: 1 })
    .toArray();
}

export async function removeEntryFromSlot(slotId, entryId) {
  const db = await connectDb();
  return db
    .collection("slots")
    .updateOne(
      { _id: new ObjectId(slotId) },
      { $pull: { entries: new ObjectId(entryId) } }
    );
}

export async function advanceSlotQueue(slotId) {
  const db = await connectDb();
  return db.collection("slots").updateOne(
    { _id: new ObjectId(slotId) },
    { $pop: { entries: -1 } } // removes first entry
  );
}

export async function closeSlot(slotId) {
  const db = await connectDb();
  return db
    .collection("slots")
    .updateOne({ _id: new ObjectId(slotId) }, { $set: { isClosed: true } });
}
