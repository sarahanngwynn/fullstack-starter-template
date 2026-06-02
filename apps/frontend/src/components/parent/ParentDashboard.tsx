"use client";

import React from "react";
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
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import { ParentPortalShell } from "./ParentPortalShell";

export function ParentDashboard() {
  const navigate = useNavigate();

  const meQuery = trpc.parents.me.useQuery();

  return (
    <ParentPortalShell
      title="Parent Portal"
      subtitle="Welcome back. Manage your family information, applications, and registrations."
    >
      {meQuery.isLoading && (
        <Card>
          <HStack>
            <Spinner />
            <Text color="gray.700">Loading your parent portal…</Text>
          </HStack>
        </Card>
      )}

      {meQuery.error && (
        <Alert status="error" borderRadius="xl">
          <AlertIcon />
          <Box>
            <Text fontWeight="semibold">Couldn’t load your parent portal.</Text>
            <Text fontSize="sm">{meQuery.error.message}</Text>
          </Box>
        </Alert>
      )}

      {meQuery.data && (
        <VStack align="stretch" spacing={6}>
          <Card>
            <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={4}>
              <Box>
                <Heading size="md" color="gray.800">
                  Hi, {meQuery.data.parentName}
                </Heading>
                <Text mt={1} color="gray.600">
                  {meQuery.data.email}
                </Text>
              </Box>

              <Badge px={3} py={1} borderRadius="full" colorScheme="green">
                Parent Account
              </Badge>
            </HStack>
          </Card>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <StatCard label="Children" value={meQuery.data.children.length} />
            <StatCard label="Applications" value={0} />
            <StatCard label="Registrations" value={0} />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Card>
              <Heading size="md" color="gray.800" mb={4}>
                Children
              </Heading>

              <Divider mb={4} />

              {meQuery.data.children.length === 0 ? (
                <EmptyState text="No children added yet." />
              ) : (
                <VStack align="stretch" spacing={3}>
                  {meQuery.data.children.map((child) => (
                    <Box
                      key={child.id}
                      bg="#f8f6f1"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="lg"
                      p={4}
                    >
                      <Text fontWeight="semibold" color="gray.800">
                        {child.name}
                      </Text>
                      <Text color="gray.600" fontSize="sm">
                        Age: {child.age}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              )}
            </Card>

            <Card>
              <Heading size="md" color="gray.800" mb={4}>
                Quick Actions
              </Heading>

              <Divider mb={4} />

              <VStack align="stretch" spacing={3}>
                <Button
                  bg="#5f6f52"
                  color="white"
                  _hover={{ bg: "#4f5f44" }}
                  onClick={() => navigate("/register")}
                >
                  Start Registration
                </Button>

                <Button
                  variant="outline"
                  borderColor="gray.300"
                  color="gray.800"
                  onClick={() => navigate("/apply")}
                >
                  Start Application
                </Button>

                <Button
                  variant="outline"
                  borderColor="gray.300"
                  color="gray.800"
                  onClick={() => navigate("/parent/profile")}
                >
                  View Parent Profile
                </Button>
              </VStack>
            </Card>
          </SimpleGrid>

          <Card>
            <Heading size="md" color="gray.800" mb={4}>
              Applications & Registrations
            </Heading>

            <Divider mb={4} />

            <EmptyState text="Application and registration tracking will appear here once we connect submissions." />
          </Card>
        </VStack>
      )}
    </ParentPortalShell>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={6}
      boxShadow="sm"
    >
      {children}
    </Box>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <Text fontSize="sm" color="gray.500" fontWeight="semibold">
        {label}
      </Text>
      <Text mt={2} fontSize="3xl" fontWeight="bold" color="gray.800">
        {value}
      </Text>
    </Card>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <Box bg="#f8f6f1" borderRadius="lg" p={5}>
      <Text color="gray.600">{text}</Text>
    </Box>
  );
}