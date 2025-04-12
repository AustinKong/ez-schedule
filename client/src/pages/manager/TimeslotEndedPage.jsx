// src/pages/manager/TimeslotEndedPage.jsx
import { useParams } from "react-router-dom";
import { useTimeslots } from "../../hooks/useTimeslots";
import { TimeslotStats } from "../ui";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";

const TimeslotEndedPage = () => {
  const { id } = useParams();
  const { getTimeslot } = useTimeslots();
  const [timeslot, setTimeslot] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatConsultationTime = (isoString) => {
    return isoString
      ? format(parseISO(isoString), "d MMM yyyy, h:mm a")
      : "N/A";
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTimeslot(id);
        setTimeslot(data);
      } catch (error) {
        console.error("Failed to load timeslot:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, getTimeslot]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!timeslot)
    return (
      <div className="flex justify-center items-center h-screen">
        Timeslot not found
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {timeslot.name}
          </h1>
          <p className="text-gray-600">
            {formatConsultationTime(timeslot.startTime)} -{" "}
            {formatConsultationTime(timeslot.endTime)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Singapore Standard Time (GMT+8)
          </p>
          <p className="text-gray-600 mt-2">Location: {timeslot.location}</p>
        </div>

        <TimeslotStats timeslot={timeslot} />

        <div className="mt-6 text-center space-y-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
            onClick={() => exportToCSV(timeslot)}
          >
            Download Consultation Report
          </button>
          <p className="text-sm text-gray-500">
            Includes participant list, wait times, and session notes
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeslotEndedPage;
