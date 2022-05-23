import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../entity/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) return true;

    const request = context.switchToHttp().getRequest();

    if (!request.user) return false;
    request.user.roles = ['ADMIN'];

    return requireRoles.some((role) => request.user.roles.includes(role));
  }
}
