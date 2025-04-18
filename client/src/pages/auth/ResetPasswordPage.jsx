import {
  Flex,
  Box,
  Heading,
  VStack,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { PasswordInput } from "@/components/ui/password-input";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const isValidPassword = (pw) => pw && pw.length >= 1; // Example minimum

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { token } = useParams(); // Assume reset token comes from URL


  const handleReset = async () => {
    if (!isValidPassword(password) || password !== repeatPassword) {
      toaster.create({
        title: "Invalid Input",
        description: "Passwords must match and meet requirements",
        type: "error",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      if (response.ok) {
        toaster.create({
          title: "Password Reset",
          description: "Your password has been reset. Please log in.",
          type: "success",
        });
        navigate("/login");
      } else {
        const { message } = await response.json();
        toaster.create({
          title: "Reset Failed",
          description: message || "Could not reset password.",
          type: "error",
        });
      }
    } catch {
      toaster.create({
        title: "Network Error",
        description: "Try again later",
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Toaster />
      <Box bg="white" p={8} rounded="md" shadow="md" minW="350px">
        <Heading mb={4} size="lg">Reset Password</Heading>
        <Text mb={6}>Please enter your new password below.</Text>
        <VStack spacing={4} align="stretch">
          <PasswordInput
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordInput
            placeholder="Repeat New Password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          {password && repeatPassword && password !== repeatPassword && (
            <Text color="red.500" fontSize="sm">Passwords do not match</Text>
          )}
          <Button
            colorScheme="blue"
            isLoading={loading}
            onClick={handleReset}
            isDisabled={!password || !repeatPassword || password !== repeatPassword}
          >
            Reset Password
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}

export default ResetPasswordPage;
