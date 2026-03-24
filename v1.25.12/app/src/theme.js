import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: { main: "#1976d2" },
        background: { default: "#f4f6f8", paper: "#FFFFFF" },
    },
    typography: {
        fontFamily: "Lato, Arial, sans-serif",
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: "primary.main",
                    borderRadius: 8,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "background.default",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "20px",
                    bgcolor: "background.paper",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
                },
            },
        },
    },
});

export default theme;
