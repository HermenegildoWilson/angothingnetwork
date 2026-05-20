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
          borderRadius: "12px",
          fontWeight: 800,
          boxShadow: "none",
          paddingInline: "18px",
          "&.MuiButton-containedPrimary": {
            background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
          },
          "&:hover": {
            boxShadow: "0 10px 24px rgba(129, 140, 248, 0.22)",
          },
        },
        outlined: {
          borderColor: "rgba(129, 140, 248, 0.45)",
          color: "#6366f1",
          backgroundColor: "rgba(129, 140, 248, 0.06)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          fontWeight: 800,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "24px",
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(226, 232, 240, 0.9)",
          boxShadow: "0 24px 70px rgba(15, 23, 42, 0.18)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "#1e293b",
          fontWeight: 900,
          padding: "22px 24px 16px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          borderColor: "rgba(226, 232, 240, 0.9)",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          gap: "12px",
          padding: "16px 24px 22px",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "inherit",
          borderRadius: "12px",
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
