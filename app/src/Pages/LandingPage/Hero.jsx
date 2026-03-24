import {
    Box,
    Button,
    Chip,
    Container,
    Grid,
    Paper,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowForward } from "@mui/icons-material";

const MotionBox = motion(Box);

export default function Hero({ seccao }) {
    const theme = useTheme();
    const navigate = useNavigate();

    const rolarParaSecao = (seccao) => {
        if (seccao.current) {
            seccao.current.scrollIntoView({ behavior: "smooth" }); // Rola suavemente
        }
    };

    return (
        <Box
            sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.light}22 0%, ${theme.palette.background.default} 100%)`,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    container
                    gap={{ xs: 4, md: 8 }}
                    display={"flex"}
                    sx={{
                        flexWrap: "wrap",
                    }}
                    justifyContent={"center"}
                    alignItems="center"
                >
                    <Grid item xs={12} md={7}>
                        <MotionBox
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            sx={{
                                mb: { xs: 0, md: -4 },
                                textAlign: "left",
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                justifyContent={"flex-start"}
                                sx={{ mb: 3 }}
                            >
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        bgcolor: "#10b981",
                                        boxShadow: "0 0 10px #10b981",
                                    }}
                                />
                                <Typography
                                    variant="overline"
                                    sx={{
                                        fontWeight: 800,
                                        color: "text.secondary",
                                        letterSpacing: 2,
                                    }}
                                >
                                    SISTEMA VIVO E OPERACIONAL
                                </Typography>
                            </Stack>

                            <Typography
                                variant="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 900,
                                    fontSize: {
                                        xs: "2rem",
                                        sm: "2.6rem",
                                        md: "3.5rem",
                                    },
                                    lineHeight: 1.15,
                                    letterSpacing: "-0.04em",
                                    mb: 2,
                                }}
                            >
                                Decisões inteligentes guiadas por{" "}
                                <span
                                    style={{
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    dados reais.
                                </span>
                            </Typography>

                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{
                                    mb: 3,
                                    fontWeight: 400,
                                    lineHeight: 1.7,
                                    fontSize: { xs: "1rem", md: "1rem" },
                                }}
                            >
                                Assuma o controlo total do seu ecossistema.
                                Monitorize Ar, Água e Solo com sensores IOT de
                                classe industrial.
                            </Typography>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                                justifyContent={{
                                    xs: "center",
                                    md: "flex-start",
                                }}
                            >
                                <Button
                                    fullWidth={{ xs: true, sm: false }}
                                    onClick={() => navigate("/cadastrar")}
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        borderRadius: 2,
                                        fontSize: "1.1rem",
                                        boxShadow:
                                            "0 10px 20px rgba(26, 115, 232, 0.3)",
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                        color: "background.paper",
                                    }}
                                >
                                    Explorar Dashboard
                                </Button>

                                <Button
                                    fullWidth={{ xs: true, sm: false }}
                                    onClick={() => rolarParaSecao(seccao)}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2,
                                        fontSize: "1.1rem",
                                        borderWidth: 2,
                                        "&:hover": { borderWidth: 2 },
                                    }}
                                >
                                    Impacto Social
                                </Button>
                            </Stack>
                        </MotionBox>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <MotionBox
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1,
                                    borderRadius: 8,
                                    maxWidth: 420,
                                    mx: "auto",
                                    background: "rgba(255, 255, 255, 0.6)",
                                    backdropFilter: "blur(20px)",
                                }}
                            >
                                <Box
                                    sx={{
                                        bgcolor: "white",
                                        borderRadius: 6,
                                        p: { xs: 3, md: 6 },
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography
                                        variant="h2"
                                        fontWeight="900"
                                        color="primary"
                                        sx={{
                                            fontSize: "3.5rem",
                                            // fontSize: {
                                            //     xs: "3.5rem",
                                            //     md: "6rem",
                                            // },
                                        }}
                                    >
                                        24.5°
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        color="text.secondary"
                                    >
                                        Uíge, Angola
                                    </Typography>
                                    <Chip
                                        label="Ar: Excelente"
                                        color="success"
                                        sx={{ mt: 2 }}
                                    />
                                </Box>
                            </Paper>
                        </MotionBox>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
