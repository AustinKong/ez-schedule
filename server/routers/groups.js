import express from 'express';

import {
	createGroup,
    getGroupById,
	getGroupByName,
    getGroupsManagedByHostId,
    getGroupsContainingParticipantId,
    addMultipleMemberParticipantsToGroup,
    getAllGroups,
	updateGroup,
} from '../database/groupDb.js';

const router = express.Router();

//GET /api/groups - View all groups
router.get('/', async (req, res) => {
	try {
		const userId = req.user.userId;
		const groups = await getAllGroups(userId); //only getting groups specific to the user
		res.json(groups);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

//POST /api/groups/createGroup - Create a Group
router.post('/createGroup', async (req, res) => {
	try {
		const { name, description, maxUsers, memberParticipants } = req.body;
		const userId = req.user.userId;

		if (!name) {
			return res.status(400).send('Name of group is required.');
			//OR
			// return res.status(400).json({message: "Name of group is required."});
		}

		const existingGroup = await getGroupByName(name);
		if (existingGroup) {
			return res.status(400).send('Name of group already exist. Choose a different name.'); //or can use res.status(400).json()
		}

		await createGroup({
			name,
			description,
			maxUsers,
			userId,
		});

		return res.status(201).json({ message: 'Group created successfully' });
	} catch (error) {
		return res.status(500).send({ error: error.message });
	}
});

//PATCH /api/groups/:groupId/editGroup - Editing/Updating group details
router.patch('/:groupId/editGroup', async (req, res) => {
	const groupId = req.params.groupId;
	const groupData = req.body;
	// console.log("(groups.js) groupId:", groupId); //debug
	// console.log("(groups.js) groupData:", groupData); //debug

	try {
		await updateGroup(groupId, groupData);
		res.status(200).json({ message: 'Successful update of group details.' });
	} catch (error) {
		console.error('(groups.js) Update group error:', error);
		res.status(500).json({ error: 'Failed to update group details.' });
	}
});

export default router;
