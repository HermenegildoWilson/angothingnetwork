import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Divider, Typography } from "@mui/material";
import { motion } from "framer-motion";

import { featureItems } from "../content";

// Componente para Wrapper de Animação
const MotionBox = motion(Box);

export default function Features() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8, bgcolor: "#0F172A", color: "white" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gap: 4,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          {featureItems.map((f, i) => (
            <Box key={i}>
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
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

        <Divider sx={{ my: 8, borderColor: "rgba(255,255,255,0.1)" }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 4 }}>
            Pronto para transformar sua gestão ambiental?
          </Typography>
          <Button
            onClick={() => navigate("/cadastrar")}
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
