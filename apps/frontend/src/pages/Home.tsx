import React from 'react';
import { Box, Heading, Text, Button, Stack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const pageBg = '#f8f6f1'; // cream background
const cardBg = '#ffffff';
const cardBorder = '#e2ddd4';

const Home = () => {
  return (
    <Box
      minH="100vh"
      bg={pageBg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        maxW="lg"
        w="100%"
        bg={cardBg}
        borderWidth="1px"
        borderColor={cardBorder}
        borderRadius="2xl"
        boxShadow="xl"
        p={{ base: 6, md: 10 }}
        textAlign="center"
      >

        {/* MAIN HEADING (Bring back the title!) */}
        <Heading
          as="h1"
          size="xl"
          mb={4}
          color="#2f7f7a"
          letterSpacing="wide"
        >
          Ready to Apply?
        </Heading>

        <Text fontSize="md" color="gray.600" mb={6} px={4}>
        The whole process only takes a few minutes. Pay the application fee at the end to submit your application.
        </Text>

        {/* Centered button */}
        <Stack spacing={4} justify="center" align="center">
          <Button
            as={RouterLink}
            to="/apply"
            size="lg"
            bg="#2f7f7a"
            color="white"
            _hover={{ bg: '#256864' }}
            borderRadius="full"
            px={8}
          >
            Apply Here
          </Button>
        </Stack>

      </Box>
    </Box>
  );
};

export default Home;

