import { Box, Heading, Button } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <Box>
      <Heading>Apply now!</Heading>
      <Button as={RouterLink} to="/apply" mt={4} colorScheme="teal">
        Go to Application
      </Button>

      <p>Go ahead!</p>

      <p>
       Please Apply
      </p>

      <p>
        You'll love our School
      </p>

      <p>
        Just click the button
      </p>

      <p>
        You'll get in, I promise!
      </p>
    </Box>
  );
};

export default Home;
