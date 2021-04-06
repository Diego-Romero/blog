import { Box, Flex, Heading } from "@chakra-ui/react";
import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "./Navbar";

interface Props {
  title: string;
}

const Layout: React.FC<Props> = (props) => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title,
            siteUrl
          }
        }
      }
    `
  )
  console.log(data)
  return (
    <Box>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{data.site.siteMetadata.title}</title>
        <link rel="canonical" href={data.site.siteMetadata.siteUrl} />
      </Helmet>
      <Flex
        w="100%"
        justify="center"
        flexDir="column"
        alignItems="center"
        p={[4, 4, 0]}
      >
        <Box maxW="500">
          <Navbar />
          <Box>
            {props.title ? <Heading mb={4}>{props.title}</Heading> : null}
            {props.children}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;
