import { useNavigate } from "react-router-dom";
import {
    CloudQueue,
    Timeline,
    Security,
    Devices,
} from "@mui/icons-material";
import { Box, Button, Container, Divider, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";

// Componente para Wrapper de Animação
const MotionBox = motion(Box);

export default function Features() {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Timeline fontSize="large" />,
            title: "Precisão em Tempo Real",
            desc: "Sensores calibrados para entregar métricas com fidelidade laboratorial a cada segundo.",
        },
        {
            icon: <CloudQueue fontSize="large" />,
            title: "Ecossistema Cloud",
            desc: "Seus dados armazenados com segurança e acessíveis de qualquer lugar do planeta.",
        },
        {
            icon: <Devices fontSize="large" />,
            title: "Dashboards Responsivos",
            desc: "Uma experiência fluida e intuitiva tanto no desktop quanto no seu smartphone.",
        },
        {
            icon: <Security fontSize="large" />,
            title: "Inteligência Preditiva",
            desc: "Alertas inteligentes que antecipam condições críticas antes que se tornem problemas.",
        },
    ];

    return (
        <Box sx={{ py: 8, bgcolor: "#0F172A", color: "white" }}>
            <Container maxWidth="lg">
                <Box sx={{display: "grid", gap: 4, gridTemplateColumns: {xs: "1fr", md: "1fr 1fr"}}}>
                    {features.map((f, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <MotionBox
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Box sx={{ color: "primary.main", mb: 2 }}>
                                    {f.icon}
                                </Box>
                                <Typography
                                    variant="h6"
                                    fontWeight="800"
                                    sx={{ mb: 1 }}
                                >
                                    {f.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "rgba(255,255,255,0.6)",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {f.desc}
                                </Typography>
                            </MotionBox>
                        </Grid>
                    ))}
                </Box>

                <Divider sx={{ my: 8, borderColor: "rgba(255,255,255,0.1)" }} />

                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" fontWeight="800" sx={{ mb: 4 }}>
                        Pronto para transformar sua gestão ambiental?
                    </Typography>
                    <Button
                        onClick={() => navigate("/cadastrar")}
                        variant="contained"
                        sx={{
                            width: "250px",
                            py: 1,
                            borderRadius: 2,
                            fontWeight: 800,
                            fontSize: "1.1rem",
                        }}
                    >
                        Começar Gratuitamente
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
