import { useState, useEffect } from "react";
import {
  fetchGroups,
  fetchGroup,
  createGroup,
  updateGroup,
  deleteGroup as deleteGroupApi,
} from "../services/api";

export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await fetchGroups();
      setGroups(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const getGroup = async (id) => {
    try {
      const data = await fetchGroup(id);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch group");
      return null;
    }
  };

  const addGroup = async (groupData) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const groupWithUser = { ...groupData, userId: userData.id };
      const newGroup = await createGroup(groupWithUser);
      setGroups((prev) => [...prev, newGroup]);
      setError(null);
      return newGroup;
    } catch (err) {
      setError(err.message || "Failed to create group");
      return null;
    }
  };

  const editGroup = async (id, groupData) => {
    try {
      const updatedGroup = await updateGroup(id, groupData);
      setGroups((prev) =>
        prev.map((group) => (group.id === id ? updatedGroup : group))
      );
      setError(null);
      return updatedGroup;
    } catch (err) {
      setError(err.message || "Failed to update group");
      return null;
    }
  };

  const deleteGroup = async (id) => {
    try {
      await deleteGroupApi(id);
      setGroups((prev) => prev.filter((group) => group.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to delete group");
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  return {
    groups,
    loading,
    error,
    loadGroups,
    getGroup,
    addGroup,
    editGroup,
    deleteGroup,
  };
};
