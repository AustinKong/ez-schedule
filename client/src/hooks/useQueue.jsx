// src/hooks/useQueue.jsx
import { useState } from 'react';
import { 
  getSlotDetails, 
  advanceQueue, 
  closeSlot 
} from '../services/api';
import { toaster } from '../../src/components/ui/toaster';
import { isSlotActive } from '../utils/dateUtils';
export const useQueue = (slotId) => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [slotStatus, setSlotStatus] = useState('inactive');

    const loadQueue = async () => {
        try {
            setLoading(true);
            const slotData = await getSlotDetails(slotId);
            
            setQueue(slotData.entries || []);
            setSlotStatus(slotData.isClosed ? 'closed' : isSlotActive(slotData) ? 'active' : 'inactive');
            setError(null);
        } catch (err) {
            setError(err.message);
            toaster.error('Failed to load queue data');
        } finally {
            setLoading(false);
        }
    };

    const callNext = async () => {
        try {
            await advanceQueue(slotId);
            await loadQueue(); // Refresh queue after advancing
            toaster.success('Queue advanced successfully');
            return true;
        } catch (err) {
            setError(err.message);
            toaster.error('Failed to advance queue');
            return false;
        }
    };

    const closeQueue = async () => {
        try {
            await closeSlot(slotId);
            setSlotStatus('closed');
            await loadQueue(); // Refresh final state
            toaster.success('Queue closed successfully');
            return true;
        } catch (err) {
            setError(err.message);
            toaster.error('Failed to close queue');
            return false;
        }
    };

    return {
        queue,
        loading,
        error,
        queueStatus: slotStatus,
        loadQueue,
        callNext,
        closeQueue,
        // Removed unused actions
    };
};