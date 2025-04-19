// src/pages/user/SubmissionsListPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Heading,
  Spinner,
  Text,
  Input,
  Select,
  Stack,
  Flex,
  Table,
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { API_URL } from "../../services/api";

const SubmissionsListPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const response = await fetch(`${API_URL}/preconsultations/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map((sub) => ({
            ...sub,
            concerns: sub.concerns || "",
            objectives: sub.objectives || "",
            createdAt: sub.createdAt,
            status: sub.status || "pending",
          }));
          setSubmissions(formattedData);
        }
      } catch (err) {
        setError("Failed to load submissions");
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
        result = result.filter(
          (sub) =>
            sub.concerns.toLowerCase().includes(lowerQuery) ||
            sub.objectives.toLowerCase().includes(lowerQuery) ||
            sub.status.toLowerCase().includes(lowerQuery)
        );
      }

      // Sorting
      result.sort((a, b) => {
        const dateA = parseISO(a.createdAt);
        const dateB = parseISO(b.createdAt);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });

      setFilteredSubmissions(result);
    };

    filterAndSortSubmissions();
  }, [searchQuery, sortOrder, submissions]);

  return (
    <Box p={6} maxW="7xl" mx="auto">
      <Heading size="lg" mb={6}>
        My Pre-Consultation Submissions
      </Heading>

      <Stack spacing={4} mb={6}>
        <Flex gap={4} direction={["column", "row"]}>
          <Input
            placeholder="Search by concerns, objectives, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
          />
          {/* <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            width={["100%", "200px"]}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </Select> */}
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
        <Table.Root variant="striped" size="md">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Date Submitted</Table.ColumnHeader>
              <Table.ColumnHeader>Consultation Time</Table.ColumnHeader>
              <Table.ColumnHeader>Main Concerns</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredSubmissions.map((submission) => (
              <Table.Row key={submission._id}>
                <Table.Cell>
                  {format(parseISO(submission.createdAt), "dd MMM yyyy")}
                </Table.Cell>
                <Table.Cell>
                  {format(parseISO(submission.slot.start), "HH:mm")} -{" "}
                  {format(parseISO(submission.slot.end), "HH:mm")}
                </Table.Cell>
                <Table.Cell
                  maxW="300px"
                  isTruncated
                  title={submission.concerns}
                >
                  {submission.concerns}
                </Table.Cell>
                <Table.Cell>
                  <Box
                    as="span"
                    px={2}
                    py={1}
                    borderRadius="md"
                    bg={
                      submission.status === "reviewed"
                        ? "green.100"
                        : submission.status === "pending"
                        ? "orange.100"
                        : "gray.100"
                    }
                    color={
                      submission.status === "reviewed"
                        ? "green.800"
                        : submission.status === "pending"
                        ? "orange.800"
                        : "gray.800"
                    }
                  >
                    {submission.status}
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/user/submissions/${submission._id}`}
                    style={{ color: "blue" }}
                  >
                    View
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
};

export default SubmissionsListPage;
