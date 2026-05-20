import {
  AccountCircle,
  Sensors,
  History,
  Login,
  Logout,
  Notifications,
  People,
  PersonAdd,
  Dashboard,
  Home,
} from "@mui/icons-material";
import { Cpu } from "lucide-react";
export const SidebarItems = {
  ADMIN: [
    { text: "Home", path: "/", icon: Dashboard },
    { text: "Real Time", path: "/realtime", icon: Sensors },
    { text: "Histórico", path: "/history", icon: History },
    { text: "Dispositivos", path: "/devices", icon: Cpu },
    { text: "Notificações", path: "/notifications", icon: Notifications },
    { text: "Usuários", path: "/users", icon: People },
    { text: "Perfil", path: "/profile", icon: AccountCircle },
    { text: "Sair", path: "/signout", icon: Logout },
  ],
  CLIENT: [
    { text: "Home", path: "/", icon: Dashboard },
    { text: "Real Time", path: "/realtime", icon: Sensors },
    { text: "Histórico", path: "/history", icon: History },
    { text: "Dispositivos", path: "/devices", icon: Cpu },
    { text: "Notificações", path: "/notifications", icon: Notifications },
    { text: "Perfil", path: "/profile", icon: AccountCircle },
    { text: "Sair", path: "/signout", icon: Logout },
  ],
  VISITOR: [
    { text: "Home", path: "/", icon: Dashboard },
    { text: "Real Time", path: "/realtime", icon: Sensors },
    { text: "Histórico", path: "/history", icon: History },
    { text: "Dispositivos", path: "/devices", icon: Cpu },
    { text: "Notificações", path: "/notifications", icon: Notifications },
    { text: "Perfil", path: "/profile", icon: AccountCircle },
    { text: "Sair", path: "/signout", icon: Logout },
  ],
  PUBLIC: [
    {
      text: "Início",
      path: "/home",
      descricao: "Landing page / visão geral.",
      icon: Home,
    },
    {
      text: "Entrar",
      path: "/signin",
      descricao: "Acesso ao portal atraves de uma conta.",
      icon: Login,
    },
    {
      text: "Criar conta",
      path: "/signup",
      descricao: "Acesso ao portal atraves de uma conta.",
      icon: PersonAdd,
    },
  ],
};
