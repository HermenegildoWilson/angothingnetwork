import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorators/role.decorator';
import { UserRole } from '@/generated/prisma/client';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { isAuthUserPayload } from './auth.jwt';
import type { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request?.user as unknown;

    if (!isAuthUserPayload(user)) {
      throw new ForbiddenException('Acesso negado.');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Acesso negado.');
    }

    return true;
  }
}
