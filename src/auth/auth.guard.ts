import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtSecret } from './constants';
import { IS_PUBLIC_KEY } from './decorators/Public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    // const isPublic = this.reflector?.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);

    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtFromHeader(request);
    if (!token) throw new UnauthorizedException();
    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  extractJwtFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : undefined;
  }
}
