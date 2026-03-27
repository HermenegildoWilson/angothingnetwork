import { forwardRef } from "react";
import { Avatar, Box, Container, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

import { socialImpactItems } from "../content";

const MotionPaper = motion(Paper);

type SocialImpactsProps = object;

const SocialImpacts = forwardRef<HTMLDivElement, SocialImpactsProps>(
  function SocialImpacts(_props, ref) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }} ref={ref}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
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
            gap: 4,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          {socialImpactItems.map((impact, idx) => (
            <MotionPaper
              key={idx}
              whileHover={{ y: -10 }}
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 6,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 3,
                height: "100%",
                width: "100%",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.light",
                  color: "background.paper",
                  width: 60,
                  height: 60,
                }}
              >
                {impact.icon}
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
