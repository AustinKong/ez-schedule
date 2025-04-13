import { connectDb } from './utils.js';
import { ObjectId } from 'mongodb';

export async function createEntry(visitorId, entryData) {
	const db = await connectDb();

	const tagArray = entryData.tags.split(',').map((tag) => tag.trim());
	try {
		const result = await db.collection('entries').insertOne({
			visitor: visitorId,
			status: 'waiting',
            createdAt: new Date(),
			tags: tagArray,
		});
		console.log('New entry created: ', result);
		return result;
	} catch (err) {
		console.error('Error creating entry:', err);
	}
}

export async function updateEntryStatus(entryId, status) {
	const db = await connectDb();
	try {
		const result = await db
			.collection('entries')
			.updateOne({ _id: new ObjectId.createFromHexString(entryId) }, { $set: { status } });
		console.log(`Status updated to '${status}' for entry ID: ${entryId}`);
		return result;
	} catch (error) {
		console.error(`Failed to update status for entry ID: ${entryId}`, error);
	}
}

export async function getEntryById(entryId) {
	const db = await connectDb();
	return db.collection('entries').findOne({ _id: new ObjectId.createFromHexString(entryId) });
}
