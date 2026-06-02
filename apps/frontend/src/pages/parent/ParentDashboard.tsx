"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { trpc } from "../../utils/trpc";

const TOKEN_KEY = "parent_access_token";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem(TOKEN_KEY);

  const { data, isLoading, error } = trpc.parents.mySubmissions.useQuery(
    undefined,
    {
      enabled: !!token,
    }
  );

  const applications = data?.applications ?? [];
  const registrations = data?.registrations ?? [];

  if (!token) {
    return (
      <Box maxW="900px" mx="auto" mt={8} p={8}>
        <Alert status="warning" borderRadius="md">
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
      </Box>
    );
  }

  return (
    <Box maxW="1100px" mx="auto" mt={8} p={{ base: 4, md: 8 }}>
      <VStack align="stretch" spacing={6}>
        <Flex justify="space-between" align="flex-start" gap={4} wrap="wrap">
          <Box>
            <Heading size="lg" color="gray.800">
              Parent Portal
            </Heading>
            <Text mt={2} color="gray.600">
              View applications, registrations, and parent account details.
            </Text>
          </Box>

          <HStack spacing={3} flexWrap="wrap">
            <Button colorScheme="blue" onClick={() => navigate("/register")}>
              Start Registration
            </Button>

            <Button variant="outline" onClick={() => navigate("/apply")}>
              Start Application
            </Button>

            <Button
              variant="outline"
              colorScheme="red"
              onClick={() => {
                localStorage.removeItem(TOKEN_KEY);
                navigate("/parent/auth");
              }}
            >
              Log out
            </Button>
          </HStack>
        </Flex>

        {isLoading && (
          <Box bg="white" borderWidth="1px" borderRadius="lg" p={6}>
            <HStack>
              <Spinner />
              <Text>Loading your parent portal…</Text>
            </HStack>
          </Box>
        )}

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="semibold">Couldn’t load submissions.</Text>
              <Text fontSize="sm">{error.message}</Text>
            </Box>
          </Alert>
        )}

        {!isLoading && !error && (
          <>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <DashboardStat label="Applications" value={applications.length} />
              <DashboardStat label="Registrations" value={registrations.length} />
              <DashboardStat
                label="Total Submissions"
                value={applications.length + registrations.length}
              />
            </SimpleGrid>

            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
              <DashboardCard title="Applications">
                {applications.length === 0 ? (
                  <EmptyState
                    text="No applications found yet."
                    buttonText="Start Application"
                    onClick={() => navigate("/apply")}
                  />
                ) : (
                  <VStack align="stretch" spacing={3}>
                    {applications.map((application: any) => (
                      <SubmissionCard
                        key={application.id}
                        submission={application}
                        typeLabel="Application"
                      />
                    ))}
                  </VStack>
                )}
              </DashboardCard>

              <DashboardCard title="Registrations">
                {registrations.length === 0 ? (
                  <EmptyState
                    text="No registrations found yet."
                    buttonText="Start Registration"
                    onClick={() => navigate("/register")}
                  />
                ) : (
                  <VStack align="stretch" spacing={3}>
                    {registrations.map((registration: any) => (
                      <SubmissionCard
                        key={registration.id}
                        submission={registration}
                        typeLabel="Registration"
                      />
                    ))}
                  </VStack>
                )}
              </DashboardCard>
            </Grid>

            <DashboardCard title="Quick Actions">
              <HStack spacing={3} flexWrap="wrap">
                <Button variant="outline" onClick={() => navigate("/parent/profile")}>
                  View My Profile
                </Button>

                <Button variant="outline" onClick={() => navigate("/parent/auth")}>
                  Switch Account
                </Button>
              </HStack>
            </DashboardCard>
          </>
        )}
      </VStack>
    </Box>
  );
}

function DashboardStat({ label, value }: { label: string; value: number }) {
  return (
    <Box bg="white" borderWidth="1px" borderRadius="lg" p={5} boxShadow="sm">
      <Stat>
        <StatLabel color="gray.600">{label}</StatLabel>
        <StatNumber color="gray.800">{value}</StatNumber>
      </Stat>
    </Box>
  );
}

function DashboardCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box bg="white" borderWidth="1px" borderRadius="lg" p={6} boxShadow="sm">
      <Heading size="md" color="gray.800" mb={4}>
        {title}
      </Heading>

      {children}
    </Box>
  );
}

function EmptyState({
  text,
  buttonText,
  onClick,
}: {
  text: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <Box bg="gray.50" borderRadius="md" p={5}>
      <Text color="gray.600" mb={3}>
        {text}
      </Text>
      <Button size="sm" colorScheme="teal" onClick={onClick}>
        {buttonText}
      </Button>
    </Box>
  );
}

function SubmissionCard({
  submission,
  typeLabel,
}: {
  submission: any;
  typeLabel: string;
}) {
  const childData = submission.childData as any;
  const childName =
    childData?.firstName && childData?.lastName
      ? `${childData.firstName} ${childData.lastName}`
      : childData?.name ?? "Child";

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50">
      <Flex justify="space-between" align="flex-start" gap={3}>
        <Box>
          <HStack mb={1}>
            <Text fontWeight="semibold">{typeLabel}</Text>
            <Badge colorScheme={submission.hasPaid ? "green" : "yellow"}>
              {submission.hasPaid ? "Paid" : "Pending"}
            </Badge>
          </HStack>

          <Text color="gray.700">{childName}</Text>

          <Text fontSize="sm" color="gray.500">
            Submitted {new Date(submission.createdAt).toLocaleDateString()}
          </Text>
        </Box>
      </Flex>

      <Divider my={3} />

      <Text fontSize="sm" color="gray.600">
        Status: {submission.status ?? "Submitted"}
      </Text>

      <Text fontSize="sm" color="gray.600">
        Procare Sync: {submission.procareSyncStatus ?? "Not synced"}
      </Text>
    </Box>
  );
}
