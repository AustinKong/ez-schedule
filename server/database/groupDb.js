import { ObjectId } from 'mongodb';
import { connectDb } from './utils.js';

export async function createGroup(groupData) {
	const db = await connectDb();
	const group = {
		name: groupData.name,
		description: groupData.description,
		maxUsers: groupData.maxUsers,
		memberParticipants: [],
		createdAt: new Date(),
		createdBy: groupData.userId, //plan to change this to username (for registering as user, to implement a username also)
	};
	return db.collection('groups').insertOne(group);
}

export async function getGroupById(groupId) {
	const db = await connectDb();
	try {
		return db.collection('groups').findOne({
			_id: ObjectId.createFromHexString(groupId),
		});
	} catch (error) {
		console.error('Error fetching group:', error);
	}
}

export async function getGroupByName(groupName) {
	const db = await connectDb();
	try {
		return db.collection('groups').findOne({ name: groupName });
	} catch (error) {
		console.error('Error fetching group:', error);
	}
}

// Newly added - assumes Hosts have managedGroups attribute (Array storing GroupIds)
export async function getGroupsManagedByHostId(hostId) {
	const db = await connectDb();
	try {
		// First, find the manager to get the list of managed groups
		const host = await db
			.collection('users')
			.findOne({ _id: new ObjectId.createFromHexString(hostId) });
		if (!host || !host.managedGroups) {
			console.log('No host or no managed groups found for the given ID.');
			return [];
		}

		// Now, fetch all groups by the IDs listed in managedGroups
		const groups = await db
			.collection('groups')
			.find({
				_id: {
					$in: host.managedGroups.map((id) => new ObjectId.createFromHexString(id)),
				},
			})
			.toArray();

		return groups;
	} catch (error) {
		console.error('Error fetching groups by host ID:', error);
	}
}

// Newly added - assumes Groups have memberParticipants attribute (Array storing UserIds)
//             - checks for Users' userRole to be 'participant'
export async function getGroupsContainingParticipantId(participantId) {
	const db = await connectDb();

	try {
		// First, verify the user's role is 'participant'
		const user = await db.collection('users').findOne({
			_id: new ObjectId.createFromHexString(participantId),
			userRole: 'participant',
		});
		if (!user) {
			console.log("No participant found with the specified ID and role 'participant'.");
			return [];
		}

		// If user role is 'participant', fetch all groups where this user is a member
		const groups = await db
			.collection('groups')
			.find({
				memberParticipants: new ObjectId.createFromHexString(participantId),
			})
			.toArray();

		return groups;
	} catch (error) {
		console.error('Error fetching groups by user ID:', error);
	}
}

// Newly added - assumes Groups have memberParticipants attribute (Array storing UserIds)
export async function addMultipleMemberParticipantsToGroup(groupId, participants) {
	const db = await connectDb();
	try {
		// Map array of user objects to array of ObjectIds
		const participantIdsToAdd = participants.map((p) => new ObjectId.createFromHexString(p.userId));

		// Update the group document to add multiple userIds to the 'memberParticipants' array
		const result = await db.collection('groups').updateOne(
			{ _id: new ObjectId.createFromHexString(groupId) },
			{ $addToSet: { memberParticipants: { $each: participantIdsToAdd } } } // $addToSet with $each ensures only unique userIds are added
		);
		console.log(
			`Added users to group: ${result.matchedCount} document(s) matched, ${result.modifiedCount} document(s) updated.`
		);
		return result;
	} catch (error) {
		console.error('Error adding multiple users to group:', error);
	}
}

export async function getAllGroups(userId) {
	const db = await connectDb();
	try {
		return await db.collection('groups').find({ createdBy: userId }).toArray(); //once username is implemented, change to createdBy: username
	} catch (error) {
		console.error('Error fetching groups:', error);
	}
}

export async function updateGroup(groupId, groupData) {
	const db = await connectDb();

	const updateFields = {};
	if (groupData.name) {
		updateFields.name = groupData.name;
	}
	if (groupData.description) {
		updateFields.description = groupData.description;
	}
	if (groupData.maxUsers) {
		updateFields.maxUsers = groupData.maxUsers;
	}
	if (groupData.createdBy) {
		updateFields.createdBy = groupData.createdBy;
	}
	if (groupData.memberParticipants) {
		updateFields.memberParticipants = groupData.memberParticipants;
	}

	try {
		await db
			.collection('groups')
			.updateOne({ _id: ObjectId.createFromHexString(groupId) }, { $set: updateFields });
	} catch (error) {
		console.error('(groupDb.js) Error updating group:', error);
		throw error;
	}
}

export async function deleteGroup(groupId) {
	const db = await connectDb();
	try {
		const result = await db.collection('groups').deleteOne({
			_id: ObjectId.createFromHexString(groupId),
		});
		return result;
	} catch (error) {
		console.error('Error deleting group:', error);
		throw error;
	}
}
