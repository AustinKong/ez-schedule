import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  HStack,
  IconButton,
  Badge,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { format } from "date-fns";
import { useTimeslots } from "@/hooks/useTimeslots"; // adjust path

const TimeSlotsPage = () => {
  const { timeslots, loading, error, loadTimeslots } = useTimeslots();

  useEffect(() => {
    loadTimeslots();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <HStack justify="space-between" mb={4}>
        <Heading size="lg">My Consultation Timeslots</Heading>
        <Button colorScheme="blue" as={Link} to="/manager/timeslots/new">
          Create New
        </Button>
      </HStack>

      {error && (
        <Text color="red.500" fontSize="sm" mb={4}>
          {error}
        </Text>
      )}

      <VStack spacing={4} align="stretch">
        {timeslots.length === 0 && <Text>No timeslots found.</Text>}
        {timeslots.map((slot) => (
          <Box
            key={slot._id}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            bg={slot.isClosed ? "gray.100" : "white"}
          >
            <HStack justify="space-between">
              <Box as={Link} to={`/manager/timeslots/${slot._id}`} flex="1">
                <Heading size="sm">
                  {format(new Date(slot.start), "d MMM yyyy, h:mm a")} –{" "}
                  {format(new Date(slot.end), "h:mm a")}
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Slot ID: {slot._id}
                </Text>
              </Box>
              <HStack>
                <Badge colorScheme={slot.isClosed ? "red" : "green"}>
                  {slot.isClosed ? "Closed" : "Open"}
                </Badge>
                <IconButton
                  as={Link}
                  to={`/manager/timeslots/${slot._id}/edit`}
                  aria-label="Edit slot"
                  size="sm"
                  variant="ghost"
                >
                  <FiEdit />
                </IconButton>
              </HStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default TimeSlotsPage;
