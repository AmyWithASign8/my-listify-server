import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { FastifyReply } from 'fastify';

import { AuthGuard } from 'src/common/guards/auth.guard';
import { BodyValidator } from 'src/common/pipes/body-validator.pipe';
import { createItemSchema } from './schemas/create-item.schema';
import { ItemService } from './item.service';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

import type { ItemCategory } from './item.constant';
import type { ICreateItem } from './item.interface';

@Controller({ version: '1', path: 'items' })
@UseGuards(AuthGuard)
export class ItemController {
  constructor(
    private itemService: ItemService,
    private db: PrismaClientService,
  ) {}

  @Post()
  async handleCreateItem(
    @BodyValidator(createItemSchema) dto: ICreateItem,
    @Res() reply: FastifyReply,
  ) {
    const candidate = await this.db.item.count({ where: { title: dto.title } });

    if (!candidate) {
      reply.status(HttpStatus.CONFLICT).send();
      return;
    }

    const result = await this.itemService.createItem(dto);

    return result;
  }

  @Get(':userId')
  async handleGetItems(
    @Param('userId') userId: number,
    @Query('category') category: string,
    @Res() reply: FastifyReply,
  ) {
    if (Number.isNaN(userId) || typeof category !== 'string') {
      reply.status(HttpStatus.BAD_REQUEST).send();
    }

    const result = await this.itemService.getItems(
      userId,
      category as ItemCategory,
    );

    return result;
  }
}
