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

  const handleCloseSlot = async () => {
    try {
      await closeSlot(slotId);
      await loadQueue();
      navigate("/manager/slots");
    } catch (error) {
      console.error("Failed to close slot:", error);
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
          <Text>{isSlotActive(slot) ? "Active" : "Closed"}</Text>
        </Box>
      </Flex>

      <Box borderRadius="lg" boxShadow="md" mb={6}>
        <Flex direction={{ base: "column", md: "row" }} p={6} gap={6}>
          <Box>
            <Heading size="md" mb={2}>
              Queue Information
            </Heading>
            <Text>Date: {formatDate(queueData.date)}</Text>
            <Text>
              Timeslot: {formatTime(queueData.startTime)} -{" "}
              {formatTime(queueData.endTime)}
            </Text>
          </Box>

          <Box borderRadius="lg" p={6} textAlign="center" minW="200px">
            <Text fontSize="4xl" fontWeight="bold" color="blue.600" mb={2}>
              {queueData.currentNumber || "No one"}
            </Text>
            <Text color="gray.600" mb={4}>
              Current Queue Number
            </Text>
            <Text fontSize="lg" fontWeight="medium">
              {queueData.waitingCount} users waiting
            </Text>
          </Box>
        </Flex>

        <HStack
          spacing={4}
          px={6}
          py={4}
          justify="center"
          borderTop="1px solid"
          borderColor="gray.200"
        >
          {!slot.isClosed && (
            <Button
              colorScheme="blue"
              onClick={handleCallNext}
              isDisabled={queueData.waitingCount === 0}
            >
              Call Next
            </Button>
          )}
          {!slot.isClosed && queueData.currentUser && (
            <Button colorScheme="red" onClick={handleCloseSlot}>
              End Session
            </Button>
          )}
        </HStack>

        {queueData.waitingUsers.length > 0 && (
          <Box px={6} py={4}>
            <Heading size="sm" mb={4}>
              Waiting Users
            </Heading>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Queue #</Table.ColumnHeader>
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {queueData.waitingUsers.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.queueNumber}</Table.Cell>
                    <Table.Cell>{user.name}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </Box>

      {!slot.isClosed && (
        <Box textAlign="center">
          <Button colorScheme="red" size="lg" onClick={handleCloseSlot}>
            Close Slot Early
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default QueuePage;
