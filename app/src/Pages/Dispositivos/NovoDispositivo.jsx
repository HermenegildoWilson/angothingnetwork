import { Box, Typography } from "@mui/material";
import FormSteps from "./FormSteps";

export default function NovoDispositivo() {
    return (
        <Box
            sx={{
                flex: "1",
                pt: { xs: 2, md: 4 },
            }}
        >
            <FormSteps>
                <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{
                        background:
                            "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: { xs: "1.475rem", md: "1.8125rem" },
                        mb: 2,
                    }}
                >
                    Novo Dispositivo IoT
                </Typography>
            </FormSteps>
        </Box>
    );
}
