// src/hooks/useGroups.jsx
import { useState, useEffect } from 'react';
import { fetchGroups, fetchGroup, createGroup, updateGroup } from '../services/api';

export const useGroups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadGroups = async () => {
        try {
            setLoading(true);
            const data = await fetchGroups();
            setGroups(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getGroup = async (id) => {
        try {
            setLoading(true);
            const data = await fetchGroup(id);
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const addGroup = async (groupData) => {
        try {
            setLoading(true);
            // Add the current user ID to the group data
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            const groupWithUser = {
                ...groupData,
                userId: userData.id // This should match how your backend expects it
            };
            
            const newGroup = await createGroup(groupWithUser);
            setGroups([...groups, newGroup]);
            setError(null);
            return newGroup;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const editGroup = async (id, groupData) => {
        try {
            setLoading(true);
            const updatedGroup = await updateGroup(id, groupData);
            setGroups(groups.map(group => group._id === id ? updatedGroup : group));
            setError(null);
            return updatedGroup;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGroups();
    }, []);

    return { groups, loading, error, loadGroups, getGroup, addGroup, editGroup };
};
