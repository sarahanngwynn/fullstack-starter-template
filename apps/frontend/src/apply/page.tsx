"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";

// ---- MUI core ----
import { StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

// ---- MUI date pickers ----
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// ---- Step components ----
import ParentDetails from "./ParentDetails";
import ChildsDetails from "./ChildsDetails";
import Location from "./Location";
import Program from "./Program";
import Payment from "./Payment";

// ---------- Types ----------
type FormValues = {
  parentFirstName?: string;
  parentLastName?: string;
  email?: string;
  phoneNumber?: string;
  emailList?: boolean;

  childFullName?: string;
  childSex?: string;
  childBirthDate?: string; // string or Date; ChildsDetails uses dayjs
  anyConcerns?: string | boolean;

  desiredLocation?: string | null;
  desiredProgram?: string | null;

  nameOnCard?: string;
  cardNumber?: string;
  expirationDate?: string;
  cvvNumber?: string;
};

const steps = ["Parent Details", "Child Details", "Location", "Program", "Payment"];

// Provide a stable MUI theme (prevents undefined theme errors)
const muiTheme = createTheme();

function getStepContent(step: number, control: any, errors: any): React.ReactNode {
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
    setActiveStep(steps.length); // show success screen
  };

  const handleNext = async () => {
    // If you want per-step validation, call methods.trigger([...fields]) here.
    setActiveStep((s) => s + 1);
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AppBar position="absolute" color="default" elevation={0}>
            <Toolbar>
              <Typography variant="h6" color="inherit" noWrap>
                Happy Moose — Apply
              </Typography>
            </Toolbar>
          </AppBar>

          <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: 12, p: { xs: 2, md: 4 } }}>
              <Typography component="h1" variant="h4" align="center" sx={{ mb: 2 }}>
                Apply for Dancing Moose
              </Typography>

              <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <FormProvider {...methods}>
                {activeStep === steps.length ? (
                  <>
                    <Typography variant="h5" gutterBottom>
                      Thank you for applying! 🎉
                    </Typography>
                    <Typography variant="body1">
                      We’ve received your application. We’ll be in touch shortly.
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <Link href="/">Return home</Link>
                    </Box>
                  </>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {getStepContent(activeStep, methods.control, methods.formState.errors)}

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      {activeStep !== 0 && (
                        <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                          Back
                        </Button>
                      )}

                      {activeStep === steps.length - 1 ? (
                        <Button type="submit" variant="contained" sx={{ mt: 3, ml: 1 }}>
                          Apply Now
                        </Button>
                      ) : (
                        <Button variant="contained" sx={{ mt: 3, ml: 1 }} onClick={handleNext}>
                          Next
                        </Button>
                      )}
                    </Box>
                  </form>
                )}
              </FormProvider>
            </Paper>

            <Box sx={{ textAlign: "center", color: "text.secondary" }}>
              <Typography variant="body2">
                Problems? <Link href="mailto:support@example.com">Contact us</Link>
              </Typography>
            </Box>
          </Container>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
