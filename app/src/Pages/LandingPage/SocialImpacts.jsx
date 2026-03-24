import {
    Agriculture,
    Business,
    MedicalServices,
    School,
    TrendingUp,
    Analytics,
    AssignmentTurnedIn,
} from "@mui/icons-material";
import { Avatar, Box, Container, Grid, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

export default function SocialImpacts({ ref }) {
    const socialImpacts = [
        {
            icon: <Agriculture />,
            title: "Agronegócio",
            desc: "Otimize colheitas monitorando microclimas e humidade do solo com precisão cirúrgica.",
        },
        {
            icon: <MedicalServices />,
            title: "Saúde Pública",
            desc: "Controle a qualidade do ar em hospitais e centros urbanos para prevenir doenças respiratórias.",
        },
        {
            icon: <Business />,
            title: "Indústria 4.0",
            desc: "Garanta a conformidade ambiental e a segurança operacional em plantas industriais complexas.",
        },
        {
            icon: <School />,
            title: "Educação e Pesquisa",
            desc: "Dados reais para o desenvolvimento científico e conscientização ambiental em escolas.",
        },
        {
            title: "Redução de Custos",
            desc: "Poupe até 30% em recursos hídricos e energia através de regas e ventilação baseadas em dados reais.",
            icon: <TrendingUp />,
        },
        {
            title: "Conformidade Legal",
            desc: "Relatórios automatizados que cumprem as normas ambientais vigentes, evitando multas e sanções.",
            icon: <AssignmentTurnedIn />,
        },
        {
            title: "Decisões em Segundos",
            desc: "Não espere por análises laboratoriais lentas. Obtenha a resposta que precisa no seu telemóvel.",
            icon: <Analytics />,
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 8 }} ref={ref}>
            <Box sx={{ textAlign: "center", mb: 5 }}>
                <Typography variant="h4" fontWeight="800" gutterBottom>
                    Um sistema, infinitas possibilidades.
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ maxWidth: 700, mx: "auto" }}
                >
                    Não coletamos apenas números. Coletamos a base para uma
                    sociedade mais sustentável e produtiva.
                </Typography>
            </Box>

            <Box sx={{display: "grid", gap: 4, gridTemplateColumns: {xs: "1fr", md: "1fr 1fr"}}}>
                {socialImpacts.map((impact, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                        <MotionPaper
                            whileHover={{ y: -10 }}
                            sx={{
                                p: { xs: 2, md: 4 },
                                borderRadius: 6,
                                borderColor: "divider",
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                height: "100%",
                                width: "100%",
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: "primary.light",
                                    color: "background.paper",
                                    width: 60,
                                    height: 60,
                                }}
                            >
                                {impact.icon}
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h6"
                                    fontWeight="800"
                                    gutterBottom
                                >
                                    {impact.title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    {impact.desc}
                                </Typography>
                            </Box>
                        </MotionPaper>
                    </Grid>
                ))}
            </Box>
        </Container>
    );
}
