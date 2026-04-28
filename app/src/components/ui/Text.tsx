import { Typography, type TypographyProps } from "@mui/material";

export default function Text(typographyProps: TypographyProps) {
  const { children, sx } = typographyProps;
  return (
    <Typography
      sx={{
        color: "text.secondary",
        fontSize: { xs: "0.9rem", md: "1rem" },
        lineHeight: 1.6,
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}
