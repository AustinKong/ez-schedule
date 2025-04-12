import { connectDb } from './utils.js';
import { ObjectId } from 'mongodb';

export async function findUserByEmail(email) {
	const db = await connectDb();
	return await db.collection('users').findOne({ email });
}

export async function findUserById(userId) {
	const db = await connectDb();
	try {
		return db.collection('users').findOne({ _id: ObjectId.createFromHexString(userId) });
	} catch (error) {
		console.error('Error fetching user:', error);
		return null; // Handle invalid ObjectId errors
	}
}

export async function updateUser(userId, userData) {
	const db = await connectDb();

	const updateFields = {};
	if (userData.email) {
		updateFields.email = userData.email;
	}
	if (userData.password) {
		updateFields.password = userData.password;
	}

	await db
		.collection('users')
		.updateOne({ _id: ObjectId.createFromHexString(userId) }, { $set: updateFields });
}

// Function to fetch all hosts
export async function getAllHosts() {
	const db = await connectDb();
	try {
		return await db.collection('users').find({ userRole: 'host' }).toArray();
	} catch (error) {
		console.error('Error fetching all managers:', error);
	}
}

// Function to fetch all participants
export async function getAllParticipants() {
	const db = await connectDb();
	try {
		return await db.collection('users').find({ userRole: 'participant' }).toArray();
	} catch (error) {
		console.error('Error fetching all users:', error);
	}
}

// Shared function to create a participant/host
export async function createUser({ email, password, username, userType }) {
	const db = await connectDb();

	try {
		let userData;
		if (userType === 'host') {
			userData = {
				email,
				password,
				username,
				userRole: 'host',
				createdAt: new Date(),
			};
		} else {
			userData = {
				email,
				password,
				username,
				userRole: 'participant',
				createdAt: new Date(),
				managedGroups: [], // Initializing managedGroups to an empty array
			};
		}
		return await db.collection('users').insertOne(userData);
	} catch (error) {
		console.error('Error creating user:', error);
		return null;
	}
}

export async function getUserByUsername(username) {
	const db = await connectDb();

	try {
		return db.collection('users').findOne({ username });
	} catch (error) {
		console.error('(usersDb.js)Error fetching user:', error);
	}
}
