"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { Registration } from "./types";
import LinearProgress from "@mui/material/LinearProgress";
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";

import Login from "./Login";
import ChildSelect from "./ChildSelect";
import Payment from "./Payment";
import ChildsInformation from "./ChildsInformation";
import Schedule from "./Schedule";
import Divorced from "./Divorced";
import Custody from "./Custody";
import Immunization from "./Immunization";
import ThanksgivingPointMembership from "./ThanksgivingPointMembership";
import { useRegistrationMutation } from "./registrationQueries";

const steps = [
  "Login",
  "Child",
  "Information",
  "Schedule",
  "Divorced",
  "Custody",
  "Immunization",
  "Thanksgiving Point Membership",
  "Payment",
];

const muiTheme = createTheme({
  palette: {
    primary: { main: "#2f7f7a" },
    background: { default: "#f8f6f1" },
  },
  typography: {
    fontFamily: '"Nunito", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

export default function RegistrationPage() {
  const registrationMutation = useRegistrationMutation();

  const [activeStep, setActiveStep] = React.useState(0);

  const [registration, setRegistration] = React.useState<Registration>({

    // auth-ish fields (Login step handles these)
    email: "",
    password: "",
    parentName: "",

    // used by ChildSelect (populate this after login/create account)
    // expected shape: [{ id: "abc", label: "Elsie (4)" }, ...]
    childrenOptions: [] as Array<{ id: string; label: string }>,

    // fields in your router schema
    divorce: "",
    custody: "",
    immunization: "",
    tgMembership: "",
    whichChild: [] as string[],
    dropOffSchedule: "",
    pickUpSchedule: "",

    schedule: "",
    allergies: "",
    listOfAllergies: "",
    support: "",
    listSupport: "",
    emailList: [] as string[],

    // payment fields (match router naming: expirationDate + cvvNumber)
    nameOnCard: "",
    cardNumber: "",
    expirationDate: "",
    cvvNumber: "",

    // extra fields you have in components (fine to keep)
    zip: "",
    selectedChild: "",
    childFirstName: "",
    childLastName: "",
    childDob: null as any,
    scheduleStartDate: null as any,
    scheduleType: "",
   
  });

  const handleNext = () => setActiveStep((s) => Math.min(s + 1, steps.length));
  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    registrationMutation.mutate(registration as any, {
      onSuccess: () => setActiveStep(steps.length),
      onError: (err) => console.error("Registration failed", err),
    });
  };

  // Step content (inline so we can pass onAuthed only to Login)
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Login
            registration={registration}
            setRegistration={setRegistration}
            onAuthed={() => setActiveStep(1)} // ✅ auto-advance after sign in / create account
          />
        );
      case 1:
        return <ChildSelect registration={registration} setRegistration={setRegistration} />;
      case 2:
        return <ChildsInformation registration={registration} setRegistration={setRegistration} />;
      case 3:
        return <Schedule registration={registration} setRegistration={setRegistration} />;
      case 4:
        return <Divorced registration={registration} setRegistration={setRegistration} />;
      case 5:
        return <Custody registration={registration} setRegistration={setRegistration} />;
      case 6:
        return <Immunization registration={registration} setRegistration={setRegistration} />;
      case 7:
        return (
          <ThanksgivingPointMembership
            registration={registration}
            setRegistration={setRegistration}
          />
        );
      case 8:
        return <Payment registration={registration} setRegistration={setRegistration} />;
      default:
        return null;
    }
  };

  const showProgressHeader = activeStep < steps.length;
  const showFooterNav = activeStep !== 0 && activeStep < steps.length; // ✅ hide footer on login step

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />

        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            py: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="md">
            {/* HERO */}
            <Box
              sx={{
                bgcolor: "#efe5d6",
                borderRadius: 4,
                py: { xs: 7, md: 9 },
                px: { xs: 3, md: 6 },
                textAlign: "center",
                mb: 6,
              }}
            >
              <Typography
                component="h1"
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#2f7f7a",
                  letterSpacing: "0.08em",
                  mb: 2,
                }}
              >
                Registration
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  maxWidth: 560,
                  mx: "auto",
                  color: "text.secondary",
                  mb: 2,
                }}
              >
                Secure your spot — we’ll walk you through it step by step.
              </Typography>

              <Link href="/" underline="hover" sx={{ fontWeight: 500 }}>
                Return home
              </Link>
            </Box>

            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
              }}
            >
              {/* STEP HEADER */}
              {showProgressHeader && (
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {steps[activeStep]}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Step {activeStep + 1} of {steps.length}
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={((activeStep + 1) / steps.length) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      bgcolor: "#eee7dd",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                      },
                    }}
                  />
                </Box>
              )}

              {activeStep === steps.length ? (
                <>
                  <Typography variant="h5" gutterBottom>
                    You’re all set 🎉
                  </Typography>
                  <Typography variant="subtitle1">
                    Your class assignment will be sent to you soon.
                  </Typography>
                </>
              ) : (
                <>
                  <Box sx={{ display: "grid", gap: 3 }}>{renderStep()}</Box>

                  {/* FOOTER NAV (hidden on Step 0) */}
                  {showFooterNav && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 4,
                      }}
                    >
                      <Button variant="text" onClick={handleBack} sx={{ mr: 1.5 }}>
                        Back
                      </Button>

                      {activeStep === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={registrationMutation.isLoading}
                          sx={{
                            borderRadius: 999,
                            px: 4,
                            py: 1.2,
                            boxShadow: "0 4px 10px rgba(47,127,122,0.25)",
                          }}
                        >
                          {registrationMutation.isLoading ? "Submitting…" : "Register Now"}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{
                            borderRadius: 999,
                            px: 4,
                            py: 1.2,
                            boxShadow: "0 4px 10px rgba(47,127,122,0.25)",
                          }}
                        >
                          Next
                        </Button>
                      )}
                    </Box>
                  )}
                </>
              )}
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
