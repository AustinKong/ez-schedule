import {
  Flex,
  Box,
  Heading,
  VStack,
  Input,
  Button,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toaster } from "@/components/ui/toaster";
import { PasswordInput } from "@/components/ui/password-input";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Basic validation
    if (!email || !isValidEmail(email) || !password) {
      toaster.create({
        title: "Validation Error",
        description: "Please enter a valid email and password",
        type: "error",
      });
      return;
    }

    // Server call
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, userId, userRole } = await response.json();
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        if (userRole === "manager") navigate("/manager");
        else if (userRole === "user") navigate("/user");
      } else {
        toaster.create({
          title: "Login Failed",
          description: "Invalid email or password",
          type: "error",
        });
      }
    } catch {
      toaster.create({
        title: "Network Error",
        description: "Please try again later",
        type: "error",
      });
    }
  };

  return (
    <Flex minH="100vh">
      <Toaster />
      {/* Left side (no image yet) */}
      <Box
        flex="1"
        bgColor="blue.50"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {/* Placeholder for future image or content */}
        <Heading fontSize="xl" color="blue.700">
          Left Panel
        </Heading>
      </Box>

      {/* Right side (form) */}
      <VStack flex="1" align="center" justify="center" spacing={6} p={8}>
        <Heading>Login</Heading>
        <Text fontSize="sm" color="gray.500">
          Ready when you are — just enter your details to log in!
        </Text>

        <VStack spacing={4} width="full" maxW="sm">
          <Box width="full">
            <Text fontWeight="semibold" mb={1}>
              Email
            </Text>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {email && !isValidEmail(email) && (
              <Text color="red.500" fontSize="sm">
                Email is invalid
              </Text>
            )}
          </Box>

          <Box width="full">
            <Text fontWeight="semibold" mb={1}>
              Password
            </Text>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>

          <Button
            colorScheme="blue"
            width="full"
            onClick={handleLogin}
            disabled={!email || !isValidEmail(email) || !password}
            mt={2}
          >
            Login
          </Button>
        </VStack>

        <Text fontSize="sm">
          Don't have an account yet?{" "}
          <ChakraLink as={Link} to="/register" color="blue.500">
            Register
          </ChakraLink>
        </Text>
      </VStack>
    </Flex>
  );
}

export default LoginPage;
