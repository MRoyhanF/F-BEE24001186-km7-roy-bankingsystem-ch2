import Joi from "joi";

export class AccountValidation {
  static createAccountSchema = Joi.object({
    bank_name: Joi.string().required(),
    bank_account_number: Joi.number().required(),
    balance: Joi.number().required(),
    user_id: Joi.number().required(),
  });

  static validate(schema, data) {
    const { error } = schema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
  }
}
