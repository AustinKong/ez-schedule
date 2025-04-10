// src/components/manager/QueueManagement.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import QueueDisplay from '../ui/QueueDisplay';
import { useQueue } from '../../hooks/useQueue';
import { getSlotDetails, advanceQueue, closeSlot } from '../../services/api';
import { formatSlotTime, isSlotActive } from '../../utils/dateUtils';
import { toaster } from '../ui/toaster';

const QueueManagement = () => {
    const { id: slotId } = useParams();
    const { user } = useAuth();
    const [slot, setSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const {
        queue,
        queueStatus,
        loadQueue,
        callNext,
        markServed
    } = useQueue(slotId);

    // Prepare queue data for display
    const [queueData, setQueueData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        currentNumber: null,
        currentUser: null,
        waitingCount: 0,
        waitingUsers: []
    });

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const slotData = await getSlotDetails(slotId);
                
                // Verify host ownership
                if(slotData.host !== user?.id) {
                    toaster.error('Unauthorized access to slot');
                    return;
                }
                
                setSlot(slotData);
                await loadQueue();
            } catch (error) {
                console.error('Failed to load data:', error);
                toaster.error('Failed to load queue data');
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData();
        
        // Set up polling to refresh queue data
        const interval = setInterval(() => {
            loadQueue();
        }, 30000);
        
        return () => clearInterval(interval);
    }, [slotId, user?.id, loadQueue]);

    // Update queue data whenever queue changes
    useEffect(() => {
        if (slot && queue) {
            const currentUser = queue[0]; // First entry is being served
            setQueueData({
                date: formatSlotTime(slot.start),
                startTime: slot.start,
                endTime: slot.end,
                currentNumber: currentUser?.queueNumber || null,
                currentUser: currentUser,
                waitingCount: queue.length,
                waitingUsers: queue
            });
        }
    }, [queue, slot]);

    const handleStartQueue = async () => {
        try {
            // No explicit "start" needed - queue starts when first user joins
            toaster.info('Queue starts automatically with first participant');
        } catch (error) {
            toaster.error('Failed to start queue');
        }
    };

    const handleCallNext = async () => {
        try {
            await advanceQueue(slotId);
            await loadQueue();
            toaster.success('Called next participant successfully');
        } catch (error) {
            toaster.error('Failed to advance queue');
        }
    };

    const handleCloseSlot = async () => {
        try {
            await closeSlot(slotId);
            await loadQueue();
            toaster.success('Slot closed successfully');
        } catch (error) {
            toaster.error('Failed to close slot');
        }
    };

    if (isLoading) return <div className="text-center py-8">Loading queue data...</div>;
    if (!slot) return <div className="text-center py-8">Slot not found or unauthorized</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{slot.name}</h1>
                        <p className="text-gray-600">
                            {formatSlotTime(slot.start)} - {formatSlotTime(slot.end)}
                        </p>
                    </div>
                    <Link 
                        to="/manager"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Back to Dashboard
                    </Link>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded">
                        <p className="font-semibold">Location:</p>
                        <p>{slot.location || 'Not specified'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                        <p className="font-semibold">Status:</p>
                        <p>{isSlotActive(slot) ? 'Active' : 'Closed'}</p>
                    </div>
                </div>
            </div>
            
            <QueueDisplay
                queueData={queueData}
                queueStatus={isSlotActive(slot) ? 'active' : 'closed'}
                onStartSession={handleStartQueue}
                onCallNext={handleCallNext}
                onEndSession={handleCloseSlot}
            />

            {!slot.isClosed && (
                <div className="mt-6 text-center">
                    <button
                        onClick={handleCloseSlot}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
                    >
                        Close Slot Early
                    </button>
                </div>
            )}
        </div>
    );
};

export default QueueManagement;