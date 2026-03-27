import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUserPayload, JwtPayload } from '../types/payload';
import { createHmac, timingSafeEqual } from 'crypto';
import { UserRole } from '@/generated/prisma/enums';
import { JwtTokenType } from '../types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' &&
  (Object.values(UserRole) as string[]).includes(value);

const isAuthUserPayload = (value: unknown): value is AuthUserPayload => {
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

const isJwtPayload = (value: unknown): value is JwtPayload => {
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

const parseJson = (input: string): unknown => JSON.parse(input) as unknown;

const base64UrlEncode = (input: Buffer | string) =>
  Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const base64UrlDecode = (input: string) => {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded =
    base64.length % 4 === 0
      ? base64
      : base64 + '='.repeat(4 - (base64.length % 4));
  return Buffer.from(padded, 'base64').toString('utf8');
};

export const parseDurationToMs = (value: string | number) => {
  if (typeof value === 'number') return value;
  const trimmed = value.trim();
  const match = /^(\d+(?:\.\d+)?)(ms|s|m|h|d|w|y)?$/i.exec(trimmed);
  if (!match) return NaN;
  const amount = Number(match[1]);
  const unit = (match[2] ?? 's').toLowerCase();
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
    w: 604_800_000,
    y: 31_536_000_000,
  };
  return amount * (multipliers[unit] ?? 1000);
};

export const signJwt = (
  payload: AuthUserPayload,
  secret: string,
  expiresInMs: number,
  tokenType: JwtTokenType,
) => {
  if (!Number.isFinite(expiresInMs) || expiresInMs <= 0) {
    throw new InternalServerErrorException(
      'Configuração de expiração JWT inválida.',
    );
  }

  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + Math.floor(expiresInMs / 1000);
  const body: JwtPayload = { payload, tokenType, iat: now, exp };

  const headerPart = base64UrlEncode(JSON.stringify(header));
  const payloadPart = base64UrlEncode(JSON.stringify(body));
  const data = `${headerPart}.${payloadPart}`;
  const signature = base64UrlEncode(
    createHmac('sha256', secret).update(data).digest(),
  );
  return `${data}.${signature}`;
};

export const verifyJwt = (token: string, secret: string): JwtPayload => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new UnauthorizedException('Token inválido.');
  }
  const [headerPart, payloadPart, signaturePart] = parts;

  let header: { alg: string; typ: string };
  try {
    const parsed = parseJson(base64UrlDecode(headerPart));
    if (
      !isRecord(parsed) ||
      typeof parsed.alg !== 'string' ||
      typeof parsed.typ !== 'string'
    ) {
      throw new UnauthorizedException('Token inválido.');
    }
    header = { alg: parsed.alg, typ: parsed.typ };
  } catch {
    throw new UnauthorizedException('Token inválido.');
  }

  if (header.alg !== 'HS256' || header.typ !== 'JWT') {
    throw new UnauthorizedException('Token inválido.');
  }

  const data = `${headerPart}.${payloadPart}`;
  const expectedSignature = base64UrlEncode(
    createHmac('sha256', secret).update(data).digest(),
  );

  if (
    expectedSignature.length !== signaturePart.length ||
    !timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signaturePart))
  ) {
    throw new UnauthorizedException('Token inválido.');
  }

  let decoded: JwtPayload;
  try {
    const parsed = parseJson(base64UrlDecode(payloadPart));
    if (!isJwtPayload(parsed)) {
      throw new UnauthorizedException('Token inválido.');
    }
    decoded = parsed;
  } catch {
    throw new UnauthorizedException('Token inválido.');
  }

  if (typeof decoded.exp === 'number') {
    const now = Math.floor(Date.now() / 1000);
    if (now >= decoded.exp) {
      throw new UnauthorizedException('Token expirado.');
    }
  }

  return decoded;
};
