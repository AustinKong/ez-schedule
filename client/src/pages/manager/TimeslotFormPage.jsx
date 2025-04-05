// src/pages/manager/TimeslotFormPage.jsx
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import TimeslotForm from '../../components/manager/TimeslotForm'; 
import { useTimeslots } from '../../hooks/useTimeslots';

const TimeslotFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTimeslot, addTimeslot, editTimeslot } = useTimeslots();
  const [timeslot, setTimeslot] = useState(null);
  const [loading, setLoading] = useState(!id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const loadTimeslot = async () => {
        try {
          const data = await getTimeslot(id);
          setTimeslot(data);
        } catch (error) {
          console.error('Failed to load timeslot:', error);
          navigate('/manager');
        } finally {
          setLoading(false);
        }
      };
      loadTimeslot();
    }
  }, [id, getTimeslot, navigate]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await editTimeslot(id, formData);
      } else {
        await addTimeslot(formData);
      }
      navigate('/manager');
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {id ? 'Edit Timeslot' : 'Create New Timeslot'}
        </h1>
        <TimeslotForm 
          timeslot={timeslot} 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default TimeslotFormPage;