"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { trpc } from "../utils/trpc";
import { useNavigate } from "react-router-dom";

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

type PaymentMethod = "card" | "ach" | "check" | "other";

type FormValues = {
  parentFirstName: string;
  parentLastName: string;
  email: string;
  phoneNumber: string;
  emailList: boolean;

  childFullName: string;
  childSex: string;
  childBirthDate: string;
  anyConcerns?: string;

  desiredLocation: string;
  desiredProgram: string;

  paymentMethod: PaymentMethod;
  billingZip: string;
  authorizePayment: boolean;
  cardName: string;

  // UI-only fields
  cardNumber?: string;
  expirationDate?: string;
  cvvNumber?: string;
};

type Prefill = {
  parentFirstName?: string;
  parentLastName?: string;
  email?: string;
  childFullName?: string;
};

const steps = [
  "Parent Details",
  "Child Details",
  "Location",
  "Program",
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
});

function getStepContent(
  step: number,
  control: any,
  errors: any,
  prefill: Prefill,
  locked: { parentIdentityLocked: boolean }
) {
  switch (step) {
    case 0:
      return (
        <ParentDetails
          control={control}
          errors={errors}
          prefill={prefill}
          locked={locked}
        />
      );
    case 1:
      return (
        <ChildsDetails
          control={control}
          errors={errors}
          prefill={prefill}
          locked={locked}
        />
      );
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
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = React.useState(0);
  const [parentToken, setParentToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    setParentToken(localStorage.getItem("parent_access_token"));
  }, []);

  const submitApplication = trpc.applications.submit.useMutation();

  const meQuery = trpc.parents.me.useQuery(undefined, {
    enabled: !!parentToken,
    retry: false,
  });

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

      desiredLocation: "",
      desiredProgram: "",

      paymentMethod: "card",
      billingZip: "",
      authorizePayment: false,
      cardName: "",

      cardNumber: "",
      expirationDate: "",
      cvvNumber: "",
    },
    mode: "onSubmit",
  });

  const { handleSubmit, setValue, getValues } = methods;

  const prefill = React.useMemo<Prefill>(() => {
    const me: any = meQuery.data;
    if (!me) return {};

    const fullName =
      (me.firstName && me.lastName
        ? `${me.firstName} ${me.lastName}`
        : me.parentName) ?? "";

    let firstName = me.firstName ?? "";
    let lastName = me.lastName ?? "";

    if ((!firstName || !lastName) && typeof fullName === "string" && fullName.trim()) {
      const parts = fullName.trim().split(/\s+/);
      firstName = firstName || parts[0] || "";
      lastName = lastName || parts.slice(1).join(" ") || "";
    }

    const child0 =
      Array.isArray(me.children) && me.children.length ? me.children[0] : null;

    const childFullName =
      child0?.fullName ??
      child0?.name ??
      [child0?.firstName, child0?.lastName].filter(Boolean).join(" ") ??
      "";

    return {
      parentFirstName: firstName,
      parentLastName: lastName,
      email: (me.email ?? "").toLowerCase(),
      childFullName: childFullName || undefined,
    };
  }, [meQuery.data]);

  const locked = React.useMemo(
    () => ({
      parentIdentityLocked: !!prefill.email,
    }),
    [prefill.email]
  );

  const didPrefillRef = React.useRef(false);

  React.useEffect(() => {
    if (didPrefillRef.current) return;
    if (!prefill.email) return;

    const current = getValues();

    if (!current.parentFirstName && prefill.parentFirstName) {
      setValue("parentFirstName", prefill.parentFirstName);
    }
    if (!current.parentLastName && prefill.parentLastName) {
      setValue("parentLastName", prefill.parentLastName);
    }
    if (!current.email && prefill.email) {
      setValue("email", prefill.email);
    }
    if (!current.childFullName && prefill.childFullName) {
      setValue("childFullName", prefill.childFullName);
    }

    didPrefillRef.current = true;
  }, [prefill, getValues, setValue]);

  const onSubmit = (data: FormValues) => {
    const payload = {
      parentFirstName: data.parentFirstName,
      parentLastName: data.parentLastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      emailList: data.emailList,

      childFullName: data.childFullName,
      childSex: data.childSex,
      childBirthDate: data.childBirthDate,
      anyConcerns: data.anyConcerns,

      desiredLocation: data.desiredLocation,
      desiredProgram: data.desiredProgram,

      paymentMethod: data.paymentMethod,
      billingZip: data.billingZip,
      authorizePayment: data.authorizePayment,
      cardName: data.cardName,
    };

    submitApplication.mutate(payload, {
      onSuccess: (result: { id: string }) => {
        console.log("Saved to backend with id:", result.id);
      
        sessionStorage.setItem(
          "pending_parent_account_prefill",
          JSON.stringify({
            email: data.email,
            parentName: `${data.parentFirstName} ${data.parentLastName}`.trim(),
            childName: data.childFullName,
            childBirthDate: data.childBirthDate,
          })
        );
      
        navigate("/parent/auth?fromApplication=1", { replace: true });
      },
      onError: (error: any) => {
        console.error("Failed to save application:", error);
        console.error("message:", error?.message);
        console.error("data:", error?.data);
        console.error("shape:", error?.shape);
      },
    });
  };

  const handleNext = () => setActiveStep((s) => s + 1);
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

                {meQuery.isLoading && (
                  <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                    Loading your parent account…
                  </Typography>
                )}

                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {getStepContent(
                      activeStep,
                      methods.control,
                      methods.formState.errors,
                      prefill,
                      locked
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