import { useGroups } from "../../hooks/useGroups";
import { useTimeslots } from "../../hooks/useTimeslots";
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  Flex,
  Center,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const MainPage = () => {
  const { groups, loading: groupsLoading, error: groupsError } = useGroups();
  const {
    timeslots,
    loading: slotsLoading,
    error: slotsError,
  } = useTimeslots();
  return (
    <Box minH="100vh">
      <Box mb={12}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h2" size="lg" color="gray.900">
            Consultation Groups
          </Heading>
          <Button
            as={RouterLink}
            to="/manager/group/create"
            colorScheme="blue"
            fontWeight="bold"
          >
            Create New Group
          </Button>
        </Flex>

        {groupsLoading ? (
          <Center py={8}>
            <Text>Loading groups...</Text>
          </Center>
        ) : groupsError ? (
          <Center py={8}>
            <Text color="red.500">Error: {groupsError}</Text>
          </Center>
        ) : groups.length === 0 ? (
          <Center py={12} bg="white" shadow="md" rounded="lg">
            <Text color="gray.500">No consultation groups found</Text>
          </Center>
        ) : (
          <Stack spacing={6}>
            {groups.map((group) => (
              <GroupCard key={group._id} group={group} />
            ))}
          </Stack>
        )}
      </Box>

      {/* Timeslots Section */}
      <Box mb={12}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h2" size="lg" color="gray.900">
            Consultation Timeslots
          </Heading>
          <Button
            as={RouterLink}
            to="/manager/timeslot/create"
            colorScheme="green"
            fontWeight="bold"
          >
            Create New Timeslot
          </Button>
        </Flex>

        {slotsLoading ? (
          <Center py={8}>
            <Text>Loading timeslots...</Text>
          </Center>
        ) : slotsError ? (
          <Center py={8}>
            <Text color="red.500">Error: {slotsError}</Text>
          </Center>
        ) : timeslots.length === 0 ? (
          <Center py={12} bg="white" shadow="md" rounded="lg">
            <Text color="gray.500">No timeslots found in selected group</Text>
          </Center>
        ) : (
          <Stack spacing={6}>
            {timeslots.map((slot) => (
              <TimeslotCard key={slot._id} slot={slot} />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MainPage;
