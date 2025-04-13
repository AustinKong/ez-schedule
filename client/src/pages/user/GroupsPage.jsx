import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useGroups } from "@/hooks/useGroups";
import { Link } from "react-router-dom";

const UserGroupsPage = () => {
  const { groups } = useGroups();

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">My Groups</Heading>
      </Flex>

      <VStack spacing={4} align="stretch">
        {groups.length === 0 ? (
          <Text color="gray.500">You are not in any groups yet.</Text>
        ) : (
          groups.map((group) => (
            <Box
              key={group._id}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              as={Link}
              to={`/user/groups/${group._id}`}
              _hover={{ bg: "gray.50" }}
            >
              <Text fontWeight="bold" mb={1}>
                {group.name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {group.description}
              </Text>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default UserGroupsPage;
