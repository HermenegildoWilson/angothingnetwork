import {
    Box,
    Button,
    Card,
    Container,
    Typography,
    CircularProgress,
    Fab,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { Plus } from "lucide-react";

/**
 * Componente que contém a lógica e a interface da lista
 */
export default function SmartView({
    title = "Items",
    subTitle = "Items",
    handleCreateNew,
    pageState = "",
    children,
    titleButton = "Adicionar",
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                flex: "1",
                pt: { xs: 2, md: 4 },
                px: 1,
            }}
        >
            <Container maxWidth="md">
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight="800"
                            sx={{
                                background:
                                    "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontSize: { xs: "1.75rem", md: "2.125rem" },
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="body2"
                            fontSize={"1rem"}
                            color="text.secondary"
                        >
                            {subTitle}
                        </Typography>
                    </Box>

                    {!isMobile && handleCreateNew && (
                        <Button
                            variant="contained"
                            startIcon={<Plus size={25} />}
                            onClick={handleCreateNew}
                            sx={{
                                borderRadius: 3,
                                textTransform: "none",
                                fontWeight: "bold",
                                px: 3,
                                py: 1,
                                boxShadow: "0 4px 14px rgba(33, 150, 243, 0.3)",
                            }}
                        >
                            {titleButton}
                        </Button>
                    )}
                </Box>

                {/* Content Card */}
                <Card
                    elevation={0}
                    sx={{
                        p: { xs: 1, md: 2 },
                    }}
                >
                    {pageState === "loading" ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            height={400}
                            gap={2}
                        >
                            <CircularProgress size={40} thickness={4} />
                            <Typography variant="body2" color="text.secondary">
                                Sincronizando dados...
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ p: { xs: 1, md: 2 } }}>{children}</Box>
                    )}
                </Card>
            </Container>

            {isMobile && handleCreateNew && (
                <Fab
                    color="primary"
                    onClick={handleCreateNew}
                    sx={{ position: "fixed", bottom: 32, right: 32 }}
                >
                    <Plus />
                </Fab>
            )}
        </Box>
    );
}
