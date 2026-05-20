import {
  Box,
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
import { useAuth } from "@/hooks/useAuth";
import theme from "@/theme";
import { SidebarItems } from "@/Partials/Sidebar/SidebarItems";

const drawerWidth = 240;
const closedDrawerWidth = 65;

const menuVisuals = {
  "/": { color: "#818cf8", bg: "rgba(129, 140, 248, 0.14)" },
  "/realtime": { color: "#10b981", bg: "rgba(16, 185, 129, 0.14)" },
  "/presence": { color: "#06b6d4", bg: "rgba(6, 182, 212, 0.14)" },
  "/history": { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.14)" },
  "/devices": { color: "#6366f1", bg: "rgba(99, 102, 241, 0.14)" },
  "/sensor-access-requests": {
    color: "#ec4899",
    bg: "rgba(236, 72, 153, 0.13)",
  },
  "/users": { color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.14)" },
  "/profile": { color: "#0f766e", bg: "rgba(15, 118, 110, 0.13)" },
  "/signout": { color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)" },
  "/home": { color: "#818cf8", bg: "rgba(129, 140, 248, 0.14)" },
  "/signin": { color: "#10b981", bg: "rgba(16, 185, 129, 0.14)" },
  "/signup": { color: "#6366f1", bg: "rgba(99, 102, 241, 0.14)" },
} as const;

const getMenuVisual = (path: string) =>
  menuVisuals[path as keyof typeof menuVisuals] ?? {
    color: "#64748b",
    bg: "rgba(100, 116, 139, 0.12)",
  };

function ListItemsMenu({
  open,
  isMobile,
  opcoesMenu,
  navigate,
  location,
  toggleDrawer,
}) {
  return (
    <List sx={{ px: open || isMobile ? 1.25 : "10px", py: 1.5 }}>
      {opcoesMenu.map((item) => {
        // === CONTROLE DO ESTADO DE ACTIVAÇÃO DA OPÇÃO DO MENU
        const active =
          item.path === "/"
            ? location.pathname === item.path
            : location.pathname.includes(item.path);
        const visual = getMenuVisual(item.path);
        const Icon = item.icon;

        return (
          <ListItem
            key={item.text}
            disablePadding
            sx={{
              display: "flex",
              justifyContent: open || isMobile ? "stretch" : "center",
              mb: 0.75,
            }}
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
                  width: open || isMobile ? "100%" : 44,
                  height: open || isMobile ? "auto" : 44,
                  justifyContent: open || isMobile ? "initial" : "center",
                  px: open || isMobile ? 1.35 : 0,
                  borderRadius: 3,
                  position: "relative",
                  overflow: "hidden",
                  color: active ? visual.color : "text.secondary",
                  background: active
                    ? `linear-gradient(135deg, ${visual.bg} 0%, rgba(255,255,255,0.78) 100%)`
                    : "transparent",
                  border: active
                    ? "1px solid rgba(255,255,255,0.76)"
                    : "1px solid transparent",
                  boxShadow: active
                    ? "0 14px 28px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.72)"
                    : "none",
                  backdropFilter: active ? "blur(12px)" : "none",
                  transition:
                    "background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease, color 160ms ease",
                  "&:hover": {
                    bgcolor: active ? undefined : "rgba(255,255,255,0.58)",
                    transform: "translateY(-1px)",
                    boxShadow: active
                      ? "0 14px 28px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.72)"
                      : "0 10px 22px rgba(15, 23, 42, 0.05)",
                  },
                  "&::before": active
                    ? {
                        content: '""',
                        position: "absolute",
                        left: open || isMobile ? 0 : "50%",
                        top: open || isMobile ? 9 : "auto",
                        bottom: open || isMobile ? 9 : 5,
                        width: open || isMobile ? 4 : 24,
                        height: open || isMobile ? "auto" : 4,
                        borderRadius: 999,
                        transform:
                          open || isMobile ? "none" : "translateX(-50%)",
                        bgcolor: visual.color,
                        boxShadow: `0 0 18px ${visual.color}66`,
                      }
                    : undefined,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: open || isMobile ? 42 : 48,
                    mr: open || isMobile ? 1.25 : 0,
                    justifyContent: "center",
                    alignItems: "center",
                    color: "inherit",
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 2.5,
                      bgcolor: active ? visual.bg : "rgba(148,163,184,0.1)",
                      color: active ? visual.color : "text.secondary",
                      transition: "background-color 160ms ease, color 160ms ease",
                      "& svg": {
                        width: 21,
                        height: 21,
                      },
                    }}
                  >
                    <Icon />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open || isMobile ? 1 : 0,
                    color: active ? visual.color : "text.secondary",
                    "& .MuiListItemText-primary": {
                      fontWeight: active ? 900 : 750,
                      fontSize: 14,
                      letterSpacing: 0,
                    },
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

export default function Sidebar({ open, toggleDrawer, isMobile }) {
  const { user } = useAuth();
  const opcoesMenu = SidebarItems[user?.role || "PUBLIC"];
  const navigate = useNavigate();
  const location = useLocation();

  const openedMixin = {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    borderRight: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(255,255,255,0.84)",
    backdropFilter: "blur(16px)",
    boxShadow: "10px 0 30px rgba(15, 23, 42, 0.04)",
  };

  const closedMixin = {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: closedDrawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: closedDrawerWidth,
    },
    borderRight: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(255,255,255,0.84)",
    backdropFilter: "blur(16px)",
    boxShadow: "10px 0 30px rgba(15, 23, 42, 0.04)",
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={isMobile ? toggleDrawer : undefined}
      sx={{
        width: isMobile ? drawerWidth : open ? drawerWidth : closedDrawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.standard,
        }),
        ...(!isMobile && {
          "& .MuiDrawer-paper": open ? openedMixin : closedMixin,
        }),
        ...(isMobile && {
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            borderRight: "1px solid rgba(148, 163, 184, 0.18)",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            boxShadow: "18px 0 40px rgba(15, 23, 42, 0.12)",
          },
        }),
      }}
    >
      <Toolbar sx={{ minHeight: 56 }} />
      <ListItemsMenu
        open={open}
        isMobile={isMobile}
        opcoesMenu={opcoesMenu}
        navigate={navigate}
        location={location}
        toggleDrawer={toggleDrawer}
      />
    </Drawer>
  );
}
