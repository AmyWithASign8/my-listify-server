import {
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { type FastifyReply } from 'fastify';

import { BodyValidator } from 'src/common/pipes/body-validator.pipe';
import { RegistrationSchema } from './schemas/registration.schema';
import { UserService } from './user.service';
import { Cookies } from 'src/common/decorators/cookie.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';

import type { IAuthorizeDto, ICreateUserDto } from './user.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async registration(
    @Res() reply: FastifyReply,
    @BodyValidator(RegistrationSchema) dto: ICreateUserDto,
  ) {
    const sid = await this.userService.registration(dto);

    if (!sid) {
      reply
        .status(HttpStatus.CONFLICT)
        .send({ status: HttpStatus.CONFLICT, message: 'User already exists' });

      return;
    }

    reply.status(HttpStatus.CREATED).send({ sid });
  }

  @Post('client')
  async authorize(
    @Res() reply: FastifyReply,
    @BodyValidator() dto: IAuthorizeDto,
  ) {
    const sid = await this.userService.authorize(dto);

    if (!sid) {
      reply.status(HttpStatus.BAD_REQUEST).send({
        status: HttpStatus.BAD_REQUEST,
        message: 'User is not exists',
      });

      return;
    }

    if (typeof sid === 'object') {
      reply
        .status(HttpStatus.BAD_REQUEST)
        .send({ status: HttpStatus.BAD_REQUEST, message: 'Invalid password' });

      return;
    }

    reply.send({ sid });
  }

  @Get()
  async authinticate(@Cookies('sid') sid: string, @Res() reply: FastifyReply) {
    const user = await this.userService.checkAuth(sid);

    if (!user) {
      reply
        .status(HttpStatus.FORBIDDEN)
        .send({ status: HttpStatus.FORBIDDEN, message: 'Unauthorized' });

      return;
    }

    reply.send(user);
  }

  @UseGuards(AuthGuard)
  @Patch()
  updateUserOptions() {}
}
