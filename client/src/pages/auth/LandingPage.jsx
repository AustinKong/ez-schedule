import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Stack,
  Icon,
  SimpleGrid,
  Container,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiUsers } from "react-icons/fi"; // Example icons
import Navbar from "../../components/custom/Navbar";

const LandingPage = () => {

const token = localStorage.getItem('token');

return (
<>
  <Navbar />

  <Box as="main" paddingTop={"100px"}>
    <Container maxW="container.xl" textAlign="center">
      <VStack spacing={8} mb={16}>
        <Heading as="h1" size="4xl" fontWeight="bold">
          Effortless Scheduling for Everyone
        </Heading>
        <Text fontSize="xl" color="gray.600">
          Simplify your appointments, meetings, and events with EzSchedule.
          Say goodbye to scheduling conflicts and hello to seamless organisation.
        </Text>
        {!token && (
          <Button
            as={Link}
            to="/register"
            size="lg"
            >
            Get Started - Register Now
          </Button>
        )}
      </VStack>

      <Box py={12}>
      <Heading as="h2" size="2xl" fontWeight="semibold" mb={8}>
        Key Features
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        <FeatureCard
          title="Easy Appointment Scheduling"
          description="Schedule and book appointments in a few clicks. Customisable availability and simple to use."
          icon={FiCalendar}
        />
        <FeatureCard
          title="Meeting Coordination"
          description="Coordinate meetings with ease and no-fuss."
          icon={FiUsers}
        />
        <FeatureCard
          title="Queue System & Automated Reminders"
          description="Built-in queue system with automated email reminders for scheduled meetings."
          icon={FiClock}
        />
        </SimpleGrid>
      </Box>
    </Container>
  </Box>
</>
);
};

// Reusable Feature Card component
const FeatureCard = ({ title, description, icon }) => (
  <Stack align="center" textAlign="center">
    <Icon as={icon} size="3xl" color="teal.500" mb={4} />
    <Heading as="h3" size="md" fontWeight="semibold" mb={2}>
      {title}
    </Heading>
    <Text color="gray.600">{description}</Text>
  </Stack>
);

export default LandingPage;