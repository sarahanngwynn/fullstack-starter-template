"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import { Grid, TextField, Checkbox, FormControlLabel, Box } from "@mui/material";

interface Props {
  control: any;
  errors: any;
}

export default function ParentDetails({ control, errors }: Props) {
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {/* First name */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="parentFirstName"
            control={control}
            rules={{ required: "First name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Parent First Name"
                error={!!errors.parentFirstName}
                helperText={errors.parentFirstName?.message}
              />
            )}
          />
        </Grid>

        {/* Last name */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="parentLastName"
            control={control}
            rules={{ required: "Last name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Parent Last Name"
                error={!!errors.parentLastName}
                helperText={errors.parentLastName?.message}
              />
            )}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email Address"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>

        {/* Phone */}
        <Grid item xs={12}>
          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              required: "Phone number is required",
              pattern: {
                value: /^[0-9+\-\s()]{7,20}$/,
                message: "Enter a valid phone number",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Phone Number"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />
        </Grid>

        {/* Email list opt-in */}
        <Grid item xs={12}>
          <Controller
            name="emailList"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={!!field.value} />}
                label="I’d like to receive updates and newsletters"
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
