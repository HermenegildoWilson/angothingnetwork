import { Air, ArrowForward, Grass, WaterDrop } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

export default function Sectores() {
    const monitoringSectors = [
        {
            icon: <Air />,
            title: "Atmosfera e Qualidade do Ar",
            sensor: "BME680 Precision",
            desc: "Evite riscos ocupacionais e ambientais. Monitorização contínua de COV, pressão atmosférica e microclimas com alertas instantâneos.",
            color: "#3b82f6",
        },
        {
            icon: <WaterDrop />,
            title: "Recursos Hídricos Críticos",
            sensor: "TDS, PH & Turbidez",
            desc: "Garanta a pureza da água. Analise a presença de sólidos, níveis de acidez e claridade para consumo ou processos industriais.",
            color: "#0ea5e9",
        },
        {
            icon: <Grass />,
            title: "Saúde e Nutrição do Solo",
            sensor: "DS18B20 & Humidade",
            desc: "Maximize a produtividade agrícola. Dados profundos sobre humidade e temperatura para otimização de rega e colheita.",
            color: "#10b981",
        },
    ];

    return (
        <Box sx={{ pt: 10 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 5 }}>
                    <Typography variant="h4" fontWeight="800" gutterBottom>
                        Uma Solução 360º para o seu Ativo
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ maxWidth: 700, mx: "auto" }}
                    >
                        Utilizamos hardware de precisão e uma arquitetura cloud
                        robusta para entregar dados em que pode confiar.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {monitoringSectors.map((sector, idx) => (
                        <Grid item xs={12} md={4} key={idx}>
                            <MotionPaper
                                whileHover={{
                                    y: -15,
                                    boxShadow: "0 30px 60px rgba(0,0,0,0.1)",
                                }}
                                sx={{
                                    p: { xs: 2, md: 4 },
                                    height: "100%",
                                    borderRadius: 8,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Stack
                                    sx={{
                                        p: { xs: 0, md: 2 },
                                        borderRadius: 6,
                                        borderColor: "divider",
                                        display: "flex",
                                        flexFlow: "row",
                                        alignItems: "center",
                                        gap: 3,
                                        height: "100%",
                                        width: "100%",
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: sector.color,
                                            width: 64,
                                            height: 64,
                                            mb: 3,
                                        }}
                                    >
                                        {sector.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography
                                            variant="h5"
                                            fontWeight={900}
                                            gutterBottom
                                        >
                                            {sector.title}
                                        </Typography>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: sector.color,
                                                fontWeight: 800,
                                                mb: 2,
                                            }}
                                        >
                                            Hardware: {sector.sensor}
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ flexGrow: 1, mb: 3 }}
                                >
                                    {sector.desc}
                                </Typography>
                                <Button
                                    variant="text"
                                    color="inherit"
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        alignSelf: "flex-start",
                                        fontWeight: 800,
                                    }}
                                >
                                    Saber mais
                                </Button>
                            </MotionPaper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
