// src/components/ui/TimeslotStatusBadge.jsx
export const TimeslotStatusBadge = ({ status }) => {
    const statusColors = {
      upcoming: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      ended: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800',
    };
  
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        statusColors[status] || 'bg-gray-100 text-gray-800'
      }`}>
        {status}
      </span>
    );
  };