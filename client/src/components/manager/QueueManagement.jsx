// src/components/manager/QueueManagement.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QueueDisplay from '../ui/QueueDisplay';
import { useQueue } from '../../hooks/useQueue';
import { useGroups } from '../../hooks/useGroups';

const QueueManagement = () => {
    const { id } = useParams(); // This is now the timeslotId, not groupId
    const [timeslot, setTimeslot] = useState(null);
    const [group, setGroup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { getTimeslot, getGroupByTimeslot } = useGroups();
    const {
        queue,
        queueStatus,
        loadQueue,
        start,
        pause,
        callNext,
        markServed
    } = useQueue(id); // Using timeslotId for queue operations

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
                const timeslotData = await getTimeslot(id);
                setTimeslot(timeslotData);
                
                // Get the group this timeslot belongs to
                const groupData = await getGroupByTimeslot(id);
                setGroup(groupData);
                
                await loadQueue();
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData();
        
        // Set up polling to refresh queue data
        const interval = setInterval(() => {
            loadQueue();
        }, 30000); // Refresh every 30 seconds
        
        return () => clearInterval(interval);
    }, [id, getTimeslot, getGroupByTimeslot, loadQueue]);

    // Update queue data whenever queue or timeslot changes
    useEffect(() => {
        if (timeslot && queue) {
            const currentUser = queue.find(user => user.status === 'serving');
            setQueueData({
                date: new Date(timeslot.startTime).toLocaleDateString(),
                startTime: timeslot.startTime,
                endTime: timeslot.endTime,
                currentNumber: currentUser ? currentUser.queueNumber : null,
                currentUser: currentUser,
                waitingCount: queue.filter(user => user.status === 'waiting').length,
                waitingUsers: queue.filter(user => user.status === 'waiting')
            });
        }
    }, [queue, timeslot]);

    const handleStartQueue = async () => {
        await start();
        loadQueue();
    };

    const handleCallNext = async () => {
        await callNext();
        loadQueue();
    };

    const handleEndSession = async () => {
        if (queueData.currentUser) {
            await markServed(queueData.currentUser.id);
            loadQueue();
        }
    };

    if (isLoading) return <div className="text-center py-8">Loading...</div>;
    if (!timeslot) return <div className="text-center py-8">Timeslot not found</div>;
    if (!group) return <div className="text-center py-8">Group not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold mb-2">{group.name} - Queue Management</h1>
                    <Link 
                        to={`/manager/timeslots/${group._id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Back to Timeslots
                    </Link>
                </div>
                <p className="text-gray-600">{group.description}</p>
                <p className="text-gray-600 mt-2">
                    <span className="font-semibold">Timeslot:</span> {new Date(timeslot.startTime).toLocaleTimeString()} - {new Date(timeslot.endTime).toLocaleTimeString()}
                </p>
                <p className="text-gray-600">
                    <span className="font-semibold">Capacity:</span> {timeslot.capacity} users
                </p>
            </div>
            
            <QueueDisplay
                queueData={queueData}
                queueStatus={queueStatus}
                onStartSession={handleStartQueue}
                onCallNext={handleCallNext}
                onEndSession={handleEndSession}
            />
        </div>
    );
};

export default QueueManagement;
