import { forwardRef } from "react";
import { Avatar, Box, Container, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

import { socialImpactItems } from "../content";

const MotionPaper = motion(Paper);

type SocialImpactsProps = object;

const SocialImpacts = forwardRef<HTMLDivElement, SocialImpactsProps>(
  function SocialImpacts(_props, ref) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }} ref={ref}>
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Typography variant="h4" fontWeight="800" gutterBottom>
            Um sistema, infinitas possibilidades.
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            Não coletamos apenas números. Coletamos a base para uma sociedade
            mais sustentável e produtiva.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {socialImpactItems.map((impact, idx) => (
            <MotionPaper
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8 }}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 6,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 3,
                height: "100%",
                width: "100%",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  color: "background.paper",
                  width: 56,
                  height: 56,
                }}
              >
                <impact.Icon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="800" gutterBottom>
                  {impact.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {impact.desc}
                </Typography>
              </Box>
            </MotionPaper>
          ))}
        </Box>
      </Container>
    );
  },
);

export default SocialImpacts;
