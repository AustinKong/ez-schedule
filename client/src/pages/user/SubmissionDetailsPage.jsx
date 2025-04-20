// src/pages/user/SubmissionDetailsPage.jsx
import { useParams, Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Link,
  Badge,
  Stack,
  Table as ChakraTable, // renamed to avoid naming conflicts if needed
} from "@chakra-ui/react";
import { fetchSubmissionDetails } from "../../services/api";

const SubmissionDetailsPage = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubmission = async () => {
      try {
        const data = await fetchSubmissionDetails(id);
        setSubmission(data);
        console.log(data);
        console.log("Have submission", submission.attachments)
      } catch (error) {
        console.error("Failed to load submission:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSubmission();
  }, [id]);

  if (loading) return <Spinner size="xl" />;
  if (!submission) return <Text>Submission not found</Text>;
  

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

        <ChakraTable.Root variant="simple">
          {/* Header can be added if needed */}
          <ChakraTable.Body>
            <ChakraTable.Row>
              <ChakraTable.Cell as="th" width="200px">
                Consultation Date
              </ChakraTable.Cell>
              <ChakraTable.Cell>
                {new Date(submission.slot.start).toLocaleDateString()}
              </ChakraTable.Cell>
            </ChakraTable.Row>

            <ChakraTable.Row>
              <ChakraTable.Cell as="th">Timeslot</ChakraTable.Cell>
              <ChakraTable.Cell>
                {new Date(submission.slot.start).toLocaleTimeString()} -{" "}
                {new Date(submission.slot.end).toLocaleTimeString()}
              </ChakraTable.Cell>
            </ChakraTable.Row>

            <ChakraTable.Row>
              <ChakraTable.Cell as="th">Main Concerns</ChakraTable.Cell>
              <ChakraTable.Cell whiteSpace="pre-wrap">
                {submission.concerns}
              </ChakraTable.Cell>
            </ChakraTable.Row>

            <ChakraTable.Row>
              <ChakraTable.Cell as="th">Objectives</ChakraTable.Cell>
              <ChakraTable.Cell whiteSpace="pre-wrap">
                {submission.objectives}
              </ChakraTable.Cell>
            </ChakraTable.Row>

            {submission.attachments?.length > 0 && (
              <ChakraTable.Row>
                <ChakraTable.Cell as="th">Documents</ChakraTable.Cell>
                <ChakraTable.Cell>
                  {submission.attachments.map((file, index) => (
                    <Link
                      key={index}
                      href={`http://localhost:5000/api/preconsultation/${submission._id}/${index}`}
                      isExternal
                      color="blue.500"
                    >
                      {file.name}
                    </Link>
                  ))}
                </ChakraTable.Cell>
              </ChakraTable.Row>
            )}
          </ChakraTable.Body>
        </ChakraTable.Root>

        <Link as={RouterLink} to="/user/submissions" color="blue.500">
          &larr; Back to All Submissions
        </Link>
      </Stack>
    </Box>
  );
};

export default SubmissionDetailsPage;
