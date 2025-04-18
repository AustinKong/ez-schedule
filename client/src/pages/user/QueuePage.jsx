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
import { getSlotDetails, joinQueue, leaveQueue, fetchQueueByTimeslot, fetchTimeslot } from "../../services/api";
import { formatSlotTime, isSlotActive } from "../../utils/dateUtils";
import { toaster } from "../../components/ui/toaster";

const QueuePage = () => {
  const { id: slotId } = useParams();
  const navigate = useNavigate();
  
  // Manage all state locally
  const [queue, setQueue] = useState([]);
  const [slot, setSlot] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const [userQueueNumber, setUserQueueNumber] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [queueStatus, setQueueStatus] = useState("inactive");
  const [waitingCount, setWaitingCount] = useState(0);
  const [currentQueueNumber, setCurrentQueueNumber] = useState("No one");

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
      
      // Set current queue number - Fix for Issue #2
      if (queueData.length > 0) {
        setCurrentQueueNumber(queueData[0].queueNumber || 1);
      } else {
        setCurrentQueueNumber("No one");
      }
      
      // Check if current user is in queue - Fix for Issue #1 and #3
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
          // Fix for Issue #1: Use the actual queue number from the entry
          setUserQueueNumber(position + 1); // Queue numbers start at 1
        } else {
          setUserPosition(null);
          setUserQueueNumber(null);
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

  // Fix for Issue #4: Add leave queue functionality
  const handleLeaveQueue = async () => {
    setIsLeaving(true);
    try {
      await leaveQueue(slotId);
      await fetchQueueData();
      setHasJoined(false);
      setUserPosition(null);
      setUserQueueNumber(null);
      toaster.success("Successfully left the queue");
    } catch (error) {
      console.error("Failed to leave queue:", error);
      toaster.error("Failed to leave queue");
    } finally {
      setIsLeaving(false);
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
        <Button mt={4} onClick={() => navigate("/user/groups")}>
          Back to Groups
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
        <Box flex={1} p={4} borderRadius="md" bg="gray.50">
          <Text fontWeight="semibold" color="gray.800">Location:</Text>
          <Text color="gray.800">{slot.location || "Not specified"}</Text>
        </Box>
        <Box flex={1} p={4} borderRadius="md" bg="gray.50">
          <Text fontWeight="semibold" color="gray.800">Status:</Text>
          <Badge 
            colorScheme={queueStatus === "active" ? "green" : queueStatus === "closed" ? "red" : "yellow"}
          >
            {queueStatus === "active" ? "Active" : queueStatus === "closed" ? "Closed" : "Inactive"}
          </Badge>
        </Box>
      </Flex>

      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        overflow="hidden" 
        boxShadow="md"
      >
        <Box bg="blue.50" p={6}>
          <Heading size="md" mb={4} textAlign="center" color="gray.800">
            Queue Information
          </Heading>
          
          <Flex 
            direction={{ base: "column", md: "row" }} 
            justify="space-between" 
            align="center" 
            gap={6}
          >
            <VStack align="flex-start" spacing={2}>
              <Text color="gray.600">Date:</Text>
              <Text fontWeight="medium" color="gray.800">
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
            
            <VStack align="center" spacing={2}>
              <Text color="gray.600">Current Queue Number</Text>
              <Text 
                fontSize="4xl" 
                fontWeight="bold" 
                color="blue.600"
              >
                {currentQueueNumber}
              </Text>
              <Text color="gray.600" mt={2}>
                {waitingCount} users waiting
              </Text>
            </VStack>
          </Flex>
        </Box>
        
        <Separator />
        
        <Box p={6} bg="white">
          <VStack spacing={6}>
            <HStack spacing={12} w="full" justify="center">
              <VStack align="center">
                <Text color="gray.600">Your Queue Number</Text>
                <Text 
                  fontSize="2xl" 
                  fontWeight="bold" 
                  color={hasJoined ? "green.500" : "gray.800"}
                >
                  {userQueueNumber || "-"}
                </Text>
              </VStack>
              
              <VStack align="center">
                <Text color="gray.600">People in Front of You</Text>
                <Text 
                  fontSize="2xl" 
                  fontWeight="bold" 
                  color={hasJoined ? "blue.500" : "gray.800"}
                >
                  {hasJoined ? userPosition : "-"}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </Box>
      
      {/* Modified button section to hide button after joining */}
      <Box textAlign="center" mt={6}>
        <HStack spacing={4} justify="center">
          {!hasJoined ? (
            <Button
              variant="outline"
              isLoading={isJoining}
              loadingText="Joining..."
              onClick={handleJoinQueue}
              isDisabled={queueStatus !== "active"}
            >
              Join Queue
            </Button>
          ) : null}
          
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
