import { useEffect, useState } from "react";
import { 
  Box, 
  Heading, 
  VStack, 
  Text, 
  Badge, 
  Spinner, 
  Flex,
  Alert,
} from "@chakra-ui/react";
import { useTimeslots } from "@/hooks/useTimeslots";
import { format, parseISO } from "date-fns";

const UserNotificationsPage = () => {
  const { timeslots, loading } = useTimeslots();
  const [userNotifications, setUserNotifications] = useState([]);

  useEffect(() => {
    if (timeslots.length > 0) {
      const notifications = timeslots.flatMap(slot => {
        return slot.entries
          .filter(entry => entry.status === 'notified' || entry.status === 'pending')
          .map(entry => ({
            slotName: slot.name,
            position: entry.queuePosition,
            status: entry.status,
            time: format(parseISO(slot.start), "d MMM yyyy, h:mm a")
          }));
      });
      setUserNotifications(notifications);
    }
  }, [timeslots]);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>Your Queue Positions</Heading>

      <VStack spacing={4} align="stretch">
        {userNotifications.length === 0 && (
          <Alert status="info" borderRadius="md">
            No queue position notifications
          </Alert>
        )}

        {userNotifications.map((notification, index) => (
          <Box 
            key={index}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg={notification.status === 'notified' ? "green.50" : "blue.50"}
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Heading size="md">{notification.slotName}</Heading>
                <Text mt={2}>
                  Your position: {notification.position}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Updated at: {notification.time}
                </Text>
              </Box>
              <Badge 
                colorScheme={notification.status === 'notified' ? "green" : "blue"}
                px={3}
                py={1}
              >
                {notification.status === 'notified' ? "Current" : "Waiting"}
              </Badge>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default UserNotificationsPage;