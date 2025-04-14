import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  Flex,
  Field,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { joinGroup } from "@/services/api";
import { fetchGroupById } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

const JoinGroupsPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [group, setGroup] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setJoining(true);
    try {
      const response = await joinGroup(id, code);
      // Assuming response.data contains the returned group info with name & description
      setGroup(response.data);
      navigate("/user/groups");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to join group");
    }
  };

  useEffect(() => {
    fetchGroupById(id)
      .then((groupData) => {
        if (groupData) {
          setGroup(groupData);
        } else {
          setError("Invalid group code");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch group data");
      });
  }, [id]);

  return (
    <Flex align="center" justify="center">
      <Box p={6} borderWidth="1px" borderRadius="lg" maxW="sm" w="full">
        <Heading size="md" mb={4} textAlign="center">
          Join a group
        </Heading>

        {group && (
          <VStack spacing={4} align="stretch">
            <Text textAlign="center" fontWeight="bold" fontSize="lg">
              {group.name}
            </Text>
            {group.description && (
              <Text textAlign="center">{group.description}</Text>
            )}
          </VStack>
        )}
        <VStack spacing={4} align="stretch" mt={4}>
          <Field.Root required>
            <Field.Label>
              6-digit Code <Field.RequiredIndicator />
            </Field.Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              maxLength={6}
            />
            {error && (
              <Text fontSize="sm" color="red.500" mt={1}>
                {error}
              </Text>
            )}
          </Field.Root>

          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={joining}
            w="full"
          >
            Join Group
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default JoinGroupsPage;
