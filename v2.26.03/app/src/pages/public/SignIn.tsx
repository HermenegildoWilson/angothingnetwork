import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Fade,
  Divider,
  Avatar,
} from "@mui/material";
import { MailOutline, LockOutlined, ArrowForward } from "@mui/icons-material";
import { Link, Navigate } from "react-router-dom";

import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import FormFields from "@/components/form/FormFields";
import type { SignInDto } from "@/services/auth/types";
import type { StyledInputProps } from "@/components/form/types";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
};

export default function SignIn() {
  const { signIn, user } = useAuth();
  const { setAlert } = useAlert();
  const [credentials, setCredentials] = useState<SignInDto["userFields"]>({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState(STATUS.IDLE);

  const isLoading = status === STATUS.LOADING;
  const isFormValid =
    credentials.email.includes("@") && credentials.password.length >= 4;

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
      const response = await signIn(credentials);

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

  const Fields: StyledInputProps[] = [
    {
      label: "E-mail",
      name: "email",
      type: "email",
      value: credentials.email,
      Icon: MailOutline,
      onChange: handleChange,
      required: true,
    },
    {
      label: "password",
      name: "password",
      type: "password",
      value: credentials.password,
      Icon: LockOutlined,
      onChange: handleChange,
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
            <Avatar
              variant="rounded"
              sx={{
                margin: "auto",
                bgcolor: "primary.main",
                color: "primary.text",
                width: 52,
                height: 52,
                borderRadius: 3,
                mb: 1,
              }}
            >
              <LockOutlined />
            </Avatar>

            <Typography variant="h4" fontWeight={700}>
              Bem-vindo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Acesse sua conta para continuar
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ px: 4, pb: 3 }}>
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
                {isLoading ? "Entrando..." : "Entrar na plataforma"}
              </Button>
            </FormFields>

            <Box sx={{ my: 2 }}>
              <Divider>OU</Divider>
            </Box>

            <Typography
              variant="body2"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              Não tem uma conta?{" "}
              <Typography component="span" color="primary" fontWeight={600}>
                <Link to={"/signup"} style={{ textDecoration: "none" }}>
                  <Typography sx={{ color: "primary.main" }}>
                    Cadastre-se agora
                  </Typography>
                </Link>
              </Typography>
            </Typography>
          </Box>
        </Card>
      </Fade>
    </Box>
  );
}
