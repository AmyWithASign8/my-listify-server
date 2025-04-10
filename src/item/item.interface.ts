import { ItemCategory } from './item.constant';

export interface ICreateItem {
  title: string;
  description?: string;
  image?: Uint8Array;
  rating?: number;
  favorite?: boolean;
  category: ItemCategory;
  userId: number;
}
