"use client";

import * as React from "react";
import { Button as MUIButton, CircularProgress } from "@mui/material";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
  color?: "primary" | "secondary" | "error" | "success";
  fullWidth?: boolean;
}

export default function Button({
  label,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  color = "primary",
  fullWidth = true,
}: ButtonProps) {
  return (
    <MUIButton
      variant="contained"
      color={color}
      type={type}
      onClick={onClick}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      sx={{
        mt: 2,
        py: 1.3,
        fontWeight: 600,
        borderRadius: 2,
        textTransform: "none",
      }}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : label}
    </MUIButton>
  );
}
