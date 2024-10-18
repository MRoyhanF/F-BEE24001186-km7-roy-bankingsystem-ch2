import Joi from "joi";

export class UserValidation {
  static createUserSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    profile: Joi.object({
      identity_type: Joi.string().valid("KTP", "SIM", "Passport").required(),
      identity_number: Joi.string().min(16).required(),
      address: Joi.string().min(3).required(),
    }).required(),
  });

  static updateUserSchema = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    profile: Joi.object({
      identity_type: Joi.string().valid("KTP", "SIM", "Passport"),
      identity_number: Joi.string().min(16),
      address: Joi.string().min(3),
    }),
  });

  static validate(schema, data) {
    const { error } = schema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
  }
}
