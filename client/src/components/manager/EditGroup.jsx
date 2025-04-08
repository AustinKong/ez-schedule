// src/components/manager/EditGroup.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GroupForm from '../ui/GroupForm';
import { useGroups } from '../../hooks/useGroups';

const EditGroup = () => {
    const [group, setGroup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams();
    const { getGroup, editGroup } = useGroups();
    const navigate = useNavigate();

    useEffect(() => {
        const loadGroup = async () => {
            setIsLoading(true);
            try {
                const groupData = await getGroup(id);
                setGroup(groupData);
            } catch (error) {
                console.error('Failed to load group:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadGroup();
    }, [id, getGroup]);

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            await editGroup(id, formData);
            navigate('/manager');
        } catch (error) {
            console.error('Failed to update group:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center py-8">Loading...</div>;
    if (!group) return <div className="text-center py-8">Group not found</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Edit Consultation Group</h1>
                <GroupForm group={group} onSubmit={handleSubmit} isLoading={isSubmitting} />
            </div>
        </div>
    );
};

export default EditGroup;
