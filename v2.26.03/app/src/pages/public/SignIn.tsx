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

import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import FormFields from "@/components/form/FormFields";
import type { SignInDto } from "@/services/auth/types";
import type { StyledInputProps } from "@/components/form/types";
import AppLoader from "@/components/feedback/loader/AppCircularLoader";
import Title from "@/components/ui/Title";
import { STATUS } from "@/constants/status";
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
          text: response.data.message,
          style: "success",
        });
      } else {
        setAlert({
          type: "SHOW",
          text: response.message,
          style: "warning",
        });

        setStatus(STATUS.IDLE);
      }
    } catch (error) {
      console.log(error);

      setAlert({
        type: "SHOW",
        text: error.response?.message,
        style: "warning",
      });

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
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        mb: 10,
      }}
    >
      <Fade in timeout={600}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 460,
          }}
        >
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Avatar
              variant="rounded"
              sx={{
                margin: "auto",
                bgcolor: "secondary.main",
                color: "primary.text",
                width: 52,
                height: 52,
                borderRadius: 3,
                mb: 1,
              }}
            >
              <LockOutlined />
            </Avatar>

            <Title>Bem-vindo</Title>
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
                  borderRadius: "12px",
                  py: 1.4,
                }}
              >
                {isLoading ? (
                  <>
                    Entrando... <AppLoader type="small" />
                  </>
                ) : (
                  <>Entrar na plataforma</>
                )}
              </Button>
            </FormFields>

            <Box>
              <Box sx={{ my: 1 }}>
                <Divider />
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
                Não tem uma conta?
                <Typography component="span" color="primary" fontWeight={600}>
                  <Link to={"/signup"} style={{ textDecoration: "none" }}>
                    <Typography sx={{ color: "primary.main" }}>
                      Cadastre-se
                    </Typography>
                  </Link>
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Fade>
    </Box>
  );
}
