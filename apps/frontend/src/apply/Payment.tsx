"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
} from "@mui/material";

interface PaymentProps {
  control: any;
  errors: any;
}

export default function Payment({ control, errors }: PaymentProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>

      <Grid container spacing={3}>
        {/* Preferred Payment Method */}
        <Grid item xs={12}>
          <FormControl component="fieldset" error={!!errors.paymentMethod}>
            <FormLabel component="legend">Preferred Payment Method</FormLabel>
            <Controller
              name="paymentMethod"
              control={control}
              rules={{ required: "Please select a payment method" }}
              render={({ field }) => (
                <RadioGroup row {...field}>
                  <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
                  <FormControlLabel value="ach" control={<Radio />} label="Bank Transfer (ACH)" />
                  <FormControlLabel value="check" control={<Radio />} label="Check" />
                </RadioGroup>
              )}
            />
            {errors.paymentMethod && (
              <p style={{ color: "red", marginTop: 4 }}>
                {errors.paymentMethod.message}
              </p>
            )}
          </FormControl>
        </Grid>

        {/* Name on Card (if applicable) */}
        <Grid item xs={12} md={6}>
          <Controller
            name="cardName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Name on Card"
                placeholder="If paying by card"
              />
            )}
          />
        </Grid>

        {/* Billing Zip Code */}
        <Grid item xs={12} md={6}>
          <Controller
            name="billingZip"
            control={control}
            rules={{
              pattern: {
                value: /^\d{5}(-\d{4})?$/,
                message: "Enter a valid ZIP code",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Billing ZIP Code"
                error={!!errors.billingZip}
                helperText={errors.billingZip?.message}
              />
            )}
          />
        </Grid>

        {/* Authorization Checkbox */}
        <Grid item xs={12}>
          <Controller
            name="authorizePayment"
            control={control}
            rules={{ required: "You must agree to proceed" }}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={!!field.value} />}
                label="I authorize the school to charge the selected payment method for enrollment fees."
              />
            )}
          />
          {errors.authorizePayment && (
            <p style={{ color: "red", marginTop: 4 }}>
              {errors.authorizePayment.message}
            </p>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
