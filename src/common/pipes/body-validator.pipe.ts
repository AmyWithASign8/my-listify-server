import {
  createParamDecorator,
  HttpStatus,
  type ExecutionContext,
} from '@nestjs/common';
import { type Schema } from 'joi';
import { type FastifyReply, type FastifyRequest } from 'fastify';

export const BodyValidator = createParamDecorator(
  (schema: Schema, ctx: ExecutionContext) => {
    const httpContext = ctx.switchToHttp();

    const request = httpContext.getRequest<FastifyRequest>();

    const response = httpContext.getResponse<FastifyReply>();

    const { error, value } = schema.validate(request.body);

    if (error) {
      response.status(HttpStatus.BAD_REQUEST).send({ message: error.message });

      throw new Error(error.message);
    }

    return value;
  },
);
