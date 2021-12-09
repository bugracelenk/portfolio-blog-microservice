import { SetMetadata } from '@nestjs/common';

export enum UserType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const ROLES_KEYS = 'roles';
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEYS, roles);
