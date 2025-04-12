import { ObjectId } from "mongodb";
import { connectDb } from "./utils.js";

export async function createGroup(groupData) {
  const db = await connectDb();
  const group = {
    name: groupData.name,
    description: groupData.description,
    maxUsers: groupData.maxUsers,
    memberUsers: [],
    createdAt: new Date(),
    createdBy: groupData.userId, //plan to change this to username (for registering as user, to implement a username also)
  };
  return db.collection("groups").insertOne(group);
}

export async function getGroupById(groupId) {
  const db = await connectDb();
  try {
    return db.collection("groups").findOne({
      _id: ObjectId.createFromHexString(userId),
    });
  } catch (error) {
    console.error("Error fetching group:", error);
  }
}

export async function getGroupByName(groupName) {
  const db = await connectDb();
  try {
    return db.collection("groups").findOne({ name: groupName });
  } catch (error) {
    console.error("Error fetching group:", error);
  }
}

// Newly added - assumes Managers have managedGroups attribute (Array storing GroupIds)
export async function getGroupsManagedByManagerId(managerId) {
  const db = await connectDb();
  try {
    // First, find the manager to get the list of managed groups
    const manager = await db
      .collection("users")
      .findOne({ _id: new ObjectId.createFromHexString(managerId) });
    if (!manager || !manager.managedGroups) {
      console.log("No manager or managed groups found for the given ID.");
      return [];
    }

    // Now, fetch all groups by the IDs listed in managedGroups
    const groups = await db
      .collection("groups")
      .find({
        _id: {
          $in: manager.managedGroups.map(
            (id) => new ObjectId.createFromHexString(id)
          ),
        },
      })
      .toArray();

    return groups;
  } catch (error) {
    console.error("Error fetching groups by manager ID:", error);
  }
}

// Newly added - assumes Groups have memberUsers attribute (Array storing UserIds)
//             - checks for Users' userRole to be users
export async function getGroupsEnrolledByUserId(userId) {
  const db = await connectDb();

  try {
    // First, verify the user's role is 'user'
    const user = await db
      .collection("users")
      .findOne({
        _id: new ObjectId.createFromHexString(userId),
        userRole: "user",
      });
    if (!user) {
      console.log("No user found with the specified ID and role 'user'.");
      return [];
    }

    // If user role is 'user', fetch all groups where this user is a member
    const groups = await db
      .collection("groups")
      .find({
        memberUsers: new ObjectId.createFromHexString(userId),
      })
      .toArray();

    return groups;
  } catch (error) {
    console.error("Error fetching groups by user ID:", error);
  }
}

// Newly added - assumes Groups have memberUsers attribute (Array storing UserIds)
export async function addMultipleMemberUsersToGroup(groupId, users) {
  const db = await connectDb();
  try {
    // Map array of user objects to array of ObjectIds
    const userIdsToAdd = users.map(
      (user) => new ObjectId.createFromHexString(user.userId)
    );

    // Update the group document to add multiple userIds to the 'memberUsers' array
    const result = await db.collection("groups").updateOne(
      { _id: new ObjectId.createFromHexString(groupId) },
      { $addToSet: { memberUsers: { $each: userIdsToAdd } } } // $addToSet with $each ensures only unique userIds are added
    );
    console.log(
      `Added users to group: ${result.matchedCount} document(s) matched, ${result.modifiedCount} document(s) updated.`
    );
    return result;
  } catch (error) {
    console.error("Error adding multiple users to group:", error);
  }
}

export async function getAllGroups(userId) {
  const db = await connectDb();
  try {
    return await db.collection("groups").find({ createdBy: userId }).toArray(); //once username is implemented, change to createdBy: username
  } catch (error) {
    console.error("Error fetching groups:", error);
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
  if (groupData.memberUsers) {
    updateFields.memberUsers = groupData.memberUsers;
  }

  try {
    await db
      .collection("groups")
      .updateOne(
        { _id: ObjectId.createFromHexString(groupId) },
        { $set: updateFields }
      );
  } catch (error) {
    console.error("(groupDb.js) Error updating group:", error);
    throw error;
  }
}
