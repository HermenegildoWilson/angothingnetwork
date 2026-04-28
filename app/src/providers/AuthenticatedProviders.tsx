import { useAuth } from "../hooks/useAuth";
import SensorsReadingProvider from "./SensorsProvider";

export default function AuthenticatedProviders({ children }) {
  const { user } = useAuth();

  if (!user) {
    return children;
  }

  return <SensorsReadingProvider>{children}</SensorsReadingProvider>;
}
