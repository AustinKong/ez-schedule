import express from "express";
import {
  createPreconsultForm,
  getPreconsultFormById,
  getPreconsultFormsBySlot,
  getPreconsultFormBySlotAndParticipant,
  updatePreconsultForm,
  deletePreconsultForm,
} from "../database/preconsultFormDb.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { slotId, text, attachments } = req.body;
  const createdBy = req.user.userId;

  if (!slotId || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await createPreconsultForm({
      slotId,
      createdBy,
      text,
      attachments,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating preconsult form" });
  }
})

export default router;