import AppLoader from "@/components/feedback/loader/AppCircularLoader";
import BackgroundBlobs from "@/components/ui/BackgroundBlobs";
import PulseIcon from "@/components/ui/PulseIcon";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { STATUS } from "@/constants/status";
import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user/user.service";
import { Box, Card, Typography } from "@mui/material";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

export default function ValidateSignUp() {
  const [searchParams] = useSearchParams();
  const { setAlert } = useAlert();
  const { signIn } = useAuth();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? STATUS.LOADING : STATUS.IDLE);

  useEffect(() => {
    if (!token) return;

    const validate = async () => {
      try {
        const response = await userService.create({ token });

        if (response.data) {
          setAlert({
            type: "SHOW",
            text: response?.message ?? "",
            style: "success",
          });

          let password = window.prompt("Informe a sua senha.");
          while (!password) {
            password = window.prompt("Comfirme a sua senha.");
          }

          const responseSignIn = await signIn({
            email: response.data.email,
            password: password,
          });

          if (responseSignIn.data) {
            setStatus(STATUS.SUCCESS);
          } else {
            setAlert({
              type: "SHOW",
              text: "Senha incorreta tente novamente.",
              style: "success",
            });
            setStatus(STATUS.IDLE);
          }
        } else {
          setAlert({
            type: "SHOW",
            text: response?.message,
            style: "error",
          });
          setStatus(STATUS.IDLE);
        }
      } catch (error) {
        console.log(error);
        setAlert({
          type: "SHOW",
          text: error.response?.message,
          style: "error",
        });
        setStatus(STATUS.IDLE);
      }
    };

    validate();
  }, [setAlert, signIn, token]);

  if (status === STATUS.SUCCESS) {
    return <Navigate to={"/"} />;
  }

  if (status === STATUS.IDLE) {
    return <Navigate to={"/signin"} />;
  }

  return (
    <Box
      sx={{
        p: 2,
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BackgroundBlobs />
      {/* Card */}
      <Card
        sx={{
          maxWidth: { xs: "100%", sm: 500, md: 640 },
          borderRadius: { xs: "18px", md: "24px" },
          px: { xs: 3, sm: 5, md: 8 },
          py: { xs: 3, md: 4 },
          textAlign: "center",
        }}
      >
        <PulseIcon>
          <AppLoader sx={{ color: "#ffffff" }} />
        </PulseIcon>

        <Title>Validando sua conta</Title>

        {/* Texto */}
        <Text sx={{ mb: 4 }}>Estamos preparando tudo pra você!</Text>

        {/* Box email */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            bgcolor: "#eff6ff",
            border: "1px solid #dbeafe",
            borderRadius: "14px",
            p: { xs: 2, md: 3 },
            mb: 4,
          }}
        >
          <Box
            sx={{
              p: 1.2,
              bgcolor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Shield style={{ color: "#3b82f6", fontSize: 22 }} />
          </Box>

          <Box>
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Validando identidade
            </Typography>
            <Text sx={{ color: "text.primary" }}>
              Isso pode levar alguns segundos. Se não abrir automaticamente,
              volte ao app após confirmar o e-mail.
            </Text>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
