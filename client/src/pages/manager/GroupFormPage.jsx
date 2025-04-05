// src/pages/manager/GroupFormPage.jsx
import { useParams } from 'react-router-dom';
import CreateGroup from '../../components/manager/CreateGroup';
import EditGroup from '../../components/manager/EditGroup';

const GroupFormPage = () => {
    const { id } = useParams();
    
    return (
        <div className="min-h-screen bg-gray-100">
            {id ? <EditGroup /> : <CreateGroup />}
        </div>
    );
};

export default GroupFormPage;
