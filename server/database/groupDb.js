import {connectDb} from "./utils.js";

export async function createGroup(groupData) {
    const db = await connectDb();
    const group = {
        "name": groupData.name,
        "description": groupData.description,
        "maxUsers": groupData.maxUsers,
        "createdAt": new Date(),
        "createdBy": groupData.userId, //plan to change this to username (for registering as user, to implement a username also)
    };
    return db.collection("groups").insertOne(group);
}


export async function getGroupById(groupId) {
    const db = await connectDb();
    try {
        return db.collection("groups").findOne({
            _id: ObjectId.createFromHexString(userId)
        });
    } catch(error) {
        console.error("Error fetching group:", error);
    }

}


export async function getGroupByName(groupName) {
    const db = await connectDb();
    try {
        return db.collection("groups").findOne({name: groupName});
    } catch(error) {
        console.error("Error fetching group:", error);
    }

}

export async function getAllGroups(userId) { //once username is implemented, change parameter to username
    const db = await connectDb();
    try {
        return await db.collection("groups").find({createdBy: userId}).toArray(); //once username is implemented, change to createdBy: username
    } catch (error) {
        console.error("Error fetching groups:", error);
    }
}

export async function getAllGroupsByUsername(username) {
    const db = await connectDb();
    try {
        return db.collection("groups").find({createdBy: username}).toArray();
    } catch (error) {
        console.error("Error fetching groups:", error);
    }
}


