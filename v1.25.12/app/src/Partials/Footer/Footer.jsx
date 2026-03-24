import { Box, Stack, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box
            sx={{
                py: 8,
                textAlign: "center",
                bgcolor: "background.default",
            }}
        >
            <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                sx={{ mb: 4 }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                    }}
                >
                    Privacidade
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                    }}
                >
                    Termos
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                    }}
                >
                    Suporte
                </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} HyperCrest. Tecnologia para um
                futuro consciente.
            </Typography>
        </Box>
    );
}
