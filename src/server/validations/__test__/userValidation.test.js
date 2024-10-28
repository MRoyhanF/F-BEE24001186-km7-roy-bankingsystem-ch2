import Joi from "joi";
import { UserValidation } from "../userValidation";

describe("UserValidation", () => {
  describe("createUserSchema", () => {
    it("should return error if name is not provided", () => {
      const data = {
        email: "roy@gmail,com",
        password: "123456",
        profile: {
          identity_type: "KTP",
          identity_number: "1234567890123456",
          address: "Jl. Jendral Sudirman No. 1",
        },
      };
      expect(() => UserValidation.validate(UserValidation.createUserSchema, data)).toThrowError();
    });

    it("should return error if email is not provided", () => {
      const data = {
        name: "Roy",
        password: "123456",
        profile: {
          identity_type: "KTP",
          identity_number: "1234567890123456",
          address: "Jl. Jendral Sudirman No. 1",
        },
      };
      expect(() => UserValidation.validate(UserValidation.createUserSchema, data)).toThrowError();
    });

    it("should return error if password is not provided", () => {
      const data = {
        name: "Roy",
        email: "roy@gmail.com",
        profile: {
          identity_type: "KTP",
          identity_number: "1234567890123456",
          address: "Jl. Jendral Sudirman No. 1",
        },
      };
      expect(() => UserValidation.validate(UserValidation.createUserSchema, data)).toThrowError();
    });
  });

  describe("updateUserSchema", () => {
    it("should not return error if name is not provided", () => {
      const data = {
        email: "roy@gmail.com",
        password: "123456",
        profile: {
          identity_type: "KTP",
          identity_number: "1234567890123456",
          address: "Jl. Jendral Sudirman No. 1",
        },
      };
      expect(() => UserValidation.validate(UserValidation.updateUserSchema, data)).not.toThrowError();
    });

    it("should not return error if email is not provided", () => {
      const data = {
        name: "Roy",
        password: "123456",
        profile: {
          identity_type: "KTP",
          identity_number: "1234567890123456",
          address: "Jl. Jendral Sudirman No. 1",
        },
      };
      expect(() => UserValidation.validate(UserValidation.updateUserSchema, data)).not.toThrowError();
    });
  });

  describe("validate", () => {
    it("should throw error if data is invalid", () => {
      const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
      });
      const data = {
        name: "Ro",
        email: "roy@gmail.com",
      };
      expect(() => UserValidation.validate(schema, data)).toThrowError();
    });
  });
});
