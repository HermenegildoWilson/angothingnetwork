import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import AppRoutes from "@/routes/AppRoutes";
import theme from "@/theme";
import { AlertProvider } from "@/providers/AlertProvider";
import { AuthProvider } from "@/providers/AuthProvider";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
