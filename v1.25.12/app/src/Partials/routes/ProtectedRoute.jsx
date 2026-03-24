import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ redirectTo = "/home" }) {
    const { user, appState } = useAuth();

    if (appState === "loading") return null;

    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
}
