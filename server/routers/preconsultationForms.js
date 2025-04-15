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

    if (form.attachments) {
      response.documents = {
        name: form.attachments.name,
        url: `/api/preconsultation/${form._id}/attachment`,
      };
    }

    res.json(response);
  } catch (error) {
    console.error("Error fetching submission by slot and user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:formId/attachment", async (req, res) => {
  const formId = req.params.formId;

  try {
    const form = await getPreconsultFormById(formId);
    console.log(form);

    if (
      !form ||
      !form.attachments ||
      !form.attachments.buffer ||
      !form.attachments.name ||
      !form.attachments.mimetype
    ) {
      return res.status(404).json({ error: "No attachment found." });
    }

    const fileBuffer = Buffer.from(form.attachments.buffer, "base64");

    res.setHeader("Content-Type", form.attachments.mimetype);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${form.attachments.name}"`
    );

    res.send(fileBuffer);
  } catch (err) {
    console.error("Error serving base64 file:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
