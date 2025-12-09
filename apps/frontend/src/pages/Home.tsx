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
    >
      <Box
        maxW="3xl"
        w="full"
        bg={cardBg}
        borderWidth="1px"
        borderColor={cardBorder}
        borderRadius="2xl"
        boxShadow="xl"
        p={{ base: 6, md: 10 }}
        textAlign="center"
      >
        {/* MAIN HEADING */}
        <Heading
          as="h1"
          size="xl"
          mb={4}
          color="gray.800"    
          fontWeight="bold"
        >
          Welcome to Dancing Moose
        </Heading>

        <Text fontSize="lg" color="gray.600" mb={8}>
          Curious families can start with an application, and currently-enrolled
          families can complete registration for upcoming sessions.
        </Text>

        {/* BUTTONS */}
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          spacing={4}
          justify="center"
        >
          {/* Existing application button */}
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

          {/* New registration button */}
          <Button
            as={RouterLink}
            to="/register"
            size="lg"
            variant="outline"
            borderColor="#2f7f7a"
            color="#2f7f7a"
            _hover={{ bg: '#e0f0ef' }}
            borderRadius="full"
            px={8}
          >
            Register
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;

