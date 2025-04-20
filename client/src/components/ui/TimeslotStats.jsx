
import { Grid, Box, Text, Heading } from '@chakra-ui/react';
import { isBefore, parseISO } from "date-fns";

export const TimeslotStats = ({ timeslot }) => {
  const durationMinutes = Math.round(
    (new Date(timeslot.endTime) - new Date(timeslot.startTime)) / 60000
  );

  const currentTime = new Date();
  const startTime = parseISO(timeslot.start);
  const isUpcoming = isBefore(currentTime, startTime);
  

  const stats = !isUpcoming
  ? [
      { label: 'Total Participants', value: timeslot.participants?.length || 0 },
      { label: 'Avg. Consultation Time', value: `${timeslot.avgDuration?.toFixed(1) || 0} mins` },
      { label: 'Total Duration', value: `${durationMinutes} mins` },
      { label: 'Max Attendance', value: timeslot.maxConcurrent || 0 },
    ]
  : [
      { label: 'Total Participants', value: '-' },
      { label: 'Avg. Consultation Time', value: '-' },
      { label: 'Total Duration', value: '-' },
      { label: 'Max Attendance', value: '-' },
    ];
    

  return (
    <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={4}>
      {stats.map((stat, index) => (
        <Box key={index} bg="gray.50" p={4} borderRadius="md">
          <Text fontSize="sm" fontWeight="medium" color="gray.600">{stat.label}</Text>
          <Heading mt={1} fontSize="lg" fontWeight="semibold" color="gray.900">{stat.value}</Heading>
        </Box>
      ))}
    </Grid>
  );
};