import { UserRole } from '@/generated/prisma/enums';
import { JwtTokenType } from '.';

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
