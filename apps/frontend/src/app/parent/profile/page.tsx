"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../../utils/trpc";
import { ParentPortalShell } from "../../../components/parent/ParentPortalShell";

const TOKEN_KEY = "parent_access_token";

type Child = {
  id: string;
  name: string;
  age: number;
};

export default function ParentProfilePage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
  }, []);

  const meQuery = trpc.parents.me.useQuery(undefined, {
    enabled: !!token,
  });

  if (!token) {
    return (
      <Box bg="#f8f6f1" minH="100vh" py={10} px={4}>
        <Box maxW="900px" mx="auto">
          <Alert status="warning" borderRadius="lg">
            <AlertIcon />
            <Box>
              <Text fontWeight="semibold">You’re not signed in.</Text>
              <Text fontSize="sm" color="gray.600">
                Go sign in to view your profile.
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
        </Box>
      </Box>
    );
  }

  return (
    <ParentPortalShell
      title="Parent Profile"
      subtitle="Review your parent account and child information."
    >
      {meQuery.isLoading && (
        <Box bg="white" borderWidth="1px" borderRadius="xl" p={6}>
          <HStack>
            <Spinner />
            <Text>Loading your profile…</Text>
          </HStack>
        </Box>
      )}

      {meQuery.error && (
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <Box>
            <Text fontWeight="semibold">Couldn’t load profile.</Text>
            <Text fontSize="sm">{meQuery.error.message}</Text>
          </Box>
        </Alert>
      )}

      {meQuery.data && (
        <>
          <Box bg="white" borderWidth="1px" borderRadius="xl" p={6} boxShadow="sm">
            <Heading size="md" color="gray.800" mb={4}>
              Account Details
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              <ProfileField label="Parent Name" value={meQuery.data.parentName} />
              <ProfileField label="Email" value={meQuery.data.email} />
            </SimpleGrid>
          </Box>

          <Box bg="white" borderWidth="1px" borderRadius="xl" p={6} boxShadow="sm">
            <HStack justify="space-between" mb={4}>
              <Heading size="md" color="gray.800">
                Children
              </Heading>

              <Badge colorScheme="teal">{meQuery.data.children.length} listed</Badge>
            </HStack>

            <Divider mb={4} />

            {meQuery.data.children.length === 0 ? (
              <Box bg="gray.50" borderRadius="lg" p={5}>
                <Text color="gray.600">No children added yet.</Text>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {meQuery.data.children.map((child: Child) => (
                  <Box key={child.id} borderWidth="1px" borderRadius="lg" p={4} bg="gray.50">
                    <Heading size="sm" color="gray.800">
                      {child.name}
                    </Heading>

                    <Text mt={1} color="gray.600">
                      Age: {child.age}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </>
      )}
    </ParentPortalShell>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Text fontSize="sm" color="gray.500" fontWeight="semibold">
        {label}
      </Text>
      <Text mt={1} color="gray.800" fontSize="lg">
        {value}
      </Text>
    </Box>
  );
}