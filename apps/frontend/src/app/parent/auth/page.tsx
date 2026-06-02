"use client";

import React from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { ParentAuthCard } from "../../../components/ParentAuthCard";

export default function ParentAuthPage() {
  return (
    <Box bg="#f8f6f1" minH="100vh" py={10} px={4}>
      <Box maxW="900px" mx="auto">
        <VStack align="stretch" spacing={6}>
          <Box>
            <Heading size="xl" color="gray.800">
              Parent Portal
            </Heading>

            <Text mt={2} color="gray.600" fontSize="lg">
              Sign in or create an account to continue.
            </Text>
          </Box>

          <ParentAuthCard
            onAuthed={() => {
              window.location.href = "/parent";
            }}
          />
        </VStack>
      </Box>
    </Box>
  );
}