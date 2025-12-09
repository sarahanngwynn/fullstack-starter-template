"use client";

import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

type Registration = {
  custody: string;
  [key: string]: any;
};

interface CustodyProps {
  registration: Registration;
  setRegistration: (value: Registration) => void;
}

export default function Custody({ registration, setRegistration }: CustodyProps) {
  const handleSelect =
    (value: "Yes" | "No") =>
    (_event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
      if (checked) {
        setRegistration({
          ...registration,
          custody: value,
        });
      } else {
        // unchecking resets the field
        setRegistration({
          ...registration,
          custody: "",
        });
      }
    };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Do you have custody papers?
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Yes"
            checked={registration.custody === "Yes"}
            onChange={handleSelect("Yes")}
            data-cy="custodyPapersYes"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="No"
            checked={registration.custody === "No"}
            onChange={handleSelect("No")}
            data-cy="custodyPapersNo"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
