import { useState } from "react";
import {
    Box,
    Card,
    Typography,
    Button,
    Fade,
    Divider,
} from "@mui/material";
import {
    MailOutline,
    LockOutlined,
    ArrowForward,
} from "@mui/icons-material";
import { Link, Navigate } from "react-router-dom";

import { useAlert } from "../hooks/useAlert";
import { useAuth } from "../hooks/useAuth";
import AppLoader from "../components/feedback/AppLoader";
import FormFields from "../components/form/FormFields";

const STATUS = {
    IDLE: "idle",
    LOADING: "loading",
    SUCCESS: "success",
};

export default function Login() {
    const { login, user } = useAuth();
    const { setAlert } = useAlert();
    const [credentials, setCredentials] = useState({
        email: "",
        senha: "",
    });
    const [status, setStatus] = useState(STATUS.IDLE);

    const isLoading = status === STATUS.LOADING;
    const isFormValid =
        credentials.email.includes("@") && credentials.senha.length >= 4;

    const handleChange = ({ target }) => {
        setCredentials((prev) => ({
            ...prev,
            [target.name]: target.value,
        }));
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setStatus(STATUS.LOADING);
            const response = await login(credentials);

            if (response?.success) {
                setStatus(STATUS.SUCCESS);
                return setAlert({
                    type: "SHOW",
                    text: response.message,
                    style: "success",
                });
            }
        } catch (error) {
            console.log(error);
            if (error.code === "ERR_NETWORK") {
                setAlert({
                    type: "SHOW",
                    text: error.message,
                    style: "error",
                });
            } else {
                setAlert({
                    type: "SHOW",
                    text: error.response?.data?.message,
                    style: "warning",
                });
            }

            setStatus(STATUS.IDLE);
        }
    };

    if (user || status === STATUS.SUCCESS) {
        return <Navigate to={"/"} />;
    }

    const Fields = [
        {
            label: "E-mail",
            name: "email",
            type: "email",
            value: credentials.email,
            icon: MailOutline,
            handleChange: handleChange,
            required: true,
        },
        {
            label: "Senha",
            name: "senha",
            type: "password",
            value: credentials.senha,
            icon: LockOutlined,
            handleChange: handleChange,
            required: true,
        },
    ];

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Fade in timeout={600}>
                <Card
                    sx={{
                        width: "100%",
                        maxWidth: 440,
                        borderRadius: "24px",
                        boxShadow: "0 20px 40px rgba(0,0,0,.1)",
                    }}
                >
                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: "16px",
                                bgcolor: "primary.main",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 1,
                            }}
                        >
                            <LockOutlined />
                        </Box>

                        <Typography variant="h4" fontWeight={700}>
                            Bem-vindo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Acesse sua conta para continuar
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ px: 4, pb: 3 }}
                    >
                        <FormFields Fields={Fields}>
                            <Button
                                type="submit"
                                size="large"
                                variant="contained"
                                disabled={!isFormValid || isLoading}
                                endIcon={!isLoading && <ArrowForward />}
                                sx={{
                                    borderRadius: "8px",
                                    py: 1.4,
                                    textTransform: "none",
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        Entrando...
                                        <AppLoader type={"small"} />
                                    </>
                                ) : (
                                    "Entrar na plataforma"
                                )}
                            </Button>
                        </FormFields>

                        <Box sx={{ my: 2 }}>
                            <Divider>OU</Divider>
                        </Box>

                        <Typography align="center" variant="body2">
                            Não tem uma conta?{" "}
                            <Typography
                                component="span"
                                color="primary"
                                fontWeight={600}
                            >
                                <Link to={"/cadastrar"}>Cadastre-se agora</Link>
                            </Typography>
                        </Typography>
                    </Box>
                </Card>
            </Fade>
        </Box>
    );
}
