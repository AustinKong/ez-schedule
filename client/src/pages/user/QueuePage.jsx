import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Separator,
  Badge,
  Spinner,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { getSlotDetails, joinQueue, fetchQueueByTimeslot, fetchTimeslot } from "../../services/api";
import { formatSlotTime, isSlotActive } from "../../utils/dateUtils";
import { toaster } from "../../components/ui/toaster";

const QueuePage = () => {
  const { id: slotId } = useParams();
  const navigate = useNavigate();
  
  // Manage all states locally
  const [queue, setQueue] = useState([]);
  const [slot, setSlot] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [queueStatus, setQueueStatus] = useState("inactive");
  const [waitingCount, setWaitingCount] = useState(0);

  // Load slot details and queue data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch slot details
        const slotData = await getSlotDetails(slotId);
        setSlot(slotData);
        
        // Determine queue status based on slot data
        const status = slotData.isClosed ? "closed" : isSlotActive(slotData) ? "active" : "inactive";
        setQueueStatus(status);
        
        // Fetch queue data
        await fetchQueueData();
      } catch (error) {
        console.error("Failed to load data:", error);
        toaster.error("Failed to load slot details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling to refresh queue data
    const interval = setInterval(() => {
      fetchQueueData();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [slotId]);

  // Separate function to fetch queue data using the existing API function
  const fetchQueueData = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });
    if (!response.ok) {
      navigate("/user/login");
      return;
    }
    const user = await response.json();

    try {
      // Use the existing API function from services/api.js
      const timeslotData = await fetchTimeslot(slotId);
      const queueData = timeslotData.entries;
      setQueue(queueData);
      setWaitingCount(queueData.length);
      
      // Check if current user is in queue
      if (user && queueData.length > 0) {
        const userInQueue = queueData.find(entry => 
          entry.participant._id === user._id || entry.participant === user._id
        );
        
        setHasJoined(!!userInQueue);
        
        if (userInQueue) {
          // Find position (how many people in front)
          const position = queueData.findIndex(entry => 
            entry.participant._id === user._id || entry.participant === user._id
          );
          
          setUserPosition(position);
        } else {
          setUserPosition(null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch queue data:", error);
    }
  };

  const handleJoinQueue = async () => {
    setIsJoining(true);
    try {
      await joinQueue(slotId);
      await fetchQueueData();
      toaster.success("Successfully joined the queue");
    } catch (error) {
      console.error("Failed to join queue:", error);
      toaster.error("Failed to join queue");
    } finally {
      setIsJoining(false);
    }
  };

  if (loading && !slot) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!slot) {
    return (
      <Box textAlign="center" p={8}>
        <Text>Slot not found or you don't have access to view it.</Text>
        <Button mt={4} onClick={() => navigate(-1)}>
          Back to Consultations
        </Button>
      </Box>
    );
  }

  return (
    <Box px={6} py={8} maxW="1000px" mx="auto">
      <Heading as="h1" size="lg" mb={2}>
        {slot.name}
      </Heading>
      <Text color="gray.600" mb={6}>
        {formatSlotTime(slot.start)} - {formatSlotTime(slot.end)}
      </Text>

      <Flex 
        gap={4} 
        mb={8} 
        direction={{ base: "column", md: "row" }}
      >
        <Box flex={1} p={4} borderRadius="md">
          <Text fontWeight="semibold">Location:</Text>
          <Text>{slot.location || "Not specified"}</Text>
        </Box>
        <Box flex={1} p={4} borderRadius="md">
          <Text fontWeight="semibold">Status:</Text>
          <Text color={queueStatus === "active" ? "green.500" : queueStatus === "closed" ? "red.500" : "yellow.500"}>
            {queueStatus === "active" ? "Active" : queueStatus === "closed" ? "Closed" : "Inactive"}
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
                {new Date(slot.start).toLocaleDateString()}
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
                {new Date(slot.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                {new Date(slot.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Text>
            </VStack>
            
            <Flex 
              flex="1" 
              justify="center" 
              align="center" 
              gap={8}
            >
              <VStack align="center" spacing={1}>
                <Text color="gray.600" fontSize="md">Queue Position</Text>
                <Text 
                  fontSize="4xl" 
                  fontWeight="bold" 
                  color="blue.600"
                >
                  {hasJoined ? userPosition + 1 : "-"}
                </Text>
              </VStack>
              
              <VStack align="center" spacing={1}>
                <Text color="gray.600" fontSize="md">Users In Queue</Text>
                <Text 
                  fontSize="4xl" 
                  fontWeight="bold" 
                  color="blue.600"
                >
                  {waitingCount}
                </Text>
              </VStack>
            </Flex>
            
            <Box minW="150px" />
          </Flex>
        </Box>
      </Box>
      
      <Box textAlign="center" mt={6}>
        <HStack spacing={4} justify="center">
          {!hasJoined && (
            <Button
              variant="outline"
              colorScheme="blue"
              isLoading={isJoining}
              loadingText="Joining..."
              onClick={handleJoinQueue}
              isDisabled={queueStatus !== "active"}
            >
              Join Queue
            </Button>
          )}
          
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back to Consultations
          </Button>
        </HStack>
        
        {queueStatus !== "active" && (
          <Text color="red.500" mt={4} textAlign="center">
            {queueStatus === "closed" 
              ? "This slot is closed and not accepting new entries." 
              : "This slot is not active yet."}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default QueuePage;
