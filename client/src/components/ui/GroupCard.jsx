// src/components/ui/GroupCard.jsx
import { Link } from 'react-router-dom';

const GroupCard = ({ group }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };
    
    return (
        <div className="bg-white shadow rounded-lg p-6 mb-4">
            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                <p className="text-gray-600">{group.description}</p>
            </div>
            <div className="mb-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                        <dd className="mt-1 text-sm text-gray-900">{group.location}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(group.startTime)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">End Time</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(group.endTime)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Max Users</dt>
                        <dd className="mt-1 text-sm text-gray-900">{group.maxUsers}</dd>
                    </div>
                </dl>
            </div>
            <div className="flex space-x-4">
                <Link
                    to={`/manager/group/edit/${group.id}`}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Edit
                </Link>
                <Link
                    to={`/manager/queue/${group.id}`}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                    Manage Queue
                </Link>
            </div>
        </div>
    );
};

export default GroupCard;
