import {
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { menuItems } from "../../utils/optionsMenu";
import theme from "../../theme";
import { useAuth } from "../../hooks/useAuth";

const drawerWidth = 240;

export default function Sidebar({ open, toggleDrawer, isMobile }) {
    const { user } = useAuth()
    const opcoesMenu = menuItems[user?.role || "public"];
    const navigate = useNavigate();
    const location = useLocation();

    const openedMixin = {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: "hidden",
    };

    const closedMixin = {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: `calc(${theme.spacing(7)} + 1px)`,
        [theme.breakpoints.up("sm")]: {
            width: `calc(${theme.spacing(8)} + 1px)`,
        },
    };
    function ListItemsMenu() {
        return (
            <List>
                {opcoesMenu.map((item) => {
                    // === CONTROLE DO ESTADO DE ACTIVAÇÃO DA OPÇÃO DO MENU
                    const active = location.pathname === item.path;
                    
                    return (
                        <ListItem
                            key={item.text}
                            disablePadding
                            sx={{ display: "block" }}
                        >
                            <Tooltip
                                title={!open && !isMobile ? item.text : ""}
                                placement="right"
                            >
                                <ListItemButton
                                    onClick={() => {
                                        navigate(item.path);
                                        if (isMobile) toggleDrawer();
                                    }}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent:
                                            open || isMobile
                                                ? "initial"
                                                : "center",
                                        px: 2.5,
                                        backgroundColor: active
                                            ? "rgba(25, 118, 210, 0.08)"
                                            : "transparent",
                                        borderRight:
                                            active && !isMobile
                                                ? "4px solid #1976d2"
                                                : "none",
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open || isMobile ? 3 : "auto",
                                            justifyContent: "center",
                                            color: active
                                                ? "primary.main"
                                                : "inherit",
                                        }}
                                    >
                                        <item.icon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{
                                            opacity: open || isMobile ? 1 : 0,
                                            color: active
                                                ? "primary.main"
                                                : "inherit",
                                            fontWeight: active
                                                ? "bold"
                                                : "normal",
                                        }}
                                    />
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </List>
        );
    }

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={open}
            onClose={isMobile ? toggleDrawer : undefined}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                whiteSpace: "nowrap",
                boxSizing: "border-box",
                ...(!isMobile && {
                    "& .MuiDrawer-paper": open ? openedMixin : closedMixin,
                }),
                ...(isMobile && {
                    "& .MuiDrawer-paper": { width: drawerWidth },
                }),
            }}
        >
            <Toolbar sx={{ px: [1] }}>x</Toolbar>
            <ListItemsMenu />
        </Drawer>
    );
}
