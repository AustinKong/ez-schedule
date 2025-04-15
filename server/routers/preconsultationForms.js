import express from "express";
import {
  getPreconsultFormById,
  getPreconsultFormBySlotAndParticipant,
} from "../database/preconsultFormDb.js";
import { getSlotById } from "../database/slotDb.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/slot/:slotId", requireAuth, async (req, res) => {
  const slotId = req.params.slotId;
  const userId = req.user.userId;
  console.log("Fetching submission for slot:", slotId, "by user:", userId);

  try {
    const form = await getPreconsultFormBySlotAndParticipant(slotId, userId);

    if (!form) {
      return res
        .status(404)
        .json({ error: "No submission found for this slot." });
    }

    const slot = await getSlotById(slotId);

    const response = {
      _id: form._id,
      concerns: form.concerns,
      objectives: form.objectives,
      createdAt: form.createdAt,
      status: "submitted",
      slot,
    };

    // ✅ Convert each attachment into frontend-expected format
    if (Array.isArray(form.attachments) && form.attachments.length > 0) {
      response.documents = form.attachments.map((file, index) => ({
        originalname: file.name,
        path: `${form._id}/${index}`,
      }));
    } else {
      response.documents = [];
    }

    res.json(response);
  } catch (error) {
    console.error("Error fetching submission by slot and user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:formId/:fileIndex", async (req, res) => {
  const { formId, fileIndex } = req.params;

  try {
    const form = await getPreconsultFormById(formId);

    const file = form?.attachments?.[fileIndex];
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const buffer = Buffer.from(file.buffer, "base64");

    res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
    res.setHeader("Content-Type", file.mimetype);
    res.send(buffer);
  } catch (err) {
    console.error("Error serving base64 file:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
