// src/components/ui/GroupForm.jsx
import { useState, useEffect } from 'react';

const GroupForm = ({ group = {}, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        maxUsers: '',
        ...group
    });

    useEffect(() => {
        if (group && group.id) {  // Only run when group ID changes
          setFormData({
            name: group.name || '',
            description: group.description || '',
            startTime: group.startTime || '',
            endTime: group.endTime || '',
            location: group.location || '',
            maxStudents: group.maxStudents || '',
          });
        }
      }, [group?.id]);  // Only depend on the ID      

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
                <div>
                    <label htmlFor="startTime" className="block text-sm font-medium">Start Time</label>
                    <input
                        type="datetime-local"
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium">End Time</label>
                    <input
                        type="datetime-local"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium">Location</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
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
                    {isLoading ? 'Saving...' : group.id ? 'Update Group' : 'Create Group'}
                </button>
            </div>
        </form>
    );
};

export default GroupForm;
