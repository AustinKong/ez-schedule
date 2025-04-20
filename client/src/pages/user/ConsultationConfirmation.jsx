import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';

const ConsultationConfirmation = () => {
  const { slotId } = useParams();

  return (
    <Center py={8}>
      <Box p={6} textAlign="center">
        <Heading size="md" color="green.600" mb={4}>
          Submission Successful!
        </Heading>
        <Text mb={6}>
          Your pre-consultation form has been submitted successfully.
        </Text>
        <Stack spacing={3}>
          <Button 
            as={RouterLink} 
            to={`/user/timeslots/${slotId}`}  // Points to existing timeslots route
            colorScheme="blue"
          >
            View Consultation Details
          </Button>
          <Button 
            as={RouterLink} 
            to="/user/submissions" 
            colorScheme="gray"
          >
            View All Submissions
          </Button>
          <Button 
            as={RouterLink} 
            to="/user/timeslots" 
            colorScheme="gray"
          >
            Back to Timeslots
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};

export default ConsultationConfirmation;