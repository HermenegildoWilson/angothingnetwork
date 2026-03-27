import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import SigInAuthDto from './dto/sig-in-auth.dto';
import { Public } from './decorators/public.decorator';
import { EnvService } from '@/config/env/env.service';
import { CookieOptions } from './types/cookie-options';
import { parseCookies, serializeCookie } from './utils/utils-controller';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly env: EnvService,
  ) {}

  @Post('sigin')
  @Public()
  async sigIn(
    @Body() sigInAuthDto: SigInAuthDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.sigIn(sigInAuthDto);

    this.setRefreshCookie(reply, refreshToken);

    return {
      message: 'Seja bem-vindo!',
      user,
      accessToken,
    };
  }

  @Post('sigout')
  @Public()
  async sigOut(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const refreshToken = this.getRefreshToken(request);
    const accessToken = this.getAccessToken(request);

    if (!refreshToken) {
      throw new UnauthorizedException('Sessão expirada, faça login.');
    }

    let userId: string | undefined;

    if (accessToken) {
      try {
        userId = this.authService.verifyAccessToken(accessToken).id;
      } catch {
        userId = undefined;
      }
    }

    if (!userId) {
      userId = this.authService.verifyRefreshToken(refreshToken).id;
    }

    await this.authService.sigOut({ userId, refreshToken });
    this.clearRefreshCookie(reply);

    return {
      message: 'Sessão encerrada com sucesso.',
    };
  }

  @Post('refresh')
  @Public()
  async refresh(@Req() request: FastifyRequest) {
    const refreshToken = this.getRefreshToken(request);

    if (!refreshToken) {
      throw new UnauthorizedException('Sessão expirada, faça login.');
    }

    const { accessToken, user } = await this.authService.refresh({
      refreshToken,
    });

    return {
      message: 'Sessão restaurada!',
      user,
      accessToken,
    };
  }

  private getAccessToken(request: FastifyRequest) {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [scheme, token] = authHeader.split(' ');
    if (!token || scheme?.toLowerCase() !== 'bearer') {
      return undefined;
    }
    return token;
  }

  private getRefreshToken(request: FastifyRequest) {
    const cookieHeader = request.headers.cookie;
    const cookies = parseCookies(
      typeof cookieHeader === 'string' ? cookieHeader : undefined,
    );

    return (
      cookies[this.env.cookieRefreshName as string] ?? cookies.refresh_token
    );
  }

  private getCookieOptions(): CookieOptions {
    const isProd = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: this.authService.getRefreshTokenTtlMs(),
    };
  }

  private setRefreshCookie(reply: FastifyReply, refreshToken: string) {
    const cookie = serializeCookie(
      this.env.cookieRefreshName as string,
      refreshToken,
      this.getCookieOptions(),
    );
    this.appendSetCookieHeader(reply, cookie);
  }

  private clearRefreshCookie(reply: FastifyReply) {
    const options = this.getCookieOptions();
    const cookie = serializeCookie(this.env.cookieRefreshName as string, '', {
      ...options,
      maxAge: 0,
      expires: new Date(0),
    });
    this.appendSetCookieHeader(reply, cookie);
  }

  private appendSetCookieHeader(reply: FastifyReply, cookie: string) {
    const existing = reply.getHeader('Set-Cookie');
    if (!existing) {
      reply.header('Set-Cookie', cookie);
      return;
    }

    const values = Array.isArray(existing) ? existing : [String(existing)];
    reply.header('Set-Cookie', [...values, cookie]);
  }
}
