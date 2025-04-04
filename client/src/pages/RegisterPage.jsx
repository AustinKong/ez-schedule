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
import { Toaster, toaster } from "@/components/ui/toaster";
import zxcvbn from "zxcvbn";
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { Link, useNavigate } from "react-router-dom";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (
      !email ||
      !isValidEmail(email) ||
      !password ||
      password !== repeatPassword
    ) {
      toaster.create({
        title: "Invalid Input",
        description: "Please check all fields",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        toaster.create({
          title: "Registration failed",
          description: "Account already exists",
          type: "error",
        });
      }
    } catch {
      toaster.create({
        title: "Network error",
        description: "Try again later",
        type: "error",
      });
    }
  };

  return (
    <Flex minH="100vh">
      <Toaster />

      {/* Left side */}
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

      {/* Right side (Form) */}
      <VStack flex="1" align="center" justify="center" spacing={6} p={8}>
        <Heading>Register</Heading>
        <Text fontSize="sm" color="gray.500">
          The first step to getting your questions answered!
        </Text>

        <VStack spacing={4} width="full" maxW="sm">
          {/* Email */}
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

          {/* Password */}
          <Box width="full">
            <Text fontWeight="semibold" mb={1}>
              Password
            </Text>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>

          {/* Repeat Password */}
          <Box width="full">
            <Text fontWeight="semibold" mb={1}>
              Repeat Password
            </Text>
            <PasswordInput
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
            {password && repeatPassword !== password && (
              <Text color="red.500" fontSize="sm">
                Passwords do not match
              </Text>
            )}
          </Box>

          <PasswordStrengthMeter value={zxcvbn(password).score} width="full" />

          <Button
            colorScheme="blue"
            width="full"
            mt={2}
            disabled={
              !email ||
              !isValidEmail(email) ||
              !password ||
              password !== repeatPassword
            }
            onClick={handleRegister}
          >
            Register
          </Button>
        </VStack>

        <Text fontSize="sm">
          Already have an account?{" "}
          <ChakraLink as={Link} to="/login" color="blue.500">
            Login
          </ChakraLink>
        </Text>
      </VStack>
    </Flex>
  );
}

export default RegisterPage;
