"use client";

import * as React from "react";
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
import { ThemeProvider, createTheme } from "@mui/material/styles";

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

const muiTheme = createTheme();

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright \u00a9 "}
      <Link color="inherit" href="https://mydancingmoose.com/">
        Dancing Moose
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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

function getStepContent(
  step: number,
  registration: any,
  setRegistration: React.Dispatch<React.SetStateAction<any>>
) {
  switch (step) {
    case 0:
      return (
        <Login registration={registration} setRegistration={setRegistration} />
      );
    case 1:
      return (
        <ChildSelect
          registration={registration}
          setRegistration={setRegistration}
        />
      );
    case 2:
      return (
        <ChildsInformation
          registration={registration}
          setRegistration={setRegistration}
        />
      );
    case 3:
      return (
        <Schedule
          registration={registration}
          setRegistration={setRegistration}
        />
      );
    case 4:
      return (
        <Divorced
          registration={registration}
          setRegistration={setRegistration}
        />
      );
    case 5:
      return (
        <Custody
          registration={registration}
          setRegistration={setRegistration}
        />
      );
    case 6:
      return (
        <Immunization
          registration={registration}
          setRegistration={setRegistration}
        />
      );
    case 7:
      return (
        <ThanksgivingPointMembership
          registration={registration}
          setRegistration={setRegistration}
        />
      );
    case 8:
      return (
        <Payment
          registration={registration}
          setRegistration={setRegistration}
        />
      );
    default:
      throw new Error("Unknown step");
  }
}

export default function RegistrationPage() {
  const registrationMutation = useRegistrationMutation();

  const [activeStep, setActiveStep] = React.useState(0);
  const [registration, setRegistration] = React.useState({
    // login
    email: "",
    password: "",
    // yes/no pages
    divorce: "",
    custody: "",
    immunization: "",
    tgMembership: "",
    // payment
    nameOnCard: "",
    cardNumber: "",
    expirationDate: "",
    cvvNumber: "",
    // schedule
    schedule: "", // keep for backwards compatibility if backend expects it
    dropOffSchedule: "",
    pickUpSchedule: "",
    // child info
    allergies: "",
    listOfAllergies: "",
    support: "",
    listSupport: "",
    // misc
    whichChild: [] as string[],
    emailList: [] as string[],
  });

  const handleSubmit = () => {
    registrationMutation.mutate(registration, {
      onSuccess: () => {
        // show the success message step
        setActiveStep(steps.length);
      },
      onError: (err) => {
        console.error("Failed to submit registration", err);
        // later: show a toast / error message
      },
    });
  };

  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  return (
    <ThemeProvider theme={muiTheme}>
      <React.Fragment>
        <CssBaseline />
        <AppBar
          position="absolute"
          color="default"
          elevation={0}
          sx={{
            position: "relative",
            borderBottom: (t) => `1px solid t${t.palette.divider}`,
          }}
        >
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              Dancing Moose
            </Typography>
          </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
          <Paper
            variant="outlined"
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
          >
            <Typography component="h1" variant="h4" align="center">
              Registration
            </Typography>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Congratulations! You have registered and secured your spot!
                </Typography>
                <Typography variant="subtitle1">
                  Your class assignment will be sent to you soon.
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep, registration, setRegistration)}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      data-cy="submit"
                      sx={{ mt: 3, ml: 1 }}
                      disabled={registrationMutation.isLoading}
                    >
                      {registrationMutation.isLoading
                        ? "Submitting..."
                        : "Register Now"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      data-cy="next"
                      sx={{ mt: 3, ml: 1 }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </React.Fragment>
            )}
          </Paper>
          <Copyright />
        </Container>
      </React.Fragment>
    </ThemeProvider>
  );
}

