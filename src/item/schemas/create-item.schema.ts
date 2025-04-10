import joi from 'joi';

import { ItemCategory } from '../item.constant';

export const createItemSchema = joi.object({
  title: joi.string().required(),
  description: joi.string(),
  image: joi.binary(),
  rating: joi.number().integer().max(5),
  favorite: joi.boolean(),
  category: joi.string().allow(ItemCategory.Anime).required(),
});
