import React from "react";
import { Link } from "gatsby";
import { Flex, Image, Stack } from "@chakra-ui/react";
import profilePicture from "../images/profile.jpg";
import { navigate } from "gatsby";

export default function Navbar() {
  return (
    <Flex flexDir="row" pt={4} pb={4} align="center" justify="space-between">
      <Image
        borderRadius="full"
        boxSize="150"
        src={profilePicture}
        alt="My photo"
        mr="4"
        cursor="pointer"
        onClick={() => navigate("/")}
      />
      <Stack direction="row" spacing={4}>
        <Link to="/blog">Blog</Link>
        <Link to="/journalism">Journalism</Link>
      </Stack>
    </Flex>
  );
}
