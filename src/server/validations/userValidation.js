import Joi from "joi";

export class UserValidation {
  static createUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    profile: Joi.object({
      identity_type: Joi.string().required(),
      identity_number: Joi.number().required(),
    }).required(),
  });

  static updateUserSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    profile: Joi.object({
      identity_type: Joi.string(),
      identity_number: Joi.number(),
    }),
  });

  static validate(schema, data) {
    const { error } = schema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
  }
}
