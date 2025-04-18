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
  AlertIcon
} from "@chakra-ui/react";
import { useTimeslots } from "@/hooks/useTimeslots";
import { format, parseISO, differenceInMinutes } from "date-fns";

const ManagerNotificationsPage = () => {
  const { timeslots, loading } = useTimeslots();
  const [queueNotifications, setQueueNotifications] = useState([]);

  useEffect(() => {
    if (timeslots.length > 0) {
      const notifications = timeslots.flatMap(slot => {
        return slot.entries
          .filter(entry => entry.status === 'notified')
          .map(entry => ({
            slotName: slot.name,
            user: entry.participant,
            position: 'host',
            time: format(parseISO(slot.start), "d MMM yyyy, h:mm a")
          }));
      });
      setQueueNotifications(notifications);
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
      <Heading size="lg" mb={6}>Queue Notifications</Heading>
      
      {queueNotifications.length === 0 && (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          No active queue notifications
        </Alert>
      )}

      <VStack spacing={4} align="stretch" mt={6}>
        {queueNotifications.map((notification, index) => (
          <Box 
            key={index}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg="blue.50"
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Heading size="md">{notification.slotName}</Heading>
                <Text mt={2}>User notified: {notification.user.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  Notification sent at: {notification.time}
                </Text>
              </Box>
              <Badge colorScheme="green" px={3} py={1}>
                User Notified
              </Badge>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ManagerNotificationsPage;