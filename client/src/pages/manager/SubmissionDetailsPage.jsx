// src/pages/manager/SubmissionDetailsPage.jsx
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Link,
  Badge,
  Stack,
  Button,
  Table,
} from "@chakra-ui/react";
import { API_URL, fetchSubmissionDetailsByUser } from "../../services/api";

const ManagerSubmissionDetailsPage = () => {
  const { slotId, userId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSubmission = async () => {
      try {
        setLoading(true);
        const data = await fetchSubmissionDetailsByUser(slotId, userId);
        setSubmission(data);
      } catch (error) {
        console.error("Failed to load submission:", error);
        setError("No submission found for this user");
      } finally {
        setLoading(false);
      }
    };
    loadSubmission();
  }, [slotId, userId]);

  const handleBackToQueue = () => {
    navigate(`/manager/timeslots/${slotId}`);
  };

  if (loading) return (
    <Box textAlign="center" py={8}>
      <Spinner size="xl" />
    </Box>
  );

  if (error || !submission) return (
    <Box p={6} maxW="7xl" mx="auto">
      <Stack spacing={6}>
        <Heading size="lg">Submission Details</Heading>
        <Text>{error || "No submission found for this user"}</Text>
        <Button 
          colorScheme="blue" 
          onClick={handleBackToQueue}
          width="fit-content"
        >
          Back to Queue
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Box p={6} maxW="7xl" mx="auto">
      <Stack spacing={6}>
        <Heading size="lg">Submission Details</Heading>

        <Box>
          <Badge colorScheme="blue" fontSize="md" mb={2}>
            Status: {submission.status}
          </Badge>
          <Text fontSize="sm" color="gray.500">
            Submitted on {new Date(submission.createdAt).toLocaleString()}
          </Text>
        </Box>

        <Table.Root variant="simple">
          <Table.Body>
            <Table.Row>
              <Table.Cell as="th" width="200px" fontWeight="bold">
                Consultation Date
              </Table.Cell>
              <Table.Cell>
                {new Date(submission.slot.start).toLocaleDateString()}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell as="th" fontWeight="bold">Timeslot</Table.Cell>
              <Table.Cell>
                {new Date(submission.slot.start).toLocaleTimeString()} -{" "}
                {new Date(submission.slot.end).toLocaleTimeString()}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell as="th" fontWeight="bold">Main Concerns</Table.Cell>
              <Table.Cell whiteSpace="pre-wrap">
                {submission.concerns}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell as="th" fontWeight="bold">Objectives</Table.Cell>
              <Table.Cell whiteSpace="pre-wrap">
                {submission.objectives}
              </Table.Cell>
            </Table.Row>

            {submission.attachments?.length > 0 && (
              <Table.Row>
                <Table.Cell as="th" fontWeight="bold">Documents</Table.Cell>
                <Table.Cell>
                  {submission.attachments.map((file, index) => (
                    <Link
                      key={index}
                      href={`${API_URL}/preconsultations/${submission._id}/${index}`}
                      isExternal
                      color="blue.500"
                      display="block"
                      mb={1}
                    >
                      {file.name}
                    </Link>
                  ))}
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>

        <Button 
          colorScheme="blue" 
          onClick={handleBackToQueue}
          width="fit-content"
        >
          Back to Queue
        </Button>
      </Stack>
    </Box>
  );
};

export default ManagerSubmissionDetailsPage;
