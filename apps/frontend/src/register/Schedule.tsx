"use client";

import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

type Registration = {
  dropOffSchedule: string;
  pickUpSchedule: string;
  [key: string]: any;
};

interface ScheduleProps {
  registration: Registration;
  setRegistration: (value: Registration) => void;
}

const DROP_OFF_OPTIONS = [
  "8:30-8:45 am (Normal drop off time)",
  "8:00 am",
  "7:30 am",
];

const PICK_UP_OPTIONS = [
  "3:30-3:45 pm (Normal pick up time)",
  "4:00 pm",
  "4:30 pm",
  "5:00 pm",
  "5:30 pm",
];

export default function Schedule({
  registration,
  setRegistration,
}: ScheduleProps) {
  const handleDropOffSelect =
    (value: string) =>
    (_event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
      setRegistration({
        ...registration,
        dropOffSchedule: checked ? value : "",
      });
    };

  const handlePickUpSelect =
    (value: string) =>
    (_event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
      setRegistration({
        ...registration,
        pickUpSchedule: checked ? value : "",
      });
    };

  return (
    <React.Fragment>
      {/* Drop-off */}
      <Typography variant="h6" gutterBottom>
        Desired Drop Off Schedule
      </Typography>

      <Grid container spacing={2}>
        {DROP_OFF_OPTIONS.map((option, index) => (
          <Grid item xs={12} key={option}>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label={option}
              checked={registration.dropOffSchedule === option}
              onChange={handleDropOffSelect(option)}
              // keep original data-cy on the "normal" option
              data-cy={index === 0 ? "dropOff" : undefined}
            />
          </Grid>
        ))}
      </Grid>

      {/* Pick-up */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Desired Pick Up Schedule
      </Typography>

      <Grid container spacing={2}>
        {PICK_UP_OPTIONS.map((option, index) => (
          <Grid item xs={12} key={option}>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label={option}
              checked={registration.pickUpSchedule === option}
              onChange={handlePickUpSelect(option)}
              // keep original data-cy on the "normal" option
              data-cy={index === 0 ? "pickUp" : undefined}
            />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}
