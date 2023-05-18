import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import * as jwt from 'jsonwebtoken';

import { PrismaService } from 'src/prisma/prisma.service';

interface JWTPayload {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (roles.lenght) {
      const request = context.switchToHttp().getRequest();
      const token = request?.headers?.authorization?.split('Bearer ')[1];
      try {
        const payload = (await jwt.verify(
          token,
          process.env.ACCESS_TOKEN,
        )) as JWTPayload;
        const user = await this.prismaService.user.findUnique({
          where: { id: payload.id },
        });

        if (roles.includes(user.user_type)) return true;
        return false;
      } catch (error) {
        return false;
      }
    }

    return true;
  }
}
