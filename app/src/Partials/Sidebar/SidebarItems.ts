import {
  AccountCircle,
  Dashboard,
  History,
  Home,
  Login,
  Logout,
  Notifications,
  People,
  PersonAdd,
} from "@mui/icons-material";
import { Cpu, HomeIcon } from "lucide-react";
export const SidebarItems = {
  ADMIN: [
    { text: "Home", path: "/", icon: HomeIcon },
    { text: "Dashboard", path: "/realtime", icon: Dashboard },
    { text: "Histórico", path: "/history", icon: History },
    { text: "Usuários", path: "/users", icon: People },
    { text: "Dispositivos", path: "/devices", icon: Cpu },
    { text: "Notificações", path: "/notifications", icon: Notifications },
    { text: "Perfil", path: "/profile", icon: AccountCircle },
    { text: "Sair", path: "/signout", icon: Logout },
  ],
  CLIENT: [
    { text: "Home", path: "/", icon: HomeIcon },
    { text: "Dashboard", path: "/realtime", icon: Dashboard },
    { text: "Histórico", path: "/history", icon: History },
    { text: "Dispositivos", path: "/devices", icon: Cpu },
    { text: "Notificações", path: "/notifications", icon: Notifications },
    { text: "Perfil", path: "/profile", icon: AccountCircle },
    { text: "Sair", path: "/signout", icon: Logout },
  ],
  VISITOR: [
    { text: "Home", path: "/", icon: HomeIcon },
    { text: "Dashboard", path: "/realtime", icon: Dashboard },
    { text: "Histórico", path: "/history", icon: History },
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
