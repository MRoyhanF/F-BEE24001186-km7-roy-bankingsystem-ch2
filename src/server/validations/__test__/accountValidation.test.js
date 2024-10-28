// import Joi from "joi";

// export class AccountValidation {
//   static createAccountSchema = Joi.object({
//     bank_name: Joi.string().min(3).max(50).required(),
//     bank_account_number: Joi.string().min(16).max(50).required(),
//     balance: Joi.number().required(),
//     user_id: Joi.number().required(),
//   });

//   static updateAccountSchema = Joi.object({
//     bank_name: Joi.string().min(3).max(50),
//     bank_account_number: Joi.string().min(16).max(50),
//     balance: Joi.number(),
//     user_id: Joi.number(),
//   });

//   static validate(schema, data) {
//     const { error } = schema.validate(data);
//     if (error) {
//       throw new Error(error.details[0].message);
//     }
//   }
// }

// unit testing the AccountValidation class methods using Jest with mock data
import Joi from "joi";
import { AccountValidation } from "../accountValidation";

describe("AccountValidation", () => {
  describe("createAccountSchema", () => {
    it("should return an error if any field is missing", () => {
      const data = {
        bank_name: "Bank of America",
        bank_account_number: "1234567890123456",
        balance: 1000,
      };
      expect(() => AccountValidation.validate(AccountValidation.createAccountSchema, data)).toThrow();
    });

    it("should not return an error if all fields are valid", () => {
      const data = {
        bank_name: "Bank of America",
        bank_account_number: "1234567890123456",
        balance: 1000,
        user_id: 1,
      };
      expect(() => AccountValidation.validate(AccountValidation.createAccountSchema, data)).not.toThrow();
    });
  });

  describe("updateAccountSchema", () => {
    it("should not return an error if no field is provided", () => {
      const data = {};
      expect(() => AccountValidation.validate(AccountValidation.updateAccountSchema, data)).not.toThrow();
    });

    it("should not return an error if all fields are valid", () => {
      const data = {
        bank_name: "Bank of America",
        bank_account_number: "1234567890123456",
        balance: 1000,
        user_id: 1,
      };
      expect(() => AccountValidation.validate(AccountValidation.updateAccountSchema, data)).not.toThrow();
    });
  });
});
