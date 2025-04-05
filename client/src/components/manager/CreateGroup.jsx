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
            await addGroup(formData);
            navigate('/manager');
        } catch (error) {
            console.error('Failed to create group:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Consultation Group</h1>
                <GroupForm onSubmit={handleSubmit} isLoading={isSubmitting} />
            </div>
        </div>
    );
};

export default CreateGroup;
