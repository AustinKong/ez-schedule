// src/components/user/TimeslotUserDetailsPage.jsx
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useTimeslots } from "../../hooks/useTimeslots";
import QueueManagement from "../user/QueuePage";
import { isWithinInterval, format, parseISO } from "date-fns";
import { TimeslotStatusBadge } from "../../components/ui/TimeslotStatusBadge";
import { TimeslotStats } from "../../components/ui/TimeslotStats";
import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

const TimeslotUserDetailsPage = () => {
  const { id } = useParams();
  const { getTimeslot } = useTimeslots();
  const [timeslot, setTimeslot] = useState(null);
  const [submissionExists, setSubmissionExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const formatConsultationTime = (isoString) => {
    return isoString
      ? format(parseISO(isoString), "d MMM yyyy, h:mm a")
      : "N/A";
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const timeslotData = await getTimeslot(id);
        setTimeslot(timeslotData);

        const response = await fetch(`/api/preconsultations/slot/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const submission = await response.json();
          setSubmissionExists(!!submission);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );

  if (!timeslot)
    return (
      <Center h="100vh">
        <Text>Timeslot not found</Text>
      </Center>
    );

  const isActive = isWithinInterval(currentTime, {
    start: parseISO(timeslot.start),
    end: parseISO(timeslot.end),
  });

  return (
    <Box maxW="4xl" mx="auto" px={4} py={8}>
      <Box p={6} mb={6}>
        <Flex justify="space-between" align="flex-start" mb={4}>
          <Box>
            <Heading size="md">
              {timeslot.name}
            </Heading>
            <Stack mt={2} spacing={2}>
              <TimeslotStatusBadge status={isActive ? "active" : "ended"} />
              {submissionExists && (
                <Badge colorScheme="green" px={2} py={1} borderRadius="md">
                  Pre-Consultation Submitted
                </Badge>
              )}
            </Stack>
          </Box>
          <Box textAlign="right">
            <Text fontSize="sm" color="gray.500">
              Location: {timeslot.location}
            </Text>
            <Text fontSize="sm" color="gray.500">
              SGT Timezone
            </Text>
          </Box>
        </Flex>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mb={6}>
          <Box>
            <Text color="gray.600">
              <Text as="span" fontWeight="medium">
                Starts:
              </Text>{" "}
              {formatConsultationTime(timeslot.startTime)}
            </Text>
            <Text color="gray.600">
              <Text as="span" fontWeight="medium">
                Ends:
              </Text>{" "}
              {formatConsultationTime(timeslot.endTime)}
            </Text>
          </Box>
          <TimeslotStats timeslot={timeslot} />
        </Grid>

        {isActive ? (
          <>
            <QueueManagement groupId={timeslot.groupId} />
            <Stack mt={6} spacing={4} align="center">
              {!submissionExists && (
                <Button
                  as={RouterLink}
                  to={`/user/slots/${id}/preconsultation`}
                  colorScheme="blue"
                >
                  Complete Pre-Consultation Form
                </Button>
              )}
              {submissionExists && (
                <Button
                  as={RouterLink}
                  to="/user/submissions"
                  colorScheme="gray"
                >
                  View All Submissions
                </Button>
              )}
            </Stack>
          </>
        ) : (
          <Box p={4} borderRadius="md" textAlign="center">
            <Heading size="sm" mb={2}>
              Consultation Session Has Ended
            </Heading>
            <Text color="gray.600">
              {formatConsultationTime(timeslot.endTime)} – Singapore Time
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TimeslotUserDetailsPage;