import { connectDb } from "./utils.js";
import { ObjectId } from "mongodb";

export async function createSlot({
  host,
  start,
  end,
  location,
  description,
  groupId,
  name,
}) {
  const db = await connectDb();
  try {
    return await db.collection("slots").insertOne({
      host: ObjectId.createFromHexString(host),
      start,
      end,
      location,
      description,
      groupId: ObjectId.createFromHexString(groupId),
      name,
      entries: [],
      isClosed: false,
      createdAt: new Date(),
    });
  } catch (error) {
    console.log("Error creating slot:", error);
  }
}

export async function updateSlot(slotId, updateFields) {
  const db = await connectDb();
  try {
    return await db
      .collection("slots")
      .updateOne(
        { _id: ObjectId.createFromHexString(slotId) },
        { $set: updateFields }
      );
  } catch (error) {
    console.log("Error updating slot:", error);
  }
}

export async function getSlotById(slotId) {
  const db = await connectDb();
  try {
    // console.log("(slotDb.js) slotId:", slotId, "typeof:", typeof slotId); //debug
    const resolvedId = typeof slotId === "string" ? ObjectId.createFromHexString(slotId) : slotId;


    return await db
      .collection("slots")
      .findOne({ _id: resolvedId });
      // .findOne({ _id: ObjectId.createFromHexString(slotId) });
  } catch (error) {
    console.log("Error fetching slot by ID:", error);
  }
}

export async function closeSlot(slotId) {
  const db = await connectDb();
  try {
    // console.log("(slotDb.js) slotId:", slotId, "typeof:", typeof slotId); //debug
    const resolvedId = typeof slotId === "string" ? ObjectId.createFromHexString(slotId) : slotId;

    return await db
      .collection("slots")
      .updateOne(
        { _id: resolvedId },
        { $set: { isClosed: true } }
      );
  } catch (error) {
    console.log("Error closing slot:", error);
  }
}

export async function getSlotsByHost(hostId) {
  const db = await connectDb();
  const now = new Date(); // current timestamp

  try {
    return await db
      .collection("slots")
      .find({ 
        host: ObjectId.createFromHexString(hostId),
        end: { $gt: now }, // filter out only slots that haven't ended
        isClosed: false    // filter out manually closed slots
      })
      .sort({ start: 1 })
      .toArray();
  } catch (error) {
    console.log("Error fetching slots by host:", error);
  }
}

export async function updateSlotTiming(slotId, newStart, newEnd) {
  const db = await connectDb();
  try {
    return await db
      .collection("slots")
      .updateOne(
        { _id: new ObjectId.createFromHexString(slotId) },
        { $set: { start: newStart, end: newEnd } }
      );
  } catch (error) {
    console.log("Error updating slot timing:", error);
  }
}

export async function reopenSlot(slotId) {
  const db = await connectDb();
  try {
    return await db
      .collection("slots")
      .updateOne(
        { _id: ObjectId.createFromHexString(slotId) },
        { $set: { isClosed: false } }
      );
  } catch (error) {
    console.log("Error reopening slot:", error);
  }
}

export async function deleteSlot(slotId) {
  const db = await connectDb();
  console.log("(slotDb.js) slotId:", slotId, "typeof:", typeof slotId);
  try {
    return await db
      .collection("slots")
      .deleteOne({ _id: ObjectId.createFromHexString(slotId) });
  } catch (error) {
    console.log("Error deleting slot:", error);
  }
}

export async function bulkAddWeeklySlots({ host, start, end, times = 16 }) {
  const db = await connectDb();
  try {
    const ops = [];
    for (let i = 0; i < times; i++) {
      const newStart = new Date(start);
      newStart.setDate(newStart.getDate() + 7 * i);
      const newEnd = new Date(end);
      newEnd.setDate(newEnd.getDate() + 7 * i);
      ops.push({
        insertOne: {
          document: {
            host,
            start: newStart,
            end: newEnd,
            entries: [],
            isClosed: false,
            createdAt: new Date(),
          },
        },
      });
    }
    return await db.collection("slots").bulkWrite(ops);
  } catch (error) {
    console.log("Error adding weekly slots:", error);
  }
}

export async function addEntryToSlot(slotId, entryId) {
  const db = await connectDb();
  return db
    .collection("slots")
    .updateOne(
      { _id: ObjectId.createFromHexString(slotId) },
      { $push: { entries: ObjectId.createFromHexString(entryId) } }
    );
}

export async function removeEntryFromSlot(slotId, entryId) {
  const db = await connectDb();
  return db
    .collection("slots")
    .updateOne(
      { _id: new ObjectId.createFromHexString(slotId) },
      { $pull: { entries: new ObjectId.createFromHexString(entryId) } }
    );
}

export async function advanceSlotQueue(slotId) {
  const db = await connectDb();
  // console.log("(slotDb.js) slotId:", slotId, "typeof:", typeof slotId); //debug
  const resolvedId = typeof slotId === "string" ? ObjectId.createFromHexString(slotId) : slotId;

  return db.collection("slots").updateOne(
    // { _id: ObjectId.createFromHexString(slotId) },
    { _id: resolvedId },
    { $pop: { entries: -1 } } // removes first entry
  );
}

export async function getSlotsByGroupId(groupId) {
  const db = await connectDb();
  try {
    return await db
      .collection("slots")
      .find({ groupId: ObjectId.createFromHexString(groupId) })
      .toArray();
  } catch (error) {
    console.log("Error fetching slots by group ID:", error);
  }
}
