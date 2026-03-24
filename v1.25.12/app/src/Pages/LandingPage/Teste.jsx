import { useRef } from "react";
import {
    Box,
    Typography,
    Container,
    Button,
    Grid,
    Paper,
    Stack,
    useTheme,
    Avatar,
    Divider,
    Chip,
} from "@mui/material";
import {
    ArrowForward,
    WaterDrop,
    Air,
    Grass,
    Shield,
    PersonSearch,
    AutoGraph,
    TrendingUp,
    Analytics,
    AssignmentTurnedIn,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Componente para Wrapper de Animação
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

/**
 * Landing Page de Alta Conversão para Plataforma IOT de Monitoramento.
 * Focada em vender o valor estratégico dos dados e a segurança da infraestrutura.
 */
export default function Teste() {
    const theme = useTheme();
    

    return (
        <Box
            sx={{
                bgcolor: "background.default",
                flex: "1",
                overflowX: "hidden",
            }}
        >

            

            {/* GESTÃO DE ROLES E ACESSO (O DIFERENCIAL) */}
            <Container maxWidth="lg" sx={{ py: 15 }}>
                <Grid container spacing={10} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <MotionBox
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Typography
                                variant="overline"
                                color="primary"
                                sx={{ fontWeight: 900, letterSpacing: 2 }}
                            >
                                SEGURANÇA E GOVERNANÇA
                            </Typography>
                            <Typography
                                variant="h3"
                                fontWeight={900}
                                sx={{ mt: 2, mb: 4 }}
                            >
                                Partilhe dados, não o controlo.
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ mb: 4, fontWeight: 400 }}
                            >
                                O nosso sistema de roles permite que
                                administradores gerenciem toda a infraestrutura,
                                enquanto visitantes podem solicitar acesso a
                                estações específicas.
                            </Typography>

                            <Stack spacing={3}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 3,
                                        p: 3,
                                        borderRadius: 4,
                                        bgcolor: "primary.light",
                                        color: "primary.dark",
                                    }}
                                >
                                    <Shield />
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            fontWeight={800}
                                        >
                                            Administradores
                                        </Typography>
                                        <Typography variant="body2">
                                            Gestão total de hardware,
                                            utilizadores e calibração remota.
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 3,
                                        p: 3,
                                        borderRadius: 4,
                                        border: "1px solid",
                                        borderColor: "divider",
                                    }}
                                >
                                    <PersonSearch color="action" />
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            fontWeight={800}
                                        >
                                            Visitantes e Analistas
                                        </Typography>
                                        <Typography variant="body2">
                                            Solicite acesso a sensores e receba
                                            permissão via notificação
                                            administrativa.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </MotionBox>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper
                            sx={{
                                p: 4,
                                borderRadius: 8,
                                bgcolor: "#0F172A",
                                color: "white",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    p: 2,
                                }}
                            >
                                <AutoGraph
                                    sx={{ fontSize: "10rem", opacity: 0.05 }}
                                />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{ mb: 4, fontWeight: 800 }}
                            >
                                Fluxo Inteligente de Alocação
                            </Typography>

                            <Stack spacing={4}>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "primary.main",
                                            fontWeight: 900,
                                        }}
                                    >
                                        PASSO 1
                                    </Typography>
                                    <Typography variant="body1">
                                        Visitante identifica uma Estação de
                                        Monitoramento de Água em Luanda.
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "primary.main",
                                            fontWeight: 900,
                                        }}
                                    >
                                        PASSO 2
                                    </Typography>
                                    <Typography variant="body1">
                                        O pedido de acesso é enviado
                                        instantaneamente para o Dashboard do
                                        Administrador.
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "primary.main",
                                            fontWeight: 900,
                                        }}
                                    >
                                        PASSO 3
                                    </Typography>
                                    <Typography variant="body1">
                                        O Admin aprova e os dados fluem em tempo
                                        real para o novo utilizador.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* CTA FINAL */}
            <Box
                sx={{
                    py: 15,
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    textAlign: "center",
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight={900} gutterBottom>
                        Pare de adivinhar. Comece a medir.
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ opacity: 0.8, mb: 6, fontWeight: 400 }}
                    >
                        Junte-se a dezenas de gestores que já utilizam o
                        HyperCrest para proteger os seus recursos ambientais.
                    </Typography>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: "white",
                                color: "primary.main",
                                px: 6,
                                py: 2,
                                fontWeight: 900,
                                "&:hover": { bgcolor: "#f0f0f0" },
                            }}
                        >
                            Criar Conta Gratuita
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                color: "white",
                                borderColor: "white",
                                px: 6,
                                py: 2,
                                fontWeight: 800,
                                "&:hover": {
                                    borderColor: "#f0f0f0",
                                    bgcolor: "rgba(255,255,255,0.1)",
                                },
                            }}
                        >
                            Falar com um Especialista
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
