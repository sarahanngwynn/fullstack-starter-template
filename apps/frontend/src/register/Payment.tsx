"use client";

import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function PaymentForm(props:any) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardName"
            label="Name on card"
            data-cy="cardName"
            fullWidth
            autoComplete="cc-name"
            value={props.registration.nameOnCard}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              props.setRegistration({
                ...props.registration, 
                nameOnCard: event.target.value,
              });
            }}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            label="Card number"
            fullWidth
            data-cy="cardNumber"
            autoComplete="cc-number"
            value={props.registration.cardNumber}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              props.setRegistration({
                ...props.registration, 
                cardNumber: event.target.value,
              });
            }}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            data-cy="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            value={props.registration.expirationDate}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              props.setRegistration({
                ...props.registration, 
                expirationDate: event.target.value,
              });
            }}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            label="CVV"
            data-cy="cvv"
            helperText="Last three digits on signature strip"
            fullWidth
            autoComplete="cc-csc"
            value={props.registration.cvvNumber}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              props.setRegistration({
                ...props.registration, 
                cvvNumber: event.target.value,
              });
            }}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Remember credit card details for next time"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}