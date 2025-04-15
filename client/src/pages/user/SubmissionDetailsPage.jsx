// src/pages/user/SubmissionDetailsPage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Box, Heading, Text, Spinner, Link, Badge, Stack, 
  Table, Thead, Tbody, Tr, Th, Td 
} from '@chakra-ui/react';
import { fetchSubmissionDetails } from '../../services/api';

const SubmissionDetailsPage = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubmission = async () => {
      try {
        const data = await fetchSubmissionDetails(id);
        setSubmission(data);
      } catch (error) {
        console.error('Failed to load submission:', error);
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

        <Table variant="simple">
          <Tbody>
            <Tr>
              <Th width="200px">Consultation Date</Th>
              <Td>{new Date(submission.slot.start).toLocaleDateString()}</Td>
            </Tr>
            <Tr>
              <Th>Timeslot</Th>
              <Td>
                {new Date(submission.slot.start).toLocaleTimeString()} -{' '}
                {new Date(submission.slot.end).toLocaleTimeString()}
              </Td>
            </Tr>
            <Tr>
              <Th>Main Concerns</Th>
              <Td whiteSpace="pre-wrap">{submission.concerns}</Td>
            </Tr>
            <Tr>
              <Th>Objectives</Th>
              <Td whiteSpace="pre-wrap">{submission.objectives}</Td>
            </Tr>
            {submission.attachments?.length > 0 && (
            <Tr>
                <Th>Documents</Th>
                <Td>
                {submission.attachments.map((file, index) => (
                    <Link 
                    key={index}
                    href={`/api/files/${file.path}`} 
                    isExternal
                    color="blue.500"
                    >
                    {file.originalname}
                    </Link>
                ))}
                </Td>
            </Tr>
            )}
          </Tbody>
        </Table>

        <Link to="/user/submissions" color="blue.500">
          &larr; Back to All Submissions
        </Link>
      </Stack>
    </Box>
  );
};

export default SubmissionDetailsPage;