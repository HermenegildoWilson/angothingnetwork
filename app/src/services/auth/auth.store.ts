import type { UserDto } from "@/services/user/types";
import type { AuthState } from "./types";

let state: AuthState = {
  accessToken: null,
  user: null,
  status: "loading",
};

const listeners = new Set<(current: AuthState) => void>();

const notify = () => {
  listeners.forEach((listener) => listener(state));
};

export const authStore = {
  getState: () => state,
  setAccessToken: (token: string | null) => {
    state = { ...state, accessToken: token };
    notify();
  },
  setUser: (user: UserDto | null) => {
    state = { ...state, user };
    notify();
  },
  setStatus: (status: AuthState["status"]) => {
    state = { ...state, status };
    notify();
  },
  setSession: (params: { accessToken: string; user: UserDto }) => {
    const { accessToken, user } = params;
    state = { accessToken, user, status: "authenticated" };
    notify();
  },
  setUnauthenticated: () => {
    state = { accessToken: null, user: null, status: "unauthenticated" };
    notify();
  },
  clear: () => {
    state = { accessToken: null, user: null, status: "unauthenticated" };
    notify();
  },
  subscribe: (listener: (current: AuthState) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
