import {
  Box,
  Flex,
  HStack,
  Link as ChakraLink,
  IconButton,
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  Spacer,
} from "@chakra-ui/react";
import { FiLogOut, FiUser, FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useState, useEffect } from "react";
import { API_URL } from "../../services/api";

const links = [{ to: "/", text: "About" }];

const Navbar = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((user) => {
        setUser(user);
      });
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box px={6} py={2} borderBottom="1px solid gray">
      <Flex align="center" gap={6}>
        <Box fontWeight="bold" fontSize="xl" mr={4}>
          EzSchedule
        </Box>

        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          {links.map((link) => (
            <ChakraLink as={Link} to={link.to} key={link.to}>
              {link.text}
            </ChakraLink>
          ))}
        </HStack>

        {/* Icons */}
        <Spacer />
        <HStack spacing={3}>
          <ColorModeButton />
          <IconButton
            aria-label="Logout"
            variant="ghost"
            size="md"
            onClick={handleLogout}
          >
            <FiLogOut />
          </IconButton>
          <AvatarRoot as={Link} to={`/users/${userId}`} size="sm">
            {user?.avatar && <AvatarImage src={`/api/${user?.avatar}`} />}
            <AvatarFallback>
              <FiUser />
            </AvatarFallback>
          </AvatarRoot>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
