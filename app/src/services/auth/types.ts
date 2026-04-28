import type { UserDto } from "@/services/user/types";

export class deviceDto {
  deviceId!: string;
  userAgent?: string;
  platform?: string;
  os?: string;
  browser?: string;
  ipAddress!: string;
  brand!: string;
  model!: string;
  osVersion!: string;
  appVersion!: string;
  country!: string;
  city!: string;
}

export class SignInDto {
  userFields: {
    email: string;
    password: string;
  };
  deviceDto: deviceDto;
}

export type AuthResponse = {
  message: string;
  user: UserDto;
  accessToken: string;
};

export type AuthState = {
  accessToken: string | null;
  user: UserDto | null;
  status: "loading" | "authenticated" | "unauthenticated";
};
