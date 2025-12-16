"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import type { Registration } from "./types";


interface ChildsInformationProps {
  registration: Registration;
  setRegistration: React.Dispatch<React.SetStateAction<Registration>>;
}

export default function ChildsInformation({
  registration,
  setRegistration,
}: ChildsInformationProps) {
  const handleChange =
    (field: keyof Registration) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setRegistration((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Child&apos;s Information
      </Typography>

      <Grid container spacing={3}>
  <Grid item xs={12}>
    <TextField
      fullWidth
      required
      label="Any allergies?"
      value={registration.allergies}
      onChange={handleChange("allergies")}
    />
  </Grid>

  <Grid item xs={12}>
    <TextField
      fullWidth
      label="List of allergies"
      value={registration.listOfAllergies}
      onChange={handleChange("listOfAllergies")}
    />
  </Grid>

  <Grid item xs={12}>
    <TextField
      fullWidth
      required
      label="Does your child need extra support?"
      value={registration.support}
      onChange={handleChange("support")}
    />
  </Grid>

  <Grid item xs={12}>
    <TextField
      fullWidth
      label="What support does your child need?"
      value={registration.listSupport}
      onChange={handleChange("listSupport")}
    />
  </Grid>
</Grid>

    </React.Fragment>
  );
}
