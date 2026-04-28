import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";

import type { StyledInputProps } from "./types";

export default function StyledInput(styledInputProps: StyledInputProps) {
  const { Icon, sx, type, ...rest } = styledInputProps;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      fullWidth
      type={type === "password" ? (showPassword ? "text" : "password") : type}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          backgroundColor: "rgba(255,255,255,0.05)",
          "& fieldset": { borderColor: "rgba(0,0,0,0.15)" },
          "&:hover fieldset": { borderColor: "primary.main" },
        },
        ...sx,
      }}
      {...rest}
      InputProps={{
        startAdornment: Icon && (
          <InputAdornment position="start" sx={{ mr: 1 }}>
            <Icon />
          </InputAdornment>
        ),
        endAdornment: type === "password" && (
          <InputAdornment position="end">
            <IconButton
              aria-label="Alternar visibilidade da senha"
              onClick={() => setShowPassword((v) => !v)}
              edge="end"
              size="small"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
