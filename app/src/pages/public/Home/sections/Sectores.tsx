import { ArrowForward } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

import { monitoringSectors } from "../content";

const MotionPaper = motion(Paper);

export default function Sectores() {
  return (
    <Box sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography variant="h4" fontWeight="800" gutterBottom>
            Uma Solução 360º para o seu Ativo
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            Utilizamos hardware de precisão e uma arquitetura cloud robusta para
            entregar dados em que pode confiar.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {monitoringSectors.map((sector, idx) => (
            <MotionPaper
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{
                y: -12,
                boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
              }}
              sx={{
                p: { xs: 2.5, md: 4 },
                height: "100%",
                borderRadius: 8,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Stack
                sx={{
                  p: { xs: 0, md: 1 },
                  borderRadius: 6,
                  display: "flex",
                  flexFlow: "row",
                  alignItems: "center",
                  gap: 3,
                  width: "100%",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: sector.color,
                    width: 64,
                    height: 64,
                    mb: 1,
                  }}
                >
                  <sector.Icon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={900} gutterBottom>
                    {sector.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: sector.color,
                      fontWeight: 800,
                      mb: 1,
                    }}
                  >
                    Hardware: {sector.sensor}
                  </Typography>
                </Box>
              </Stack>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ flexGrow: 1, mb: 3 }}
              >
                {sector.desc}
              </Typography>
              <Button
                variant="text"
                color="inherit"
                endIcon={<ArrowForward />}
                sx={{
                  alignSelf: "flex-start",
                  fontWeight: 800,
                }}
              >
                Saber mais
              </Button>
            </MotionPaper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
