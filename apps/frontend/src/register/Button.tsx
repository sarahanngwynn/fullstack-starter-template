import React from "react";
import MuiButton from "@mui/material/Button";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "text" | "outlined" | "contained";
}

export const Button = ({
  text,
  onClick,
  disabled = false,
  type = "button",
  variant = "contained",
}: ButtonProps) => {
  return (
    <MuiButton
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      type={type}
      sx={{ mt: 2 }}
    >
      {text}
    </MuiButton>
  );
};
