// src/components/manager/CreateGroup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupForm from '../ui/GroupForm';
import { useGroups } from '../../hooks/useGroups';

const CreateGroup = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addGroup } = useGroups();
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            // Add the current user ID to the group data
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            const groupWithUser = {
                ...formData,
                userId: userData.id // This should match how your backend expects it
            };
            
            await addGroup(groupWithUser);
            navigate('/manager');
        } catch (error) {
            console.error('Failed to create group:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Create New Consultation Group</h1>
                <GroupForm onSubmit={handleSubmit} isLoading={isSubmitting} />
            </div>
        </div>
    );
};

export default CreateGroup;
