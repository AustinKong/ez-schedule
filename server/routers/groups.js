import express from "express";

import {
  createGroup,
  getGroupByName,
  getGroupById,
  getAllGroups,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getGroupsManagedByHostId,
  getGroupsContainingParticipantId,
} from "../database/groupDb.js";

import { getSlotsByGroupId } from "../database/slotDb.js";

const router = express.Router();

router.post("/:groupId/join", async (req, res) => {
  const groupId = req.params.groupId;
  const { password } = req.body;

  const userId = req.user.userId;
  const group = await getGroupById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found." });
  }

  if (group.password !== password) {
    return res.status(403).json({ error: "Incorrect password." });
  }

  try {
    await joinGroup(groupId, userId, password);
    res.status(200).json({ message: "Successfully joined the group." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/:groupId/leave", async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.user.userId;

  try {
    const group = await getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    await leaveGroup(groupId, userId);
    res.status(200).json({ message: "Successfully left the group." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//GET /api/groups/:groupId - Get a specific group by ID
router.get("/:groupId", async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const group = await getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }
    if (group.createdBy.toString() !== req.user.userId) {
      delete group.password;
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET /api/groups - View all groups
router.get("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    if (req.user.userRole === "host") {
      const groups = await getGroupsManagedByHostId(userId); //only getting groups specific to the user
      res.json(groups);
    } else if (req.user.userRole === "participant") {
      const groups = await getGroupsContainingParticipantId(userId); //only getting groups specific to the user
      res.json(groups);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//POST /api/groups/createGroup - Create a Group
router.post("/createGroup", async (req, res) => {
  try {
    const { name, description, maxUsers, memberParticipants, password } =
      req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).send("Name of group is required.");
    }

    const existingGroup = await getGroupByName(name);
    if (existingGroup) {
      return res
        .status(400)
        .send("Name of group already exist. Choose a different name."); //or can use res.status(400).json()
    }

    function generate6DigitCode() {
      return Math.floor(100000 + Math.random() * 900000).toString();
    }

    await createGroup({
      name,
      description,
      maxUsers,
      userId,
      password: password || generate6DigitCode(),
    });

    return res.status(201).json({ message: "Group created successfully" });
  } catch (error) {
    console.error("(groups.js) Create group error:", error);
    return res.status(500).json({ error: "Failed to create group" });
  }
});

//PATCH /api/groups/:groupId/editGroup - Editing/Updating group details
router.patch("/:groupId/editGroup", async (req, res) => {
  const groupId = req.params.groupId;
  const groupData = req.body;

  try {
    // Check if group exists and if user is the host
    const group = await getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (group.createdBy !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Only host can update group details." });
    }

    await updateGroup(groupId, groupData);
    res.status(200).json({ message: "Successful update of group details." });
  } catch (error) {
    console.error("(groups.js) Update group error:", error);
    res.status(500).json({ error: "Failed to update group details." });
  }
});

router.get("/:groupId/timeslots", async (req, res) => {
  const groupId = req.params.groupId;
  try {
    const slots = await getSlotsByGroupId(groupId);
    if (!slots || slots.length === 0) {
      return res
        .status(404)
        .json({ message: "No timeslots found for this group." });
    }
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//DELETE /api/groups/:groupId - Delete a specific group by ID
router.delete("/:groupId", async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const group = await getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // Authorization check: only group host can delete the group
    // console.log("(groups.js) createdBy:", group.createdBy); //debug
    // console.log("(groups.js) req.user.userId:", req.user.userId); //debug
    if (group.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Only host can delete the group." });
    }

    await deleteGroup(groupId);
    res.status(200).json({ message: "Group deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/groups/:name - Fetch a group by name
router.get("/:name", async (req, res) => {
  const groupName = req.params.name;
  try {
    const group = await getGroupByName(groupName);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/groups/host/:hostId - Fetch all groups managed by a specific host
router.get("/host/:hostId", async (req, res) => {
  const hostId = req.params.hostId;
  try {
    const groups = await getGroupsManagedByHostId(hostId);
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/groups/participant/:participantId - Fetch all groups containing a specific participant
router.get("/participant/:participantId", async (req, res) => {
  const participantId = req.params.participantId;
  try {
    const groups = await getGroupsContainingParticipantId(participantId);
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/groups/:groupId/addParticipants - Add multiple participants to a group
router.post("/:groupId/addParticipants", async (req, res) => {
  const groupId = req.params.groupId;
  const { participants } = req.body; // Array of user IDs

  if (!participants || !participants.length) {
    return res.status(400).json({ error: "Participant list cannot be empty." });
  }

  try {
    const result = await addMultipleMemberParticipantsToGroup(
      groupId,
      participants
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Group not found." });
    }
    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message:
          "No new participants were added (they may already be members).",
      });
    }
    res.status(200).json({ message: "Participants added successfully." });
  } catch (error) {
    console.error("Error adding participants:", error);
    res.status(500).json({ error: "Failed to add participants to group." });
  }
});

export default router;
