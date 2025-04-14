import {
  Box,
  Heading,
  Text,
  Flex,
  Spinner,
  Center,
  VStack,
  QrCode,
  Clipboard,
  IconButton,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGroupById } from "@/services/api";

const ShareGroupsPage = () => {
  const { id: groupId } = useParams();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await fetchGroupById(groupId);
        setGroup(data);
      } catch (err) {
        console.error("Failed to fetch group data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const joinUrl = `${window.location.origin}/user/groups/${groupId}/join`;

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!group) {
    return (
      <Box textAlign="center" mt={10}>
        <Text>Unable to load group information.</Text>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg">
      <Heading size="lg" mb={4}>
        Share Group
      </Heading>
      <Text mb={6}>
        Ask users to scan this QR code or enter the 6-digit code below to join
        this group.
      </Text>

      <Center mb={6}>
        <QrCode.Root value={joinUrl} size="2xl">
          <QrCode.Frame>
            <QrCode.Pattern />
          </QrCode.Frame>
        </QrCode.Root>
      </Center>

      <VStack spacing={6} align="center">
        <VStack spacing={1} align="center">
          <Text fontSize="sm" color="gray.500">
            6-digit code:
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {group.password}
          </Text>
        </VStack>

        <CopyJoinUrl joinUrl={joinUrl} />
      </VStack>
    </Box>
  );
};

const CopyJoinUrl = ({ joinUrl }) => {
  return (
    <Clipboard.Root maxW="300px" value={joinUrl}>
      <Clipboard.Label textStyle="label">Join URL</Clipboard.Label>
      <InputGroup endElement={<ClipboardIconButton />}>
        <Clipboard.Input asChild>
          <Input />
        </Clipboard.Input>
      </InputGroup>
    </Clipboard.Root>
  );
};

const ClipboardIconButton = () => {
  return (
    <Clipboard.Trigger asChild>
      <IconButton variant="surface" size="xs" me="-2">
        <Clipboard.Indicator />
      </IconButton>
    </Clipboard.Trigger>
  );
};

export default ShareGroupsPage;
