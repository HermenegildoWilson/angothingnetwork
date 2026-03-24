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
    admin: [
        { text: "Home", path: "/", icon: HomeIcon },
        { text: "Dashboard", path: "/dashboard", icon: Dashboard },
        { text: "Histórico", path: "/historico", icon: History },
        { text: "Usuários", path: "/usuarios", icon: People },
        { text: "Dispositivos", path: "/dispositivos", icon: Cpu },
        { text: "Notificações", path: "/notificacoes", icon: Notifications },
        { text: "Perfil", path: "/perfil", icon: AccountCircle },
        { text: "Sair", path: "/logout", icon: Logout },
    ],
    visitor: [
        { text: "Home", path: "/", icon: HomeIcon },
        { text: "Dashboard", path: "/dashboard", icon: Dashboard },
        { text: "Histórico", path: "/historico", icon: History },
        { text: "Notificações", path: "/notificacoes", icon: Notifications },
        { text: "Perfil", path: "/perfil", icon: AccountCircle },
        { text: "Sair", path: "/logout", icon: Logout },
    ],
    public: [
        {
            text: "Início",
            path: "/home",
            descricao: "Landing page / visão geral.",
            icon: Home,
        },
        {
            text: "Entrar",
            path: "/login",
            descricao: "Acesso ao portal atraves de uma conta.",
            icon: Login,
        },
        {
            text: "Criar conta",
            path: "/cadastrar",
            descricao: "Acesso ao portal atraves de uma conta.",
            icon: PersonAdd,
        },
    ],
};
