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

const BRAND_GREEN = "#5f6f52";
const BRAND_GREEN_DARK = "#4f5f44";
const CREAM = "#f8f6f1";

export function ParentDashboard() {
  const navigate = useNavigate();

  const meQuery = trpc.parents.me.useQuery();
  const submissionsQuery = trpc.parents.mySubmissions.useQuery();

  const applications = submissionsQuery.data?.applications ?? [];
  const registrations = submissionsQuery.data?.registrations ?? [];

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

              <Badge bg="#e8eee4" color={BRAND_GREEN} px={3} py={1} borderRadius="full">
                Parent Account
              </Badge>
            </HStack>
          </Card>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <StatCard label="Children" value={meQuery.data.children.length} />
            <StatCard label="Applications" value={applications.length} />
            <StatCard label="Registrations" value={registrations.length} />
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
                      bg={CREAM}
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
                <PrimaryButton onClick={() => navigate("/register")}>
                  Start Registration
                </PrimaryButton>

                <SecondaryButton onClick={() => navigate("/apply")}>
                  Start Application
                </SecondaryButton>

                <SecondaryButton onClick={() => navigate("/parent/profile")}>
                  View Parent Profile
                </SecondaryButton>
              </VStack>
            </Card>
          </SimpleGrid>

          <Card>
            <Heading size="md" color="gray.800" mb={4}>
              Applications
            </Heading>

            <Divider mb={4} />

            {submissionsQuery.isLoading ? (
              <HStack>
                <Spinner />
                <Text color="gray.700">Loading applications…</Text>
              </HStack>
            ) : applications.length === 0 ? (
              <EmptyState
                text="No applications found yet."
                actionText="Start Application"
                onClick={() => navigate("/apply")}
              />
            ) : (
              <VStack align="stretch" spacing={3}>
                {applications.map((submission: any) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    label="Application"
                  />
                ))}
              </VStack>
            )}
          </Card>

          <Card>
            <Heading size="md" color="gray.800" mb={4}>
              Registrations
            </Heading>

            <Divider mb={4} />

            {submissionsQuery.isLoading ? (
              <HStack>
                <Spinner />
                <Text color="gray.700">Loading registrations…</Text>
              </HStack>
            ) : registrations.length === 0 ? (
              <EmptyState
                text="No registrations found yet."
                actionText="Start Registration"
                onClick={() => navigate("/register")}
              />
            ) : (
              <VStack align="stretch" spacing={3}>
                {registrations.map((submission: any) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    label="Registration"
                  />
                ))}
              </VStack>
            )}
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
      color="gray.800"
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

function EmptyState({
  text,
  actionText,
  onClick,
}: {
  text: string;
  actionText?: string;
  onClick?: () => void;
}) {
  return (
    <Box bg={CREAM} borderRadius="lg" p={5}>
      <Text color="gray.700" mb={actionText ? 4 : 0}>
        {text}
      </Text>

      {actionText && onClick && (
        <PrimaryButton onClick={onClick}>{actionText}</PrimaryButton>
      )}
    </Box>
  );
}

function SubmissionCard({
  submission,
  label,
}: {
  submission: any;
  label: string;
}) {
  const paid = Boolean(submission.hasPaid);

  return (
    <Box
      bg={CREAM}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      p={4}
      color="gray.800"
    >
      <HStack justify="space-between" align="flex-start" spacing={4}>
        <Box>
          <HStack spacing={2} mb={2}>
            <Text fontWeight="bold" color="gray.800">
              {label}
            </Text>

            <Badge
              bg={paid ? "#e6f4ea" : "#fff4d6"}
              color={paid ? "#276749" : "#8a6100"}
              borderRadius="full"
              px={2}
            >
              {paid ? "Paid" : "Pending"}
            </Badge>
          </HStack>

          <Text color="gray.800">Child</Text>

          <Text fontSize="sm" color="gray.600">
            Submitted {new Date(submission.createdAt).toLocaleDateString()}
          </Text>
        </Box>
      </HStack>

      <Divider my={3} />

      <Text fontSize="sm" color="gray.700">
        Status: {submission.status ?? "Submitted"}
      </Text>

      <Text fontSize="sm" color="gray.700">
        Procare Sync: {submission.procareSyncStatus ?? "Not sent"}
      </Text>
    </Box>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      bg={BRAND_GREEN}
      color="white"
      _hover={{ bg: BRAND_GREEN_DARK }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      borderColor={BRAND_GREEN}
      color={BRAND_GREEN}
      _hover={{ bg: "#f0f3ed" }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}