import { Outlet } from "react-router-dom";
import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Flex direction="column" height="100vh">
        <Navbar />
        <Flex flex="1" overflow="hidden">
          <Sidebar />
          <Box flex="1" overflowY="auto" p={8}>
            <Outlet />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Layout;
