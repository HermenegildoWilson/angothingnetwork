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
import type { RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowForward } from "@mui/icons-material";

const MotionBox = motion(Box);

type HeroProps = {
    impactRef: RefObject<HTMLElement | null>;
};

export default function Hero({ impactRef }: HeroProps) {
    const theme = useTheme();
    const navigate = useNavigate();

    const rolarParaSecao = (sectionRef: RefObject<HTMLElement | null>) => {
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: "smooth" }); // Rola suavemente
        }
    };

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                py: { xs: 1, md: 2 },
                background: `radial-gradient(1200px 600px at -10% -20%, ${theme.palette.primary.light}33 0%, transparent 60%),
                  radial-gradient(900px 500px at 110% 0%, ${theme.palette.secondary.main}22 0%, transparent 55%),
                  linear-gradient(135deg, ${theme.palette.primary.light}11 0%, ${theme.palette.background.default} 100%)`,
            }}
        >
            <MotionBox
                aria-hidden
                animate={{ y: [0, 18, 0], x: [0, -10, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                sx={{
                    position: "absolute",
                    top: { xs: -120, md: -160 },
                    right: { xs: -120, md: -160 },
                    width: { xs: 260, md: 420 },
                    height: { xs: 260, md: 420 },
                    borderRadius: "50%",
                    bgcolor: theme.palette.primary.main,
                    opacity: 0.15,
                    filter: "blur(45px)",
                }}
            />
            <MotionBox
                aria-hidden
                animate={{ y: [0, -16, 0], x: [0, 12, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                sx={{
                    position: "absolute",
                    bottom: { xs: -140, md: -180 },
                    left: { xs: -120, md: -140 },
                    width: { xs: 240, md: 380 },
                    height: { xs: 240, md: 380 },
                    borderRadius: "50%",
                    bgcolor: theme.palette.secondary.main,
                    opacity: 0.12,
                    filter: "blur(45px)",
                }}
            />

            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                <Grid
                    container
                    spacing={{ xs: 4, md: 8 }}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid>
                        <MotionBox
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            sx={{
                                mb: { xs: 0, md: -4 },
                                textAlign: "left" ,
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                justifyContent={"flex-start" }
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
                                alignItems={{ xs: "center", md: "flex-start" }}
                            >
                                <Button
                                    size="large"
                                    onClick={() => navigate("/signup")}
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        borderRadius: 2,
                                        fontSize: "1.1rem",
                                        width: { xs: "100%", sm: "auto" },
                                        px: { xs: 3, md: 4 },
                                        boxShadow:
                                            "0 10px 20px rgba(26, 115, 232, 0.3)",
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                        color: "background.paper",
                                    }}
                                >
                                    Explorar Dashboard
                                </Button>

                                <Button
                                    size="large"
                                    onClick={() => rolarParaSecao(impactRef)}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2,
                                        fontSize: "1.1rem",
                                        width: { xs: "100%", sm: "auto" },
                                        px: { xs: 3, md: 4 },
                                        borderWidth: 2,
                                        "&:hover": { borderWidth: 2 },
                                    }}
                                >
                                    Impacto Social
                                </Button>
                            </Stack>
                        </MotionBox>
                    </Grid>

                    <Grid size={{ xs: 12, md: 7 }}>
                        <MotionBox
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            whileHover={{ y: -6 }}
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
                                    border: "1px solid rgba(255,255,255,0.4)",
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
                </Grid>
            </Container>
        </Box>
    );
}
