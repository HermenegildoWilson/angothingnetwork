import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import SigInAuthDto from './dto/sig-in-auth.dto';
import SigOutAuthDto from './dto/sig-out-auth.dto';
import RefreshAuthDto from './dto/refresh-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EnvService } from '@/config/env/env.service';
import { MailService } from '../mail/mail.service';
import { User } from '@/generated/prisma/client';
import { JwtTokenType } from './types';
import { AuthUserPayload } from './types/payload';
import { parseDurationToMs, signJwt, verifyJwt } from './utils/utils-service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly env: EnvService,
    private readonly mailService: MailService,
  ) {}

  async sigIn(data: SigInAuthDto) {
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
    const refreshExpiresAt = this.getExpiresAt(
      this.env.jwtRefreshExpiresIn as string,
    );

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

  async sigOut(data: SigOutAuthDto) {
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
    return this.parseExpiresIn(this.env.jwtRefreshExpiresIn as string);
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
    const ttlMs = this.parseExpiresIn(this.env.jwtAccessExpiresIn as string);
    return signJwt(payload, this.env.jwtAccessSecret, ttlMs, 'access');
  }

  private signRefreshToken(payload: AuthUserPayload) {
    const ttlMs = this.parseExpiresIn(this.env.jwtRefreshExpiresIn as string);
    return signJwt(payload, this.env.jwtRefreshSecret, ttlMs, 'refresh');
  }

  private verifyToken(
    token: string,
    secret: string,
    expectedType: JwtTokenType,
    errorMessage: string,
  ) {
    try {
      const decoded = verifyJwt(token, secret);
      if (decoded.tokenType !== expectedType) {
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
