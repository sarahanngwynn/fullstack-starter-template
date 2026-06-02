import React, { useMemo, useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { trpc } from "../utils/trpc";

type ChildInput = { name: string; age: number };

type Props = {
  onAuthed?: (token: string) => void;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function ParentAuthCard({ onAuthed }: Props) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");

  const [email, setEmail] = useState("");
  const [parentName, setParentName] = useState("");
  const [password, setPassword] = useState("");

  const [children, setChildren] = useState<ChildInput[]>([
    { name: "", age: 3 },
  ]);

  const emailNormalized = useMemo(() => normalizeEmail(email), [email]);

  const checkEmailQuery = trpc.parents.checkEmail.useQuery(
    { email: emailNormalized },
    {
      enabled: emailNormalized.length > 3 && emailNormalized.includes("@"),
      retry: false,
    }
  );

  const signUp = trpc.parents.signUp.useMutation();
  const signIn = trpc.parents.signIn.useMutation();

  const emailExists = checkEmailQuery.data?.exists;
  const busy = signUp.isPending || signIn.isPending;

  function persistToken(token: string) {
    localStorage.setItem("parent_access_token", token);
    onAuthed?.(token);
  }

  function addChildRow() {
    setChildren((prev) => [...prev, { name: "", age: 3 }]);
  }

  function removeChildRow(index: number) {
    setChildren((prev) => prev.filter((_, i) => i !== index));
  }

  function updateChild(index: number, patch: Partial<ChildInput>) {
    setChildren((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...patch } : c))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanedEmail = emailNormalized;
    if (!cleanedEmail) return;

    try {
      if (mode === "signup") {
        const cleanedChildren = children
          .map((c) => ({
            name: c.name.trim(),
            age: Number.isFinite(c.age) ? c.age : 0,
          }))
          .filter((c) => c.name.length > 0);

        const res = await signUp.mutateAsync({
          parentName: parentName.trim(),
          email: cleanedEmail,
          password,
          children: cleanedChildren,
        });

        persistToken(res.accessToken);
      } else {
        const res = await signIn.mutateAsync({
          email: cleanedEmail,
          password,
        });

        persistToken(res.accessToken);
      }
    } catch {
      // mutation errors render below
    }
  }

  const disableSubmit =
    busy ||
    !emailNormalized ||
    !password ||
    (mode === "signup" && !parentName.trim());

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="2xl"
      p={{ base: 5, md: 8 }}
      color="gray.800"
      boxShadow="sm"
    >
      <VStack align="stretch" spacing={6}>
        <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
          <Heading size="md">
            {mode === "signup" ? "Create your parent account" : "Sign in"}
          </Heading>

          <HStack spacing={2}>
            <Button
              size="sm"
              variant={mode === "signup" ? "solid" : "outline"}
              colorScheme="teal"
              onClick={() => setMode("signup")}
              isDisabled={busy}
            >
              Sign up
            </Button>

            <Button
              size="sm"
              variant={mode === "signin" ? "solid" : "outline"}
              colorScheme="teal"
              onClick={() => setMode("signin")}
              isDisabled={busy}
            >
              Sign in
            </Button>
          </HStack>
        </HStack>

        <Divider />

        <Box as="form" onSubmit={handleSubmit}>
          <Stack spacing={5}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                isDisabled={busy}
                placeholder="you@email.com"
                type="email"
                size="lg"
                bg="white"
                color="gray.800"
                borderColor="gray.300"
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>

            {checkEmailQuery.isFetching && emailNormalized && (
              <HStack spacing={2} color="gray.600" fontSize="sm">
                <Spinner size="xs" />
                <Text>Checking email…</Text>
              </HStack>
            )}

            {emailExists === true && (
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <Text fontSize="sm">
                  Account found. You can switch to sign in.
                </Text>
              </Alert>
            )}

            {mode === "signup" && (
              <FormControl isRequired>
                <FormLabel>Parent name</FormLabel>
                <Input
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  autoComplete="name"
                  isDisabled={busy}
                  placeholder="First Last"
                  size="lg"
                  bg="white"
                  color="gray.800"
                  borderColor="gray.300"
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
            )}

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                isDisabled={busy}
                placeholder="Create a secure password"
                size="lg"
                bg="white"
                color="gray.800"
                borderColor="gray.300"
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>

            {mode === "signup" && (
              <Box>
                <Text fontWeight="semibold" mb={3}>
                  Children
                </Text>

                <Stack spacing={4}>
                  {children.map((child, index) => (
                    <SimpleGrid
                      key={index}
                      columns={{ base: 1, md: 12 }}
                      spacing={3}
                      alignItems="end"
                    >
                      <FormControl gridColumn={{ base: "auto", md: "span 7" }}>
                        <FormLabel fontSize="sm">Child name</FormLabel>
                        <Input
                          value={child.name}
                          onChange={(e) =>
                            updateChild(index, { name: e.target.value })
                          }
                          isDisabled={busy}
                          placeholder="Child name"
                          bg="white"
                          color="gray.800"
                          borderColor="gray.300"
                          _placeholder={{ color: "gray.400" }}
                        />
                      </FormControl>

                      <FormControl gridColumn={{ base: "auto", md: "span 3" }}>
                        <FormLabel fontSize="sm">Age</FormLabel>
                        <NumberInput
                          value={child.age}
                          min={0}
                          max={25}
                          onChange={(_, numberValue) =>
                            updateChild(index, {
                              age: Number.isFinite(numberValue) ? numberValue : 0,
                            })
                          }
                          isDisabled={busy}
                        >
                          <NumberInputField
                            bg="white"
                            color="gray.800"
                            borderColor="gray.300"
                          />
                        </NumberInput>
                      </FormControl>

                      <IconButton
                        gridColumn={{ base: "auto", md: "span 2" }}
                        aria-label="Remove child"
                        icon={<CloseIcon />}
                        onClick={() => removeChildRow(index)}
                        isDisabled={busy || children.length === 1}
                        variant="outline"
                      />
                    </SimpleGrid>
                  ))}

                  <Button
                    onClick={addChildRow}
                    isDisabled={busy}
                    variant="outline"
                    variant="outline"
borderColor="#5f6f52"
color="#5f6f52"
_hover={{ bg: "#f0f3ed" }}
                    alignSelf="flex-start"
                  >
                    + Add another child
                  </Button>
                </Stack>
              </Box>
            )}

            <Button
              type="submit"
              bg="#5f6f52"
color="white"
_hover={{ bg: "#4f5f44" }}
              size="lg"
              isLoading={busy}
              isDisabled={disableSubmit}
            >
              {mode === "signup" ? "Create account" : "Sign in"}
            </Button>

            {(signUp.error?.message || signIn.error?.message) && (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                {signUp.error?.message || signIn.error?.message}
              </Alert>
            )}
          </Stack>
        </Box>
      </VStack>
    </Box>
  );
}


