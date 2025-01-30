import joi from 'joi';

export const AuthorizeSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});
