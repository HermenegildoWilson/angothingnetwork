import { UserRole } from '@/generated/prisma/client';

export type JwtTokenType = 'access' | 'refresh';

export type AuthUserPayload = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  photoUrl?: string | null;
  createdAt: string;
};

export type JwtPayload = {
  payload: AuthUserPayload;
  tokenType: JwtTokenType;
  iat: number;
  exp: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' &&
  (Object.values(UserRole) as string[]).includes(value);

export const isAuthUserPayload = (value: unknown): value is AuthUserPayload => {
  if (!isRecord(value)) return false;
  if (typeof value.id !== 'string') return false;
  if (typeof value.name !== 'string') return false;
  if (typeof value.username !== 'string') return false;
  if (typeof value.email !== 'string') return false;
  if (typeof value.phone !== 'string') return false;
  if (!isUserRole(value.role)) return false;
  if (typeof value.createdAt !== 'string') return false;
  if (
    value.photoUrl !== undefined &&
    value.photoUrl !== null &&
    typeof value.photoUrl !== 'string'
  ) {
    return false;
  }
  return true;
};

export const isJwtPayload = (value: unknown): value is JwtPayload => {
  if (!isRecord(value)) return false;
  if (!isAuthUserPayload(value.payload)) return false;
  if (value.tokenType !== 'access' && value.tokenType !== 'refresh') {
    return false;
  }
  if (typeof value.iat !== 'number' || typeof value.exp !== 'number') {
    return false;
  }
  return true;
};
