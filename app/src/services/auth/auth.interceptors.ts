import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { AxiosHeaders } from "axios";
import { authService } from "./auth.service";
import { authStore } from "./auth.store";

type RetriableRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
  skipAuth?: boolean;
  skipAuthRefresh?: boolean;
};

let refreshPromise: Promise<
  Awaited<ReturnType<typeof authService.refresh>>
> | null = null;

const refreshTokens = async () => {
  if (!refreshPromise) {
    refreshPromise = authService
      .refresh()
      .then((result) => {
        if (result?.success && result.data) {
          if (result.data.user) {
            authStore.setSession({
              accessToken: result.data.accessToken,
              user: result.data.user,
            });
          } else {
            authStore.setAccessToken(result.data.accessToken);
            authStore.setStatus("authenticated");
          }
        } else {
          authStore.setUnauthenticated();
        }
        return result;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

type NetworkErrorHandler = (error: AxiosError) => void;

let networkErrorHandler: NetworkErrorHandler = (error) => {
  if (typeof window !== "undefined") {
    // fallback simples caso não exista sistema de alertas
    console.warn("Network error:", error.message);
  }
};

export const setNetworkErrorHandler = (handler: NetworkErrorHandler) => {
  networkErrorHandler = handler;
};

const shouldSkipAuth = (config?: RetriableRequestConfig) =>
  Boolean(config?.skipAuth);

const shouldSkipRefresh = (config?: RetriableRequestConfig) =>
  Boolean(config?.skipAuthRefresh);

// Interceptor para enviar token automaticamente
const accessTokenInterceptor = (api: AxiosInstance) => {
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (shouldSkipAuth(config as RetriableRequestConfig)) return config;

      const token = authStore.getState().accessToken;

      if (token) {
        const headers = AxiosHeaders.from(config.headers ?? {});
        headers.set("Authorization", `Bearer ${token}`);
        config.headers = headers;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
};

const isAuthRoute = (url?: string) =>
  Boolean(
    url && (url.includes("/auth/refresh") || url.includes("/auth/signin")),
  );

// Interceptor para tratar erro global/401 / Refresco automático do token
const refreshTokenInterceptor = (api: AxiosInstance) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const originalConfig = error.config as RetriableRequestConfig | undefined;

      if (
        status === 401 &&
        originalConfig &&
        !originalConfig._retry &&
        !shouldSkipRefresh(originalConfig)
      ) {
        const url = originalConfig.url ?? "";
        if (isAuthRoute(url)) {
          return Promise.reject(error);
        }

        originalConfig._retry = true;

        const result = await refreshTokens();
        if (result?.success) {
          const token = authStore.getState().accessToken;
          if (token) {
            const headers = AxiosHeaders.from(originalConfig.headers ?? {});
            headers.set("Authorization", `Bearer ${token}`);
            originalConfig.headers = headers;
          }
          return api.request(originalConfig);
        }
      }

      return Promise.reject(error);
    },
  );
};

// Interceptor para tratar erro de rede
const networkErrorInterceptor = (api: AxiosInstance) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.message === "Network Error" || error?.code === "ERR_NETWORK") {
        networkErrorHandler(error);
      }
      return Promise.reject(error);
    },
  );
};

export const setupAuthInterceptors = (api: AxiosInstance) => {
  accessTokenInterceptor(api);
  refreshTokenInterceptor(api);
  networkErrorInterceptor(api);
};

// export const Interceptors = {
//   accessTokenInterceptor,
//   refreshTokenInterceptor,
//   networkErrorInterceptor,
// };
