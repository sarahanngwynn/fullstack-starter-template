"use client";

import React from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { ParentAuthCard } from "../../../components/ParentAuthCard";

function getAgeFromBirthDate(birthDate?: string) {
  if (!birthDate) return 3;

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return Math.max(0, age);
}

export default function ParentAuthPage() {
  const [prefill, setPrefill] = React.useState<any>(null);

  React.useEffect(() => {
    const raw = sessionStorage.getItem("pending_parent_account_prefill");
    if (!raw) return;

    const parsed = JSON.parse(raw);

    setPrefill({
      email: parsed.email ?? "",
      parentName: parsed.parentName ?? "",
      children: [
        {
          name: parsed.childName ?? "",
          age: getAgeFromBirthDate(parsed.childBirthDate),
        },
      ],
    });
  }, []);

  return (
    <Box bg="#f8f6f1" minH="100vh" py={10} px={4}>
      <Box maxW="900px" mx="auto">
        <VStack align="stretch" spacing={6}>
          <Box>
            <Heading size="xl" color="gray.800">
              Create Your Parent Account
            </Heading>

            <Text mt={2} color="gray.600" fontSize="lg">
              We filled in what we could from your application. Just create a password to finish.
            </Text>
          </Box>

          <ParentAuthCard
            prefill={prefill}
            onAuthed={() => {
              sessionStorage.removeItem("pending_parent_account_prefill");
              window.location.href = "/parent";
            }}
          />
        </VStack>
      </Box>
    </Box>
  );
}