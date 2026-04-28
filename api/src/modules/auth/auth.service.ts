import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import SignInAuthDto from './dto/sign-in-auth.dto';
import SignOutAuthDto from './dto/sign-out-auth.dto';
import RefreshAuthDto from './dto/refresh-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EnvService } from '@/config/env/env.service';
import { MailService } from '../mail/mail.service';
import { User } from '@/generated/prisma/client';
import {
  AuthUserPayload,
  JwtPayload,
  JwtTokenType,
  isJwtPayload,
} from './auth.jwt';

const parseDurationToMs = (value: string | number) => {
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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly env: EnvService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(data: SignInAuthDto) {
    const { userFields } = data;
    const { email } = userFields;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const passwordIsValid = await this.verifyPassword(
      user,
      userFields.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = this.buildUserPayload(user);
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);
    const refreshTokenHash = this.hashToken(refreshToken);
    const refreshExpiresAt = this.getExpiresAt(this.env.jwtRefreshExpiresIn);

    await this.prisma.token.create({
      data: {
        tokenHash: refreshTokenHash,
        userId: user.id,
        expiresAt: refreshExpiresAt,
        ...data.deviceDto,
      },
    });

    void this.mailService
      .sendSecurityAlert({
        to: user.email,
        nome: user.name,
        deviceInfo: data.deviceDto,
      })
      .catch(() => undefined);

    return {
      accessToken,
      refreshToken,
      user: payload,
    };
  }

  async signOut(data: SignOutAuthDto) {
    const { userId, refreshToken } = data;
    const tokenHash = this.hashToken(refreshToken);

    await this.prisma.token.updateMany({
      where: { tokenHash, userId },
      data: { isRevoked: true },
    });

    return {
      message: 'Sessão encerrada com sucesso.',
    };
  }

  async refresh(data: RefreshAuthDto) {
    const { refreshToken } = data;
    const payload = this.verifyRefreshToken(refreshToken);
    const tokenHash = this.hashToken(refreshToken);

    const tokenRecord = await this.prisma.token.findFirst({
      where: {
        tokenHash,
        userId: payload.id,
        isRevoked: false,
      },
    });

    if (!tokenRecord || tokenRecord.expiresAt <= new Date()) {
      throw new UnauthorizedException('Sessão expirada, faça login.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Sessão expirada, faça login.');
    }

    await this.prisma.token.update({
      where: { id: tokenRecord.id },
      data: { lastUsedAt: new Date() },
    });

    const userPayload = this.buildUserPayload(user);
    const accessToken = this.signAccessToken(userPayload);

    return {
      accessToken,
      user: userPayload,
    };
  }

  verifyAccessToken(token: string) {
    return this.verifyToken(
      token,
      this.env.jwtAccessSecret,
      'access',
      'Token de acesso inválido ou expirado.',
    );
  }

  verifyRefreshToken(token: string) {
    return this.verifyToken(
      token,
      this.env.jwtRefreshSecret,
      'refresh',
      'Sessão expirada, faça login.',
    );
  }

  getRefreshTokenTtlMs() {
    return this.parseExpiresIn(this.env.jwtRefreshExpiresIn);
  }

  private buildUserPayload(user: User): AuthUserPayload {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      photoUrl: user.photoUrl,
      createdAt: user.createdAt.toISOString(),
    };
  }

  private signAccessToken(payload: AuthUserPayload) {
    return this.jwtService.sign(
      { tokenType: 'access', payload },
      {
        secret: this.env.jwtAccessSecret,
        expiresIn: this.env.jwtAccessExpiresIn,
      },
    );
  }

  private signRefreshToken(payload: AuthUserPayload) {
    return this.jwtService.sign(
      { tokenType: 'refresh', payload },
      {
        secret: this.env.jwtRefreshSecret,
        expiresIn: this.env.jwtRefreshExpiresIn,
      },
    );
  }

  private verifyToken(
    token: string,
    secret: string,
    expectedType: JwtTokenType,
    errorMessage: string,
  ) {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(token, { secret });
      if (!isJwtPayload(decoded) || decoded.tokenType !== expectedType) {
        throw new UnauthorizedException(errorMessage);
      }
      return decoded.payload;
    } catch {
      throw new UnauthorizedException(errorMessage);
    }
  }

  private parseExpiresIn(value: string | number) {
    const ttlMs = parseDurationToMs(value);
    if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
      throw new InternalServerErrorException(
        'Configuração de expiração JWT inválida.',
      );
    }
    return ttlMs;
  }

  private getExpiresAt(value: string | number) {
    const ttlMs = this.parseExpiresIn(value);
    return new Date(Date.now() + ttlMs);
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private async verifyPassword(user: User, password: string) {
    const currentHash = user.passwordHash;
    const isBcryptHash = /^\$2[aby]\$/.test(currentHash);

    if (isBcryptHash) {
      return bcrypt.compare(password, currentHash);
    }

    if (currentHash !== password) {
      return false;
    }

    const newHash = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });
    return true;
  }
}
