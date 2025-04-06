// src/components/ui/TimeslotStats.jsx
export const TimeslotStats = ({ timeslot }) => {
  const durationMinutes = Math.round(
    (new Date(timeslot.endTime) - new Date(timeslot.startTime)) / 60000
  );

  const stats = [
    { label: 'Total Participants', value: timeslot.participants?.length || 0 },
    { label: 'Avg. Consultation Time', value: `${timeslot.avgDuration?.toFixed(1) || 0} mins` },
    { label: 'Total Duration', value: `${durationMinutes} mins` },
    { label: 'Max Attendance', value: timeslot.maxConcurrent || 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-50 p-3 rounded-lg">
          <dt className="text-sm font-medium text-gray-600">{stat.label}</dt>
          <dd className="mt-1 text-lg font-semibold text-gray-900">{stat.value}</dd>
        </div>
      ))}
    </div>
  );
};