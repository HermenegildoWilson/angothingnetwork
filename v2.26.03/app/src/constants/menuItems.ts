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
export const menuItems = {
    ADMIN: [
        { text: "Home", path: "/", icon: HomeIcon },
        { text: "Dashboard", path: "/dashboard", icon: Dashboard },
        { text: "Histórico", path: "/historico", icon: History },
        { text: "Usuários", path: "/usuarios", icon: People },
        { text: "Dispositivos", path: "/dispositivos", icon: Cpu },
        { text: "Notificações", path: "/notificacoes", icon: Notifications },
        { text: "Perfil", path: "/perfil", icon: AccountCircle },
        { text: "Sair", path: "/signout", icon: Logout },
    ],
    CLIENT: [
        { text: "Home", path: "/", icon: HomeIcon },
        { text: "Dashboard", path: "/dashboard", icon: Dashboard },
        { text: "Histórico", path: "/historico", icon: History },
        { text: "Notificações", path: "/notificacoes", icon: Notifications },
        { text: "Perfil", path: "/perfil", icon: AccountCircle },
        { text: "Sair", path: "/signout", icon: Logout },
    ],
    VISITOR: [
        { text: "Home", path: "/", icon: HomeIcon },
        { text: "Dashboard", path: "/dashboard", icon: Dashboard },
        { text: "Histórico", path: "/historico", icon: History },
        { text: "Notificações", path: "/notificacoes", icon: Notifications },
        { text: "Perfil", path: "/perfil", icon: AccountCircle },
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
