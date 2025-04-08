// src/components/ui/GroupForm.jsx
import { useState, useEffect } from 'react';

const GroupForm = ({ group = {}, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        maxUsers: 10,
        ...group
    });

    useEffect(() => {
        if (group  && group.id) {
            setFormData({
                name: group.name || '',
                description: group.description || '',
                maxUsers: group.maxUsers || 10,
            });
        }
    }, [group?.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium">Group Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
            <div>
                <label htmlFor="maxUsers" className="block text-sm font-medium">Maximum Users</label>
                <input
                    type="number"
                    id="maxUsers"
                    name="maxUsers"
                    value={formData.maxUsers}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                    {isLoading ? 'Saving...' : group._id ? 'Update Group' : 'Create Group'}
                </button>
            </div>
        </form>
    );
};

export default GroupForm;
