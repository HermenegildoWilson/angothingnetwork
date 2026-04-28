import { CheckRounded } from "@mui/icons-material";
import { Box } from "@mui/material";
import type { ReactNode } from "react";

export default function PulseIcon(props: {
  Icon?: typeof CheckRounded;
  children?: ReactNode;
}) {
  const { Icon, children } = props;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
      <Box
        sx={{
          position: "relative",
          width: { xs: 65, md: 80 },
          height: { xs: 65, md: 80 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid #3b82f6",
            animation:
              "pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite",
          },
          "@keyframes pulseRing": {
            "0%": { transform: "scale(0.8)", opacity: 0.5 },
            "80%, 100%": { transform: "scale(1.4)", opacity: 0 },
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            bgcolor: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 12px 30px rgba(59,130,246,0.25)",
          }}
        >
          {Icon && (
            <Icon sx={{ color: "#fff", fontSize: { xs: 30, md: 40 } }} />
          )}
          {children}
        </Box>
      </Box>
    </Box>
  );
}
