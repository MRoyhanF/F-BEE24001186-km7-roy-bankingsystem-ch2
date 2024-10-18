import Joi from "joi";

export class TransactionValidation {
  static createTransactionSchema = Joi.object({
    source_account_id: Joi.number().required(),
    destination_account_id: Joi.number().required(),
    amount: Joi.number().required(),
  });

  static validate(schema, data) {
    const { error } = schema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
  }
}
