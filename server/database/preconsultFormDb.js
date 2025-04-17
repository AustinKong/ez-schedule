import { connectDb } from "./utils.js";
import { ObjectId } from "mongodb";

export async function createPreconsultForm({
  slotId,
  createdBy,
  objectives,
  concerns,
  attachments,
}) {
  const db = await connectDb();
  try {
    return await db.collection("preconsultForms").insertOne({
      slotId: ObjectId.createFromHexString(slotId),
      createdBy: ObjectId.createFromHexString(createdBy),
      concerns,
      objectives,
      attachments,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating preconsult form:", error);
  }
}

export async function updatePreconsultForm(formId, updateFields) {
  const db = await connectDb();
  try {
    return await db
      .collection("preconsultForms")
      .updateOne(
        { _id: ObjectId.createFromHexString(formId) },
        { $set: updateFields }
      );
  } catch (error) {
    console.error("Error updating preconsult form:", error);
  }
}

export async function getPreconsultFormById(formId) {
  const db = await connectDb();
  try {
    return await db
      .collection("preconsultForms")
      .findOne({ _id: ObjectId.createFromHexString(formId) });
  } catch (error) {
    console.error("Error fetching preconsult form by ID:", error);
  }
}

export async function getPreconsultFormsBySlot(slotId) {
  const db = await connectDb();
  try {
    return await db
      .collection("preconsultForms")
      .find({ slotId: ObjectId.createFromHexString(slotId) })
      .toArray();
  } catch (error) {
    console.error("Error fetching preconsult forms by slot:", error);
  }
}

export async function getPreconsultFormBySlotAndParticipant(slotId, userId) {
  const db = await connectDb();
  try {
    return await db.collection("preconsultForms").findOne({
      slotId: ObjectId.createFromHexString(slotId),
      createdBy: ObjectId.createFromHexString(userId),
    });
  } catch (error) {
    console.error("Error fetching preconsult form by slot and user:", error);
  }
}

export async function deletePreconsultForm(formId) {
  const db = await connectDb();
  try {
    return await db
      .collection("preconsultForms")
      .deleteOne({ _id: ObjectId.createFromHexString(formId) });
  } catch (error) {
    console.error("Error deleting preconsult form:", error);
  }
}

export async function getPreconsultFormByParticipantId(userId) {
  const db = await connectDb();
  try {
    return await db
      .collection("preconsultForms")
      .find({ createdBy: ObjectId.createFromHexString(userId) })
      .toArray();
  } catch (error) {
    console.error("Error fetching preconsult form by user ID:", error);
  }
}