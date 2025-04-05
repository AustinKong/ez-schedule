// src/components/ui/QueueDisplay.jsx
import { useState } from 'react';

const QueueDisplay = ({ queueData, onStartSession, onCallNext, onEndSession, queueStatus }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Queue Information</h3>
          <p className="mt-2">Date: {formatDate(queueData.date)}</p>
          <p>Timeslot: {formatTime(queueData.startTime)} - {formatTime(queueData.endTime)}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-indigo-600">{queueData.currentNumber || 'No one'}</div>
          <p className="text-gray-500">Current Queue Number</p>
          <div className="mt-2 text-lg font-semibold">{queueData.waitingCount} users waiting</div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        {queueStatus === 'inactive' && (
          <button
            onClick={onStartSession}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Queue
          </button>
        )}
        
        {queueStatus === 'active' && !queueData.currentUser && (
          <button
            onClick={onCallNext}
            disabled={queueData.waitingCount === 0}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              queueData.waitingCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Call Next
          </button>
        )}
        
        {queueStatus === 'active' && queueData.currentUser && (
          <button
            onClick={onEndSession}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            End Session
          </button>
        )}
      </div>
      
      {queueData.waitingUsers && queueData.waitingUsers.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-2">Waiting Users</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Queue #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {queueData.waitingUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.queueNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueDisplay;
