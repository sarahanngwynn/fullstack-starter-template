"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";

interface LocationProps {
  control: any;
  errors: any;
}

const locations = [
  "River Park",
  "Garden",
  "Museum",
  "South Jordan",
  "Midvale",
];

export default function Location({ control, errors }: LocationProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <FormControl component="fieldset" error={!!errors.desiredLocation} fullWidth>
        <FormLabel component="legend" sx={{ mb: 1 }}>
          Select Desired Location
        </FormLabel>

        <Controller
          name="desiredLocation"
          control={control}
          rules={{ required: "Please select a location" }}
          render={({ field }) => (
            <RadioGroup {...field}>
              {locations.map((loc) => (
                <FormControlLabel
                  key={loc}
                  value={loc}
                  control={<Radio />}
                  label={loc}
                />
              ))}
            </RadioGroup>
          )}
        />

        {errors.desiredLocation && (
          <p style={{ color: "red", marginTop: 4 }}>
            {errors.desiredLocation.message}
          </p>
        )}
      </FormControl>
    </Box>
  );
}
