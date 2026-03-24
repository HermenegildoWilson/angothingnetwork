import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { userService } from "../services/user.service";
import { api } from "../api/axios";
import { useAlert } from "../hooks/useAlert";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [appState, setAppState] = useState("loading");

    const { setAlert } = useAlert();

    async function login(credentials) {
        const res = await userService.login(credentials);
        setUser(res.data.user);
        setAccessToken(res.data.access_token);
        return res.data;
    }

    async function logout() {
        const res = await userService.logout(user);

        setUser(null);
        setAccessToken(null);
        return res.data;
    }

    async function restoreSession() {
        try {
            const res = await userService.refresh();
            setUser(res.data.user);
            setAccessToken(res.data.access_token);
        } catch (error) {
            console.log(error);
            if (error.code === "ERR_NETWORK") {
                setAlert({
                    type: "SHOW",
                    text: error.message || error.response?.data?.message,
                    style: "error",
                });
            } 

            setUser(null);
            setAccessToken(null);
        } finally {
            setAppState("done");
        }
    }

    // Interceptor de request
    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use((config) => {
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        });

        return () => api.interceptors.request.eject(requestInterceptor);
    }, [accessToken]);

    // Interceptor de response (401 e 403)
    useEffect(() => {
        const responseInterceptor = api.interceptors.response.use(
            (res) => res,
            async (err) => {
                const status = err.response?.status;

                if (status === 401) {
                    try {
                        const res = await userService.refresh();
                        setAccessToken(res.data.access_token);
                        setUser(res.data.user);

                        err.config.headers.Authorization = `Bearer ${res.data.access_token}`;

                        return api(err.config);
                    } catch {
                        await logout();
                    }
                }

                if (status === 403) {
                    setAlert({
                        type: "SHOW",
                        text: err.response?.data?.message,
                        style: "warning",
                    });
                }

                return Promise.reject(err);
            }
        );

        return () => api.interceptors.response.eject(responseInterceptor);
    }, []);

    useEffect(() => {
        restoreSession();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                appState,
                login,
                logout,
                api,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
