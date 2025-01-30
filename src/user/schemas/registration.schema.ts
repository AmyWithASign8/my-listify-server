import joi from 'joi';

export const RegistrationSchema = joi.object({
  username: joi.string().max(100).required(),
  password: joi.string().max(255).required(),
  avatar: joi.binary().required(),
  theme: joi.string(),
});
