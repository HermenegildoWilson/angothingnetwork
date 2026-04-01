import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#818cf8",
      contrastText: "#ffffff",
    },
    secondary: { main: "#a5b4fc" },
    background: { default: "#f4f6f8", paper: "#FFFFFF" },
    text: { primary: "#1e293b", secondary: "#64748b" },
  },
  typography: {
    fontFamily: '"Manrope", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "inherit",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          animation: "fadeInUp 0.8s ease-out both",
          "@keyframes fadeInUp": {
            from: { opacity: 0, transform: "translateY(20px) scale(0.97)" },
            to: { opacity: 1, transform: "translateY(0) scale(1) " },
          },
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
          borderRadius: "24px",
        },
      },
    },
  },
});

export default theme;
