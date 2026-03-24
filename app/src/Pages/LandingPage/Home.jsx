import { useRef } from "react";
import {
    Box,
    Typography,
    Stack,
} from "@mui/material";

import Hero from "./Hero";
import SocialImpacts from "./SocialImpacts";
import Features from "./Features";
import Footer from "../../Partials/Footer/Footer";
import Sectores from "./Sectores";

/**
 * Landing Page Premium para o Sistema de Monitoramento Ambiental.
 * Design focado em conversão, animações fluidas e impacto social.
 */
export default function LandingPage() {
    const seccao_impacto_socialRef = useRef(null); // Ref para a seção de destino

    return (
        <Box
            sx={{
                bgcolor: "background.default",
                pt: 1.4,
                flex: "1",
            }}
        >
            {/* HERO SECTION COM ANIMAÇÃO */}
            <Hero seccao={seccao_impacto_socialRef} />

            {/* SECTORES E HARDWARE (O QUE MONITORIZAMOS?) */}
            <Sectores />

            {/* IMPACTO SOCIAL E SETORIAL */}
            <SocialImpacts ref={seccao_impacto_socialRef} />

            {/* FUNCIONALIDADES COM ANIMAÇÃO STAGGER */}
            <Features />

            {/* RODAPÉ */}
           <Footer />
        </Box>
    );
}
