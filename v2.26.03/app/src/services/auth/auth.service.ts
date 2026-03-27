import { api } from "@/config/api";
import type { AuthResponse, SignInDto } from "./types";
import type { functionDefaultReturn } from "@/types/functionDefaultReturn";
import { buildWebDeviceDto } from "./device";

const signIn = async (
  data: SignInDto["userFields"],
): Promise<functionDefaultReturn<AuthResponse>> => {
  try {
    const deviceDto = await buildWebDeviceDto();
    const response = await api.post<AuthResponse>("/auth/signin", {
      userFields: data,
      deviceDto,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      ...(error.response?.data || error),
    };
  }
};

const signOut = async (): Promise<
  functionDefaultReturn<{ message: string }>
> => {
  try {
    const response = await api.post("/auth/signout");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      ...(error.response?.data || error),
    };
  }
};

const refresh = async (): Promise<functionDefaultReturn<AuthResponse>> => {
  try {
    const response = await api.post<AuthResponse>("/auth/refresh");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      ...(error.response?.data || error),
    };
  }
};

export const authService = {
  signIn,
  signOut,
  refresh,
};
