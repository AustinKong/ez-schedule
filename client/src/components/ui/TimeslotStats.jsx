// src/components/ui/TimeslotStats.jsx
export const TimeslotStats = ({ timeslot }) => {
    const stats = [
      { label: 'Total Participants', value: timeslot.participants?.length || 0 },
      { label: 'Average Wait Time', value: `${timeslot.avgWaitTime?.toFixed(1) || 0} mins` },
      { label: 'Max Concurrent Users', value: timeslot.maxConcurrent || 0 },
      { label: 'Completion Rate', value: `${timeslot.completionRate || 0}%` },
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <dt className="text-sm font-medium text-gray-600">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</dd>
          </div>
        ))}
      </div>
    );
  };