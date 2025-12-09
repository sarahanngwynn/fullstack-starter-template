"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

type Registration = {
  allergies: string;
  listOfAllergies: string;
  support: string;
  listSupport: string;
  [key: string]: any;
};

interface ChildsInformationProps {
  registration: Registration;
  setRegistration: (value: Registration) => void;
}

export default function ChildsInformation({
  registration,
  setRegistration,
}: ChildsInformationProps) {
  const handleChange =
    (field: keyof Registration) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRegistration({
        ...registration,
        [field]: event.target.value,
      });
    };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Child&apos;s Information
      </Typography>
      <Grid container spacing={2}>
        {/* Any Allergies? */}
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="Yes/No"
            name="anyAllergies"
            data-cy="allergies"
            required
            fullWidth
            id="anyAllergies"
            label="Any Allergies?"
            value={registration.allergies}
            onChange={handleChange("allergies")}
            autoFocus
          />
        </Grid>

        {/* List of allergies */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="listOfAllergies"
            label="List of allergies"
            name="listOfAllergies"
            data-cy="listOfAllergies"
            value={registration.listOfAllergies}
            onChange={handleChange("listOfAllergies")}
            autoComplete="off"
          />
        </Grid>

        {/* Extra support? */}
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="Yes/No"
            name="support"
            required
            fullWidth
            id="support"
            data-cy="extraSupport"
            label="Does your child need extra support?"
            value={registration.support}
            onChange={handleChange("support")}
          />
        </Grid>

        {/* What support? */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="whatSupport"
            label="What support does your child need?"
            name="whatSupport"
            data-cy="whatSupport"
            autoComplete="off"
            value={registration.listSupport}
            onChange={handleChange("listSupport")}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
