import {
    Flex,
    Box,
    Heading,
    VStack,
    Input,
    Button,
    HStack,
    Text,
    Link as ChakraLink,
    RadioGroup,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { Toaster, toaster } from "@/components/ui/toaster";
  import { API_URL } from '../../services/api'
  
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  function ForgetPasswordPage() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = async () => {
      setEmailError("");
  
      if (!email) {
        setEmailError("Email is required");
        return;
      }
  
      if (!isValidEmail(email)) {
        setEmailError("Invalid email format");
        return;
      }
  
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
  
        if (response.ok) {
          toaster.create({
            title: "Reset Email Sent",
            description: "Check your email to reset your password.",
            type: "success",
          });
          navigate("/login"); // Redirect to login page after success.
        } else {
          const errorData = await response.json();
          toaster.create({
            title: "Error",
            description: errorData.message || "Failed to send reset email.",
            type: "error",
          });
        }
      } catch (error) {
        toaster.create({
          title: "Network Error",
          description: "Could not connect to the server.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Toaster />
        <Box bg="white" p={8} rounded="md" shadow="md" minW="350px">
        <Heading mb={4} size="lg" color="black">
            Forgot Password
          </Heading>
          <Text mb={6} color="black">
            Enter your email address and we'll send you a link to reset your
            password.
          </Text>
          <VStack spacing={4} align="stretch">
            {/* Form Control */}
            <Box>
            <Text fontWeight="semibold" mb={1} color="black">
                Email Address
              </Text>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                color = "black"
              />
              {emailError && (
                <Text color="black" fontSize="sm">
                  {emailError}
                </Text>
              )}
            </Box>
            <Button
              colorScheme="blue"
              width="full"
              onClick={handleSubmit}
              isLoading={loading}
            >
              Send Reset Link
            </Button>
          </VStack>
        </Box>
      </Flex>
    );
  }
  
  export default ForgetPasswordPage;
  