import { useState, useEffect } from 'react';
import { 
  fetchHostTimeslots, // Changed from fetchTimeslotsByGroup
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
      // Use the host-specific endpoint that doesn't require group ID
      const data = await fetchHostTimeslots();
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
      // Use direct timeslot endpoint instead of group-based
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

export const fetchHostTimeslots = async () => {
  const response = await fetch('/api/slots/host', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return handleResponse(response);
};