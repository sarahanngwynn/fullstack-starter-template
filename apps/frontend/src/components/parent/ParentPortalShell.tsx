"use client";

import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "parent_access_token";

type ParentPortalShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function ParentPortalShell({
  title,
  subtitle,
  children,
}: ParentPortalShellProps) {
  const navigate = useNavigate();

  return (
    <Box bg="#f8f6f1" minH="100vh" py={10} px={4}>
      <Box maxW="1100px" mx="auto">
        <VStack align="stretch" spacing={6}>
          <Flex justify="space-between" align="flex-start" gap={4} wrap="wrap">
            <Box>
              <Heading size="xl" color="gray.800">
                {title}
              </Heading>

              {subtitle && (
                <Text mt={2} color="gray.600" fontSize="lg">
                  {subtitle}
                </Text>
              )}
            </Box>

            <HStack spacing={3} flexWrap="wrap">
              <Button variant="outline" onClick={() => navigate("/parent")}>
                Dashboard
              </Button>

              <Button variant="outline" onClick={() => navigate("/parent/profile")}>
                Profile
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

          {children}
        </VStack>
      </Box>
    </Box>
  );
}