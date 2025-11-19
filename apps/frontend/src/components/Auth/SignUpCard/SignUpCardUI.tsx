import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';

export type EmailAndPassword = {
  email: string;
  password: string;
};

type SignUpCardProps = {
  onSubmit(values: EmailAndPassword): void;
};

function SignUpCardUI({ onSubmit }: SignUpCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<EmailAndPassword>();

  // Colors inspired by Dancing Moose feel
  const pageBg = useColorModeValue('#f8f6f1', 'gray.800'); // warm, soft background
  const heroBg = useColorModeValue('#efe5d6', 'gray.700'); // light “wood” band
  const heroBorder = useColorModeValue('#f5edde', 'gray.600');
  const heroText = useColorModeValue('#2f7f7a', 'teal.200'); // teal style
  const bodyText = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');

  return (
    <Flex
      minH="100vh"
      align="flex-start"
      justify="center"
      bg={pageBg}
      py={{ base: 10, md: 16 }}
      px={{ base: 4, md: 8 }}
    >
      <Stack spacing={10} mx="auto" maxW="3xl" w="100%">
        {/* Hero strip – mimics BLOG header area */}
        <Box
          bg={heroBg}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={heroBorder}
          py={{ base: 10, md: 12 }}
          px={{ base: 4, md: 10 }}
          textAlign="center"
        >
          <Heading
            as="h1"
            fontSize={{ base: '2xl', md: '3xl' }}
            letterSpacing="wide"
            color={heroText}
            mb={4}
          >
            Enrollment Application
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} color={bodyText} maxW="2xl" mx="auto">
            We’re excited to learn more about your child and your family.
            This application is the first step toward joining our Dancing Moose community.
          </Text>
        </Box>

        {/* Form card */}
        <Box
          rounded="2xl"
          bg={cardBg}
          borderWidth="1px"
          borderColor={cardBorder}
          boxShadow="md"
          p={{ base: 6, md: 10 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={6}>
              <Stack spacing={1} textAlign="left">
                <Heading as="h2" fontSize="xl" color={heroText}>
                  Parent Portal Login
                </Heading>
                <Text fontSize="sm" color={bodyText}>
                  Create your account to start or continue an application.
                </Text>
              </Stack>

              <FormControl isRequired isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <Input
                  id="email"
                  type="email"
                  bg={useColorModeValue('white', 'gray.800')}
                  {...register('email', { required: 'Email is required' })}
                />
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    bg={useColorModeValue('white', 'gray.800')}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Minimum length should be 8',
                      },
                    })}
                  />
                  <InputRightElement h="full">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Stack spacing={4} pt={2}>
                <Button
                  isLoading={isSubmitting}
                  loadingText="Submitting"
                  size="lg"
                  bg={heroText}
                  color="white"
                  type="submit"
                  _hover={{
                    bg: '#256864',
                  }}
                  borderRadius="full"
                >
                  Start Application
                </Button>
              </Stack>

              <Stack pt={4}>
                <Text align="center" fontSize="sm" color={bodyText}>
                  Already started an application?{' '}
                  <Link as={RouterLink} to="/login" color={heroText} fontWeight="semibold">
                    Log in here
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}

export default SignUpCardUI;
