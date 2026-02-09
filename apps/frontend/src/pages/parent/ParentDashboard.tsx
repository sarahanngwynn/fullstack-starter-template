"Use Client"
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "parent_access_token";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
  }, []);

  return (
    <Box
      maxW="900px"
      mx="auto"
      mt={8}
      p={8}
      bg="white"
      borderRadius="lg"
      boxShadow="md"
    >
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <Box>
          <Heading size="lg" color="gray.800">
            Parent Portal
          </Heading>
          <Text mt={2} color="gray.600">
            This is the parent dashboard. Next we’ll show your profile and
            submissions here.
          </Text>
        </Box>

        {/* Not signed in */}
        {!token ? (
          <Alert
            status="warning"
            borderRadius="md"
            bg="orange.50"
            color="gray.800"
          >
            <AlertIcon />
            <Box>
              <Text fontWeight="semibold">
                You’re not signed in.
              </Text>
              <Text fontSize="sm" color="gray.600">
                Go sign in to continue.
              </Text>

              <Button
                mt={3}
                colorScheme="orange"
                onClick={() => navigate("/parent/auth")}
              >
                Go to Parent Sign In
              </Button>
              <Button onClick={() => navigate("/parent/profile")}>
  View My Profile
</Button>
            </Box>
          </Alert>
        ) : (
          <>
            {/* Signed in */}
            <Alert
              status="success"
              borderRadius="md"
              bg="green.50"
              color="gray.800"
            >
              <AlertIcon />
              <Text fontWeight="semibold">
                Signed in successfully.
              </Text>
            </Alert>

            {/* Actions */}
            <Box
              borderWidth="1px"
              borderRadius="md"
              p={4}
              bg="gray.50"
            >
              <Text fontWeight="semibold" mb={3}>
                Quick actions
              </Text>

              <HStack spacing={3} flexWrap="wrap">
                <Button
                  colorScheme="blue"
                  onClick={() => navigate("/register")}
                >
                  Go to Registration Form
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/parent/auth")}
                >
                  Switch account
                </Button>

                <Button
                  variant="outline"
                  colorScheme="red"
                  onClick={() => {
                    localStorage.removeItem(TOKEN_KEY);
                    setToken(null);
                    navigate("/parent/auth");
                  }}
                >
                  Log out
                </Button>
              </HStack>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
}

