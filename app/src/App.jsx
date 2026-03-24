import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import theme from "./theme";
import AlertProvider from "./providers/AlertProvider";
import AuthProvider from "./providers/AuthProvider";
import AuthenticatedProviders from "./providers/AuthenticatedProviders";
import AppRoutes from "./Partials/routes/AppRoutes";
import AuthGate from "./gates/AuthGate";

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <AlertProvider>
                <AuthProvider>
                    <AuthGate>
                        <AuthenticatedProviders>
                            <BrowserRouter>
                                <AppRoutes />
                            </BrowserRouter>
                        </AuthenticatedProviders>
                    </AuthGate>
                </AuthProvider>
            </AlertProvider>
        </ThemeProvider>
    );
}