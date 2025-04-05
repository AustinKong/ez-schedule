// src/pages/manager/TimeslotDetailsPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useTimeslots } from '../../hooks/useTimeslots';
import QueueManagement from '../manager/QueueManagement';
import { isWithinInterval } from 'date-fns';

const TimeslotDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTimeslot } = useTimeslots();
  const [timeslot, setTimeslot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const loadData = async () => {
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
    
    loadData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [id, getTimeslot, navigate]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!timeslot) return <div className="flex justify-center items-center h-screen">Timeslot not found</div>;

  const isActive = isWithinInterval(currentTime, {
    start: new Date(timeslot.startTime),
    end: new Date(timeslot.endTime)
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{timeslot.name}</h1>
        <p className="text-gray-600">{timeslot.description}</p>
        <p className="text-gray-600">
          {new Date(timeslot.startTime).toLocaleString()} - 
          {new Date(timeslot.endTime).toLocaleString()}
        </p>
        <p className="text-gray-600">Location: {timeslot.location}</p>
      </div>

      {isActive ? (
        <QueueManagement groupId={timeslot.groupId} />
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Queue management is only available during the timeslot</h2>
          <p>Current time: {currentTime.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default TimeslotDetailsPage;