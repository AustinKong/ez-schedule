import express from "express";
import {
  createSlot,
  getSlotById,
  addEntryToSlot,
  removeEntryFromSlot,
  advanceSlotQueue,
  getSlotsByHost,
  updateSlot,
  closeSlot,
} from "../database/slotDb.js";
import multer from "multer";
import { createPreconsultForm } from "../database/preconsultFormDb.js";

import {
  createEntry,
  getEntryById,
  updateEntryStatus,
} from "../database/entryDb.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Middleware to ensure slot exists
async function loadSlot(req, res, next) {
  const slotId = req.params.slotId;
  const slot = await getSlotById(slotId);
  if (!slot || slot.isClosed)
    return res.status(404).json({ error: "Slot not found or closed" });
  slot.entries = await Promise.all(
    slot.entries.map((entryId) => getEntryById(entryId.toString()))
  );
  req.slot = slot;
  next();
}

// POST /api/slots - Create a slot (host only)
router.post("/", async (req, res) => {
  console.log("Creating slot with data:", req.body);
  const { start, end, location, description, groupId, name } = req.body;
  const host = req.user.userId;
  if (!start || !end || !location || !groupId || !name)
    return res.status(400).json({ error: "Missing required fields" });

  const result = await createSlot({
    host,
    start: new Date(start),
    end: new Date(end),
    location,
    description,
    groupId,
    name,
  });
  res.status(201).json(result);
});

// GET /api/slots/host - All slots created by current user
router.get("/host", async (req, res) => {
  const hostId = req.user.userId;
  const slots = await getSlotsByHost(hostId);
  res.json(slots);
});

// GET /api/slots/:slotId - Full slot details
router.get("/:slotId", loadSlot, (req, res) => {
  res.json(req.slot);
});

router.post(
  "/:slotId/preconsultation",
  upload.single("documents"),
  async (req, res) => {
    const { slotId } = req.params;
    const { concerns, objectives } = req.body;
    const userId = req.user.userId;

    if (!concerns || !objectives) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    try {
      const attachment = req.file
        ? {
            name: req.file.originalname,
            mimetype: req.file.mimetype,
            buffer: req.file.buffer.toString("base64"), // or save to S3/gridFS instead
          }
        : null;

      const result = await createPreconsultForm({
        slotId,
        createdBy: userId,
        concerns,
        objectives,
        attachments: attachment,
      });

      res.status(201).json({ success: true, id: result.insertedId });
    } catch (err) {
      console.error("Failed to create preconsultation form:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// POST /api/slots/:slotId/join - Join a queue
router.post("/:slotId/join", loadSlot, async (req, res) => {
  const userId = req.user.userId;
  const entryData = req.body; //currently, the logic would be that the frontend would have tags, hence the request body would have the tags

  // Check if already in queue
  const alreadyInQueue = req.slot.entries.some(
    (entry) => entry.visitor === userId
  );
  if (alreadyInQueue)
    return res.status(400).json({ error: "Already in queue" });

  const entry = await createEntry(userId, entryData);
  await addEntryToSlot(req.slot._id.toString(), entry.insertedId.toString());

  res.status(200).json({ message: "Joined queue" });
});

// POST /api/slots/:slotId/leave - Leave the queue
router.post("/:slotId/leave", loadSlot, async (req, res) => {
  const userId = req.user.userId;

  const matchingEntryId = req.slot.entries.find(
    (entry) => entry.visitor === userId
  )?._id;
  if (!matchingEntryId)
    return res.status(400).json({ error: "You are not in the queue" });

  await removeEntryFromSlot(req.slot._id, matchingEntryId);
  await updateEntryStatus(matchingEntryId, "missed");

  res.status(200).json({ message: "Left queue" });
});

// POST /api/slots/:slotId/advance - Host advances the queue
router.post("/:slotId/advance", loadSlot, async (req, res) => {
  if (req.slot.host !== req.user.userId) {
    return res.status(403).json({ error: "Only host can advance queue" });
  }

  const nextEntryId = req.slot.entries[0]._id;
  if (!nextEntryId) return res.status(400).json({ error: "Queue is empty" });

  await updateEntryStatus(nextEntryId, "notified");
  await advanceSlotQueue(req.slot._id); // removes first entry

  res.status(200).json({ message: "Advanced queue" });
});

// POST /api/slots/:slotId/close - Host closes the slot
router.post("/:slotId/close", loadSlot, async (req, res) => {
  if (req.slot.host !== req.user.userId) {
    return res.status(403).json({ error: "Only host can close the slot" });
  }

  // Optionally skip if already closed
  if (req.slot.isClosed) {
    return res.status(400).json({ error: "Slot already closed" });
  }

  await closeSlot(req.slot._id);
  res.status(200).json({ message: "Slot closed" });
});
// GET /api/slots/:slotId/position - User queue position
router.get("/:slotId/position", loadSlot, (req, res) => {
  const userId = req.user.userId;

  const index = req.slot.entries.findIndex(
    (entry) => entry.visitor?.toString() === userId
  );

  if (index === -1) {
    return res.status(400).json({ error: "You are not in the queue" });
  }

  res.json({
    position: index + 1,
    total: req.slot.entries.length,
  });
});

// GET /api/slots/available?host=hostId - Get all slots available for a host
router.get("/available", async (req, res) => {
  const { host } = req.query;
  if (!host) return res.status(400).json({ error: "Missing host ID" });

  const slots = await getSlotsByHost(host);
  res.json(slots);
});

router.put("/:slotId", loadSlot, async (req, res) => {
  if (req.slot.host !== req.user.userId) {
    return res.status(403).json({ error: "Only host can edit timeslot" });
  }

  const { start, end, location, description, groupId, name } = req.body;

  // Require at least one field to update
  if (!start && !end && !location && !description && !groupId && !name) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  const updateFields = {};
  if (start) updateFields.start = new Date(start);
  if (end) updateFields.end = new Date(end);
  if (location) updateFields.location = location;
  if (description !== undefined) updateFields.description = description;
  if (groupId) updateFields.groupId = groupId;
  if (name) updateFields.name = name;

  await updateSlot(req.slot._id.toString(), updateFields);

  const updatedSlot = await getSlotById(req.slot._id);
  res.status(200).json({ message: "Timeslot updated", slot: updatedSlot });
});

// DELETE /api/slots/:slotId - Delete a specific slot
router.delete("/:slotId", loadSlot, async (req, res) => {
  if (req.slot.host !== req.user.userId) {
    return res.status(403).json({ error: "Only host can delete the slot" });
  }

  await deleteSlot(req.slot._id);
  res.status(200).json({ message: "Slot deleted successfully" });
});

// PUT /api/slots/:slotId/timing - Update slot timing
router.put("/:slotId/timing", loadSlot, async (req, res) => {
  if (req.slot.host !== req.user.userId) {
    return res.status(403).json({ error: "Only host can update slot timing" });
  }

  const { start, end } = req.body;
  if (!start || !end) {
    return res.status(400).json({ error: "Start and end times are required" });
  }

  await updateSlotTiming(
    req.slot._id.toString(),
    new Date(start),
    new Date(end)
  );
  const updatedSlot = await getSlotById(req.slot._id);
  res.status(200).json({ message: "Slot timing updated", slot: updatedSlot });
});

export default router;
