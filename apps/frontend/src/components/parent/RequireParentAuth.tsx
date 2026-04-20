import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

const TOKEN_KEY = "parent_access_token";

export function RequireParentAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [checked, setChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      const redirect = encodeURIComponent(
        location.pathname + location.search
      );

      navigate(`/parent/auth?redirect=${redirect}`, { replace: true });

      setAuthorized(false);
      setChecked(true);
      return;
    }

    setAuthorized(true);
    setChecked(true);
  }, [navigate, location.pathname, location.search]);

  // ⏳ Still checking auth
  if (!checked) {
    return (
      <Box p={10}>
        <VStack spacing={3}>
          <Spinner />
          <Text>Checking parent sign-in…</Text>
        </VStack>
      </Box>
    );
  }

  // 🔁 Redirecting (no token)
  if (!authorized) {
    return (
      <Box p={10}>
        <VStack spacing={3}>
          <Spinner />
          <Text>Redirecting to parent sign-in…</Text>
        </VStack>
      </Box>
    );
  }

  // ✅ Authorized — now render children
  return <>{children}</>;
}
