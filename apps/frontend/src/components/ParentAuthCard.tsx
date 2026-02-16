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

    // Gentle auto-switch based on existence (nice UX)
    if (emailExists === true && mode === "signup") setMode("signin");
    if (emailExists === false && mode === "signin") setMode("signup");

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
      // mutation errors displayed below
    }
  }

  // ✅ FORCE LIGHT THEME LOOK (matches Apply page)
  const panelBg = "white";
  const border = "gray.200";
  const subtle = "gray.600";
  const helperBg = "gray.50";

  const disableSubmit =
    busy ||
    !emailNormalized ||
    !password ||
    (mode === "signup" && !parentName.trim());

  return (
    <Box
      bg={panelBg}
      border="1px solid"
      borderColor={border}
      borderRadius="2xl"
      p={{ base: 5, md: 6 }}
      color="gray.800"
    >
      <VStack align="stretch" spacing={5}>
        <HStack justify="space-between" align="center">
          <Heading size="sm" color="gray.800">
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
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="gray.800">Email</FormLabel>
              <Input
                bg="white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                isDisabled={busy}
                placeholder="you@email.com"
                type="email"
              />
            </FormControl>

            <Box minH="22px">
              {checkEmailQuery.isFetching && emailNormalized ? (
                <HStack spacing={2} color={subtle} fontSize="sm">
                  <Spinner size="xs" />
                  <Text>Checking email…</Text>
                </HStack>
              ) : emailExists === true ? (
                <Box bg={helperBg} borderRadius="lg" p={3} border="1px solid" borderColor="gray.200">
                  <Text fontSize="sm" color="gray.700">
                    Account found — you can{" "}
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setMode("signin")}
                      isDisabled={busy}
                      colorScheme="teal"
                      fontWeight="semibold"
                    >
                      sign in
                    </Button>
                    .
                  </Text>
                </Box>
              ) : emailExists === false && emailNormalized ? (
                <Box bg={helperBg} borderRadius="lg" p={3} border="1px solid" borderColor="gray.200">
                  <Text fontSize="sm" color="gray.700">
                    No account yet — you can{" "}
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setMode("signup")}
                      isDisabled={busy}
                      colorScheme="teal"
                      fontWeight="semibold"
                    >
                      create one
                    </Button>
                    .
                  </Text>
                </Box>
              ) : null}
            </Box>

            {mode === "signup" && (
              <FormControl isRequired>
                <FormLabel color="gray.800">Parent name</FormLabel>
                <Input
                  bg="white"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  autoComplete="name"
                  isDisabled={busy}
                  placeholder="First Last"
                />
              </FormControl>
            )}

            <FormControl isRequired>
              <FormLabel color="gray.800">Password</FormLabel>
              <Input
                bg="white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                isDisabled={busy}
                placeholder="••••••••"
              />
            </FormControl>

            {mode === "signup" && (
              <Box>
                <Text fontWeight="semibold" mb={2} color="gray.800">
                  Children
                </Text>

                <Stack spacing={3}>
                  {children.map((c, idx) => (
                    <HStack key={idx} spacing={3} align="end">
                      <FormControl>
                        <FormLabel fontSize="sm" color="gray.800">
                          Child name
                        </FormLabel>
                        <Input
                          bg="white"
                          value={c.name}
                          onChange={(e) =>
                            updateChild(idx, { name: e.target.value })
                          }
                          isDisabled={busy}
                          placeholder="Child name"
                        />
                      </FormControl>

                      <FormControl w="140px">
                        <FormLabel fontSize="sm" color="gray.800">
                          Age
                        </FormLabel>
                        <NumberInput
                          value={c.age}
                          min={0}
                          max={25}
                          onChange={(_, n) =>
                            updateChild(idx, {
                              age: Number.isFinite(n) ? n : 0,
                            })
                          }
                          isDisabled={busy}
                        >
                          <NumberInputField bg="white" />
                        </NumberInput>
                      </FormControl>

                      <IconButton
                        aria-label="Remove child"
                        icon={<CloseIcon />}
                        onClick={() => removeChildRow(idx)}
                        isDisabled={busy || children.length === 1}
                        variant="outline"
                        title={
                          children.length === 1
                            ? "Keep at least one row"
                            : "Remove"
                        }
                      />
                    </HStack>
                  ))}

                  <Button
                    onClick={addChildRow}
                    isDisabled={busy}
                    variant="outline"
                    colorScheme="teal"
                    alignSelf="flex-start"
                  >
                    + Add another child
                  </Button>
                </Stack>
              </Box>
            )}

            <Button
              type="submit"
              colorScheme="teal"
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

            <Text fontSize="sm" color={subtle}>
              Token is stored as <code>parent_access_token</code> in localStorage.
            </Text>
          </Stack>
        </Box>
      </VStack>
    </Box>
  );
}



