import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

export function RequireParentAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("parent_access_token");
    if (!token) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/parent/auth?redirect=${redirect}`, { replace: true });
    }
  }, [navigate, location.pathname, location.search]);

  // While redirecting / checking:
  return (
    <Box p={10}>
      <VStack spacing={3}>
        <Spinner />
        <Text>Checking parent sign-in…</Text>
      </VStack>
      <Box mt={6}>{children}</Box>
    </Box>
  );
}
