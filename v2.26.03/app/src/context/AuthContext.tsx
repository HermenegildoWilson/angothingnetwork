import type { AuthResponse, SignInDto } from "@/services/auth/types";
import type { UserDto } from "@/services/user/types";
import type { functionDefaultReturn } from "@/types/functionDefaultReturn";

import { createContext } from "react";

type AuthContextType = {
  appState: "loading" | "authenticated" | "unauthenticated";
  isAuthenticated: boolean;
  user: UserDto | null;
  signIn: (
    data: SignInDto["userFields"],
  ) => Promise<functionDefaultReturn<AuthResponse>>;
  signOut: () => Promise<functionDefaultReturn<{ message: string }>>;
  refresh: () => Promise<functionDefaultReturn<AuthResponse>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
