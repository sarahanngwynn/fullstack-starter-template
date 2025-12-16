"use client";

import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import type { Registration } from "./types";



interface ImmunizationProps {
  registration: Registration;
  setRegistration: (value: Registration) => void;
}

export default function Immunization({
  registration,
  setRegistration,
}: ImmunizationProps) {
  const handleSelect =
    (value: "Yes" | "No") =>
    (_event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
      if (checked) {
        setRegistration({
          ...registration,
          immunization: value,
        });
      } else {
        setRegistration({
          ...registration,
          immunization: "",
        });
      }
    };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Is your child up to date on their immunizations?
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Yes"
            checked={registration.immunization === "Yes"}
            onChange={handleSelect("Yes")}
            data-cy="immunizationsYes"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="No"
            checked={registration.immunization === "No"}
            onChange={handleSelect("No")}
            data-cy="immunizationsNo"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
