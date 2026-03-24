import { useEffect } from "react";
import { useAlert } from "../hooks/useAlert";
import { useAuth } from "../hooks/useAuth";
import AppLoader from "../components/feedback/AppLoader";
import { Box, Typography } from "@mui/material";

export default function Logout() {
    const { logout } = useAuth();
    const { setAlert } = useAlert();

    useEffect(() => {
        const Logout = async () => {
            const data = await logout();

            if (data.success) {
                return setAlert({
                    type: "SHOW",
                    text: data.message,
                    style: "success",
                });
            }
            setAlert({
                type: "SHOW",
                text: data.message,
                style: "warning",
            });
        };
        Logout();
    }, []);

    return (
        <Box
            sx={{
                height: "89.9vh",
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2
            }}
        >
            <Typography variant="body1" fontSize={"1.3rem"} >Saindo...</Typography>
            <AppLoader  sx={"text-blue-500"} />
        </Box>
    );
}
