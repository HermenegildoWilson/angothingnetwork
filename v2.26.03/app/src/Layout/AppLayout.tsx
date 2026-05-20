import { useRef, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";

import theme from "../theme";
import Header from "../Partials/Header/Header";
import Sidebar from "../Partials/Sidebar/Sidebar";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const boxRef = useRef(null); // Ref para o box principal
  const toggleDrawer = () => setOpen(!open);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Header open={open} toggleDrawer={toggleDrawer} />

      <Sidebar open={open} toggleDrawer={toggleDrawer} isMobile={isMobile} />

      <Box
        ref={boxRef}
        component="main"
        sx={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #f6f9fc 0%, #eef2f5 100%)",
          flexGrow: 1,
          mt: 7,
          overflowY: "auto",
          transition: theme.transitions.create(["margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
