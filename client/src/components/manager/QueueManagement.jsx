// src/components/manager/QueueManagement.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QueueDisplay from '../ui/QueueDisplay';
import { useQueue } from '../../hooks/useQueue';
import { useGroups } from '../../hooks/useGroups';

const QueueManagement = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { getGroup } = useGroups();
    const {
        queue,
        queueStatus,
        loadQueue,
        start,
        pause,
        callNext,
        markServed
    } = useQueue(id);
    
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
                const groupData = await getGroup(id);
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
    }, [id, getGroup, loadQueue]);
    
    // Update queue data whenever queue or group changes
    useEffect(() => {
        if (group && queue) {
            const currentUser = queue.find(user => user.status === 'serving');
            
            setQueueData({
                date: group.startTime,
                startTime: group.startTime,
                endTime: group.endTime,
                currentNumber: currentUser ? currentUser.queueNumber : null,
                currentUser: currentUser,
                waitingCount: queue.filter(user => user.status === 'waiting').length,
                waitingUsers: queue.filter(user => user.status === 'waiting')
            });
        }
    }, [queue, group]);

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

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!group) return <div className="flex justify-center items-center h-screen">Group not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{group.name} - Queue Management</h1>
                <p className="text-gray-600">{group.description}</p>
                <p className="text-gray-600">Location: {group.location}</p>
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
