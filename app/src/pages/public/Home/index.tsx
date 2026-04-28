import { useRef } from "react";
import { Box } from "@mui/material";

import Hero from "./sections/Hero";
import SocialImpacts from "./sections/SocialImpacts";
import Features from "./sections/Features";
import Footer from "@/Partials/Footer/Footer";
import Sectores from "./sections/Sectores";

/**
 * Landing Page Premium para o Sistema de Monitoramento Ambiental.
 * Design focado em conversão, animações fluidas e impacto social.
 */
export default function Home() {
  const impactSectionRef = useRef<HTMLDivElement | null>(null); // Ref para a seção de destino

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        flex: "1",
        overflowX: "hidden",
      }}
    >
      {/* HERO SECTION COM ANIMAÇÃO */}
      <Hero impactRef={impactSectionRef} />

      {/* SECTORES E HARDWARE (O QUE MONITORIZAMOS?) */}
      <Sectores />

      {/* IMPACTO SOCIAL E SETORIAL */}
      <SocialImpacts ref={impactSectionRef} />

      {/* FUNCIONALIDADES COM ANIMAÇÃO STAGGER */}
      <Features />

      {/* RODAPÉ */}
      <Footer />
    </Box>
  );
}
