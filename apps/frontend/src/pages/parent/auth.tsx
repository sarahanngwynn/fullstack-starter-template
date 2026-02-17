import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Heading, Text } from "@chakra-ui/react";
import { ParentAuthCard } from "../../components/ParentAuthCard";

function useRedirectTarget() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  return params.get("redirect") || "/parent";
}

export default function ParentAuthPage() {
  const navigate = useNavigate();
  const redirectTo = useRedirectTarget();

  return (
    <Box minH="calc(100vh - 64px)" bg="#f5f1ea" py={10} px={4}>
      <Box
        maxW="720px"
        mx="auto"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="2xl"
        p={{ base: 5, md: 8 }}
        boxShadow="md"
        color="gray.800"
      >
        <Heading size="lg" mb={2}>
          Parent Portal
        </Heading>
        <Text color="gray.600" mb={6}>
          Sign in or create an account to continue.
        </Text>

        <ParentAuthCard
          onAuthed={() => {
            navigate(redirectTo);
          }}
        />
      </Box>
    </Box>
  );
}

