// src/services/api.js
const API_URL = 'http://localhost:3000/api';

export const fetchGroups = async () => {
    const response = await fetch(`${API_URL}/groups`);
    if (!response.ok) throw new Error('Failed to fetch groups');
    return response.json();
};

export const fetchGroup = async (id) => {
    const response = await fetch(`${API_URL}/groups/${id}`);
    if (!response.ok) throw new Error('Failed to fetch group');
    return response.json();
};

export const createGroup = async (groupData) => {
    const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData)
    });
    if (!response.ok) throw new Error('Failed to create group');
    return response.json();
};

export const updateGroup = async (id, groupData) => {
    const response = await fetch(`${API_URL}/groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData)
    });
    if (!response.ok) throw new Error('Failed to update group');
    return response.json();
};

export const fetchQueueByGroup = async (groupId) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/queue`);
    if (!response.ok) throw new Error('Failed to fetch queue');
    return response.json();
};

export const startQueue = async (groupId) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/queue/start`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to start queue');
    return response.json();
};

export const pauseQueue = async (groupId) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/queue/pause`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to pause queue');
    return response.json();
};

export const callNextUser = async (groupId) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/queue/next`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to call next user');
    return response.json();
};

export const markUserAsServed = async (groupId, userId) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/queue/${userId}/served`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to mark user as served');
    return response.json();
};
