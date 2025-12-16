"use client";

import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import type { Registration } from "./types";


interface TGMembershipProps {
  registration: Registration;
  setRegistration: (value: Registration) => void;
}

export default function ThanksgivingPointMembership({
  registration,
  setRegistration,
}: TGMembershipProps) {
  const handleSelect =
    (value: "Yes" | "No") =>
    (_event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
      setRegistration({
        ...registration,
        tgMembership: checked ? value : "",
      });
    };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Do you have your Family Thanksgiving Point Membership?
      </Typography>

      <Grid container spacing={2}>
        {/* YES */}
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Yes"
            checked={registration.tgMembership === "Yes"}
            onChange={handleSelect("Yes")}
            data-cy="TGPMembershipYes"
          />
        </Grid>

        {/* NO */}
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="No"
            checked={registration.tgMembership === "No"}
            onChange={handleSelect("No")}
            data-cy="TGPMembershipNo"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
