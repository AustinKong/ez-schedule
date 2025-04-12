import express from "express";

import {
  createGroup,
  getGroupByName,
  getGroupById,
  getAllGroups,
  updateGroup,
  deleteGroup,
  getGroupsEnrolledByUserId,
  joinGroup,
  leaveGroup,
} from "../database/groupDb.js";

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
    if (group.createdBy !== req.user.userId) {
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
    if (req.user.userRole === "manager") {
      const groups = await getAllGroups(userId); //only getting groups specific to the user
      res.json(groups);
    } else if (req.user.userRole === "user") {
      const groups = await getGroupsEnrolledByUserId(userId); //only getting groups specific to the user
      res.json(groups);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//POST /api/groups/createGroup - Create a Group
router.post("/createGroup", async (req, res) => {
  try {
    const { name, description, maxUsers, memberUsers, password } = req.body;
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

//DELETE /api/groups/:groupId - Delete a specific group by ID
router.delete("/:groupId", async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const group = await getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // Authorization check: only group host can delete the group
    if (group.createdBy !== req.user.userId) {
      return res.status(403).json({ error: "Only host can delete the group." });
    }

    await deleteGroup(groupId);
    res.status(200).json({ message: "Group deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
