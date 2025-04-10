import type { Category } from '@prisma/client';

export enum ItemCategory {
  Anime = 'anime',
}

export const ConvertItemCategoryToDb: Record<ItemCategory, Category> = {
  [ItemCategory.Anime]: 'ANIME',
};
