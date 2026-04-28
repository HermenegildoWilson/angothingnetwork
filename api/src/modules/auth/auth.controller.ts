import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CookieSerializeOptions } from '@fastify/cookie';
import { AuthService } from './auth.service';
import SignInAuthDto from './dto/sign-in-auth.dto';
import { Public } from './decorators/public.decorator';

const REFRESH_COOKIE_NAME = 'refreshToken';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @Public()
  async signIn(
    @Body() signInAuthDto: SignInAuthDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.signIn(signInAuthDto);

    this.setRefreshCookie(reply, refreshToken);

    return {
      message: 'Seja bem-vindo!',
      user,
      accessToken,
    };
  }

  @Post('signout')
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

    await this.authService.signOut({ userId, refreshToken });
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
    const cookies = request.cookies as Record<string, string> | undefined;
    return cookies?.[REFRESH_COOKIE_NAME] ?? cookies?.refresh_token;
  }

  private getCookieOptions(): CookieSerializeOptions {
    const isProd = process.env.NODE_ENV === 'production';
    const sameSite: 'none' | 'lax' = isProd ? 'none' : 'lax';
    return {
      httpOnly: true,
      secure: isProd,
      sameSite,
      path: '/',
      maxAge: Math.floor(this.authService.getRefreshTokenTtlMs() / 1000),
    };
  }

  private setRefreshCookie(reply: FastifyReply, refreshToken: string) {
    reply.setCookie(REFRESH_COOKIE_NAME, refreshToken, this.getCookieOptions());
  }

  private clearRefreshCookie(reply: FastifyReply) {
    reply.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
  }
}
