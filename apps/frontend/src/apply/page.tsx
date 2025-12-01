"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { trpc } from "../utils/trpc";


import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import ParentDetails from "./ParentDetails";
import ChildsDetails from "./ChildsDetails";
import Location from "./Location";
import Program from "./Program";
import Payment from "./Payment";

type FormValues = {
  parentFirstName: string;
  parentLastName: string;
  email: string;
  phoneNumber: string;
  emailList: boolean;

  childFullName: string;
  childSex: string;
  childBirthDate: string;
  anyConcerns?: string | boolean;

  desiredLocation: string | null;
  desiredProgram: string | null;

  nameOnCard?: string;
  cardNumber?: string;
  expirationDate?: string;
  cvvNumber?: string;
};

const steps = ["Parent Details", "Child Details", "Location", "Program", "Payment"];

const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#2f7f7a", 
    },
    background: {
      default: "#f8f6f1", 
    },
  },
  typography: {
    fontFamily: '"Nunito", "Helvetica", "Arial", sans-serif',
  },
});

function getStepContent(
  step: number,
  control: any,
  errors: any
): React.ReactNode {
  switch (step) {
    case 0:
      return <ParentDetails control={control} errors={errors} />;
    case 1:
      return <ChildsDetails control={control} errors={errors} />;
    case 2:
      return <Location control={control} errors={errors} />;
    case 3:
      return <Program control={control} errors={errors} />;
    case 4:
      return <Payment control={control} errors={errors} />;
    default:
      return null;
  }
}

export default function ApplyPage() {
  const [activeStep, setActiveStep] = React.useState(0);

  // tRPC mutation to save the application to the backend
  const submitApplication = trpc.applications.submit.useMutation();

  const methods = useForm<FormValues>({
    defaultValues: {
      parentFirstName: "",
      parentLastName: "",
      email: "",
      phoneNumber: "",
      emailList: false,
      childFullName: "",
      childSex: "",
      childBirthDate: "",
      anyConcerns: "",
      desiredLocation: null,
      desiredProgram: null,
      nameOnCard: "",
      cardNumber: "",
      expirationDate: "",
      cvvNumber: "",
    },
    mode: "onSubmit",
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: FormValues) => {
    console.log("Application submitted:", data);

    // Call backend via tRPC
    submitApplication.mutate(
      {
        ...(data as any),
      },
      {
        onSuccess: (result: { id: string }) => {
          console.log("Saved to backend with id:", result.id);
          // Only move to success screen when save worked
          setActiveStep(steps.length);
        },
        onError: (error: unknown) => {
          console.error("Failed to save application:", error);
          // later: show a toast / error UI here
        },
      }
    );
  };

  const handleNext = () => {
    setActiveStep((s) => s + 1);
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              minHeight: "100vh",
              bgcolor: "background.default",
              py: { xs: 8, md: 10 },
            }}
          >
            <Container component="main" maxWidth="md">
              {/* HERO BAND – like the BLOG header */}
              <Box
                sx={{
                  bgcolor: "#efe5d6",
                  borderRadius: 3,
                  border: "1px solid #f5edde",
                  py: { xs: 6, md: 8 },
                  px: { xs: 2, md: 6 },
                  textAlign: "center",
                  mb: 4,
                }}
              >
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    mb: 2,
                    letterSpacing: "0.08em",
                    color: "#2f7f7a",
                    textTransform: "uppercase",
                  }}
                >
                  Enrollment Application
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: 700,
                    mx: "auto",
                    color: "text.secondary",
                  }}
                >
                  It takes a village, and we’d love to be part of yours. This
                  application is the first step in joining our community.
                </Typography>
              </Box>

              {/* FORM CARD */}
              <Paper
                variant="outlined"
                sx={{
                  my: { xs: 4, md: 6 },
                  p: { xs: 2.5, md: 4 },
                  borderRadius: 3,
                  borderColor: "#e2ddd4",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                  backgroundColor: "#ffffff",
                }}
              >
                <Stepper activeStep={activeStep} sx={{ pt: 1, pb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <FormProvider {...methods}>
                  {activeStep === steps.length ? (
                    <>
                      <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
                        Thank you for applying! 🎉
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        We’ve received your application and will be in touch
                        shortly with next steps.
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Link href="/" underline="hover">
                          Return home
                        </Link>
                      </Box>
                    </>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {getStepContent(
                        activeStep,
                        methods.control,
                        methods.formState.errors
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 4,
                        }}
                      >
                        {activeStep !== 0 && (
                          <Button
                            onClick={handleBack}
                            sx={{ mr: 1.5 }}
                            variant="text"
                          >
                            Back
                          </Button>
                        )}

                        {activeStep === steps.length - 1 ? (
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 999, px: 3 }}
                            disabled={submitApplication.isLoading}
                          >
                            {submitApplication.isLoading
                              ? "Submitting..."
                              : "Apply Now"}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 999, px: 3 }}
                            onClick={handleNext}
                          >
                            Next
                          </Button>
                        )}
                      </Box>
                    </form>
                  )}
                </FormProvider>
              </Paper>

              <Box sx={{ textAlign: "center", color: "text.secondary", mb: 2 }}>
                <Typography variant="body2">
                  Problems?{" "}
                  <Link href="mailto:support@example.com" underline="hover">
                    Contact us
                  </Link>
                </Typography>
              </Box>
            </Container>
          </Box>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

