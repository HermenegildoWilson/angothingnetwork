import { Box, Paper, Typography } from "@mui/material";

export default function NotFound() {
    return (
        <Box
            sx={{
                height: "89.9vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper
                sx={{
                    p: 3,
                    flex: "auto",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h4">
                    Page Not Found...
                </Typography>
            </Paper>
        </Box>
    );
}
