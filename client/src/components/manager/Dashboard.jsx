// src/components/manager/Dashboard.jsx
import { Link } from 'react-router-dom';
import { useGroups } from '../../hooks/useGroups';
import { useTimeslots } from '../../hooks/useTimeslots';
import GroupCard from '../ui/GroupCard';
import TimeslotCard from '../ui/TimeslotCard';

const Dashboard = () => {
    const { groups, loading: groupsLoading, error: groupsError } = useGroups();
    const { timeslots, loading: slotsLoading, error: slotsError } = useTimeslots();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Groups Section */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Consultation Groups</h2>
                    <Link
                        to="/manager/group/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create New Group
                    </Link>
                </div>
                
                {groupsLoading ? (
                    <div className="text-center py-8">Loading groups...</div>
                ) : groupsError ? (
                    <div className="text-center py-8 text-red-500">Error: {groupsError}</div>
                ) : groups.length === 0 ? (
                    <div className="text-center py-12 bg-white shadow rounded-lg">
                        <p className="text-gray-500 mb-4">No consultation groups found</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {groups.map(group => (
                            <GroupCard key={group._id} group={group} />
                        ))}
                    </div>
                )}
            </div>

            {/* Timeslots Section */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Consultation Timeslots</h2>
                    <Link
                        to="/manager/timeslot/create"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create New Timeslot
                    </Link>
                </div>
                
                {slotsLoading ? (
                    <div className="text-center py-8">Loading timeslots...</div>
                ) : slotsError ? (
                    <div className="text-center py-8 text-red-500">Error: {slotsError}</div>
                ) : timeslots.length === 0 ? (
                    <div className="text-center py-12 bg-white shadow rounded-lg">
                        <p className="text-gray-500 mb-4">No timeslots found in selected group</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {timeslots.map(slot => (
                            <TimeslotCard key={slot._id} slot={slot} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;