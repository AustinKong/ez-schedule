// src/components/manager/Dashboard.jsx
import { Link } from 'react-router-dom';
import { useGroups } from '../../hooks/useGroups';
import GroupCard from '../ui/GroupCard';

const Dashboard = () => {
    const { groups, loading, error } = useGroups();

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Consultation Groups</h1>
                <Link
                    to="/manager/group/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Create New Group
                </Link>
            </div>
            
            {groups.length === 0 ? (
                <div className="text-center py-12 bg-white shadow rounded-lg">
                    <p className="text-gray-500 mb-4">You don't have any consultation groups yet.</p>
                    <Link
                        to="/manager/group/create"
                        className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create Your First Group
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {groups.map(group => (
                        <GroupCard key={group._id} group={group} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
