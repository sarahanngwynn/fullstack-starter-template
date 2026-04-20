"use client";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const TOKEN_KEY = "parent_access_token";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState<string | null>(null);

  const params = new URLSearchParams(location.search);
  const justSubmitted = params.get("application") === "submitted";

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
        {justSubmitted && (
          <Box
            mt={2}
            mb={2}
            p={4}
            borderRadius="md"
            bg="green.50"
            border="1px solid"
            borderColor="green.200"
            color="green.800"
          >
            <Text fontWeight="bold">Application in progress</Text>
            <Text mt={1}>
              Your application was submitted successfully and is now in progress.
            </Text>
          </Box>
        )}

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
              <Text fontWeight="semibold">You’re not signed in.</Text>
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
              <Text fontWeight="semibold">Signed in successfully.</Text>
            </Alert>

            {/* Actions */}
            <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50">
              <Text fontWeight="semibold" mb={3}>
                Quick actions
              </Text>

              <HStack spacing={3} flexWrap="wrap">
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => navigate("/parent/profile")}
                >
                  View My Profile
                </Button>

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

