import { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    Card,
    Container,
    Typography,
    Divider,
    IconButton,
    Paper,
    Grid,
    Fade,
    CircularProgress,
    Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    MapPin,
    ArrowLeft,
    MoreVertical,
} from "lucide-react";
import { api } from "../api/axios";
import MiniMenu from "../components/modal/MiniMenu";
import { useAuth } from "../hooks/useAuth";
import AppLoader from "../components/feedback/AppLoader";

const defaultIconMapper = {
    nome: User,
    email: Mail,
    telefone: Phone,
    datacadastro: Calendar,
    nivel: Shield,
    localizacao: MapPin,
};

export default function Perfil() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    // Estados baseados na sua lógica original
    const [userPerfil, setUserPerfil] = useState(null);
    const [pageState, setPageState] = useState("loading");

    // Simulação da sua função getPeople
    async function getPeople() {
        try {
            if (!id) {
                return setUserPerfil(user);
            }

            setPageState("loading");
            const { data } = await api.get("/user/usuarios", {
                params: { id },
            });
            const people = data.data[0];

            setUserPerfil(people);
        } catch (error) {
            console.error("Erro ao buscar perfil:", error);
            setUserPerfil(null);
        } finally {
            setPageState("done");
        }
    }

    useEffect(() => {
        getPeople();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (pageState === "loading") {
        return (
            <Box
                sx={{
                    height: "90vh",
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <Typography variant="body1" color="text.secondary">
                    Sincronizando perfil...
                </Typography>
                {/* <AppLoader /> */}
                <AppLoader />
            </Box>
        );
    }

    if (!userPerfil || !userPerfil.nome) {
        return (
            <Box
                sx={{
                    height: "90vh",
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Avatar
                    sx={{
                        width: 120,
                        height: 120,
                        fontSize: 48,
                        fontWeight: "bold",
                        bgcolor: "primary.main",
                        boxShadow: "0 8px 24px -6px rgba(33, 150, 243, 0.4)",
                        mb: 2,
                        border: "4px solid white",
                    }}
                >
                    ?
                </Avatar>
                <Typography variant="h5" color="text.secondary">
                    Perfil inexistente...
                </Typography>
                <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    Voltar
                </Button>
            </Box>
        );
    }

    // Processamento de dados conforme sua lógica original
    const perfilDados = Object.entries(userPerfil).filter(
        ([key]) => (key !== "id" && key !== "nome"),
    );

    return (
        <Box
            sx={{
                background: "linear-gradient(135deg, #f6f9fc 0%, #eef2f5 100%)",
                py: { xs: 1, md: 2.5 },
            }}
        >
            <Container maxWidth="sm">
                <Fade in timeout={600}>
                    <Card
                        sx={{
                            overflow: "visible",
                            boxShadow: "0 20px 60px -12px rgba(0,0,0,0.08)",
                            border: "1px solid rgba(255,255,255,0.6)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        {/* Header do Perfil */}
                        <Box
                            sx={{
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                position: "relative",
                                borderRadius: "32px 32px 0 0",
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 20,
                                    right: 20,
                                }}
                            >
                                <MiniMenu options={["Editar", "Deletar"]} />
                            </Box>

                            {/* <Box
                                sx={{ position: "absolute", top: 20, left: 20 }}
                            >
                                <IconButton onClick={() => navigate(-1)}>
                                    <ArrowLeft size={20} />
                                </IconButton>
                            </Box> */}

                            <Avatar
                                sx={{
                                    width: 110,
                                    height: 110,
                                    fontSize: 50,
                                    fontWeight: "bold",
                                    bgcolor: "primary.main",
                                    boxShadow:
                                        "0 8px 24px -6px rgba(33, 150, 243, 0.4)",
                                    mb: 1,
                                    border: "4px solid white",
                                }}
                            >
                                {userPerfil.nome[0]}
                            </Avatar>

                            <Typography
                                variant="h5"
                                fontWeight="800"
                                color="text.primary"
                            >
                                {userPerfil.nome}
                            </Typography>
                        </Box>

                        <Divider sx={{ mx: 4, opacity: 0.6 }} />

                        {/* Lista de Atributos */}
                        <Box sx={{ p: 2, px: { xs: 1, md: 4 } }}>
                            <>
                                {perfilDados.map(([key, value]) => (
                                    <Box mb={1}>
                                        <ProfileInfoItem
                                            label={key}
                                            value={value}
                                            iconMapper={defaultIconMapper}
                                        />
                                    </Box>
                                ))}
                            </>
                        </Box>
                    </Card>
                </Fade>
            </Container>
        </Box>
    );
}

/**
 * Sub-componente para itens da lista de perfil
 */
function ProfileInfoItem({ label, value, iconMapper }) {
    const keyLower = label.toLowerCase();
    const Icon = iconMapper[keyLower] || User;

    // Formatação de data se a chave for DataCadastro
    const displayValue = keyLower.includes("data")
        ? new Date(value).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          })
        : value;

    // Capitalização do label
    const displayLabel =
        label.charAt(0).toUpperCase() +
        label.slice(1).replace(/([A-Z])/g, " $1");

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                p: 1.5,
                borderRadius: 4,
                bgcolor: "white",
                border: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                gap: 1,
                transition: "transform 0.2s",
                "&:hover": {
                    transform: "translateX(4px)",
                    borderColor: "primary.light",
                },
            }}
        >
            <Avatar
                sx={{
                    bgcolor: "#e3f2fd",
                    color: "primary.main",
                    width: 40,
                    height: 40,
                    borderRadius: 2.5,
                }}
            >
                <Icon size={20} />
            </Avatar>
            <Box>
                <Typography
                    variant="caption"
                    color="text.disabled"
                    fontWeight="bold"
                    sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                    {displayLabel}
                </Typography>
                <Typography
                    variant="body1"
                    fontWeight="600"
                    color="text.primary"
                >
                    {displayValue}
                </Typography>
            </Box>
        </Paper>
    );
}
