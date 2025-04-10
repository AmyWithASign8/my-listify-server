import { Injectable } from '@nestjs/common';

import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { ConvertItemCategoryToDb, ItemCategory } from './item.constant';

import type { ICreateItem } from './item.interface';

@Injectable()
export class ItemService {
  constructor(private db: PrismaClientService) {}

  async createItem(dto: ICreateItem) {
    const { category, ...otherDto } = dto;

    const result = await this.db.item.create({
      data: {
        category: ConvertItemCategoryToDb[category],
        ...otherDto,
      },
    });

    return result;
  }

  async getItems(userId: number, category: ItemCategory) {
    const result = await this.db.item.findMany({
      where: { userId, category: ConvertItemCategoryToDb[category] },
    });

    return result;
  }

  deleteItem(id: number) {
    this.db.item.delete({ where: { id } });
  }

  deleteUserItems(userId: number) {
    this.db.item.deleteMany({ where: { userId } });
  }
}
