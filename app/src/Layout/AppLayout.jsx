import { useRef, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";

import theme from "../theme";
import Header from "../Partials/Header/Header";
import Sidebar from "../Partials/Sidebar/Sidebar";
import ScrollTop from "../Partials/ScrollTop";

const drawerWidth = 0;
const closedWidth = -22; //`calc(${theme.spacing(7)} + 1px)`;

export default function AppLayout() {
    const [open, setOpen] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const boxRef = useRef(null); // Ref para o box principal
    const toggleDrawer = () => setOpen(!open);

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Header
                open={open}
                toggleDrawer={toggleDrawer}
                isMobile={isMobile}
            />

            <Sidebar
                open={open}
                toggleDrawer={toggleDrawer}
                isMobile={isMobile}
            />

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
                    overflowY: "scroll",
                    transition: theme.transitions.create(["margin"], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.standard,
                    }),
                    ml: !isMobile ? (open ? drawerWidth : closedWidth) : 0,
                }}
            >
                <Outlet />
                <ScrollTop target={() => boxRef.current} />
            </Box>
        </Box>
    );
}
