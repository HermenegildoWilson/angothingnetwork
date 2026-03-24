import { Routes, Route } from "react-router-dom";

import AppLayout from "../../Layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

import NotFound from "../../Pages/NotFound";
import Home from "../../Pages/LandingPage/Home";
import Login from "../../Pages/Login";
import Cadastrar from "../../Pages/Cadastrar";

import History from "../../Pages/Dashboard/History";
import RealTime from "../../Pages/Dashboard/RealTime";
import Logout from "../../Pages/Logout";
import Perfil from "../../Pages/Perfil";
import Notificacoes from "../../Pages/Notificacoes";
import Usuarios from "../../Pages/Usuarios";
import Dispositivos from "../../Pages/Dispositivos/Dispositivos";
import NovoDispositivo from "../../Pages/Dispositivos/NovoDispositivo";
import PerfilDispositivo from "../../Pages/Dispositivos/PerfilDispositivo";
import Teste from "../../Pages/LandingPage/Teste";
import Main from "../../Pages/Main";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route path="/cadastrar" element={<Cadastrar />} />

                <Route element={<ProtectedRoute />}>
                    <Route index element={<Main />} />

                    <Route path="/dashboard" element={<RealTime />} />

                    <Route path="/historico" element={<History />} />

                    <Route path="/usuarios" element={<Usuarios />} />

                    <Route path="/usuarios" element={<Usuarios />} />

                    <Route path="/notificacoes" element={<Notificacoes />} />

                    <Route path="/perfil" element={<Perfil />} />

                    <Route path="/perfil/:id" element={<Perfil />} />

                    <Route path="/logout" element={<Logout />} />

                    <Route path="/dispositivos" element={<Dispositivos />} />

                    <Route
                        path="/novodispositivo"
                        element={<NovoDispositivo />}
                    />

                    <Route
                        path="/dispositivo/:id"
                        element={<PerfilDispositivo />}
                    />

                    <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="/home" element={<Home />} />

                {/* <Route path="/home2" element={<Teste />} /> */}

                <Route path="/login" element={<Login />} />

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
