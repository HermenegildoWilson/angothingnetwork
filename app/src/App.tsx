import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import AppRoutes from "@/routes/AppRoutes";
import theme from "@/theme";
import { AlertProvider } from "@/providers/AlertProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import AuthenticatedProviders from "./providers/AuthenticatedProviders";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertProvider>
        <AuthProvider>
          <AuthenticatedProviders>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthenticatedProviders>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
