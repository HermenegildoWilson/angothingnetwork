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
  Notifications as NotificationsIcon,
  AccountCircle,
  ArrowLeftSharp,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Header({ open, toggleDrawer }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {/* Ícone de abrir Drawer */}
        {open !== undefined && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
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

        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Angothingnetwork
        </Typography>

        <Box sx={{ display: "flex" }}>
          {user ? (
            <>
              <Link to={"/notificacoes"}>
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Link>
              <Link to={"/perfil"}>
                <IconButton color="inherit">
                  <AccountCircle />
                </IconButton>
              </Link>
            </>
          ) : (
            <>
              <Button
                sx={{ backgroundColor: "white" }}
                onClick={() => navigate("/login")}
              >
                Entrar
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
