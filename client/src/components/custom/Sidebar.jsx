import { Box, VStack, Link as ChakraLink, Icon } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { FiTag, FiUser, FiCompass } from "react-icons/fi";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: FiCompass },
  { to: "/my-slots", label: "My Slots", icon: FiTag },
  { to: "/queue", label: "Queue", icon: FiUser },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <Box p={4} pt={9} borderRight="1px solid gray" height="full">
      <VStack align="start" spacing={2} height="full">
        {links.map((link) => (
          <ChakraLink
            as={Link}
            to={link.to}
            key={link.to}
            bg={
              location.pathname.includes(link.to)
                ? "bg.inverted"
                : "transparent"
            }
            color={
              location.pathname.includes(link.to) ? "fg.inverted" : "fg.muted"
            }
            p="4px 12px"
            w="full"
          >
            <Icon as={link.icon} mr={1} />
            {link.label}
          </ChakraLink>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
