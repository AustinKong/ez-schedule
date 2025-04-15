// src/pages/user/SubmissionsListPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, Thead, Tbody, Tr, Th, Td, 
  Box, Heading, Spinner, Text, Input, 
  Select, Stack, HStack, Flex 
} from '@chakra-ui/react';
import { fetchSubmissions } from '../../services/api';
import { format, parseISO } from 'date-fns';

const SubmissionsListPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const response = await fetch('/api/preconsultations/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map(sub => ({
            ...sub,
            concerns: sub.text?.concerns || '',
            objectives: sub.text?.objectives || '',
            createdAt: sub.createdAt,
            status: sub.status || 'pending'
          }));
          setSubmissions(formattedData);
        }
      } catch (err) {
        setError('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };
    loadSubmissions();
  }, []);

  useEffect(() => {
    const filterAndSortSubmissions = () => {
      let result = [...submissions];

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        result = result.filter(sub => 
          sub.concerns.toLowerCase().includes(lowerQuery) ||
          sub.objectives.toLowerCase().includes(lowerQuery) ||
          sub.status.toLowerCase().includes(lowerQuery)
        );
      }

      // Sorting
      result.sort((a, b) => {
        const dateA = parseISO(a.createdAt);
        const dateB = parseISO(b.createdAt);
        return sortOrder === 'newest' ? 
          dateB - dateA : dateA - dateB;
      });

      setFilteredSubmissions(result);
    };

    filterAndSortSubmissions();
  }, [searchQuery, sortOrder, submissions]);

  return (
    <Box p={6} maxW="7xl" mx="auto">
      <Heading size="lg" mb={6}>My Pre-Consultation Submissions</Heading>

      <Stack spacing={4} mb={6}>
        <Flex gap={4} direction={['column', 'row']}>
          <Input
            placeholder="Search by concerns, objectives, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
          />
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            width={['100%', '200px']}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </Select>
        </Flex>
        <Text fontSize="sm" color="gray.500">
          Showing {filteredSubmissions.length} submissions
        </Text>
      </Stack>

      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : filteredSubmissions.length === 0 ? (
        <Text>No submissions found matching your criteria</Text>
      ) : (
        <Table variant="striped" size="md">
          <Thead bg="gray.50">
            <Tr>
              <Th>Date Submitted</Th>
              <Th>Consultation Time</Th>
              <Th>Main Concerns</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredSubmissions.map((submission) => (
              <Tr key={submission._id}>
                <Td>
                  {format(parseISO(submission.createdAt), 'dd MMM yyyy')}
                </Td>
                <Td>
                  {format(parseISO(submission.slot.start), 'HH:mm')} - {' '}
                  {format(parseISO(submission.slot.end), 'HH:mm')}
                </Td>
                <Td maxW="300px" isTruncated title={submission.concerns}>
                  {submission.concerns}
                </Td>
                <Td>
                  <Box
                    as="span"
                    px={2}
                    py={1}
                    borderRadius="md"
                    bg={
                      submission.status === 'reviewed' ? 'green.100' :
                      submission.status === 'pending' ? 'orange.100' : 'gray.100'
                    }
                    color={
                      submission.status === 'reviewed' ? 'green.800' :
                      submission.status === 'pending' ? 'orange.800' : 'gray.800'
                    }
                  >
                    {submission.status}
                  </Box>
                </Td>
                <Td>
                  <Link 
                    to={`/user/submissions/${submission._id}`}
                    color="blue.500"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    View
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default SubmissionsListPage;