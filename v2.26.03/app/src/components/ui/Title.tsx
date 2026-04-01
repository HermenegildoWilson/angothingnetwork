import { Typography, type TypographyProps } from "@mui/material";

export default function Title(typographyProps: TypographyProps) {
  const { children, sx } = typographyProps;
  return (
    <Typography
      variant={"h5"}
      fontWeight={700}
      sx={{
        fontSize: { xs: "1.5rem", md: "2rem" },
        color: "text.primary",        
        ...sx,
      }}
      {...typographyProps}
    >
      {children}
    </Typography>
  );
}
