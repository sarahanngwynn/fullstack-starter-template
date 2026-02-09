import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  List,
  ListItem,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../utils/trpc";

const TOKEN_KEY = "parent_access_token";

export default function ParentProfile() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
  }, []);

  const meQuery = trpc.parents.me.useQuery(undefined, {
    enabled: !!token,
    retry: false,
  });

  const children = useMemo(() => meQuery.data?.children ?? [], [meQuery.data]);

  return (
    <Box maxW="900px" mx="auto" mt={8} p={8} bg="white" borderRadius="lg" boxShadow="md">
      <VStack align="stretch" spacing={6}>
        <HStack justify="space-between" align="start" flexWrap="wrap" gap={3}>
          <Box>
            <Heading size="lg" color="gray.800">
              My Profile
            </Heading>
            <Text mt={2} color="gray.600">
              Your contact info and children on file.
            </Text>
          </Box>

          <HStack spacing={3}>
            <Button variant="outline" onClick={() => navigate("/parent")}>Back</Button>
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
        </HStack>

        {!token ? (
          <Alert status="warning" borderRadius="md" bg="orange.50" color="gray.800">
            <AlertIcon />
            <Box>
              <Text fontWeight="semibold">You’re not signed in.</Text>
              <Text fontSize="sm" color="gray.600">
                Sign in to view your profile.
              </Text>
              <Button mt={3} colorScheme="orange" onClick={() => navigate("/parent/auth")}>
                Go to Parent Sign In
              </Button>
            </Box>
          </Alert>
        ) : meQuery.isLoading ? (
          <Stack spacing={3}>
            <Skeleton height="24px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Divider />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        ) : meQuery.isError ? (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="semibold">Couldn’t load your profile.</Text>
              <Text fontSize="sm" color="gray.600">
                {meQuery.error.message}
              </Text>
              <HStack mt={3} spacing={3}>
                <Button onClick={() => meQuery.refetch()}>Try again</Button>
                <Button variant="outline" onClick={() => navigate("/parent/auth")}>
                  Re-sign in
                </Button>
              </HStack>
            </Box>
          </Alert>
        ) : (
          <>
            <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50">
              <Text fontWeight="semibold" mb={2}>
                Parent
              </Text>
              <Text>
                <Text as="span" fontWeight="semibold">
                  Name:
                </Text>{" "}
                {meQuery.data?.parentName}
              </Text>
              <Text>
                <Text as="span" fontWeight="semibold">
                  Email:
                </Text>{" "}
                {meQuery.data?.email}
              </Text>
            </Box>

            <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="semibold">Children</Text>
                <Text fontSize="sm" color="gray.600">
                  {children.length} on file
                </Text>
              </HStack>

              {children.length === 0 ? (
                <Text color="gray.600" fontSize="sm">
                  No children added yet.
                </Text>
              ) : (
                <List spacing={2}>
                  {children.map((c) => (
                    <ListItem key={c.id}>
                      <Text>
                        <Text as="span" fontWeight="semibold">
                          {c.name}
                        </Text>
                        {typeof c.age === "number" ? ` — ${c.age}` : ""}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              )}

              <Divider my={4} />

              <Text fontSize="sm" color="gray.600">
                Next step: we’ll add a “My submissions” section here so parents can see their
                registration and application status.
              </Text>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
}
