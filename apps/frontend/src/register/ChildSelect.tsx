"use client";

import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

type Registration = {
  whichChild: string[];
  [key: string]: any;
};

interface ChildSelectProps {
  registration: Registration;
  setRegistration: (value: Registration) => void;
}

const CHILDREN = ["Oliver Gwynn", "Elsie Gwynn", "Collin Gwynn"];

export default function ChildSelect({
  registration,
  setRegistration,
}: ChildSelectProps) {
  const handleToggleChild =
    (child: string) =>
    (_event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
      if (checked) {
        // only one selected at a time
        setRegistration({
          ...registration,
          whichChild: [child],
        });
      } else {
        setRegistration({
          ...registration,
          whichChild: [],
        });
      }
    };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Please select the child you are registering
      </Typography>

      <Grid container spacing={2}>
        {CHILDREN.map((child) => (
          <Grid item xs={12} key={child}>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label={child}
              checked={registration.whichChild.includes(child)}
              onChange={handleToggleChild(child)}
              data-cy="chooseChild"
            />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}

