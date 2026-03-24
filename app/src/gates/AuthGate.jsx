import { Box, LinearProgress, Typography } from "@mui/material";
import AppLoader from "../components/feedback/AppLoader";
import { useAuth } from "../hooks/useAuth";

export default function AuthGate({ children }) {
    const { appState } = useAuth();

    if (appState === "loading") {
        return (
            <Box
                sx={{
                    height: "89.9vh",
                    display: "flex",
                    flexFlow: "column",
                    gap: 2,
                }}
            >
                <div className="w-screen border">
                    <LinearProgress sx={{ height: 4 }} />
                </div>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexFlow: "column",
                        flexGrow: 1
                    }}
                >
                    <Typography variant="body1" fontSize={"1rem"} mb={1}>
                        Carregando...
                    </Typography>
                    <AppLoader />
                </Box>
            </Box>
        );
    }

    return <> {children} </>;
}
