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
                  <Button
                      as={Link}
                      to="/register"
                      size="lg"
                  >
                      Get Started - Register Now
                  </Button>
              </VStack>

              <Box py={12}>
                  <Heading as="h2" size="2xl" fontWeight="semibold" mb={8}>
                      Key Features
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                      <FeatureCard
                          title="Easy Appointment Scheduling"
                          description="Let users book appointments with you in a few clicks. Customisable availability and buffer times."
                          icon={FiCalendar}
                      />
                      <FeatureCard
                          title="Meeting Coordination"
                          description="Find the best time for group meetings with built-in availability comparison."
                          icon={FiUsers}
                      />
                      <FeatureCard
                          title="Automated Reminders"
                          description="Reduce no-shows with automated email and SMS reminders for scheduled events."
                          icon={FiClock}
                      />
                      {/* Add more features as needed */}
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