import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  VStack,
  Collapsible,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiTrash,
  FiShare2,
} from "react-icons/fi";
import { useGroups } from "@/hooks/useGroups";
import { useState } from "react";
import { Link } from "react-router-dom";

const GroupsPage = () => {
  const { groups, deleteGroup } = useGroups(); // Assuming deleteGroup is available in useGroups
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      deleteGroup(id)
        .then(() => {
          toaster.success({
            title: "Group deleted.",
            description: "The group has been successfully deleted.",
          });
        })
        .catch((error) => {
          toaster.error({
            title: "Error deleting group.",
            description: error.message || "An error occurred.",
          });
        });
    }
  };

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Groups</Heading>
        <Button as={Link} to="/manager/groups/new">
          Create New Group
        </Button>
      </Flex>

      <VStack spacing={4} align="stretch">
        {groups.map((group) => (
          <Collapsible.Root key={group._id} open={expandedId === group._id}>
            <Box borderWidth="1px" borderRadius="md" p={4}>
              <Flex justify="space-between" align="center">
                <Text fontWeight="bold">{group.name}</Text>
                <Flex gap={2}>
                  <IconButton
                    aria-label="Edit"
                    size="sm"
                    variant="ghost"
                    as={Link}
                    to={`/manager/groups/${group._id}/edit`}
                  >
                    <FiEdit />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(group._id)}
                  >
                    <FiTrash />
                  </IconButton>
                  <IconButton
                    aria-label="Share"
                    size="sm"
                    variant="ghost"
                    as={Link}
                    to={`/manager/groups/${group._id}/share`}
                  >
                    <FiShare2 />
                  </IconButton>
                  <Collapsible.Trigger
                    as={IconButton}
                    onClick={() => toggle(group._id)}
                    aria-label="Toggle group info"
                    size="sm"
                    variant="ghost"
                  >
                    {expandedId === group._id ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </Collapsible.Trigger>
                </Flex>
              </Flex>

              <Collapsible.Content>
                <Box mt={2} fontsize="sm">
                  <Text>ID: {group._id}</Text>
                  <Text>Created at: {group.createdAt}</Text>
                  <Text>Description: {group.description}</Text>
                  <Text>Max users: {group.maxUsers}</Text>
                </Box>
              </Collapsible.Content>
            </Box>
          </Collapsible.Root>
        ))}
      </VStack>
    </Box>
  );
};

export default GroupsPage;
