// src/hooks/useQueue.jsx
import { useState } from 'react';
import {
    fetchQueueByTimeslot,
    startQueue,
    pauseQueue,
    callNextUser,
    markUserAsServed
} from '../services/api';

export const useQueue = (timeslotId) => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [queueStatus, setQueueStatus] = useState('inactive');

    const loadQueue = async () => {
        try {
            setLoading(true);
            const data = await fetchQueueByTimeslot(timeslotId);
            setQueue(data.users || []);
            setQueueStatus(data.status || 'inactive');
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const start = async () => {
        try {
            await startQueue(timeslotId);
            setQueueStatus('active');
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const pause = async () => {
        try {
            await pauseQueue(timeslotId);
            setQueueStatus('paused');
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const callNext = async () => {
        try {
            const result = await callNextUser(timeslotId);
            await loadQueue(); // Refresh queue after calling next
            return result;
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    const markServed = async (userId) => {
        try {
            await markUserAsServed(timeslotId, userId);
            setQueue(queue.filter(user => user.id !== userId));
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    return {
        queue,
        loading,
        error,
        queueStatus,
        loadQueue,
        start,
        pause,
        callNext,
        markServed
    };
};
