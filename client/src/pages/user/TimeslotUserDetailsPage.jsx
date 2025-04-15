import { useParams, useNavigate, Link } from "react-router-dom";
import { useTimeslots } from "../../hooks/useTimeslots";
import QueueManagement from "../user/QueuePage";
import { isWithinInterval, format, parseISO } from "date-fns";
import { TimeslotStatusBadge } from "../../components/ui/TimeslotStatusBadge";
import { TimeslotStats } from "../../components/ui/TimeslotStats";
import { useEffect, useState } from "react";
import { Badge } from "@chakra-ui/react";
import { fetchSubmissions } from "../../services/api";

const TimeslotUserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTimeslot } = useTimeslots();
  const [timeslot, setTimeslot] = useState(null);
  const [submissionExists, setSubmissionExists] = useState(false);
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
        const timeslotData = await getTimeslot(id);
        setTimeslot(timeslotData);
        
        const response = await fetch(`/api/preconsultations/slot/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const submission = await response.json();
          setSubmissionExists(!!submission);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);
  
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
            <div className="mt-2 space-y-2">
              <TimeslotStatusBadge
                status={isActive ? "active" : "ended"}
              />
              {submissionExists && (
                <Badge 
                  colorScheme="green" 
                  fontSize="md" 
                  px={2} 
                  py={1} 
                  borderRadius="md"
                >
                  Pre-Consultation Submitted
                </Badge>
              )}
            </div>
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
          <>
            <QueueManagement groupId={timeslot.groupId} />
            <div className="mt-6 text-center space-y-4">
              {!submissionExists && (
                <Link
                  to={`/user/slots/${id}/preconsultation`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Complete Pre-Consultation Form
                </Link>
              )}
              {submissionExists && (
                <Link
                  to={`/user/submissions`}
                  className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  View All Submissions
                </Link>
              )}
            </div>
          </>
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

export default TimeslotUserDetailsPage;