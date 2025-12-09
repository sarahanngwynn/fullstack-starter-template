"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

type Registration = {
  email: string;
  password: string;
  [key: string]: any;
};

interface LoginProps {
  registration: Registration;
  setRegistration: (value: Registration) => void;
}

export default function Login({ registration, setRegistration }: LoginProps) {
  const handleChange =
    (field: keyof Registration) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRegistration({
        ...registration,
        [field]: event.target.value,
      });
    };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Login
      </Typography>

      <Grid container spacing={2}>
        {/* Email */}
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            data-cy="email"
            autoComplete="email"
            value={registration.email}
            onChange={handleChange("email")}
          />
        </Grid>

        {/* Password */}
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            data-cy="password"
            autoComplete="new-password"
            value={registration.password}
            onChange={handleChange("password")}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
