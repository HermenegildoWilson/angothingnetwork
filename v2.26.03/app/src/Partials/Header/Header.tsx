import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  ArrowLeftSharp,
  FactCheck,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Header({ open, toggleDrawer }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const iconButtonSx = {
    width: 40,
    height: 40,
    color: "primary.main",
    bgcolor: "rgba(129, 140, 248, 0.14)",
    border: "1px solid rgba(129, 140, 248, 0.18)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
    "&:hover": {
      bgcolor: "rgba(129, 140, 248, 0.2)",
      boxShadow: "0 10px 22px rgba(129, 140, 248, 0.18)",
    },
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: "text.primary",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(248,250,252,0.76) 58%, rgba(238,242,255,0.82) 100%)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
      }}
    >
      <Toolbar sx={{ minHeight: 56, px: { xs: 1.5, sm: 2.5 } }}>
        {/* Ícone de abrir Drawer */}
        {open !== undefined && (
          <IconButton
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{
              ...iconButtonSx,
              mr: 2,
            }}
          >
            {open ? (
              <Tooltip title={"Fechar Menu"} placement="right">
                <ArrowLeftSharp />
              </Tooltip>
            ) : (
              <Tooltip title={"Abrir Menu"} placement="right">
                <MenuIcon />
              </Tooltip>
            )}
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 900,
              letterSpacing: 0,
              lineHeight: 1.1,
              color: "text.primary",
            }}
          >
            Angothingnetwork
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {user ? (
            <>
              <IconButton
                onClick={() => navigate("/sensor-access-requests")}
                sx={iconButtonSx}
              >
                <Tooltip title={"Pedidos de Acesso"}>
                  <FactCheck />
                </Tooltip>
              </IconButton>
              <IconButton
                onClick={() => navigate("/profile")}
                sx={iconButtonSx}
              >
                <Tooltip title={"Perfil"}>
                  <AccountCircle />
                </Tooltip>
              </IconButton>
            </>
          ) : (
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
              }}
              onClick={() => navigate("/signin")}
            >
              Entrar
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
