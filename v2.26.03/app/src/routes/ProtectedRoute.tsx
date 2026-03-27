import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ redirectTo = "/home" }) {
  const { appState, isAuthenticated } = useAuth();

  if (appState === "loading") return null;

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
