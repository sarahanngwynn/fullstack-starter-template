import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

const TOKEN_KEY = "parent_access_token";

export function RequireParentAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/parent/auth?redirect=${redirect}`, { replace: true });
      setHasToken(false);
      return;
    }

    setHasToken(true);
  }, [navigate, location.pathname, location.search]);

  if (hasToken === true) {
    return <>{children}</>;
  }

  return (
    <Box p={10} minH="300px" display="grid" placeItems="center">
      <VStack spacing={3} color="gray.700">
        <Spinner color="teal.500" />
        <Text>Checking parent sign-in…</Text>
      </VStack>
    </Box>
  );
}
