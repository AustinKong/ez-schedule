import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Spinner,
  Table,
  Center,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSlotDetails, advanceQueue, closeSlot } from "@/services/api";
import { useQueue } from "@/hooks/useQueue";
import { formatSlotTime, isSlotActive } from "@/utils/dateUtils";

const QueuePage = () => {
  const { id: slotId } = useParams();
  const navigate = useNavigate();

  const [slot, setSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { queue, loadQueue } = useQueue(slotId);

  const [queueData, setQueueData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    currentNumber: null,
    currentUser: null,
    waitingCount: 0,
    waitingUsers: [],
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const slotData = await getSlotDetails(slotId);
        setSlot(slotData);
        await loadQueue();
      } catch (error) {
        console.error("Failed to load queue data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    const interval = setInterval(() => loadQueue(), 30000);
    return () => clearInterval(interval);
  }, [slotId]);

  useEffect(() => {
    if (slot && queue) {
      const currentUser = queue[0];
      setQueueData({
        date: formatSlotTime(slot.start),
        startTime: slot.start,
        endTime: slot.end,
        currentNumber: currentUser?.queueNumber || null,
        currentUser,
        waitingCount: queue.length,
        waitingUsers: queue.map(entry => ({
          id: entry._id,
          userId: entry.participant._id || entry.participant, // Make sure userId is available
          name: entry.participant.username,
          queueNumber: entry.queueNumber,
        })),
      });
    }
  }, [queue, slot]);  

  const handleCallNext = async () => {
    try {
      await advanceQueue(slotId);
      await loadQueue();
    } catch (error) {
      console.error("Failed to advance queue:", error);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!slot) {
    return (
      <Box textAlign="center" py={8}>
        <Text fontSize="lg">Slot not found or unauthorized</Text>
      </Box>
    );
  }

  return (
    <Box px={6} py={8} maxW="6xl" mx="auto">
      <Flex justify="space-between" mb={6} align="center">
        <Box>
          <Heading size="lg">{slot.name}</Heading>
          <Text color="gray.600">
            {formatSlotTime(slot.start)} - {formatSlotTime(slot.end)}
          </Text>
        </Box>
      </Flex>

      <Flex gap={4} mb={8} direction={{ base: "column", md: "row" }}>
      <Box flex={1} p={4} borderRadius="md">
        <Text fontWeight="semibold">Location:</Text>
        <Text>{slot.location || "Not specified"}</Text>
      </Box>
      <Box flex={1} p={4} borderRadius="md">
        <Text fontWeight="semibold">Status:</Text>
        <Text 
          color={isSlotActive(slot) ? "green.500" : "red.500"}
          fontWeight="medium"
        >
          {isSlotActive(slot) ? "Active" : "Inactive"}
        </Text>
      </Box>

      </Flex>

      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        overflow="hidden" 
        boxShadow="md"
      >
        <Box p={6}>
          <Heading size="md" mb={4} textAlign="center">
            Queue Information
          </Heading>
          
          <Flex 
            direction={{ base: "column", md: "row" }} 
            justify="space-between"
            align="center"
            gap={4}
          >
            <VStack align="flex-start" spacing={2} minW="150px">
              <Text color="gray.600">Date:</Text>
              <Text fontWeight="medium">
                {formatDate(queueData.date)}
              </Text>
              
              <Text color="gray.600" mt={2}>Timeslot:</Text>
              <Text 
                fontWeight="medium" 
                color="white"
                bg="black"
                px={2}
                py={1}
                borderRadius="md"
              >
                {formatTime(queueData.startTime)} - {formatTime(queueData.endTime)}
              </Text>
            </VStack>
            
            <Flex 
              flex="1" 
              justify="center" 
              align="center" 
              gap={8}
            >
              
              <VStack align="center" spacing={1}>
                <Text color="gray.600" fontSize="md">Users In Queue</Text>
                <Text 
                  fontSize="4xl" 
                  fontWeight="bold" 
                  color="blue.600"
                >
                  {queueData.waitingCount}
                </Text>
              </VStack>
            </Flex>
            
            <Box minW="150px" />
          </Flex>
        </Box>

        {queueData.waitingUsers.length > 0 && (
          <Box px={6} py={4}>
            <Center mb={4}>
              <Heading size="md" textAlign="center">
                Waiting Users
              </Heading>
            </Center>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader fontWeight="bold">Position</Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold">Name</Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {queueData.waitingUsers.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.queueNumber}</Table.Cell>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => navigate(`/manager/timeslots/${slotId}/submissions/${user.userId || user.participant}`)}
                      >
                        View
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </Box>

      {!slot.isClosed && (
        <Box textAlign="center" mt={6}>
          <HStack spacing={4} justify="center">
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Back to Timeslots
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleCallNext}
              isDisabled={queueData.waitingCount === 0}
            >
              Call Next
            </Button>
          </HStack>
        </Box>
      )}
    </Box>
  );
};

export default QueuePage;
