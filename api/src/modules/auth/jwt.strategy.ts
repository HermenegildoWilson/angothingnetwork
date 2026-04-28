import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from '@/config/env/env.service';
import { isJwtPayload } from './auth.jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly env: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.jwtAccessSecret,
    });
  }

  validate(payload: unknown) {
    if (!isJwtPayload(payload) || payload.tokenType !== 'access') {
      throw new UnauthorizedException('Token de acesso inválido ou expirado.');
    }
    return payload.payload;
  }
}
