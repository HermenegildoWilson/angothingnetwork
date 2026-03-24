import { api } from "../api/axios";

export const userService = {
    login: (data) => api.post("/user/login", data),
    logout: (user) => api.post("/user/logout", { user }),
    refresh: () => api.post("/user/session"),
};
