import SuperJSON from "superjson";
import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "../utils/trpc";

export const useQueryTrpcClient = () => {
  const APP_URL = import.meta.env.VITE_APP_URL;
  if (!APP_URL) throw new Error("No app url env variable found");

  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: APP_URL,
          headers() {
            // ✅ Parent portal routes should send the parent token
            const pathname =
            typeof window !== "undefined" ? window.location.pathname : "";
          
          const isParentRoute =
            pathname.startsWith("/parent") ||
            pathname.startsWith("/apply") ||
            pathname.startsWith("/register");
          

            if (isParentRoute) {
              const parentToken = localStorage.getItem("parent_access_token");
              if (parentToken) {
                return {
                  authorization: `Bearer ${parentToken}`,
                };
              }
              return {};
            }

            // ✅ All other routes use the normal staff token
            const userJson = localStorage.getItem("user");
            if (userJson) {
              try {
                const user = JSON.parse(userJson);
                if (user?.accessToken) {
                  return {
                    authorization: `Bearer ${user.accessToken}`,
                  };
                }
              } catch {
                // ignore malformed user json
              }
            }

            return {};
          },
        }),
      ],
      transformer: SuperJSON,
    })
  );

  return { queryClient, trpcClient };
};

