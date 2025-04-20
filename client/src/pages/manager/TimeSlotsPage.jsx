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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash } from "react-icons/fi";
import { format } from "date-fns";
import { useTimeslots } from "@/hooks/useTimeslots"; // adjust path
import { Toaster, toaster } from "@/components/ui/toaster";
import { fetchGroup } from "../../services/api";



const TimeSlotsPage = () => {
  const { timeslots, loadTimeslots, removeTimeslot } = useTimeslots();
  const [groupNames, setGroupNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTimeslots();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      console.log("Timeslots:", timeslots);
      try {
        // Fetch group names for each timeslot
        const names = {};
        for (const slot of timeslots) {
          const group = await fetchGroup(slot.groupId);
          console.log(group);
          names[slot._id] = group?.name || 'No Group Assigned';
        }
        setGroupNames(names);
      } catch (err) {
        console.error("Error fetching timeslots or groups:", err);
        setError("Failed to load timeslots.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [timeslots]);

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

  const handleDelete = (id, event) => {
    // event.stopPropagation(); // Prevent navigation when delete is clicked
     
     if (window.confirm("Are you sure you want to delete this group?")) {
      removeTimeslot(id)
         .then(() => {
           toaster.success({
             title: "Group deleted.",
             description: "The group has been successfully deleted.",
           });
           loadTimeslots();
         })
         .catch((error) => {
           toaster.error({
             title: "Error deleting group.",
             description: error.message || "An error occurred.",
           });
         });
     }
   };

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
        <Toaster />
        {timeslots.length === 0 && <Text>No timeslots found.</Text>}
        {timeslots.map((slot) => (
          <Box key={slot._id} borderWidth="1px" borderRadius="md" p={4}>
            <HStack justify="space-between">
              <Box as={Link} to={`/manager/timeslots/${slot._id}`} flex="1">
                <Heading size="sm">
                  {format(new Date(slot.start), "d MMM yyyy, h:mm a")} –{" "}
                  {format(new Date(slot.end), "h:mm a")}
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Group: {groupNames[slot._id]}
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
                <IconButton
                  aria-label="Delete"
                  size="sm"
                  variant="ghost"
                  onClick={(e) => handleDelete(slot._id, e)}
                >
                  <FiTrash />
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
