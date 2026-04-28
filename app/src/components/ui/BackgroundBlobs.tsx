import { Box } from "@mui/material";

export default function BackgroundBlobs() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.35,
        zIndex: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-15%",
          left: "-15%",
          width: { xs: "70%", md: "40%" },
          height: { xs: "70%", md: "40%" },
          bgcolor: "#bfdbfe",
          borderRadius: "50%",
          filter: "blur(120px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          right: "-15%",
          width: { xs: "70%", md: "40%" },
          height: { xs: "70%", md: "40%" },
          bgcolor: "#e0e7ff",
          borderRadius: "50%",
          filter: "blur(120px)",
        }}
      />
    </Box>
  );
}
