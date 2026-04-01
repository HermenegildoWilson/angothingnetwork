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
import {
  PersonOutline,
  MailOutline,
  LockOutlined,
  PhoneOutlined,
  ArrowForward,
  PersonAdd,
} from "@mui/icons-material";
import { Link, Navigate } from "react-router-dom";

import FormFields from "@/components/form/FormFields";
import { useAlert } from "@/hooks/useAlert";
import type { GenerateRegisterTokenDto } from "@/services/user/types";
import { userService } from "@/services/user/user.service";
import type { StyledInputProps } from "@/components/form/types";
import AppLoader from "@/components/feedback/loader/AppCircularLoader";
import Title from "@/components/ui/Title";
import { STATUS } from "@/constants/status";

export default function SignUp() {
  const { setAlert } = useAlert();
  const [data, setData] = useState<GenerateRegisterTokenDto>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState(STATUS.IDLE);

  const isLoading = status === STATUS.LOADING;

  const isFormValid =
    data.name.length >= 3 &&
    data.email.includes("@") &&
    data.phone.length >= 9 &&
    data.password.length >= 4;

  const handleChange = ({ target }) => {
    setData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setStatus(STATUS.LOADING);
      const response = await userService.generateRegisterToken(data);

      if (response.data) {
        setAlert({
          type: "SHOW",
          text: response?.data.message,
          style: "success",
        });
        setMessage(response?.data.message);

        setStatus(STATUS.SUCCESS);
      } else {
        setAlert({
          type: "SHOW",
          text: response?.message,
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

  if (status === STATUS.SUCCESS) {
    return <Navigate to={"/signup/verify"} state={{ message }} />;
  }

  const Fields: StyledInputProps[] = [
    {
      label: "Nome completo",
      name: "name",
      type: "text",
      value: data.name,
      Icon: PersonOutline,
      onChange: handleChange,
      required: true,
    },
    {
      label: "E-mail",
      name: "email",
      type: "email",
      value: data.email,
      Icon: MailOutline,
      onChange: handleChange,
      required: true,
    },
    {
      label: "Telephone",
      name: "phone",
      type: "tel",
      value: data.phone,
      Icon: PhoneOutlined,
      onChange: handleChange,
      required: true,
    },
    {
      label: "Senha",
      name: "password",
      type: "password",
      value: data.password,
      Icon: LockOutlined,
      onChange: handleChange,
      required: true,
    },
  ];

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
          }}
        >
          <Box sx={{ p: 2, textAlign: "center" }}>
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
              <PersonAdd />
            </Avatar>

            <Title>
              Criar conta
            </Title>
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
                    Criando sua conta...
                    <AppLoader type={"small"} />
                  </>
                ) : (
                  "Criar conta"
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
                Já tem uma conta?
                <Typography component="span" color="primary" fontWeight={600}>
                  <Link to={"/signin"} style={{ textDecoration: "none" }}>
                    <Typography sx={{ color: "primary.main" }}>
                      Entrar
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
