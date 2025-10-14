"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Grid,
} from "@mui/material";

interface Props {
  control: any;
  errors: any;
}

const programOptions = [
  { value: "toddlers_am", label: "Toddlers (AM) • 8:30–11:30" },
  { value: "toddlers_pm", label: "Toddlers (PM) • 12:30–3:30" },
  { value: "preschool_half", label: "Preschool Half-Day • 8:30–12:30" },
  { value: "preschool_full", label: "Preschool Full-Day • 8:30–3:30" },
  { value: "kindergarten", label: "Kindergarten • 8:30–3:30" },
  { value: "aftercare", label: "After-Care Add-On • 3:30–5:30" },
];

export default function Program({ control, errors }: Props) {
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl component="fieldset" error={!!errors.desiredProgram} fullWidth>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Select Desired Program
            </FormLabel>

            <Controller
              name="desiredProgram"
              control={control}
              rules={{ required: "Please select a program" }}
              render={({ field }) => (
                <RadioGroup {...field}>
                  {programOptions.map((p) => (
                    <FormControlLabel
                      key={p.value}
                      value={p.value}
                      control={<Radio />}
                      label={p.label}
                    />
                  ))}
                </RadioGroup>
              )}
            />

            {errors.desiredProgram && (
              <p style={{ color: "red", marginTop: 4 }}>
                {errors.desiredProgram.message}
              </p>
            )}
          </FormControl>
        </Grid>

        {/* Optional notes (e.g., days preferred, schedule constraints) */}
        <Grid item xs={12}>
          <Controller
            name="programNotes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Notes (optional)"
                placeholder="Preferred days, schedule constraints, sibling info, etc."
                multiline
                minRows={3}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
