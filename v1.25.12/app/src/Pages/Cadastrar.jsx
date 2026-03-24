import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Fade,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";
import {
  PersonOutline,
  MailOutline,
  LockOutlined,
  PhoneOutlined,
  Visibility,
  VisibilityOff,
  ArrowForward,
  PersonAdd,
} from "@mui/icons-material";
import { Link, Navigate } from "react-router-dom";

import { api } from "../api/axios";
import { useAlert } from "../hooks/useAlert";
import { useAuth } from "../hooks/useAuth";
import AppLoader from "../components/feedback/AppLoader";
import FormFields from "../components/form/FormFields";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
};

export default function Register() {
  const { user, login } = useAuth();
  const { setAlert } = useAlert();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
  });

  const [status, setStatus] = useState(STATUS.IDLE);

  const isLoading = status === STATUS.LOADING;

  const isFormValid =
    form.nome.length >= 3 &&
    form.email.includes("@") &&
    form.telefone.length >= 9 &&
    (form.senha.length >= 4 || !!user);

  const handleChange = ({ target }) => {
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setStatus(STATUS.LOADING);
      const { data } = await api.post("/user/cadastrar", form);

      if (data?.success) {
        setAlert({
          type: "SHOW",
          text: data.message,
          style: "success",
        });

        const response = await login({
          email: form.email,
          senha: form.senha,
        });

        if (response?.success) {
          setStatus(STATUS.SUCCESS);
          return setAlert({
            type: "SHOW",
            text: response.message,
            style: "success",
          });
        }
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

  if (
    status === STATUS.SUCCESS ||
    user /* || (user && user?.role !== "admin")*/
  ) {
    return <Navigate to={"/"} />;
  }

  const Fields = [
    {
      label: "Nome completo",
      name: "nome",
      type: "text",
      value: form.nome,
      icon: PersonOutline,
      handleChange: handleChange,
      required: true,
    },
    {
      label: "E-mail",
      name: "email",
      type: "email",
      value: form.email,
      icon: MailOutline,
      handleChange: handleChange,
      required: true,
    },
    {
      label: "Telefone",
      name: "telefone",
      type: "tel",
      value: form.telefone,
      icon: PhoneOutlined,
      handleChange: handleChange,
      required: true,
    },
  ];

  // !(user?.role === "admin") &&
  Fields.push({
    label: "Senha",
    name: "senha",
    type: "password",
    value: form.senha,
    icon: LockOutlined,
    handleChange: handleChange,
    required: true,
  });

  const title = !(user?.role === "admin") ? "Criar conta" : "Cadastrar Usuário";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Fade in timeout={600}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 460,
            borderRadius: "24px",
            boxShadow: "0 20px 40px rgba(0,0,0,.1)",
          }}
        >
          {/* Header */}
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Avatar
              variant="rounded"
              sx={{
                margin: "auto",
                bgcolor: "#e3f2fd",
                color: "primary.main",
                width: 52,
                height: 52,
                borderRadius: 3,
                mb: 1,
              }}
            >
              <PersonAdd />
            </Avatar>

            <Typography variant="h5" fontWeight={700}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Preencha os dados para se cadastrar
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ px: 4, pb: 3 }}>
            <FormFields Fields={Fields}>
              <Button
                type="submit"
                size="large"
                variant="contained"
                disabled={!isFormValid || isLoading}
                endIcon={!isLoading && <ArrowForward />}
                sx={{
                  borderRadius: "12px",
                  py: 1.4,
                  textTransform: "none",
                }}
              >
                {isLoading ? (
                  <>
                    Criando sua conta...
                    <AppLoader type={"small"} />
                  </>
                ) : (
                  title
                )}
              </Button>
            </FormFields>

            {!user && (
              <>
                {" "}
                <Box sx={{ my: 2 }}>
                  <Divider />
                </Box>
                <Typography align="center" variant="body2">
                  Já tem uma conta?{" "}
                  <Typography component="span" color="primary" fontWeight={600}>
                    <Link to={"/login"}>Entrar</Link>
                  </Typography>
                </Typography>
              </>
            )}
          </Box>
        </Card>
      </Fade>
    </Box>
  );
}
