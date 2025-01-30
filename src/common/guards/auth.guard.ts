import {
  ExecutionContext,
  HttpStatus,
  Injectable,
  type CanActivate,
} from '@nestjs/common';
import { type FastifyReply } from 'fastify';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<true> {
    const httpContext = context.switchToHttp();

    const request = httpContext.getRequest();

    const response = httpContext.getResponse<FastifyReply>();

    const sid = request.cookies['sid'] as string;

    if (!sid) {
      response
        .status(HttpStatus.UNAUTHORIZED)
        .send({
          status: HttpStatus.UNAUTHORIZED,
          message: 'You are not authorized',
        });
    }

    const checkAuth = await this.userService.checkAuth(sid);

    if (!checkAuth) {
      response
        .status(HttpStatus.UNAUTHORIZED)
        .send({
          status: HttpStatus.UNAUTHORIZED,
          message: 'You are not authorized',
        });
    }

    return true;
  }
}
