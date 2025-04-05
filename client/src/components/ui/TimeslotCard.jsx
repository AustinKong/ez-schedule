// src/components/ui/TimeslotCard.jsx
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

const TimeslotCard = ({ timeslot }) => {
  const formatDateTime = (isoString) => {
    return isoString ? format(parseISO(isoString), 'dd MMM yyyy, h:mm a') : 'N/A';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">{timeslot.name}</h3>
        <p className="text-gray-600">{timeslot.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <span className="text-gray-500">Location:</span>
          <p className="text-gray-900">{timeslot.location}</p>
        </div>
        <div>
          <span className="text-gray-500">Status:</span>
          <p className={`font-medium ${
            timeslot.status === 'active' ? 'text-green-600' : 'text-gray-600'
          }`}>
            {timeslot.status}
          </p>
        </div>
        <div>
          <span className="text-gray-500">Starts:</span>
          <p className="text-gray-900">{formatDateTime(timeslot.startTime)}</p>
        </div>
        <div>
          <span className="text-gray-500">Ends:</span>
          <p className="text-gray-900">{formatDateTime(timeslot.endTime)}</p>
        </div>
      </div>
      <div className="mt-4 flex space-x-3">
        <Link
          to={`/manager/timeslot/edit/${timeslot.id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Edit
        </Link>
        <Link
          to={`/manager/timeslot/${timeslot.id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TimeslotCard;