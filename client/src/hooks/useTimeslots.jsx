// src/hooks/useTimeslots.jsx
import { useState, useEffect } from 'react';
import { 
  fetchTimeslots, 
  fetchTimeslot, 
  createTimeslot, 
  updateTimeslot 
} from '../services/api';

export const useTimeslots = () => {
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTimeslots = async () => {
    try {
      setLoading(true);
      const data = await fetchTimeslots();
      setTimeslots(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTimeslot = async (id) => {
    try {
      setLoading(true);
      const data = await fetchTimeslot(id);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addTimeslot = async (timeslotData) => {
    try {
      setLoading(true);
      const newTimeslot = await createTimeslot(timeslotData);
      setTimeslots([...timeslots, newTimeslot]);
      setError(null);
      return newTimeslot;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editTimeslot = async (id, timeslotData) => {
    try {
      setLoading(true);
      const updatedTimeslot = await updateTimeslot(id, timeslotData);
      setTimeslots(timeslots.map(t => t.id === id ? updatedTimeslot : t));
      setError(null);
      return updatedTimeslot;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeslots();
  }, []);

  return { timeslots, loading, error, loadTimeslots, getTimeslot, addTimeslot, editTimeslot };
};