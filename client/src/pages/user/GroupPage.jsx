// THIS IS THE LIST OF TIMESLOTS FOR A GROUP, WHICH IS ACCESSED AFTER CLICKING ON THE GROUPSPAGE.JSX WHICH ITSELF IS A LIST OF GROUPS
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { leaveGroup } from "@/services/api";
import { formatSlotTime } from "@/utils/dateUtils";
import { fetchTimeslotsByGroup } from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

const GroupPage = () => {
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id: groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTimeslots = async () => {
      setLoading(true);
      try {
        const data = await fetchTimeslotsByGroup(groupId);
        setTimeslots(data);
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch timeslots", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeslots();
  }, [groupId]);

  const handleViewDetails = (slotId) => {
    navigate(`/user/timeslots/${slotId}/queue`);
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(groupId);
      navigate("/user/groups");
    } catch (err) {
      console.error("Failed to leave group", err);
    }
  };

  return (
    <Box px={6} py={8} maxW="5xl" mx="auto">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Available Consultations</Heading>
        <Button onClick={handleLeaveGroup} colorScheme="red">
          Leave Group
        </Button>
      </Flex>
      
      {loading ? (
        <Flex justify="center" py={8}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <VStack spacing={4} align="stretch">
          {timeslots.length === 0 ? (
            <Text>No open consultations available right now.</Text>
          ) : (
            timeslots.map((slot) => (
              <Box key={slot._id} p={4} borderWidth="1px" borderRadius="md">
                <Heading size="md">{slot.name}</Heading>
                <Text color="gray.600">
                  {formatSlotTime(slot.start)} - {formatSlotTime(slot.end)}
                </Text>
                <Text mt={2}>Location: {slot.location || "Not specified"}</Text>
                <Flex mt={4} gap={4}>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleViewDetails(slot._id)}
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={() =>
                      navigate(`/user/timeslots/${slot._id}/preconsultation`)
                    }
                  >
                    Fill Pre-Consultation Form
                  </Button>
                </Flex>
              </Box>
            ))
          )}
        </VStack>
      )}
    </Box>
  );
};

export default GroupPage;
