"use client";

import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";

type Registration = {
  // Multi-select (array) — preferred if you allow selecting multiple children
  whichChild?: string[];

  // Single-select (string) — preferred if user must choose exactly one child
  selectedChild?: string;

  // Optional list of children from your login/API step
  childrenOptions?: Array<{ id: string; label: string }>;

  [key: string]: any;
};

type Props = {
  registration: Registration;
  setRegistration: React.Dispatch<React.SetStateAction<Registration>>;
};

/**
 * Choose one approach:
 * - Multi-select: set USE_MULTI_SELECT = true (uses registration.whichChild: string[])
 * - Single-select: set USE_MULTI_SELECT = false (uses registration.selectedChild: string)
 */
const USE_MULTI_SELECT = true;

export default function ChildSelect({ registration, setRegistration }: Props) {
  // ✅ Safe options list (won’t crash if API didn’t populate anything yet)
  const options =
    Array.isArray(registration.childrenOptions) && registration.childrenOptions.length > 0
      ? registration.childrenOptions
      : [
          { id: "child_1", label: "Child 1" },
          { id: "child_2", label: "Child 2" },
        ];

  // ✅ Safe selected values
  const selectedMulti = Array.isArray(registration.whichChild) ? registration.whichChild : [];
  const selectedSingle = typeof registration.selectedChild === "string" ? registration.selectedChild : "";

  const toggleMulti = (id: string) => (_: React.SyntheticEvent, checked: boolean) => {
    setRegistration((prev) => {
      const prevArr = Array.isArray(prev.whichChild) ? prev.whichChild : [];
      if (checked) {
        if (prevArr.includes(id)) return prev;
        return { ...prev, whichChild: [...prevArr, id] };
      }
      return { ...prev, whichChild: prevArr.filter((x) => x !== id) };
    });
  };

  const setSingle = (_: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setRegistration((prev) => ({ ...prev, selectedChild: value }));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select child
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {USE_MULTI_SELECT ? "Select one or more children to continue." : "Select one child to continue."}
      </Typography>

      {USE_MULTI_SELECT ? (
        <Grid container spacing={1}>
          {options.map((child) => (
            <Grid item xs={12} key={child.id}>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label={child.label}
                checked={selectedMulti.includes(child.id)}
                onChange={toggleMulti(child.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <FormControl>
          <FormLabel sx={{ mb: 1 }}>Child</FormLabel>
          <RadioGroup value={selectedSingle} onChange={setSingle}>
            {options.map((child) => (
              <FormControlLabel
                key={child.id}
                value={child.id}
                control={<Radio />}
                label={child.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    </Box>
  );
}

