// src/pages/manager/TimeslotDetailsPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useTimeslots } from "../../hooks/useTimeslots";
import QueueManagement from "../manager/QueueManagement";
import { isWithinInterval, format, parseISO } from "date-fns";
import { TimeslotStatusBadge, TimeslotStats } from "../ui";
import { useEffect, useState } from "react";

const TimeslotDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTimeslot } = useTimeslots();
  const [timeslot, setTimeslot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

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
        navigate("/manager");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [id, getTimeslot, navigate]);

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

  const isActive = isWithinInterval(currentTime, {
    start: parseISO(timeslot.startTime),
    end: parseISO(timeslot.endTime),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {timeslot.name}
            </h1>
            <TimeslotStatusBadge
              status={isActive ? "active" : "ended"}
              className="mt-2"
            />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Location: {timeslot.location}
            </p>
            <p className="text-sm text-gray-500">SGT Timezone</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">
              <span className="font-medium">Starts:</span>{" "}
              {formatConsultationTime(timeslot.startTime)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Ends:</span>{" "}
              {formatConsultationTime(timeslot.endTime)}
            </p>
          </div>
          <TimeslotStats timeslot={timeslot} />
        </div>

        {isActive ? (
          <QueueManagement groupId={timeslot.groupId} />
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">
              Consultation Session Has Ended
            </h2>
            <p className="text-gray-600">
              {formatConsultationTime(timeslot.endTime)} - Singapore Time
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeslotDetailsPage;
