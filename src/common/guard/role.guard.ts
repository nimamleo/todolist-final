import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!roles) {
            return false;
        }

        const userRoles = this.getUserRoles(context);
        return this.validateRoles(roles, userRoles);
    }

    private getUserRoles(context: ExecutionContext): string[] {
        const request = context.switchToHttp().getRequest();
        return request.user?.role || [];
    }

    private validateRoles(roles: string[], userRoles: string[]): boolean {
        return roles.some((role) => userRoles.includes(role));
    }
}
