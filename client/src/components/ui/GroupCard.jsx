// src/components/ui/GroupCard.jsx
import { Link } from 'react-router-dom';
import TimeslotCard from './TimeslotCard';
import { formatSlotTime } from '../../utils/dateUtils';

const GroupCard = ({ group }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{group.name}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{group.description}</p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{group.location || 'Not specified'}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Maximum Capacity</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{group.maxUsers}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(group.createdAt)}</dd>
                    </div>
                </dl>
            </div>

            {/* Associated Timeslots Section */}
            <div className="px-4 py-5 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-4">Scheduled Timeslots</h4>
                <div className="space-y-4">
                    {group.timeslots?.length > 0 ? (
                        group.timeslots.map(slot => (
                            <TimeslotCard 
                                key={slot._id}
                                slot={{
                                    ...slot,
                                    startTime: formatSlotTime(slot.start),
                                    endTime: formatSlotTime(slot.end)
                                }}
                            />
                        ))
                    ) : (
                        <div className="text-center py-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">No timeslots scheduled yet</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-2">
                <Link
                    to={`/manager/group/edit/${group._id}`}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                    Edit Group
                </Link>
                <Link
                    to={`/manager/timeslots/${group._id}`}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                    Manage Timeslots
                </Link>
            </div>
        </div>
    );
};

export default GroupCard;