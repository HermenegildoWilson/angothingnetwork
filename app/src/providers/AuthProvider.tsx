import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { AuthContext } from "@/context/AuthContext";
import { api } from "@/config/api/api";
import { setupAuthInterceptors } from "@/services/auth/auth.interceptors";
import { authService } from "@/services/auth/auth.service";
import { authStore } from "@/services/auth/auth.store";
import type { UserDto } from "@/services/user/types";
import type { SignInDto } from "@/services/auth/types";
import FullLoader from "@/components/feedback/loader/FullLoader";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const initialState = authStore.getState();
  const [appState, setAppState] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >(initialState.status);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(initialState.user),
  );
  const [user, setUser] = useState<UserDto | null>(initialState.user);

  const value = useMemo(
    () => ({
      appState,
      isAuthenticated,
      user,
      signIn: async (data: SignInDto["userFields"]) => {
        const result = await authService.signIn(data);
        if (result.success && result.data) {
          authStore.setSession({
            accessToken: result.data.accessToken,
            user: result.data.user,
          });
        } else {
          authStore.setUnauthenticated();
        }
        return result;
      },
      signOut: async () => {
        const result = await authService.signOut();
        authStore.setUnauthenticated();
        return result;
      },
      refresh: async () => {
        const result = await authService.refresh();
        if (result.success && result.data) {
          authStore.setSession({
            accessToken: result.data.accessToken,
            user: result.data.user,
          });
        } else {
          authStore.setUnauthenticated();
        }
        return result;
      },
      sensor: {ids: ["cmnd31bt000006hi03lutoimd"], codes: ["Esp-32-001"]},
    }),
    [appState, isAuthenticated, user],
  );

  useEffect(() => {
    setupAuthInterceptors(api);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const result = await authService.refresh();
        if (result.success && result.data) {
          authStore.setSession({
            accessToken: result.data.accessToken,
            user: result.data.user,
          });
        } else {
          authStore.setUnauthenticated();
        }
      } catch (error) {
        console.log(error);
        authStore.setUnauthenticated();
      }
    };

    void bootstrap();
  }, []);

  useEffect(() => {
    return authStore.subscribe((state) => {
      setUser(state.user);
      setIsAuthenticated(Boolean(state.user));
      setAppState(state.status);
    });
  }, []);

  if (appState === "loading") {
    return <FullLoader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
