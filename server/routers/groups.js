import express from "express";

import {
    createGroup,
    getGroupById,
    getGroupByName,
    getAllGroups,

} from "../database/groupDb.js";

const router = express.Router();


//GET /api/groups - view all groups
router.get("/", async(req,res) => {
    try {
        const userId = req.user.userId;
        const groups = await getAllGroups(userId); //only getting groups specific to the user
        res.json(groups);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})



//POST /api/groups/createGroup - Create a Group
router.post("/createGroup", async(req,res) => {
    try {
    const {name, description, maxUsers} = req.body;
    const userId = req.user.userId;

    if (!name) {
        return res.status(400).send("Name of group is required.");
    }

    const existingGroup = await getGroupByName(name);
    if (existingGroup) {
        return res.status(400).send("Name of group already exist. Choose a different name.");
    }

    await createGroup({
        name,
        description,
        maxUsers,
        userId,
    });

    return res.status(201).json({ message: "Group created successfully" });

    } catch (error) {
        return res.status(500).send({error: error.message});
    }
})









export default router;