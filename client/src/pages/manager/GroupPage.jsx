import {
    Box,
    Heading,
    Text,
    VStack,
    Spinner,
    Flex,
    Button,
    IconButton,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { formatSlotTime } from "@/utils/dateUtils";
  import { fetchTimeslotsByGroup } from "../../services/api";
  import { useParams, useNavigate } from "react-router-dom";
  import { FiEdit, FiTrash } from "react-icons/fi";
  import { toaster } from "@/components/ui/toaster";
  
  const ManagerGroupPage = () => {
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
        } catch (err) {
          console.error("Failed to fetch timeslots", err);
          toaster.error("Failed to load timeslots");
        } finally {
          setLoading(false);
        }
      };
  
      fetchTimeslots();
    }, [groupId]);
  
    const handleViewDetails = (slotId) => {
        navigate(`/manager/timeslots/${slotId}`);
    };      
  
    const handleCreateTimeslot = () => {
      navigate(`/manager/timeslots/new?groupId=${groupId}`);
    };
  
    const handleEditTimeslot = (slotId) => {
      navigate(`/manager/timeslots/${slotId}/edit`);
    };
  
    const handleBackToGroups = () => {
      navigate("/manager/groups");
    };
  
    return (
      <Box px={6} py={8} maxW="5xl" mx="auto">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Timeslots</Heading>
          <Flex gap={3}>
            <Button onClick={handleCreateTimeslot} colorScheme="blue">
              Create Timeslot
            </Button>
            <Button onClick={handleBackToGroups} variant="outline">
              Back to Groups
            </Button>
          </Flex>
        </Flex>
        
        {loading ? (
          <Flex justify="center" py={8}>
            <Spinner size="xl" />
          </Flex>
        ) : (
          <VStack spacing={4} align="stretch">
            {timeslots.length === 0 ? (
              <Text>No timeslots available for this group.</Text>
            ) : (
              timeslots.map((slot) => (
                <Box key={slot._id} p={4} borderWidth="1px" borderRadius="md">
                  <Flex justify="space-between">
                    <Box>
                      <Heading size="md">{slot.name}</Heading>
                      <Text color="gray.600">
                        {formatSlotTime(slot.start)} - {formatSlotTime(slot.end)}
                      </Text>
                      <Text mt={2}>Location: {slot.location || "Not specified"}</Text>
                    </Box>
                    <Flex>
                      <IconButton
                        icon={<FiEdit />}
                        aria-label="Edit timeslot"
                        variant="ghost"
                        onClick={() => handleEditTimeslot(slot._id)}
                        mr={2}
                      />
                    </Flex>
                  </Flex>
                  <Flex mt={4} gap={4}>
                    <Button
                      colorScheme="blue"
                      onClick={() => handleViewDetails(slot._id)}
                    >
                      View Queue
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
  
  export default ManagerGroupPage;
  