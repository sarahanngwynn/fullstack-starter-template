import { Route, Routes } from "react-router-dom";
import SidebarWithHeader from "../components/SidebarWithHeader/SidebarWithHeader";
import { QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import SignUpCard from "../components/Auth/SignUpCard/SignUpCard";
import SignInCard from "../components/Auth/SignInCard/SignInCard";
import { useQueryTrpcClient } from "./useQueryClient";
import AuthVerify from "../components/Auth/AuthVerify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "../pages/Home";
import { Box } from "@chakra-ui/react";
import ApplyPage from "../apply/page";
import RegistrationPage from "../register/page";
import ParentDashboard from "../pages/parent";
import ParentAuthPage from "../pages/parent/auth";
import ParentProfile from "../app/parent/profile/page";
import { RequireParentAuth } from "../components/parent/RequireParentAuth";

export function App() {
  const { queryClient, trpcClient } = useQueryTrpcClient();

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="colored"
        hideProgressBar
        closeOnClick
      />

      <QueryClientProvider client={queryClient}>
        <AuthVerify />
        <SidebarWithHeader>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-up" element={<SignUpCard />} />
            <Route path="/login" element={<SignInCard />} />

            <Route path="/apply" element={<ApplyPage />} />

            <Route
              path="/register"
              element={
                <RequireParentAuth>
                  <RegistrationPage />
                </RequireParentAuth>
              }
            />

            <Route
              path="/parent"
              element={
                <RequireParentAuth>
                  <ParentDashboard />
                </RequireParentAuth>
              }
            />

            <Route
              path="/parent/profile"
              element={
                <RequireParentAuth>
                  <ParentProfile />
                </RequireParentAuth>
              }
            />

            <Route path="/parent/auth" element={<ParentAuthPage />} />

            <Route path="*" element={<Box>Not Found</Box>} />
          </Routes>
        </SidebarWithHeader>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
