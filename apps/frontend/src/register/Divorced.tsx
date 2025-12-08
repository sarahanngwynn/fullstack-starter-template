"use client";

import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

type Registration = {
  divorce: string;
  [key: string]: any;
};

interface DivorcedProps {
  registration: Registration;
  setRegistration: (value: Registration) => void;
}

export default function Divorced({
  registration,
  setRegistration,
}: DivorcedProps) {
  const handleSelect =
    (value: "Yes" | "No") =>
    (_event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
      if (checked) {
        setRegistration({
          ...registration,
          divorce: value,
        });
      } else {
        setRegistration({
          ...registration,
          divorce: "",
        });
      }
    };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Are you divorced?
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Yes"
            checked={registration.divorce === "Yes"}
            onChange={handleSelect("Yes")}
            data-cy="divorcedYes"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="No"
            checked={registration.divorce === "No"}
            onChange={handleSelect("No")}
            data-cy="divorcedNo"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
