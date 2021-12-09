import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UserType, ROLES_KEYS } from 'src/decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToRpc().getData();
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEYS,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const user = await this.userService.send<{ roles: UserType[] }>(
      'GET_ROLES',
      {
        userId: req.userId,
      },
    );

    const userRoles = await lastValueFrom(user);

    return requiredRoles.some((role) => userRoles.roles.includes(role));
  }
}
