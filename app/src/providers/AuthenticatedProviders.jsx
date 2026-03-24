import { useAuth } from "../hooks/useAuth";
import SensorProvider from "./SensorProvider";

export default function AuthenticatedProviders({ children }) {
    const { user } = useAuth();

    if (!user) {
        return children;
    }

    return (
        <SensorProvider>
            {children}
        </SensorProvider>
    );
}
