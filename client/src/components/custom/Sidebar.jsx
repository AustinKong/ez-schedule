import { Box, VStack, Link as ChakraLink, Icon } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { FiTag, FiUser, FiCompass, FiFolder } from "react-icons/fi";
import { FiUsers, FiCalendar } from "react-icons/fi";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetch(`/api/users/${userId}`, {
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

  let links = [];
  if (user?.userRole === "host") {
    links = [
      { to: "/manager/groups", label: "Groups", icon: FiUsers },
      { to: "/manager/timeslots", label: "Timeslots", icon: FiCalendar },
      { to: "/queue", label: "Queue", icon: FiUser },
    ];
  } else if (user?.userRole === "participant") {
    links = [
      { to: "/user/groups", label: "Groups", icon: FiUsers },
      { to: "/user/timeslots/all", label: "Timeslots", icon: FiCalendar },
      { to: "/queue", label: "Queue", icon: FiUser },
      { to: "/user/preconsultForm/new", label: "Preconsult Form", icon: FiFolder },
    ];
  }

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
