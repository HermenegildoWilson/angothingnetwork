import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Divider, Typography } from "@mui/material";
import { motion } from "framer-motion";

import { featureItems } from "../content";

// Componente para Wrapper de Animação
const MotionBox = motion(Box);

export default function Features() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        color: "white",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 40%, rgba(2,6,23,1) 100%)",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -120,
          right: -160,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, #38bdf833 0%, transparent 65%)",
          filter: "blur(10px)",
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
          <Typography variant="overline" sx={{ letterSpacing: 3 }}>
            Plataforma Inteligente
          </Typography>
          <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>
            Funcionalidades pensadas para decisões rápidas
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              color: "rgba(255,255,255,0.65)",
              maxWidth: 720,
              mx: "auto",
            }}
          >
            Tudo o que você precisa para monitorar, analisar e agir em tempo
            real com uma experiência premium.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {featureItems.map((f, i) => (
            <Box key={i}>
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(15,23,42,0.5)",
                  backdropFilter: "blur(6px)",
                  height: "100%",
                }}
              >
                <Box sx={{ color: "primary.main", mb: 2 }}>
                  <f.Icon fontSize="large" />
                </Box>
                <Typography variant="h6" fontWeight="800" sx={{ mb: 1 }}>
                  {f.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.7,
                  }}
                >
                  {f.desc}
                </Typography>
              </MotionBox>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: { xs: 6, md: 8 }, borderColor: "rgba(255,255,255,0.1)" }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 4 }}>
            Pronto para transformar sua gestão ambiental?
          </Typography>
          <Button
            onClick={() => navigate("/signup")}
            variant="contained"
            sx={{
              width: "250px",
              py: 1,
              borderRadius: 2,
              fontWeight: 800,
              fontSize: "1.1rem",
            }}
          >
            Começar Gratuitamente
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
