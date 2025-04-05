import express from "express";
import {
  createSlot,
  getSlotById,
  addEntryToSlot,
  removeEntryFromSlot,
  advanceSlotQueue,
} from "../database/slotDb.js";

import {
  createEntry,
  getEntryById,
  updateEntryStatus,
} from "../database/entryDb.js";

const router = express.Router();

// Middleware to ensure slot exists
async function loadSlot(req, res, next) {
  const slotId = req.params.slotId;
  const slot = await getSlotById(slotId);
  if (!slot || slot.isClosed)
    return res.status(404).json({ error: "Slot not found or closed" });
  slot.entries = await Promise.all(
    slot.entries.map((entryId) => getEntryById(entryId))
  );
  req.slot = slot;
  next();
}

// POST /api/slots - Create a slot (host only)
router.post("/", async (req, res) => {
  const { start, end } = req.body;
  const host = req.user.userId;
  if (!start || !end)
    return res.status(400).json({ error: "Missing start/end" });

  const result = await createSlot({
    host,
    start: new Date(start),
    end: new Date(end),
  });
  res.status(201).json(result);
});

// POST /api/slots/:slotId/join - Join a queue
router.post("/:slotId/join", loadSlot, async (req, res) => {
  const userId = req.user.userId;

  // Check if already in queue
  const alreadyInQueue = req.slot.entries.some(
    (entry) => entry.visitor === userId
  );
  if (alreadyInQueue)
    return res.status(400).json({ error: "Already in queue" });

  const entry = await createEntry(userId);
  await addEntryToSlot(req.slot._id, entry.insertedId);

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

export default router;
