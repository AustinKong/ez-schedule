import express from "express";

import { 
    findUserByEmail,
    findUserById,
    updateUser,
} from "../database/userDb.js";

const router = express.Router();

// GET /api/users/:userId - View user profile
router.get("/:userId", async(req, res) => {
    const userId = req.params.userId;
    const user = await findUserById(userId);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({error: "User not found"});
    }
});


// PUT /api/users/:userId - Update/Edit user profile
router.put("/:userId", async(req, res) => {
    const userId = req.params.userId;
    // const user = await findUserById(userId);
    const userData = req.body;
    try {
        await updateUser(userId, userData);
        res.sendStatus(204);
    } catch (error) {
        res.sendStatus(404);
    }
});




export default router;


