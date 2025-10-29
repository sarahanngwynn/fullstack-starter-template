"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";
import { Controller } from "react-hook-form";
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  control: any;
  errors: any;
}

export default function ChildsDetails({ control, errors }: Props) {
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {/* Child full name */}
        <Grid item xs={12}>
          <Controller
            name="childFullName"
            control={control}
            rules={{ required: "Child's full name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Child's Full Name"
                error={!!errors.childFullName}
                helperText={errors.childFullName?.message}
              />
            )}
          />
        </Grid>

        {/* Child sex */}
        <Grid item xs={12}>
          <FormControl component="fieldset" error={!!errors.childSex}>
            <FormLabel component="legend">Child's Sex</FormLabel>
            <Controller
              name="childSex"
              control={control}
              rules={{ required: "Please select one" }}
              render={({ field }) => (
                <RadioGroup row {...field}>
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="nonbinary" control={<Radio />} label="Non-binary" />
                  <FormControlLabel value="prefer_not" control={<Radio />} label="Prefer not to say" />
                </RadioGroup>
              )}
            />
            {errors.childSex && (
              <p style={{ color: "red", marginTop: 4 }}>{errors.childSex.message}</p>
            )}
          </FormControl>
        </Grid>

        {/* Birthdate */}
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="childBirthDate"
              control={control}
              rules={{ required: "Birthdate is required" }}
              render={({ field: { value, onChange, ...rest } }) => (
                <DatePicker
                  {...rest}
                  label="Birthdate"
                  value={value ? dayjs(value) : null}
                  onChange={(d: Dayjs | null) =>
                    onChange(d ? d.format("YYYY-MM-DD") : "")
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.childBirthDate,
                      helperText: errors.childBirthDate?.message,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        {/* Any concerns */}
        <Grid item xs={12}>
          <Controller
            name="anyConcerns"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Any concerns we should know about?"
                placeholder="Allergies, accessibility needs, behavioral notes, etc."
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
