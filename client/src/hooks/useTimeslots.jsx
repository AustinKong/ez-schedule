import { useState, useEffect } from "react";
import {
  fetchHostTimeslots,
  fetchTimeslot,
  createTimeslot,
  updateTimeslot,
} from "../services/api";

export const useTimeslots = () => {
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTimeslots = async () => {
    try {
      setLoading(true);
      const data = await fetchHostTimeslots();
      setTimeslots(data);
      console.log(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTimeslot = async (id) => {
    try {
      const data = await fetchTimeslot(id);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const addTimeslot = async (timeslotData) => {
    try {
      const newTimeslot = await createTimeslot(timeslotData);
      setTimeslots((prev) => [...prev, newTimeslot]);
      setError(null);
      return newTimeslot;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const editTimeslot = async (id, timeslotData) => {
    try {
      const updatedTimeslot = await updateTimeslot(id, timeslotData);
      setTimeslots((prev) =>
        prev.map((t) => (t._id === id ? updatedTimeslot : t))
      );
      setError(null);
      return updatedTimeslot;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    loadTimeslots();
  }, []);

  return {
    timeslots,
    loading,
    error,
    loadTimeslots,
    getTimeslot,
    addTimeslot,
    editTimeslot,
  };
};
