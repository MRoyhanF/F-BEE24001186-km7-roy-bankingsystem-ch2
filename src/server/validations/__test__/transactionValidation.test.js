// import Joi from "joi";

// export class TransactionValidation {
//   static createTransactionSchema = Joi.object({
//     source_account_id: Joi.number().required(),
//     destination_account_id: Joi.number().required(),
//     amount: Joi.number().required(),
//   });

//   static transactionSchema = Joi.object({
//     amount: Joi.number().required(),
//   });

//   static validate(schema, data) {
//     const { error } = schema.validate(data);
//     if (error) {
//       throw new Error(error.details[0].message);
//     }
//   }
// }

// unit test for transactionValidation.js using Jest with mock function

import Joi from "joi";
import { TransactionValidation } from "../transactionValidation";

describe("TransactionValidation", () => {
  describe("createTransactionSchema", () => {
    it("should return an error if any field is missing", () => {
      const data = {
        source_account_id: 1,
        destination_account_id: 2,
      };
      expect(() => TransactionValidation.validate(TransactionValidation.createTransactionSchema, data)).toThrow();
    });
  });

  describe("transactionSchema", () => {
    it("should return an error if amount is missing", () => {
      const data = {};
      expect(() => TransactionValidation.validate(TransactionValidation.transactionSchema, data)).toThrow();
    });

    it("should throw error if data is invalid", () => {
      const schema = Joi.object({
        amount: Joi.number().required(),
      });
      const data = {};
      expect(() => TransactionValidation.validate(schema, data)).toThrow();
    });
  });
});
