import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import React from "react";
import Navbar from "./Navbar";

interface Props {
  title: string;
}

const Layout: React.FC<Props> = (props) => {
  return (
    <Flex w="100%" justify="center" flexDir="column" alignItems="center">
      <Box maxW="600px">
        <Navbar />
        <Box>
          {props.title ? <Heading mb={4}>{props.title}</Heading> : null}
          {props.children}
        </Box>
      </Box>
    </Flex>
  );
};

export default Layout;
