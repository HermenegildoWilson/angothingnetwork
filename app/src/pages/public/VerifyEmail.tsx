import { Box, Card, Typography, Button } from "@mui/material";
import { CheckRounded, MailOutline } from "@mui/icons-material";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import BackgroundBlobs from "@/components/ui/BackgroundBlobs";
import PulseIcon from "@/components/ui/PulseIcon";
import Title from "@/components/ui/Title";
import Text from "@/components/ui/Text";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const message = state?.message;

  if (!message) {
    return <Navigate to={"/signup"} />;
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
        <PulseIcon Icon={CheckRounded} />

        <Title>Verificar E-mail!</Title>

        {/* Texto */}
        <Text sx={{ mb: 4 }}>
          {message ??
            "Enviamos um link de verificação para o seu e-mail. Confirme a conta para começar a usar a plataforma."}
        </Text>

        {/* Box email */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            textAlign: { xs: "center", sm: "left" },
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
            <MailOutline sx={{ color: "#3b82f6", fontSize: 22 }} />
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
              Verifique seu e-mail
            </Typography>
            <Text sx={{ color: "text.primary" }}>
              Enviamos o link para confirmar o seu cadastro.
            </Text>
          </Box>
        </Box>

        {/* Botões */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            sx={{
              borderRadius: "10px",
              boxShadow: "0 6px 16px rgba(15,23,42,0.2)",
            }}
          >
            <Typography
              component="a"
              sx={{ textDecoration: "none", color: "primary.contrastText" }}
              href="mailto:"
              target="_blank"
            >
              Ver email
            </Typography>
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate("/signin")}
            sx={{
              py: 1,
              color: "#475569",
              borderColor: "#e2e8f0",
              fontWeight: 600,
              borderRadius: "10px",
              textTransform: "none",
              bgcolor: "#fff",
            }}
          >
            Ir para o login
          </Button>
        </Box>

        {/* Footer */}
        <Text
          sx={{
            mt: 4,
            color: "#94a3b8",
            fontSize: "0.9rem",
          }}
        >
          Não recebeu o e-mail? Verifique sua pasta de spam ou{" "}
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <Typography
              component="span"
              sx={{
                color: "#3b82f6",
                fontSize: "0.9rem",
              }}
            >
              reenviar
            </Typography>
          </Link>
          .
        </Text>
      </Card>
    </Box>
  );
}
