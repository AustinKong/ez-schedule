import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DATABASE_URI;
const client = new MongoClient(uri);
const dbName = process.env.DATABASE_NAME;

export async function connectDb() {
	try {
		await client.connect();
		return client.db(dbName);
	} catch (err) {
		console.error('Failed to connect to MongoDB', err);
		process.exit(1);
	}
}
