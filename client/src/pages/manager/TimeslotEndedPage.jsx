// src/pages/manager/TimeslotEndedPage.jsx
import { useParams } from 'react-router-dom';
import { useTimeslots } from '../../hooks/useTimeslots';

const TimeslotEndedPage = () => {
  const { id } = useParams();
  const { getTimeslot } = useTimeslots();
  const [timeslot, setTimeslot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTimeslot(id);
        setTimeslot(data);
      } catch (error) {
        console.error('Failed to load timeslot:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, getTimeslot]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!timeslot) return <div className="flex justify-center items-center h-screen">Timeslot not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Timeslot Ended</h1>
        <p className="text-gray-600 mb-4">
          The timeslot "{timeslot.name}" has ended. Here are the final statistics:
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">Total Participants</p>
            <p className="text-2xl">{timeslot.participants?.length || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">Average Wait Time</p>
            <p className="text-2xl">{(timeslot.avgWaitTime || 0).toFixed(1)} mins</p>
          </div>
        </div>

        <p className="text-gray-600">Thank you for using our system!</p>
      </div>
    </div>
  );
};

export default TimeslotEndedPage;