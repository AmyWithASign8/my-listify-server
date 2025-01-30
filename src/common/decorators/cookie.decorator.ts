import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { type FastifyRequest } from 'fastify';

export const Cookies = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return key ? request.cookies?.[key] : request.cookies;
  },
);
