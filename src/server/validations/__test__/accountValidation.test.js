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

    it("should return an error if any field is invalid", () => {
      const data = {
        bank_name: "Bank of America",
        bank_account_number: "1234567890123456",
        balance: "1000",
        user_id: "1",
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
    it("should return an error if any field is invalid", () => {
      const data = {
        bank_name: "Bank of America",
        bank_account_number: "1234567890123456",
        balance: "1000",
        user_id: "1",
      };
      expect(() => AccountValidation.validate(AccountValidation.updateAccountSchema, data)).toThrow();
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
